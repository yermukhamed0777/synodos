import test from 'node:test';
import assert from 'node:assert/strict';
import { buildItinerary, CITIES, maxDaysFor } from '../../lib/itineraries';
import { parseSavedPlan, SAVED_PLAN_KEY, serializeSavedPlan } from '../../lib/saved-plan';

const city = CITIES[0];
const plan = {
  city,
  days: buildItinerary(city, maxDaysFor(city), ['food', 'culture'], '2026-11-27'),
  travellers: 2,
};

test('a saved plan round-trips with its city reconstructed from curated data', () => {
  const restored = parseSavedPlan(serializeSavedPlan(plan));
  assert.ok(restored);
  assert.equal(restored.city.id, city.id);
  assert.equal(restored.travellers, 2);
  assert.deepEqual(restored.days, plan.days);
  assert.match(SAVED_PLAN_KEY, /_v1$/);
});

test('corrupt, wrong-version and unknown-city payloads are rejected', () => {
  assert.equal(parseSavedPlan(null), null);
  assert.equal(parseSavedPlan('not json'), null);
  assert.equal(parseSavedPlan('{}'), null);
  assert.equal(parseSavedPlan(JSON.stringify({ v: 2, cityId: city.id, days: [], travellers: 2 })), null);
  assert.equal(parseSavedPlan(JSON.stringify({ v: 1, cityId: 'atlantis', days: [], travellers: 2 })), null);
});

test('a payload with an unknown stop or bad traveller count is rejected', () => {
  const badStop = JSON.parse(serializeSavedPlan(plan)) as { days: { morning: { title: string } }[] };
  badStop.days[0].morning.title = 'Invented Rooftop';
  assert.equal(parseSavedPlan(JSON.stringify(badStop)), null);

  const badTravellers = JSON.parse(serializeSavedPlan(plan)) as { travellers: number };
  badTravellers.travellers = 99;
  assert.equal(parseSavedPlan(JSON.stringify(badTravellers)), null);
});
