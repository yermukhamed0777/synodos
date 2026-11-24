# Synodos

Synodos is an AI travel companion concept — before, during and after a trip. This repo is the marketing site plus a working planner prototype.

## Live

https://yermukhamed0777.github.io/synodos/

## Stack

- Next.js 16 (App Router, static export)
- React 19 + TypeScript
- Plain CSS design system (no UI framework)
- GitHub Pages via `.github/workflows/deploy-pages.yml`

## What works

- **Planner** (`/planner`): city + days + travellers + interests → day-by-day draft, estimated budget, save / copy / download. Per-day rebuild keeps the rest of the trip intact.
- **Waitlist**: posts to a real email relay (FormSubmit). The owner must click the one-time activation email on the first submission.
- **Scroll reveals**: IntersectionObserver choreography with `prefers-reduced-motion` support.
- **Concept modal**, sticky nav, mobile menu.

The planner uses a curated dataset for Tokyo, Lisbon, Bali and Paris. It does not query live inventory or make bookings — that is the next phase.

## Design

Dark cinematic: red `#e2231a`, white `#f7f5f7`, purple `#8a4fd6`. Generated WebP hero imagery in `public/assets/images/`.

## Run locally

```bash
npm install
npm run dev
```

Note: `basePath` is `/synodos` for GitHub Pages. Locally the app is served at `http://localhost:3000/synodos/`.

## Desktop demo

`desktop/` packages the planner as an Electron app that serves the static export locally, so it works offline. GitHub Actions builds Windows (NSIS + zip), macOS (dmg + zip) and Linux (AppImage + deb) on native runners and attaches them to the `v*` release.

Unsigned macOS builds need right-click → Open on first launch.

## Docs

- `docs/PRODUCT_RESEARCH.md` — architecture, LLM economics, travel APIs, GDPR, phased plan
- `docs/CONSUMER_RESEARCH.md` — 2026 traveller expectations, willingness to pay, feature priorities
- `docs/COMPETITOR_ANALYSIS.md` — Layla/Expedia, Wanderlog, Mindtrip, GuideGeek, Google, Tripadvisor
- `docs/REVISED_PLAN.md` — what to build, what not to build, gates and metrics
