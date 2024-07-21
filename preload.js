const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFiles: () => ipcRenderer.invoke('select-files'),
  convertImage: (args) => ipcRenderer.invoke('convert-image', args),
  resizeImage: (args) => ipcRenderer.invoke('resize-image', args),
  saveResizedImage: (args) => ipcRenderer.invoke('save-resized-image', args),
  getImageMetadata: (filePath) => ipcRenderer.invoke('get-image-metadata', filePath),
  saveBulkResizedImagesAsZip: (args) => ipcRenderer.invoke('save-bulk-resized-images-as-zip', args),
  openPath: (filePath) => ipcRenderer.invoke('open-path', filePath),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  openDirectory: (directoryPath) => ipcRenderer.invoke('open-directory', directoryPath),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options)
});
