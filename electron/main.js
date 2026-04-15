import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, '../build/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: '#050507',
    autoHideMenuBar: true,
  });

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

// Auto-update events
autoUpdater.on('update-available', () => {
  log.info('Update available.');
});

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded; will install now');
  autoUpdater.quitAndInstall();
});
