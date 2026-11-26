import test from 'node:test';
import assert from 'node:assert/strict';
import { checkArtifact, REQUIRED_FILES } from '../../scripts/verify-artifact.mjs';

function fixture(base = '/synodos') {
  const result: Record<string, string> = {};
  for (const file of REQUIRED_FILES) {
    result[file] = `<html><head><link rel="stylesheet" href="${base}/_next/static/a.css"><link rel="preload" href="${base}/_next/static/font.woff2" as="font"></head><body><a href="${base}/privacy/">Privacy</a></body></html>`;
  }
  result['icon.svg'] = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
  return result;
}

test('a correct subpath build passes', () => {
  assert.deepEqual(checkArtifact(fixture(), '/synodos'), { ok: true, problems: [] });
});

test('a correct root build passes', () => {
  assert.deepEqual(checkArtifact(fixture(''), ''), { ok: true, problems: [] });
});

test('a broken base path fails (V1-2 regression)', () => {
  const broken = fixture();
  broken['planner/index.html'] = broken['planner/index.html'].replace('/synodos/_next', '/_next');
  const result = checkArtifact(broken, '/synodos');
  assert.equal(result.ok, false);
  assert.ok(result.problems.some((p) => p.includes('outside base path')));
});

test('a CDN font, personal address or captcha override fails', () => {
  for (const injected of [
    '<link href="https://fonts.googleapis.com/css2">',
    'someone@gmail.com',
    '_captcha',
  ]) {
    const bad = fixture();
    bad['index.html'] = bad['index.html'].replace('</body>', `${injected}</body>`);
    assert.equal(checkArtifact(bad, '/synodos').ok, false, injected);
  }
});

test('a missing route fails', () => {
  const bad = fixture();
  delete bad['privacy/index.html'];
  assert.ok(checkArtifact(bad, '/synodos').problems.some((p) => p.includes('missing built file')));
});
