const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Configure logging
autoUpdater.logger = log;
autoUpdater.autoDownload = false;
autoUpdater.allowPrerelease = true;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

// vite-plugin-electron emits this file and the preload as .cjs
// (see vite.config.js entryFileNames: '[name].cjs'), so at runtime the
// preload lives next to us as preload.cjs. Fall back to preload.js in
// case the build config ever changes.
function resolvePreload() {
  const cjs = path.join(__dirname, 'preload.cjs');
  return fs.existsSync(cjs) ? cjs : path.join(__dirname, 'preload.js');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, '../build/icon.ico'),
    webPreferences: {
      preload: resolvePreload(),
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#050507',
    autoHideMenuBar: true,
  });

  // Ensure security settings
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Check for updates after a short delay so the renderer's IPC listeners
  // are registered before any update-status messages arrive.
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => autoUpdater.checkForUpdatesAndNotify(), 3000);
  });

  // Drop the reference once closed so update events don't try to send
  // to a destroyed webContents (optional chaining below then no-ops).
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC communication
ipcMain.on('download-update', () => {
  autoUpdater.downloadUpdate();
});

ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('check-for-updates', () => {
  try {
    mainWindow?.webContents.send('update-status', 'Starting update check...');
    autoUpdater.checkForUpdates();
  } catch (err) {
    log.error('Failed to start update check:', err);
    mainWindow?.webContents.send('update-status', 'Fatal error starting engine: ' + err.message);
  }
});

// Auto-update events linked to UI
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
  mainWindow?.webContents.send('update-status', 'Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available: ' + info.version);
  mainWindow?.webContents.send('update-status', 'Update available: ' + info.version);
  mainWindow?.webContents.send('update-available-data', info);
});

autoUpdater.on('update-not-available', () => {
  log.info('Update not available.');
  mainWindow?.webContents.send('update-status', 'Your system is up to date.');
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater: ' + err);
  mainWindow?.webContents.send('update-status', 'Update error: ' + (err.message || 'Unknown error'));
});

autoUpdater.on('download-progress', (progressObj) => {
  // electron-updater's progress object uses `percent` (0-100)
  const percent = Math.floor(progressObj.percent);
  mainWindow?.webContents.send('update-progress', percent);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded; version:', info.version);
  mainWindow?.webContents.send('update-ready', true);
});
