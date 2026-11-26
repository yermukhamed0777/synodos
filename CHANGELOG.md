# Changelog

All notable changes to this project are documented here, in Keep a Changelog style. The history
below is grouped by the dates actually recorded by
`git log --date=short --pretty=format:'%h %ad %s' -20` — it is **not** a release history. `1.0.0` is
the current `package.json` version, not a published release. No tag or release was published by the
2026-11-26 hardening work; the only tag in this checkout is `v0.1.0` on commit `e2e0278`
(2026-11-24), made for the earlier desktop demo.

Entries under `[Unreleased]` describe changes present in the current working tree; no command
results, timings or metrics are asserted here.

## [Unreleased]

### Added

- Verification scripts and scripts surface in `package.json`: `typecheck`, `lint`, `test`,
  `test:e2e`, `verify`, `verify:artifact`, `verify:variants` and `walkthrough`, plus the ESLint flat
  config `eslint.config.mjs`.
- Unit tests in `tests/unit/` (itineraries, feasibility, saved plan, events, artefact) and a browser
  smoke test in `tests/e2e/` driven by `playwright-core` against a local static server.
- `scripts/verify-artifact.mjs`: repeatable check of required routes, base-path-prefixed asset URLs,
  absent runtime Google Fonts requests, absent personal address/CAPTCHA override and a linked
  privacy page.
- `scripts/verify-variants.mjs`: builds and verifies the `/synodos` subpath and root-path variants,
  then restores the subpath build in `out/`.
- `scripts/capture-walkthrough.ts`: deterministic fixture capture into `artifacts/walkthrough/`.
- `lib/events.ts`: content-free event harness — allowlisted names plus a timestamp only, no user
  text, no storage and no network transmission.
- `lib/saved-plan.ts`: versioned `synodos_saved_plan_v1` payload with validation that rejects
  corrupt, outdated or unknown-stop payloads; the planner now restores a saved plan on load.
- `app/privacy/page.tsx`: static privacy notice, linked from the site footer and the waitlist form.
- `.env.example` documenting `NEXT_PUBLIC_WAITLIST_ENDPOINT` and `NEXT_PUBLIC_BASE_PATH`.
- CI quality gates in `.github/workflows/deploy-pages.yml` (typecheck, lint, unit tests, build,
  artefact check and browser smoke before deploy) and `.github/workflows/desktop-release.yml`
  (typecheck, lint, unit tests, build and artefact check before packaging).
- Open Graph and Twitter image metadata in `app/layout.tsx`.
- `engines` field pinning Node `>=20.19.0`.

### Changed

- `next` pinned to `16.4.6`; package description changed to a deterministic, verifiable travel
  planner and concept site.
- `next.config.ts`, `lib/site.ts` and `desktop/main.js` now derive the base path from
  `NEXT_PUBLIC_BASE_PATH` (desktop: `SYNODOS_BASE_PATH`) instead of hard-coding `/synodos`.
- CI runners moved from Node 20 to Node 24.
- `lib/feasibility.ts`: each day is validated against its own date (UTC-noon anchor), with hard
  conflicts, advisory notes and a `totalHard` count surfaced separately in the planner UI.
- Planner day selector capped at the dataset-supported length (2–3 days) via `maxDaysFor`; per-stop prices are rendered as
  `~$<amount> USD` and the form note explains the USD-equivalent, no-FX model.
- Waitlist submission now requires an env-provided endpoint and explicit consent; CAPTCHA override
  removed, the message no longer contains the submitted address, and the failure text no longer
  names a personal inbox. Desktop package author/maintainer contact changed to `hello@synodos.app`.
- Public copy reconciled with shipped behaviour in `components/sections/Hero.tsx`, `Idea.tsx`,
  `Features.tsx`, `HowItWorks.tsx`, `Business.tsx`, `Footer.tsx` and `lib/site.ts`; journey-signal
  cards are labelled as a concept preview and future in-trip features are marked as future work.
- Gitignore extended for `out-*/` and `artifacts/`.

### Fixed

- Broken `lint` script (`next lint`, removed in Next 16) replaced by ESLint flat config;
  `typecheck` added.
- Save plan had no read path; saved plans are now restored and validated on load.
- 4–7 day itineraries repeated stops; the selector now stops at the dataset-supported 2–3 day limit.
- Per-stop local-currency labels contradicted USD-equivalent aggregates; all displayed money is
  labelled USD-equivalent.
- One date was used for every day; closed venues, late arrival and past-closing were only warnings;
  long transfers were treated as blockers. Hard and advisory constraints are now separated.
- Hard-coded personal FormSubmit address, `_captcha: 'false'` and the personal failure contact were
  removed from tracked source; the footer contact mailto was replaced with a privacy link.
- `summary_large_image` social cards claimed an image that did not exist; image metadata added.
- Unused `JOURNEY_ALERTS` import removed from `components/sections/Idea.tsx`.

### Removed

- Hard-coded personal Gmail endpoint from `components/ui/WaitlistForm.tsx` and the personal address
  from desktop package author/maintainer metadata.
- `_captcha: 'false'` override and the `JOURNEY_ALERTS` export.
- Workflow-wide `contents: write` in `desktop-release.yml` and broad build-job permissions in
  `deploy-pages.yml`; write permissions are now scoped to the deploy/release jobs only.
- Public claims of an implemented AI in-trip companion; these are relabelled as deterministic
  planner or future direction.

## 2026-11-25

- `29b8f8d` — Record push and passing CI verification in plan logs
- `39c44e4` — Add long-term plan folder with strategy, roadmap, backlog and append-only logs

## 2026-11-24

- `0ff3139` — Add deterministic feasibility solver: hours, closures, travel and buffers
- `317795e` — Document desktop builds and research docs
- `e2e0278` — Fix Debian package metadata for Linux build
- `416d2f1` — Fix budget currency model: USD-equivalent aggregates, local stop prices
- `895dfc7` — Add verified plan data, decision mode, competitor analysis, and desktop packaging
- `64889b7` — Untrack local screenshots
- `bf17b1d` — Add print fallback for reveal animations
- `ae2e1f3` — Make per-day rebuild swap stops so the day actually changes
- `4a0c5d7` — Fix credibility claims, self-host display fonts, tighten feature strip
- `4bab92d` — Add one-day re-planning and consumer research
- `63b3f06` — Add real waitlist delivery, scroll reveals, and planner prototype
- `7a6fde9` — Ignore local screenshot artifacts
- `2bae487` — Add Synodos favicon
- `e79ae0f` — Rebuild Synodos as cinematic travel site with generated imagery and working waitlist
- `abfa724` — Add productization research
- `ae423af` — Add static export and GitHub Pages workflow
- `4147613` — Pin empty PostCSS config for hosted build
- `26862dd` — Make npm start self-building for hosted deploy
