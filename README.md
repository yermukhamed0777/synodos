# Synodos

[![Deploy Synodos to GitHub Pages](https://github.com/yermukhamed0777/synodos/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/yermukhamed0777/synodos/actions/workflows/deploy-pages.yml)

Synodos is a **deterministic travel planner concept** plus its marketing site. A curated,
human-checked dataset is assembled into a day-by-day draft, checked against opening hours and
transfer estimates, and handed off to real search pages. There is no AI model, no live inventory, no
booking, no account and no tracking.

Live: https://yermukhamed0777.github.io/synodos/

## Stack

- Next.js 16.4.6 (App Router, static export), React 19, TypeScript
- Plain CSS design system; self-hosted fonts via `next/font`
- GitHub Pages deployment with a CI quality gate
- Electron desktop wrapper in [`desktop/`](desktop/) serving the static export offline

## What works today

- **Planner** (`/planner`): choose a city, dates, group size and interests → a day-by-day draft with a
  USD-equivalent budget range, per-day weekday checks and a handoff block. Trips are capped at two
  or three days — the longest each city's curated dataset can cover without repeating a stop or
  inventing data.
- **Feasibility check**: curated closure days and closing times are hard conflicts; long transfers
  are advisory. Days are validated against their own date, not one shared date.
- **One-day rebuild**: swaps a stop rather than repeating it, so no day is lost.
- **Save / download / copy**: a plan is restored from this browser's local storage on reload.
- **Waitlist**: off by default. It only becomes submittable when a build sets
  `NEXT_PUBLIC_WAITLIST_ENDPOINT`; even then it requires explicit consent.
- **Privacy notice** (`/privacy`), scroll reveals with reduced-motion support, and a concept modal
  that is deliberately text, not video.

The site makes no usage, conversion or revenue claims. The targets in `docs/REVISED_PLAN.md` are
hypotheses, not measurements.

## Run locally

PowerShell on Windows blocks plain `npm`; use `npm.cmd` there.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000/synodos/`. `basePath` is `/synodos` for GitHub Pages; set
`NEXT_PUBLIC_BASE_PATH=` to build for a root path instead.

Copy `.env.example` to `.env.local` only if you have a real submission endpoint. Never commit a
personal inbox, API key or `.env.local`.

## Verify

```bash
npm run verify          # typecheck → lint (warnings denied) → unit tests → build → artefact check
npm run test:e2e        # real Chrome/Edge smoke test; requires a built out/
npm run verify:variants # builds and checks both /synodos and root-path variants
npm run walkthrough     # writes deterministic fixtures to artifacts/walkthrough/
```

`npm run verify` is the same gate CI runs before deploy. A red run stops the release because the
Pages deploy job depends on the build job. The e2e test also runs in CI on the runner's Chrome.

## Deploy

- **Web**: push to `main`. `.github/workflows/deploy-pages.yml` runs `npm ci`, typecheck, lint, unit
  tests, build, artefact check and the browser smoke test, then uploads `out/` to GitHub Pages.
- **Desktop**: push a `v*` tag. `.github/workflows/desktop-release.yml` builds Windows, macOS and
  Linux artefacts and attaches them to that tag's release. macOS builds are unsigned (right-click →
  Open on first launch). Building statically first is required because `desktop/` packages `../out`.
- Never push, tag, publish or change repository settings without the owner's explicit approval.

## Backup and restore

There is no server-side storage and no account. A plan saved in the planner lives only in this
browser under `synodos_saved_plan_v1` and is restored automatically on reload. Corrupt or outdated
payloads are ignored. For a portable backup, use **Download .md**; the Markdown file is
human-readable and contains a reminder to verify hours and prices. Clearing site data removes the
saved plan — download it first.

## Planning and docs

- [`plan/`](plan/README.md) — internal strategy, roadmap, backlog, append-only decisions and
  progress logs. Every claim there must trace to a recorded command.
- [`docs/REVISED_PLAN.md`](docs/REVISED_PLAN.md) — product thesis, gates and quality bar.
- [`docs/PRODUCT_RESEARCH.md`](docs/PRODUCT_RESEARCH.md),
  [`docs/CONSUMER_RESEARCH.md`](docs/CONSUMER_RESEARCH.md),
  [`docs/COMPETITOR_ANALYSIS.md`](docs/COMPETITOR_ANALYSIS.md).
- [`docs/WALKTHROUGH.md`](docs/WALKTHROUGH.md) — deterministic capture and video script.
- [`docs/PILOT_HANDOFF.md`](docs/PILOT_HANDOFF.md) — what remains human before and during the pilot.
- [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CHANGELOG.md`](CHANGELOG.md),
  [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md), [`LICENSE`](LICENSE).

The licence file is a **proprietary notice**: source is viewable for evaluation, no open-source
licence is granted.
