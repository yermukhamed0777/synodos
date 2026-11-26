# Architecture

Synodos is a Next.js App Router site with a deterministic, client-side planning engine. There is no
server API for planning, no database and no third-party data call in the planner. Curated data and
the rules that consume it are TypeScript modules; the built site is a static export.

## Data-flow diagram

```text
Browser input (city, start date, days, travellers, interests)
  app/planner/page.tsx  →  components/planner/Planner.tsx
        │
        ├─ lib/planner-input.ts .......... strict date/group validation
        │
        ├─ lib/itineraries.ts ............ CITIES catalog + build/rebuild
        │       └─ lib/venue-meta.ts ..... curated hours, closure days, last entry, coordinates
        │
        ├─ lib/feasibility.ts ............ per-day date, hard conflicts, advisories, legs
        │
        ├─ estimateBudget / budgetBreakdown / itineraryToMarkdown / handoffLinks
        │
        ├─ lib/saved-plan.ts ............. versioned localStorage payload (city id only)
        │
        └─ lib/events.ts ................. allowlisted, content-free counters (in memory)

Build time:  next.config.ts → out/ → GitHub Pages (or Electron desktop/server.js reading out/)
Verification: scripts/validate-matrix.ts + tests/unit/* + tests/e2e/* → CI gate → deploy
```

## Core engine

### `lib/itineraries.ts`

- `CITIES`, `INTERESTS`, `SLOTS` and the `Item`/`City`/`PlannedDay` types are the catalog. Every city
  has nine stops, three per slot; each `City` carries `dailyBudget` and a human `verifiedAt` date
  (2026-11-24 for all four cities).
- `fitsSlot` (module-private) checks curated open/close times, last entry and typical duration.
  `maxDaysFor` returns the smallest number of slot-fitting stops, so trips are capped at 2 or 3 days.
- `buildItineraryWithStatus` returns `{ days, limited }`. It visits the most constrained date first,
  picks from unused stops that are open and fit the slot, orders by open-date count, interest overlap
  and price, and publishes only complete days. `buildItinerary` is the backward-compatible wrapper.
- `rebuildDayWithStatus` returns `{ days, changed, limited }`. It re-picks each slot of one day; if
  the preferred stop is on another day it swaps it in and moves the current stop there, rejecting a
  swap that would put a stop on a closed day or outside its slot. No day is lost and no title is
  duplicated. `rebuildDay` is the wrapper.
- `estimateBudget` and `budgetBreakdown` derive a USD-equivalent range from `dailyBudget`, days and
  travellers (0.8×–1.35×, split 45% stay / 25% food / 20% activities / 10% local transport).
- `mapLink` and `handoffLinks` build URLs to Google Maps, Google Flights, Booking.com and
  GetYourGuide. These are handoff searches, not bookings and not affiliate links in this code.
- `itineraryToMarkdown` is the same text used by Save/Download/Copy and always includes “Verify
  opening hours and prices before booking.”

### `lib/feasibility.ts`

- `dateForDay` and `weekdayForDate` use a UTC-noon anchor so a calendar date does not shift under DST.
- `validateDay(day, date)` walks morning → afternoon → evening. Per stop it compares the computed
  arrival with curated open, close, last entry and duration; it records `hard` messages, `advisory`
  messages and per-slot `legs` (transfer minutes, wait, arrival, end). `warnings` is hard + advisory
  for the existing UI.
- **Hard**: closed on that weekday; arrival after last entry; less than the visit duration before
  closing; or running past closing. These set `feasible: false`.
- **Advisory**: `travelMinutes >= LONG_TRANSFER_MINUTES` (60). The text says “Long but possible —
  check live transit before you go”; it never affects `feasible`.
- `travelMinutes` uses a private haversine helper on curated coordinates, then 18 km/h for trips up
  to 12 km, 40 km/h beyond that, a 10-minute buffer and an 8-minute floor. It is a deterministic
  estimate, not a routing query.
- `validatePlan(days, startDate)` returns `days`, `feasibleDays`, `totalWarnings` and `totalHard`.

### `lib/venue-meta.ts`

`VENUE_META` is a curated, dated table keyed by stop title: `lat`, `lng`, `duration` (minutes),
`open`, `close`, `closedDays` (0 = Sunday … 6 = Saturday) and optional `lastEntry`. The header says
it was checked 2026-11-24 and that hours are typical published hours, not live data. `DEFAULT_META`
is the conservative fallback when a title is absent. These are the only dated opening facts in the
engine; there is no feed that refreshes them.

## Supporting libraries

| File | Role |
|---|---|
| `lib/planner-input.ts` | `isIsoDate` accepts only a real `YYYY-MM-DD` calendar date; `validatePlannerInput` rejects unknown cities, dates outside that shape, fewer than 2 or more than `maxDaysFor(city)` days, and traveller counts outside 1–4. |
| `lib/saved-plan.ts` | `SAVED_PLAN_KEY = 'synodos_saved_plan_v1'`. `serializeSavedPlan` stores only `{ v: 1, cityId, days, travellers }` so curated data stays authoritative on load. `parseSavedPlan` rejects unknown versions, cities, stop titles, day numbers and traveller counts; corrupt payloads are ignored. |
| `lib/events.ts` | `emit` appends an allowlisted name plus `Date.now()` to an in-memory buffer capped at 100; `events()` snapshots it and `clearEvents()` resets it. No payload, user text, storage or network — these are counters for a possible pilot, not analytics. |
| `lib/site.ts` | Build-time `BASE_PATH`, asset helper, site metadata and marketing copy. Flags concept previews explicitly. |

## UI and routes

- `app/page.tsx` — `/`, the marketing page composed from `components/sections/*`. It labels the
  alerts and trip rows as concept previews rather than live data.
- `app/planner/page.tsx` — `/planner`, statically rendered shell that mounts
  `components/planner/Planner.tsx`.
- `app/privacy/page.tsx` — `/privacy`, the current privacy notice; it states there are no accounts,
  payments, analytics, cookies or third-party tracking scripts, and that saved plans stay in the
  browser.
- `components/planner/Planner.tsx` — the `'use client'` component. It owns form state, restores a
  saved plan on mount, calls `validatePlannerInput` → `buildItineraryWithStatus` → `validatePlan`,
  rebuilds a single day with `rebuildDayWithStatus`, and shows the exact `limited` and `changed`
  notices. It also handles Save (localStorage), Download/Copy (Markdown), the allowlisted counters
  and the handoff links.
- `components/Navbar.tsx` and `components/sections/Footer.tsx` provide navigation; the footer links
  the privacy page and the waitlist anchor.

## Build, hosting and CI

- `next.config.ts`: `output: 'export'`, `trailingSlash: true`, and `basePath` from
  `NEXT_PUBLIC_BASE_PATH`, defaulting to `/synodos`. `lib/site.ts` and `desktop/main.js` derive the
  same prefix, `SYNODOS_BASE_PATH` for the wrapper.
- **GitHub Pages**: `.github/workflows/deploy-pages.yml` runs on pushes to `main` and manual dispatch.
  Its build job runs `npm ci`, typecheck, lint, unit tests, build, `verify:artifact` and a Chrome e2e
  smoke test; the deploy job depends on that build.
- **Root-path variant**: `scripts/verify-variants.mjs` builds with `NEXT_PUBLIC_BASE_PATH='/synodos'`
  and `''`, runs the artefact check on both and restores `out/` to the Pages build.
- **Artefact check**: `scripts/verify-artifact.mjs` asserts five required files, base-path-prefixed
  URLs, self-hosted font preload, a linked privacy page, and the absence of runtime Google Fonts,
  a personal inbox and captcha overrides. The pure `checkArtifact` function is unit-tested.
- **Desktop**: `desktop/server.js` is the loopback-only static server, extracted from
  `desktop/main.js` so its path rules can be tested without Electron. `desktop/main.js` serves `../out`
  inside an Electron `BrowserWindow` (`contextIsolation: true`, `nodeIntegration: false`);
  `desktop/package.json` packages `../out` as an extra resource. See [`DESKTOP.md`](DESKTOP.md) for
  verified and unsigned formats. `.github/workflows/desktop-release.yml` runs the same gates
  on Windows, macOS and Linux, packages with electron-builder, and attaches artefacts to a `v*` tag
  release only when the ref is a tag.
- **Engine verification**: `scripts/validate-matrix.ts` and `scripts/capture-walkthrough.ts` produce
  the deterministic artifacts described in [`docs/CASE_STUDY.md`](CASE_STUDY.md). `tests/unit/*`
  covers the engine and the checks; `tests/e2e/*` uses `playwright-core` against a locally installed
  Chrome/Edge and a local static server — no browser download or external service.

## Curated facts vs estimates vs live data

| Kind | Where | Nature |
|---|---|---|
| Dated curated facts | `lib/venue-meta.ts` (`checked 2026-11-24`), `City.verifiedAt`, `Item.price`, `City.dailyBudget` | Human-checked typical hours, closure days, durations, coordinates and USD-equivalent estimates. Not live. |
| Deterministic estimates | `lib/feasibility.ts` (`travelMinutes`, hard/advisory rules), `lib/itineraries.ts` (`fitsSlot`, budgets) | Computed from the curated table with fixed speeds, buffers and share factors. Not measured on the day. |
| Browser-local state | `lib/saved-plan.ts`, `lib/events.ts`, `components/planner/Planner.tsx` | localStorage and in-memory counters only; nothing is uploaded. |
| Live data | — | None. No inventory, weather, transit, FX or price provider is called. Handoff links open search pages in a new tab; the app does not book or take payment. |

The waitlist is the one possible outbound path, and it is disabled unless a build sets
`NEXT_PUBLIC_WAITLIST_ENDPOINT`; even then it requires explicit consent. See
[`docs/PILOT_HANDOFF.md`](PILOT_HANDOFF.md) for the human work that must happen before that is used.
