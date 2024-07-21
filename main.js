const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const archiver = require('archiver');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,  // Add this line to hide the default menu bar
  });

  mainWindow.loadFile('index.html');

  // Remove or comment out the line below to disable the debug tools
  // mainWindow.webContents.openDevTools();

  ipcMain.handle('select-files', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'ico', 'heic'] }],
    });
    return result.filePaths;
  });

  ipcMain.handle('get-image-metadata', async (event, filePath) => {
    const metadata = await sharp(filePath).metadata();
    const size = fs.statSync(filePath).size;
    return { ...metadata, size };
  });

  ipcMain.handle('resize-image', async (event, { filePath, width, height }) => {
    const buffer = await sharp(filePath).resize(width, height).toBuffer();
    return buffer;
  });

  ipcMain.handle('save-resized-image', async (event, { filePath, buffer, width, height, outputDirectory }) => {
    const parsedPath = path.parse(filePath);
    const resizedFilePath = path.join(outputDirectory, `${parsedPath.name}_${width}x${height}${parsedPath.ext}`);
    fs.writeFileSync(resizedFilePath, buffer);
    return resizedFilePath;
  });

  ipcMain.handle('save-bulk-resized-images-as-zip', async (event, { filePaths, sizes, zipFilePath }) => {
    const zip = archiver('zip', { zlib: { level: 9 } });
    const output = fs.createWriteStream(zipFilePath);

    zip.pipe(output);

    for (const filePath of filePaths) {
      for (const size of sizes) {
        const buffer = await sharp(filePath).resize(size.width, size.height).toBuffer();
        const parsedPath = path.parse(filePath);
        const fileName = `${parsedPath.name}_${size.width}x${size.height}${parsedPath.ext}`;
        zip.append(buffer, { name: fileName });
      }
    }

    await zip.finalize();
    return zipFilePath;
  });

  ipcMain.handle('open-path', async (event, filePath) => {
    require('electron').shell.showItemInFolder(filePath);
  });

  ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });
    return result.filePaths[0];
  });

  ipcMain.handle('save-settings', (event, settings) => {
    fs.writeFileSync('settings.json', JSON.stringify(settings, null, 2));
  });

  ipcMain.handle('load-settings', () => {
    if (fs.existsSync('settings.json')) {
      const settings = fs.readFileSync('settings.json');
      return JSON.parse(settings);
    }
    return {};
  });

  ipcMain.handle('open-directory', async (event, directoryPath) => {
    require('electron').shell.openPath(directoryPath);
  });

  ipcMain.handle('show-save-dialog', async (event, options) => {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
