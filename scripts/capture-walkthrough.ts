import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildItinerary, CITIES, itineraryToMarkdown, maxDaysFor } from '../lib/itineraries';
import { validatePlan } from '../lib/feasibility';
import { serializeSavedPlan } from '../lib/saved-plan';
import { clearEvents, emit, EVENT_NAMES, events } from '../lib/events';

const OUT = join(process.cwd(), 'artifacts', 'walkthrough');
const START = '2026-11-27';

const city = CITIES[0];
const interests = ['food', 'culture'] as const;
const days = buildItinerary(city, maxDaysFor(city), [...interests], START);
const check = validatePlan(days, START);

clearEvents();
for (const name of EVENT_NAMES) emit(name);
const deterministicEvents = events().map((event) => ({ name: event.name, t: 0 }));

const files: Record<string, string> = {
  '01-input.json': JSON.stringify(
    { city: city.id, startDate: START, days: days.length, interests: [...interests] },
    null,
    2
  ),
  '02-plan.md': itineraryToMarkdown(city, days, 2),
  '03-feasibility.json': JSON.stringify(check, null, 2),
  '04-saved-plan.json': serializeSavedPlan({ city, days, travellers: 2 }),
  '05-events.json': JSON.stringify(deterministicEvents, null, 2),
};

mkdirSync(OUT, { recursive: true });
for (const [name, content] of Object.entries(files)) writeFileSync(join(OUT, name), content, 'utf8');

const manifest = Object.entries(files).map(([name, content]) => ({
  file: name,
  bytes: Buffer.byteLength(content, 'utf8'),
  sha256: createHash('sha256').update(content).digest('hex'),
}));
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

for (const entry of manifest) {
  console.log(`${entry.file}  ${entry.bytes} bytes  sha256:${entry.sha256.slice(0, 16)}…`);
}
console.log(`Wrote ${manifest.length + 1} deterministic fixtures to ${OUT}`);
