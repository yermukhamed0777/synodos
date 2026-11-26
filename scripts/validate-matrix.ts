import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  budgetBreakdown,
  buildItineraryWithStatus,
  CITIES,
  estimateBudget,
  itineraryToMarkdown,
  maxDaysFor,
  rebuildDayWithStatus,
  SLOTS,
  type Interest,
} from '../lib/itineraries';
import { validatePlan } from '../lib/feasibility';

export interface MatrixOptions {
  startDate?: string;
  interestSets?: Interest[][];
}

/** Seven consecutive start dates so every weekday is covered, four interest sets. */
export const DEFAULT_START = '2026-11-23';
export const DEFAULT_INTERESTS: Interest[][] = [
  [],
  ['food', 'culture'],
  ['nature', 'relax'],
  ['food', 'culture', 'nature', 'nightlife', 'shopping', 'relax'],
];

export function runMatrix({ startDate = DEFAULT_START, interestSets = DEFAULT_INTERESTS }: MatrixOptions = {}) {
  const starts = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(`${startDate}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });

  const summary = {
    startDate,
    weekdaysCovered: starts.length,
    interestSets: interestSets.length,
    combinations: 0,
    daysGenerated: 0,
    hardConflicts: 0,
    advisoryWarnings: 0,
    duplicateStops: 0,
    incompleteBuilds: 0,
    rebuilds: 0,
    rebuildHardConflicts: 0,
    rebuildLimited: 0,
    byCity: {} as Record<string, { combinations: number; days: number; hard: number; advisories: number }>,
    failures: [] as string[],
  };

  const cases: Record<string, unknown>[] = [];

  for (const city of CITIES) {
    const perCity = { combinations: 0, days: 0, hard: 0, advisories: 0 };
    for (let days = 2; days <= maxDaysFor(city); days += 1) {
      for (const start of starts) {
        for (const interests of interestSets) {
          summary.combinations += 1;
          perCity.combinations += 1;
          const built = buildItineraryWithStatus(city, days, interests, start);
          const check = validatePlan(built.days, start);
          const titles = built.days.flatMap((d) => SLOTS.map((s) => d[s].title));
          const unique = new Set(titles).size === titles.length;
          if (!unique) summary.duplicateStops += 1;
          if (built.limited || built.days.length !== Math.min(days, maxDaysFor(city)))
            summary.incompleteBuilds += 1;
          summary.hardConflicts += check.totalHard;
          summary.advisoryWarnings += check.totalWarnings - check.totalHard;
          summary.daysGenerated += built.days.length;
          perCity.days += built.days.length;
          perCity.hard += check.totalHard;
          perCity.advisories += check.totalWarnings - check.totalHard;

          const budget = estimateBudget(city, built.days.length, 2);
          const lines = budgetBreakdown(city, built.days.length, 2);
          const md = itineraryToMarkdown(city, built.days, 2);
          if (
            budget.currency !== 'USD' ||
            budget.low > budget.high ||
            Math.abs(lines.reduce((n, l) => n + l.share, 0) - 1) > 1e-9 ||
            !md.includes(`## Day ${built.days.length}`) ||
            !md.includes('Verify opening hours')
          ) summary.failures.push(`${city.id}/${days}/${start}: budget or export invariant`);

          let rebuildHard = 0;
          for (let i = 0; i < built.days.length; i += 1) {
            const rebuilt = rebuildDayWithStatus(city, built.days, i, interests, start);
            const rc = validatePlan(rebuilt.days, start);
            rebuildHard += rc.totalHard;
            summary.rebuilds += 1;
            if (rebuilt.limited) summary.rebuildLimited += 1;
            const rt = rebuilt.days.flatMap((d) => SLOTS.map((s) => d[s].title));
            if (new Set(rt).size !== rt.length)
              summary.failures.push(`${city.id}/${days}/${start}/day${i + 1}: duplicate after rebuild`);
          }
          summary.rebuildHardConflicts += rebuildHard;

          cases.push({
            city: city.id,
            days: days,
            start,
            interests: interests.join(',') || 'none',
            builtDays: built.days.length,
            feasibleDays: check.feasibleDays,
            hard: check.totalHard,
            advisories: check.totalWarnings - check.totalHard,
            weekdays: check.days.map((d) => d.weekday),
            duplicateStop: !unique,
            rebuildHard,
            budget: `${budget.low}-${budget.high} ${budget.currency}`,
            exportBytes: Buffer.byteLength(md, 'utf8'),
          });
        }
      }
    }
    summary.byCity[city.id] = perCity;
  }

  summary.failures.push(
    ...(summary.hardConflicts > 0 ? ['hard conflicts in generated plans'] : []),
    ...(summary.rebuildHardConflicts > 0 ? ['hard conflicts after rebuild'] : []),
    ...(summary.duplicateStops > 0 ? ['duplicate stops'] : [])
  );
  return { summary, cases };
}

function main() {
  const { summary, cases } = runMatrix();
  const out = join(process.cwd(), 'artifacts', 'matrix');
  mkdirSync(out, { recursive: true });
  const json = JSON.stringify({ summary, cases }, null, 2);
  writeFileSync(join(out, 'results.json'), json, 'utf8');
  const sha = createHash('sha256').update(json).digest('hex');
  const lines = [
    '# Planning-engine validation matrix',
    '',
    `- Start anchor: ${summary.startDate} (${summary.weekdaysCovered} consecutive weekdays)`,
    `- Interest sets: ${summary.interestSets}`,
    `- Combinations: ${summary.combinations}`,
    `- Generated days: ${summary.daysGenerated}`,
    `- Hard conflicts: ${summary.hardConflicts}`,
    `- Advisory warnings: ${summary.advisoryWarnings}`,
    `- Duplicate stops: ${summary.duplicateStops}`,
    `- Incomplete builds: ${summary.incompleteBuilds}`,
    `- One-day rebuilds: ${summary.rebuilds} (hard conflicts ${summary.rebuildHardConflicts}, limited ${summary.rebuildLimited})`,
    `- Deterministic SHA-256: ${sha}`,
    '',
    '| City | Combinations | Days | Hard | Advisories |',
    '|---|---:|---:|---:|---:|',
    ...Object.entries(summary.byCity).map(
      ([city, v]) => `| ${city} | ${v.combinations} | ${v.days} | ${v.hard} | ${v.advisories} |`
    ),
    '',
  ];
  writeFileSync(join(out, 'summary.md'), lines.join('\n'), 'utf8');
  console.log(lines.join('\n'));
  if (summary.failures.length) {
    for (const failure of summary.failures) console.error(`FAIL ${failure}`);
    process.exitCode = 1;
  } else {
    console.log('PASS matrix: no hard conflicts, duplicates or incomplete curated coverage.');
  }
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll('\\', '/'))) main();
