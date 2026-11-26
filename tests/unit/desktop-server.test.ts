import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import type { Server } from 'node:http';

const require = createRequire(import.meta.url);
const { serve } = require('../../desktop/server.js') as {
  serve: (root: string, prefix?: string) => Promise<Server>;
};

const root = mkdtempSync(join(tmpdir(), 'synodos-desktop-'));
mkdirSync(join(root, 'planner'), { recursive: true });
writeFileSync(join(root, 'index.html'), '<h1>home</h1>');
writeFileSync(join(root, 'planner', 'index.html'), '<h1>planner</h1>');

test('desktop server serves the subpath export and rejects other paths', async (t) => {
  const server = await serve(root, '/synodos/');
  t.after(() => server.close());
  const origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`;

  const rootResponse = await fetch(origin, { redirect: 'manual' });
  assert.equal(rootResponse.status, 302);
  assert.equal(rootResponse.headers.get('location'), '/synodos/');

  const home = await fetch(`${origin}/synodos/`);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /home/);

  const planner = await fetch(`${origin}/synodos/planner/`);
  assert.equal(planner.status, 200);
  assert.match(await planner.text(), /planner/);

  assert.equal((await fetch(`${origin}/outside`)).status, 404);
});

test('desktop server also supports a root-path export', async (t) => {
  const server = await serve(root, '/');
  t.after(() => server.close());
  const origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  const home = await fetch(`${origin}/`);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /home/);
  const planner = await fetch(`${origin}/planner/`);
  assert.equal(planner.status, 200);
  assert.match(await planner.text(), /planner/);
  rmSync(root, { recursive: true, force: true });
});
