import { cpSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.cwd();
const out = join(root, 'out');
const subpath = join(root, 'out-subpath');
const rootOut = join(root, 'out-root');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(args, env) {
  console.log(`> ${npm} ${args.join(' ')}  [NEXT_PUBLIC_BASE_PATH=${JSON.stringify(env.NEXT_PUBLIC_BASE_PATH)}]`);
  execSync(`${npm} ${args.join(' ')}`, { cwd: root, env: { ...process.env, ...env }, stdio: 'inherit' });
}

function save(dir) {
  rmSync(dir, { recursive: true, force: true });
  cpSync(out, dir, { recursive: true });
}

function restore(dir) {
  rmSync(out, { recursive: true, force: true });
  cpSync(dir, out, { recursive: true });
}

// 1. GitHub Pages project path (the deployed variant).
run(['run', 'build'], { NEXT_PUBLIC_BASE_PATH: '/synodos' });
run(['run', 'verify:artifact'], { NEXT_PUBLIC_BASE_PATH: '/synodos' });
save(subpath);

// 2. Root path (custom domain / local server variant).
run(['run', 'build'], { NEXT_PUBLIC_BASE_PATH: '' });
run(['run', 'verify:artifact'], { NEXT_PUBLIC_BASE_PATH: '' });
save(rootOut);

// Leave out/ in the deployed variant so a later deploy is never a root build.
restore(subpath);
console.log('PASS both variants; out/ restored to the /synodos build.');
