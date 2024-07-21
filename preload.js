const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFiles: (multiple = true) => ipcRenderer.invoke('select-files', multiple),
  getImageMetadata: (filePath) => ipcRenderer.invoke('get-image-metadata', filePath),
  resizeImage: (data) => ipcRenderer.invoke('resize-image', data),
  saveResizedImage: (data) => ipcRenderer.invoke('save-resized-image', data),
  convertImage: (data) => ipcRenderer.invoke('convert-image', data),
  cropImage: (data) => ipcRenderer.invoke('crop-image', data),
  saveCroppedImage: (data) => ipcRenderer.invoke('save-cropped-image', data),
  saveBulkResizedImagesAsZip: (data) => ipcRenderer.invoke('save-bulk-resized-images-as-zip', data),
  openPath: (filePath) => ipcRenderer.invoke('open-path', filePath),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  openDirectory: (directoryPath) => ipcRenderer.invoke('open-directory', directoryPath),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', { title, body })
});
