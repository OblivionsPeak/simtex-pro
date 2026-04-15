const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Configure logging
autoUpdater.logger = log;
autoUpdater.autoDownload = false;
autoUpdater.allowPrerelease = true;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, '../build/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Ensure this matches actual file
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

  // Check for updates
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
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
  autoUpdater.checkForUpdates();
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

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.');
  mainWindow?.webContents.send('update-status', 'Your system is up to date.');
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater: ' + err);
  mainWindow?.webContents.send('update-status', 'Update error: ' + (err.message || 'Unknown error'));
});

autoUpdater.on('download-progress', (progressObj) => {
  const percent = Math.floor(progressObj.percentage);
  mainWindow?.webContents.send('update-progress', percent);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded; version:', info.version);
  mainWindow?.webContents.send('update-ready', true);
});
