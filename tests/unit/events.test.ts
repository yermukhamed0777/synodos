import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { EVENT_NAMES, clearEvents, emit, events, type EventName } from '../../lib/events';

test('only allowlisted names can be emitted, with no payload field', () => {
  clearEvents();
  const event = emit('plan_generated');
  assert.deepEqual(Object.keys(event).sort(), ['name', 't']);
  assert.equal(EventGuard('plan_generated'), true);
  assert.ok(events().length === 1);
  const json = JSON.stringify(events());
  const decoded = JSON.parse(json) as { name: string; t: number }[];
  assert.deepEqual(Object.keys(decoded[0]).sort(), ['name', 't']);
  assert.ok(EVENT_NAMES.includes(decoded[0].name as EventName));
});

function EventGuard(name: EventName) {
  return EVENT_NAMES.includes(name);
}

test('emitted events contain no journal, account or email content', () => {
  clearEvents();
  for (const name of EVENT_NAMES) emit(name);
  const snapshot = JSON.stringify(events());
  const forbidden = ['@', 'gmail', 'Tsukiji', 'Boulangerie', 'passport', 'hotel booking', 'note:', 'diary'];
  for (const term of forbidden) {
    assert.equal(snapshot.toLowerCase().includes(term.toLowerCase()), false, `leaked ${term}`);
  }
});

test('the event module performs no network transmission', () => {
  const source = readFileSync(new URL('../../lib/events.ts', import.meta.url), 'utf8');
  for (const api of ['fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket', 'localStorage', 'sessionStorage']) {
    assert.equal(source.includes(api), false, `event harness uses ${api}`);
  }
});
