import { createServer, type Server } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { chromium, type Browser } from 'playwright-core';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const BASE = '/synodos';

export async function startStaticServer(): Promise<{ server: Server; origin: string }> {
  const outDir = join(process.cwd(), 'out');
  if (!existsSync(join(outDir, 'index.html'))) {
    throw new Error('out/ is missing — run `npm run build` before the e2e suite');
  }
  const server = createServer((req, res) => {
    const raw = decodeURIComponent((req.url ?? '/').split('?')[0]);
    if (raw === BASE) {
      res.writeHead(302, { Location: `${BASE}/` });
      res.end();
      return;
    }
    if (raw !== '/' && !raw.startsWith(`${BASE}/`)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const rel = raw === '/' ? 'index.html' : raw.slice(BASE.length + 1);
    let file = join(outDir, rel);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
    if (!existsSync(file)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[file.slice(file.lastIndexOf('.'))] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('no server address');
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

export async function launchBrowser(): Promise<Browser> {
  const candidates = [
    undefined, // let Playwright discover a default browser
    { channel: 'chrome' },
    { channel: 'msedge' },
  ];
  for (const options of candidates) {
    try {
      return await chromium.launch({ headless: true, ...options });
    } catch {
      // Try the next installed browser.
    }
  }
  throw new Error('No Chromium browser found. Install Chrome or Edge, or run `npx playwright install chromium`.');
}
