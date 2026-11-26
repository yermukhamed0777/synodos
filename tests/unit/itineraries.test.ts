import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildItinerary,
  budgetBreakdown,
  CITIES,
  estimateBudget,
  handoffLinks,
  itineraryToMarkdown,
  mapLink,
  maxDaysFor,
  rebuildDay,
  SLOTS,
} from '../../lib/itineraries';
import { validatePlan } from '../../lib/feasibility';

const interests = ['food', 'culture'] as const;

test('each city fills its supported length with distinct stops in every slot', () => {
  for (const city of CITIES) {
    const days = buildItinerary(city, maxDaysFor(city), [...interests]);
    assert.equal(days.length, maxDaysFor(city));
    const seen = new Set<string>();
    for (const day of days) {
      for (const slot of SLOTS) {
        const title = day[slot].title;
        assert.equal(seen.has(title), false, `${city.name} repeated ${title}`);
        seen.add(title);
      }
    }
  }
});

test('an over-long request is clamped instead of repeating stops (P0-4 regression)', () => {
  for (const city of CITIES) {
    const days = buildItinerary(city, 7, [...interests]);
    assert.equal(days.length, maxDaysFor(city));
    const titles = days.flatMap((d) => SLOTS.map((s) => d[s].title));
    assert.equal(new Set(titles).size, titles.length, `${city.name} repeated a stop`);
  }
});

test('date-aware generation avoids venues closed on the trip dates (P0-3 regression)', () => {
  for (const city of CITIES) {
    const days = buildItinerary(city, maxDaysFor(city), [...interests], '2026-11-27');
    const check = validatePlan(days, '2026-11-27');
    assert.equal(check.totalHard, 0, `${city.name}: ${check.days.flatMap((d) => d.hard).join(' | ')}`);
    assert.deepEqual(check.days.map((d) => d.weekday), [5, 6, 0].slice(0, days.length));
  }
});

test('rebuild changes the day, preserves the rest and never mutates its input', () => {
  const city = CITIES[0];
  const original = buildItinerary(city, maxDaysFor(city), [...interests], '2026-11-27');
  const snapshot = JSON.stringify(original);
  const rebuilt = rebuildDay(city, original, 0, [...interests], '2026-11-27');

  assert.equal(JSON.stringify(original), snapshot, 'input was mutated');
  assert.notDeepEqual(rebuilt[0], original[0], 'day was not rebuilt');
  assert.equal(rebuilt.length, original.length, 'a day was lost');
  const titles = rebuilt.flatMap((d) => SLOTS.map((s) => d[s].title));
  assert.equal(new Set(titles).size, titles.length, 'rebuild duplicated a stop');
  assert.equal(validatePlan(rebuilt, '2026-11-27').totalHard, 0);
});

test('rebuild ignores an out-of-range index', () => {
  const city = CITIES[0];
  const days = buildItinerary(city, 2, [...interests]);
  assert.deepEqual(rebuildDay(city, days, 99, [...interests]), days);
});

test('budget is USD, a range, and category shares sum to one', () => {
  const city = CITIES[1];
  const budget = estimateBudget(city, 3, 2);
  assert.equal(budget.currency, 'USD');
  assert.ok(budget.low < budget.high);
  const breakdown = budgetBreakdown(city, 3, 2);
  assert.ok(Math.abs(breakdown.reduce((sum, line) => sum + line.share, 0) - 1) < 1e-9);
  const lowSum = breakdown.reduce((sum, line) => sum + line.low, 0);
  assert.ok(Math.abs(lowSum - budget.low) <= breakdown.length);
});

test('exported markdown and handoff links are self-describing', () => {
  const city = CITIES[2];
  const days = buildItinerary(city, 2, [...interests]);
  const md = itineraryToMarkdown(city, days, 2);
  assert.ok(md.includes('## Day 1'));
  assert.ok(md.includes('Verify opening hours'));
  assert.equal(handoffLinks(city).length, 4);
  assert.ok(handoffLinks(city).every((h) => h.href.startsWith('https://')));
  assert.ok(mapLink(city, days[0].morning).includes(encodeURIComponent(city.name)));
});
