import test from 'node:test';
import assert from 'node:assert/strict';
import { CITIES, maxDaysFor } from '../../lib/itineraries';
import { runMatrix } from '../../scripts/validate-matrix';

const { summary, cases } = runMatrix();

test('the matrix covers every city, supported duration, weekday and interest set', () => {
  assert.equal(summary.combinations, 196);
  assert.equal(summary.weekdaysCovered, 7);
  assert.equal(summary.interestSets, 4);
  for (const city of CITIES) {
    const rows = cases.filter((c) => c.city === city.id);
    assert.ok(rows.length > 0, `${city.id} missing from matrix`);
    for (const row of rows) {
      const r = row as { days: number; builtDays: number; weekdays: number[] };
      assert.ok(r.days >= 2 && r.days <= maxDaysFor(city));
      assert.equal(r.builtDays, r.days);
      assert.equal(new Set(r.weekdays).size, r.weekdays.length);
    }
  }
});

test('no generated or rebuilt plan has a hard conflict or duplicate stop', () => {
  assert.equal(summary.hardConflicts, 0);
  assert.equal(summary.rebuildHardConflicts, 0);
  assert.equal(summary.duplicateStops, 0);
  assert.equal(summary.incompleteBuilds, 0);
  assert.deepEqual(summary.failures, []);
});

test('advisories remain visible and are never counted as infeasible', () => {
  assert.ok(summary.advisoryWarnings > 0, 'expected long-transfer advisories in curated data');
  for (const row of cases) {
    const r = row as { advisory: number; feasibleDays: number; builtDays: number };
    assert.ok(r.feasibleDays === r.builtDays, 'advisory must not make a day infeasible');
  }
});

test('limited rebuilds are reported instead of inventing a replacement stop', () => {
  assert.ok(summary.rebuildLimited > 0, 'curated coverage is finite, so limited rebuilds must occur');
  assert.equal(summary.rebuildHardConflicts, 0);
});
