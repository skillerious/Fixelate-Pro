const { app, BrowserWindow, ipcMain, dialog, Menu, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const Jimp = require('jimp');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false, // This is best practice for security
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Remove the default menu bar
  Menu.setApplicationMenu(null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Load settings
let settings = {};
const settingsPath = path.join(__dirname, 'settings.json');
if (fs.existsSync(settingsPath)) {
  settings = JSON.parse(fs.readFileSync(settingsPath));
}

// IPC handlers
ipcMain.handle('select-files', async (event, multiple) => {
  const result = await dialog.showOpenDialog({
    properties: multiple ? ['openFile', 'multiSelections'] : ['openFile'],
  });
  return result.filePaths;
});

ipcMain.handle('get-image-metadata', async (event, filePath) => {
  const metadata = await sharp(filePath).metadata();
  const stats = fs.statSync(filePath);
  return { ...metadata, size: stats.size };
});

ipcMain.handle('resize-image', async (event, data) => {
  const { filePath, width, height } = data;
  const buffer = await sharp(filePath).resize(width, height).toBuffer();
  return buffer;
});

ipcMain.handle('save-resized-image', async (event, data) => {
  const { filePath, buffer, width, height, outputDirectory } = data;
  const outputFilePath = path.join(outputDirectory, `resized-${path.basename(filePath)}`);
  await sharp(buffer).toFile(outputFilePath);
  return outputFilePath;
});

ipcMain.handle('convert-image', async (event, data) => {
  const { filePath, format, outputDirectory } = data;
  const outputFilePath = path.join(outputDirectory, `${path.basename(filePath, path.extname(filePath))}.${format}`);

  if (format === 'ico') {
    // Use Jimp for .ico conversion
    const image = await Jimp.read(filePath);
    await image.writeAsync(outputFilePath);
  } else {
    await sharp(filePath).toFormat(format).toFile(outputFilePath);
  }

  return outputFilePath;
});

ipcMain.handle('crop-image', async (event, data) => {
  const { filePath, cropX, cropY, cropWidth, cropHeight } = data;
  const buffer = await sharp(filePath).extract({ left: cropX, top: cropY, width: cropWidth, height: cropHeight }).toBuffer();
  return buffer;
});

ipcMain.handle('save-cropped-image', async (event, data) => {
  const { filePath, buffer, cropWidth, cropHeight, outputDirectory } = data;
  const outputFilePath = path.join(outputDirectory, `cropped-${path.basename(filePath)}`);
  await sharp(buffer).toFile(outputFilePath);
  return outputFilePath;
});

ipcMain.handle('save-bulk-resized-images-as-zip', async (event, data) => {
  const { filePaths, sizes, zipFilePath } = data;
  const archiver = require('archiver');
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Set the compression level.
  });

  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.pipe(output);

  for (const filePath of filePaths) {
    const fileName = path.basename(filePath);
    for (const size of sizes) {
      const resizedImageBuffer = await sharp(filePath).resize(size.width, size.height).toBuffer();
      archive.append(resizedImageBuffer, { name: `${size.width}x${size.height}-${fileName}` });
    }
  }

  await archive.finalize();

  return zipFilePath;
});

ipcMain.handle('select-directory', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('save-settings', async (event, settings) => {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
});

ipcMain.handle('load-settings', async (event) => {
  return settings;
});

ipcMain.handle('open-path', async (event, filePath) => {
  require('electron').shell.openPath(filePath);
});

ipcMain.handle('open-directory', async (event, directoryPath) => {
  require('electron').shell.openPath(directoryPath);
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(options);
  return result;
});

// Function to show notifications
ipcMain.handle('show-notification', async (event, { title, body }) => {
  new Notification({ title, body }).show();
});
