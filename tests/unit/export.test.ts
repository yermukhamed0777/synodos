import test from 'node:test';
import assert from 'node:assert/strict';
import { CITIES, itineraryToMarkdown, buildItinerary } from '../../lib/itineraries';

const city = CITIES[0];
const days = buildItinerary(city, 2, ['food', 'culture'], '2026-11-27');

test('exported and copied Markdown contains the whole plan and its caveats', () => {
  const md = itineraryToMarkdown(city, days, 2);
  assert.ok(md.startsWith(`# Synodos — ${city.name}, ${city.country}`));
  assert.ok(md.includes('2 days · 2 travellers'));
  assert.ok(md.includes('## Day 1'));
  assert.ok(md.includes('## Day 2'));
  for (const day of days) {
    for (const slot of ['morning', 'afternoon', 'evening'] as const) {
      assert.ok(md.includes(day[slot].title));
    }
  }
  assert.ok(md.includes('Verify opening hours and prices before booking.'));
  assert.ok(md.includes('prototype'));
});

test('export is deterministic and never presents estimates as live or local-currency facts', () => {
  const a = itineraryToMarkdown(city, days, 2);
  const b = itineraryToMarkdown(city, days, 2);
  assert.equal(a, b);
  for (const code of ['JPY', 'EUR', 'IDR']) assert.equal(a.includes(code), false);
  assert.equal(/live|booked|confirmed available/i.test(a), false);
});
