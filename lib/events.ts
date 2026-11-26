/**
 * Content-free funnel events for validation planning.
 *
 * Only an allowlisted name and a timestamp are ever created. There is no
 * payload, no user text, no storage and no network call — nothing leaves the
 * browser. This is deliberately not analytics; it is a deterministic way to
 * count steps if a future pilot is authorised.
 */
export const EVENT_NAMES = [
  'plan_generated',
  'plan_rebuilt',
  'plan_saved',
  'plan_downloaded',
  'plan_copied',
  'waitlist_submitted',
] as const;

export type EventName = (typeof EVENT_NAMES)[number];
export type EmittedEvent = { name: EventName; t: number };

const buffer: EmittedEvent[] = [];
const MAX_EVENTS = 100;

export function emit(name: EventName): EmittedEvent {
  const event: EmittedEvent = { name, t: Date.now() };
  buffer.push(event);
  if (buffer.length > MAX_EVENTS) buffer.shift();
  return event;
}

/** Read-only snapshot for an in-page debug view or a test. */
export function events(): readonly EmittedEvent[] {
  return buffer;
}

export function clearEvents(): void {
  buffer.length = 0;
}
