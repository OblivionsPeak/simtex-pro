const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateStatus: (callback) => ipcRenderer.on('update-status', (_event, value) => callback(value)),
  onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (_event, value) => callback(value)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-ready', (_event, value) => callback(value)),
  onUpdateAvailableData: (callback) => ipcRenderer.on('update-available-data', (_event, value) => callback(value)),
  restartAndInstall: () => ipcRenderer.send('restart-app'),
  downloadUpdate: () => ipcRenderer.send('download-update'),
  checkForUpdates: () => ipcRenderer.send('check-for-updates')
});
