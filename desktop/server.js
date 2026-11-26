const http = require('http');
const fs = require('fs');
const path = require('path');

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

/**
 * Serves the static export from a local port. Kept separate from Electron so
 * the path and traversal rules can be tested without a display or a browser.
 */
function serve(root, prefix = '/synodos/') {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      if (prefix !== '/' && (urlPath === '/' || urlPath === '')) {
        res.writeHead(302, { Location: prefix });
        res.end();
        return;
      }
      if (prefix !== '/' && !urlPath.startsWith(prefix)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      const rel = prefix === '/' ? urlPath.slice(1) : urlPath.slice(prefix.length);
      let file = path.join(root, rel);
      if (!file.startsWith(root)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory())
        file = path.join(file, 'index.html');
      if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`;
      if (!fs.existsSync(file)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

module.exports = { serve, MIME };
