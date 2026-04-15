const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateStatus: (callback) => ipcRenderer.on('update-status', (_event, value) => callback(value)),
  onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (_event, value) => callback(value)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-ready', (_event, value) => callback(value)),
  restartAndInstall: () => ipcRenderer.send('restart-app')
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
});
