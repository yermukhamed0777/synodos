const { app, BrowserWindow } = require('electron');
const path = require('path');
const { serve } = require('./server.js');

// Matches the basePath used when `out/` was built. Defaults to the Pages path.
const BASE_PATH = process.env.SYNODOS_BASE_PATH ?? '/synodos';
const PREFIX = BASE_PATH ? `${BASE_PATH}/` : '/';

app.whenReady().then(async () => {
  const root = app.isPackaged
    ? path.join(process.resourcesPath, 'out')
    : path.join(__dirname, '..', 'out');
  const server = await serve(root, PREFIX);
  const port = server.address().port;
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#08070b',
    autoHideMenuBar: true,
    title: 'Synodos',
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  win.loadURL(`http://127.0.0.1:${port}${PREFIX}`);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      const w = new BrowserWindow({ width: 1280, height: 860, backgroundColor: '#08070b' });
      w.loadURL(`http://127.0.0.1:${port}${PREFIX}`);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
