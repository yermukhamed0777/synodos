# Planning-engine case study

This is a reproducible case study of the Synodos planning engine as it exists in this checkout. Every
number below comes from a command run locally or from a command recorded in
[`plan/progress.md`](../plan/progress.md). Measurements were taken on 2026-11-26 with `HEAD` at
`87ea728` and the final validation work described in [`plan/progress.md`](../plan/progress.md). There is
no user study here; see [`docs/PILOT_HANDOFF.md`](PILOT_HANDOFF.md) for the unrun, human-only pilot.

## Problem

A traveller wants a short, trustworthy day-by-day draft without model memory, a live inventory feed
or a booking account. The engine must assemble that draft from a small, human-checked dataset, check
it against dates and opening hours, and let the traveller change one day without losing the others.
The failure mode to avoid is fabrication: repeating a stop, inventing an attraction, or presenting a
closed venue as open.

## Constraints

- The dataset is finite: `CITIES` in [`lib/itineraries.ts`](../lib/itineraries.ts) holds four cities
  with nine curated stops each, three per slot (morning, afternoon, evening).
- `maxDaysFor` caps a trip at the smallest number of slot-fitting stops, so the supported durations
  are 2–3 days (Bali supports 2; Tokyo, Lisbon and Paris support 2–3). A longer trip is clamped, not
  padded with invented stops.
- Input is strict: [`lib/planner-input.ts`](../lib/planner-input.ts) requires a real `YYYY-MM-DD`
  date, a supported city, 2–`maxDaysFor(city)` days and 1–4 travellers.
- Each day is checked against its **own** date via UTC-noon anchors, so weekday closures are applied
  with a timezone-independent weekday.
- Opening hours, closing times, last entry and closure days are curated facts checked on 2026-11-24
  in [`lib/venue-meta.ts`](../lib/venue-meta.ts). They are not live data.
- A day is published only when all three slots are filled with open, unused, slot-fitting stops.
  A partially filled day is dropped and reported as `limited`.

## Deterministic scheduling approach

For each city, duration, start date and interest set, `buildItineraryWithStatus` runs one pass per
slot:

1. Compute each candidate date's number of open, slot-fitting choices.
2. Visit the **most constrained date first** (fewest choices, then earliest index) so a stop that is
   closed on Sunday is not forced onto Sunday.
3. Filter to unused stops that are open on that date and fit the slot's curated hours and duration.
4. Order the remainder by how few dates they are open on, then interest overlap, then estimated
   price; take the first. If none remain, mark the build `limited` and leave that slot empty rather
   than invent a stop.

Hard and advisory findings are separated in [`lib/feasibility.ts`](../lib/feasibility.ts):

- **Hard**: closed on that weekday, arrival after last entry, or not enough time before closing.
  These make the day infeasible.
- **Advisory**: a straight-line transfer estimate of at least 60 minutes. It is printed as “Long but
  possible — check live transit before you go” and never makes a day infeasible.

`rebuildDayWithStatus` rebuilds one day only. It tries open, unused alternatives for each slot and
swaps with another day when the preferred stop is already used there; a swap is rejected if it would
place a stop on a closed day or outside its slot. The plan keeps all its days and no stop is
duplicated. When nothing can be placed, `limited` is returned and the UI says so.

Budgets (`estimateBudget`, `budgetBreakdown`) are 0.8×–1.35× the city's curated `dailyBudget` per
person per day, shown in USD-equivalent; there is no FX conversion or live pricing. The Markdown
export (`itineraryToMarkdown`) always carries the reminder to verify hours and prices.

## Verification method

`scripts/validate-matrix.ts` enumerates 4 cities × their supported durations (2 and 3 where
supported) × 7 consecutive start dates from `2026-11-23` × 4 interest sets. For every combination it
builds a plan, calls `validatePlan`, checks for duplicate titles and incomplete builds, checks the
budget/export invariants, and rebuilds each generated day once. It writes `artifacts/matrix/results.json`
and `artifacts/matrix/summary.md`, hashes the JSON with SHA-256, and exits non-zero if any hard
conflict, duplicate or incomplete build appears. The same matrix is asserted by
`tests/unit/matrix.test.ts`, so it also runs inside `npm test` and the CI gate.

Separately, `scripts/capture-walkthrough.ts` writes six deterministic fixtures to
`artifacts/walkthrough/` with byte sizes and SHA-256 hashes in `manifest.json`. Inputs are fixed and
no wall-clock time enters the output.

## Measured results

`npm.cmd run validate:matrix` → exit 0:

| Measure | Result |
|---|---:|
| Combinations | 196 |
| Generated days | 476 |
| Hard conflicts in generated plans | 0 |
| Advisory long-transfer warnings | 28 |
| Duplicate stops | 0 |
| Incomplete builds | 0 |
| One-day rebuilds | 476 |
| Hard conflicts after rebuild | 0 |
| Limited rebuilds | 164 |
| SHA-256 of `artifacts/matrix/results.json` | `f85b4f30002cb31f6ee94a6c05e86a143fa7816efc48d855426291c18eca22dd` |

By city:

| City | Combinations | Days | Hard | Advisories |
|---|---:|---:|---:|---:|
| tokyo | 56 | 140 | 0 | 0 |
| lisbon | 56 | 140 | 0 | 0 |
| bali | 28 | 56 | 0 | 28 |
| paris | 56 | 140 | 0 | 0 |

All 28 advisories are Bali long-transfer notes; they are not infeasible days.

`npm.cmd run walkthrough` → exit 0; the fixtures and their hashes are listed in
`artifacts/walkthrough/manifest.json`:

| Fixture | Bytes | SHA-256 (full) |
|---|---:|---|
| `01-input.json` | 111 | `60c44598e721946fb3a4a66eb2c233f5b939d92895d36244457f95b0deb31ecc` |
| `02-plan.md` | 1094 | `4eadc236928484305e6af03e4a3285b30f45ba3a220b58d1c96b386d51cfcf87` |
| `03-feasibility.json` | 2411 | `a4addecb8171e69e413a8b31930fddd3e3edf1d4a3cd4a8169c487672cda1344` |
| `04-saved-plan.json` | 1661 | `421b2cce81f779ddba6afde4bc007a62cc634dbbdeb689f422368a5941bf5d5a` |
| `05-events.json` | 298 | `96841e81430e26274bc311e3ad30ce73b6e687cf5816a8d9fac411531a11c31e` |

The SHA-256 of `manifest.json` itself is
`0e93c98ac15e8b4770c5055329588bbcbfa467a71094385fba6d0471e38363ac` (uppercase form recorded in
`plan/progress.md:132`).

Baseline: `plan/progress.md:141-148` records `npm.cmd run verify` → exit 0 (typecheck, lint, 25/25
unit tests, static build, artefact check) at this commit, plus a passing e2e smoke run and both build
variants. There is no `check:live` script in `package.json` and no `8/8` result recorded in this
checkout, so no live-check figure is reported here.

## What is NOT claimed

- **No live inventory, availability or booking.** Handoff links open real search pages; the app does
  not reserve anything and earns no commission.
- **No generative AI.** No model is called; picks come from deterministic sorting of curated stops.
- **No real-time prices.** Stop prices and budget ranges are USD-equivalent curated estimates with no
  FX conversion, and they are not quotes.
- **No live transit or weather.** Transfer minutes are haversine straight-line estimates at a fixed
  urban speed plus a buffer; advisories say to check live transit before travel.
- **No user outcomes.** The pilot has not run, and the gates in `docs/PILOT_HANDOFF.md` are targets,
  not measurements. No usage, conversion or revenue claim is made.
- **No in-trip disruption handling.** Rebuild is a planning-time action on a saved draft.

## Re-run the measurements

PowerShell on Windows needs `npm.cmd`; on POSIX use `npm`.

```bash
npm.cmd ci
npm.cmd run validate:matrix
Get-FileHash artifacts\matrix\results.json -Algorithm SHA256
npm.cmd run walkthrough
Get-FileHash artifacts\walkthrough\manifest.json -Algorithm SHA256
npm.cmd run verify
npm.cmd run test:e2e
npm.cmd run verify:variants
```

`artifacts/` is gitignored capture output. `npm run verify` is the same gate CI runs before deploy;
`npm run verify:variants` builds and checks both the `/synodos` and root-path variants and restores
`out/` to the Pages build. See [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) for where each check lives
and [`docs/EXAMPLE_ITINERARIES.md`](EXAMPLE_ITINERARIES.md) for concrete drafts generated by these
functions.
