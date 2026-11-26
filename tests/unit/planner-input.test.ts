import test from 'node:test';
import assert from 'node:assert/strict';
import { isIsoDate, validatePlannerInput } from '../../lib/planner-input';

test('strict ISO dates reject malformed and impossible calendar values', () => {
  assert.equal(isIsoDate('2026-11-27'), true);
  assert.equal(isIsoDate('2024-02-29'), true);
  assert.equal(isIsoDate('2026-02-29'), false);
  assert.equal(isIsoDate('2026-13-01'), false);
  assert.equal(isIsoDate('27/11/2026'), false);
  assert.equal(isIsoDate(undefined), false);
});

test('valid planner input is accepted for every supported city', () => {
  for (const cityId of ['tokyo', 'lisbon', 'bali', 'paris']) {
    const result = validatePlannerInput({ cityId, startDate: '2026-11-27', days: 2, travellers: 2 });
    assert.equal(result.ok, true, cityId);
    if (result.ok) assert.equal(result.city.id, cityId);
  }
});

test('invalid dates, durations, group sizes and cities are rejected with a message', () => {
  const bad = [
    { cityId: 'tokyo', startDate: 'not-a-date', days: 2, travellers: 2 },
    { cityId: 'tokyo', startDate: '2026-02-30', days: 2, travellers: 2 },
    { cityId: 'tokyo', startDate: '2026-11-27', days: 1, travellers: 2 },
    { cityId: 'bali', startDate: '2026-11-27', days: 3, travellers: 2 },
    { cityId: 'tokyo', startDate: '2026-11-27', days: 2, travellers: 0 },
    { cityId: 'tokyo', startDate: '2026-11-27', days: 2, travellers: 5 },
    { cityId: 'atlantis', startDate: '2026-11-27', days: 2, travellers: 2 },
  ];
  for (const input of bad) {
    const result = validatePlannerInput(input);
    assert.equal(result.ok, false, JSON.stringify(input));
    if (!result.ok) assert.ok(result.message.length > 10);
  }
});
