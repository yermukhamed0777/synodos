import test from 'node:test';
import assert from 'node:assert/strict';
import { CITIES, buildItinerary, type PlannedDay } from '../../lib/itineraries';
import {
  dateForDay,
  formatMinutes,
  LONG_TRANSFER_MINUTES,
  toMinutes,
  travelMinutes,
  validateDay,
  validatePlan,
  weekdayForDate,
  WEEKDAY_NAMES,
} from '../../lib/feasibility';
import { VENUE_META } from '../../lib/venue-meta';

test('each day gets its own date and weekday (P0-3 regression)', () => {
  const dates = [0, 1, 2].map((i) => dateForDay('2026-11-27', i));
  assert.deepEqual(dates, ['2026-11-27', '2026-11-28', '2026-11-29']);
  assert.deepEqual(dates.map(weekdayForDate), [5, 6, 0]);
  assert.deepEqual(dates.map((d) => WEEKDAY_NAMES[weekdayForDate(d)]), ['Friday', 'Saturday', 'Sunday']);
  // Crossing a month boundary must not shift the calendar day.
  assert.equal(dateForDay('2026-11-30', 1), '2026-12-01');
});

test('time helpers handle past-midnight closing times', () => {
  assert.equal(toMinutes('18:30'), 1110);
  assert.equal(formatMinutes(1110), '18:30');
  assert.equal(formatMinutes(26 * 60), '02:00');
  assert.equal(formatMinutes(-30), '23:30');
});

test('travel estimate is deterministic and bounded below', () => {
  const a = VENUE_META['Meiji Jingu forest walk'];
  const b = VENUE_META['TeamLab Planets'];
  assert.equal(travelMinutes(a, b), travelMinutes(a, b));
  assert.ok(travelMinutes(a, b) >= 8);
  assert.ok(travelMinutes(a, a) >= 8);
  assert.ok(LONG_TRANSFER_MINUTES === 60);
});

function dayWith(cityId: string, slot: keyof Pick<PlannedDay, 'morning' | 'afternoon' | 'evening'>, title: string) {
  const city = CITIES.find((c) => c.id === cityId)!;
  const days = buildItinerary(city, 2, ['food', 'culture'], '2026-11-27');
  const item = city.items.find((i) => i.title === title)!;
  return { ...days[0], [slot]: item } as PlannedDay;
}

test('a venue closed on that date is a hard conflict, not a soft warning', () => {
  const day = dayWith('paris', 'morning', 'Boulangerie breakfast'); // closed Mondays
  const check = validateDay(day, '2026-11-30'); // Monday
  assert.equal(check.weekday, 1);
  assert.equal(check.feasible, false);
  assert.ok(check.hard.some((w) => w.includes('closed on Monday')));
  assert.ok(check.hard.every((h) => check.warnings.includes(h)));
});

test('a stop that cannot finish before closing is a hard conflict with an accurate message', () => {
  const day = dayWith('bali', 'evening', 'Kecak dance at Uluwatu'); // closes 19:00, 90 min visit
  const check = validateDay(day, '2026-11-27');
  assert.equal(check.feasible, false);
  assert.ok(check.hard.some((w) => w.includes('before closing (19:00)')));
});

test('a long transfer is advisory and does not make the day infeasible', () => {
  const city = CITIES.find((c) => c.id === 'bali')!;
  const days = buildItinerary(city, 2, ['food', 'culture'], '2026-11-27');
  const check = validatePlan(days, '2026-11-27');
  const withAdvisory = check.days.find((d) => d.advisories.length > 0)!;
  assert.ok(withAdvisory, 'expected one long-transfer day in the curated Bali dataset');
  assert.ok(withAdvisory.advisories.some((w) => w.includes('min transfer')));
  assert.equal(withAdvisory.feasible, true);
  assert.equal(withAdvisory.hard.length, 0);
});

test('generated default plans for every city start with no hard conflicts', () => {
  for (const city of CITIES) {
    const days = buildItinerary(city, 2, ['food', 'culture'], '2026-11-27');
    const check = validatePlan(days, '2026-11-27');
    assert.equal(check.totalHard, 0, `${city.name}: ${check.days.flatMap((d) => d.hard).join(' | ')}`);
    assert.equal(check.feasibleDays, days.length);
  }
});
