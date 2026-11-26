import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const REQUIRED_FILES = [
  'index.html',
  'planner/index.html',
  'privacy/index.html',
  '404.html',
  'icon.svg',
];

// Pattern-based so no real address is stored in tracked source.
const PERSONAL_INBOX = /[A-Za-z0-9._%+-]+@gmail\.com/;

/**
 * Pure check: given the built files and the expected base path, return every
 * problem found. Kept side-effect free so unit tests can prove it fails on a
 * deliberately broken base path without rebuilding the site.
 */
export function checkArtifact(htmlByPath, expectedBasePath = '/synodos') {
  const problems = [];
  const prefix = expectedBasePath ? `${expectedBasePath}/` : '/';

  for (const file of REQUIRED_FILES) {
    if (typeof htmlByPath[file] !== 'string') problems.push(`missing built file: ${file}`);
  }
  if (problems.length) return { ok: false, problems };

  for (const [file, html] of Object.entries(htmlByPath)) {
    if (!file.endsWith('.html')) continue;
    for (const match of html.matchAll(/(?:src|href)="(\/[^"]*)"/g)) {
      const url = match[1];
      if (url.startsWith('//')) continue;
      if (expectedBasePath && !url.startsWith(prefix) && url !== expectedBasePath) {
        problems.push(`${file}: asset URL ${url} is outside base path ${expectedBasePath}`);
      }
    }
    if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(html)) {
      problems.push(`${file}: runtime Google Fonts request found`);
    }
    if (PERSONAL_INBOX.test(html)) {
      problems.push(`${file}: personal gmail address leaked into built HTML`);
    }
    if (html.includes('_captcha')) {
      problems.push(`${file}: captcha override found in built HTML`);
    }
  }

  // The homepage is where the self-hosted-font claim is made; Next's generated
  // 404 shell does not include the layout's font preloads.
  if (!htmlByPath['index.html'].includes('.woff2')) {
    problems.push('index.html: no self-hosted font preload found');
  }

  if (!htmlByPath['index.html'].includes(`${expectedBasePath}/privacy/`)) {
    problems.push('index.html: privacy notice is not linked');
  }

  return { ok: problems.length === 0, problems };
}

function main() {
  const outDir = join(process.cwd(), 'out');
  const expectedBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/synodos';
  const htmlByPath = {};
  for (const file of REQUIRED_FILES) {
    const full = join(outDir, file);
    if (!existsSync(full)) continue;
    htmlByPath[file] = readFileSync(full, 'utf8');
  }
  const result = checkArtifact(htmlByPath, expectedBasePath);
  for (const problem of result.problems) console.error(`FAIL ${problem}`);
  if (result.ok) {
    console.log(
      `PASS artifact check: ${REQUIRED_FILES.length} required files, base path '${expectedBasePath}', 0 problems`
    );
  }
  process.exitCode = result.ok ? 0 : 1;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll('\\', '/'))) {
  main();
}
