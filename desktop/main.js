const { app, BrowserWindow } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Matches the basePath used when `out/` was built. Defaults to the Pages path.
const BASE_PATH = process.env.SYNODOS_BASE_PATH ?? '/synodos';
const PREFIX = BASE_PATH ? `${BASE_PATH}/` : '/';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

function serve(root) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      if (PREFIX !== '/' && (urlPath === '/' || urlPath === '')) {
        res.writeHead(302, { Location: PREFIX });
        res.end();
        return;
      }
      if (PREFIX !== '/' && !urlPath.startsWith(PREFIX)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      let rel = PREFIX === '/' ? urlPath.slice(1) : urlPath.slice(PREFIX.length);
      let file = path.join(root, rel);
      if (!file.startsWith(root)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
        file = path.join(file, 'index.html');
      }
      if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) {
        file = `${file}.html`;
      }
      if (!fs.existsSync(file)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

app.whenReady().then(async () => {
  const root = app.isPackaged
    ? path.join(process.resourcesPath, 'out')
    : path.join(__dirname, '..', 'out');
  const port = await serve(root);
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
