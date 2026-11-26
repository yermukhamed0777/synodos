# Synodos — strategy

> Working document. No root `PLAN.md` existed at the time of writing (checked with `Test-Path PLAN.md` → `NO`), so this file was created from scratch rather than moved. Status and index live in [`README.md`](README.md).

## Thesis

The travel-planning market rewards inventory and booking, not itinerary reasoning. Synodos is positioned around a narrower promise: **a deterministic, verifiable day plan that survives one change without invalidating the whole trip**, then hands off to merchants without claiming commission (`lib/itineraries.ts:217-245`, `components/planner/Planner.tsx:340`). The documented end-state is "LLM drafts, solver decides" (`docs/REVISED_PLAN.md:77-78`). That end-state is **documented only**: there is no LLM, no live places/weather/routes API and no server runtime anywhere in the repo. What actually ships today is a static marketing site plus a client-side planner over a curated dataset (`README.md:3,23`, `next.config.ts:6-10`, `lib/itineraries.ts:40-121`).

Commercial posture: proprietary. On 2026-11-25 the user chose a **proprietary notice** (source visible, commercial rights retained) and skipped the publish phase; on 2026-11-26 that decision was superseded and the phase **re-authorised** (`P1-1`/`P1-2` are OPEN again). No `LICENSE` file has been added yet; the 2026-11-25 `gh repo view` reported the existing remote as `PUBLIC` with `licenseInfo: null`. This is a decision, not a licence grant, and no push or publication is authorised without final explicit confirmation.

## Users

| Segment | Evidence | What is real today |
|---|---|---|
| Self-directed trip planners comparing cities and days | Planner form (`components/planner/Planner.tsx:142-221`) | Static city shortlist via one numeric score (`:45-56`); 2–7 day selection (`:190`); save/copy/download (`:75-106`) |
| Privacy-sensitive travellers | `FEATURE_BAR` "Private by default" (`lib/site.ts:42-47`); self-hosted fonts verified in `out/index.html` (0 Google-font requests, 8 `.woff2` preloads); no analytics found in source or built HTML | Partially real: no tracking scripts, but waitlist emails go to a hard-coded personal Gmail via FormSubmit with CAPTCHA disabled (`components/ui/WaitlistForm.tsx:7,34`) |
| Offline/desktop demo users | Electron wrapper serving the static export locally (`desktop/main.js:1-86`, `README.md:38-42`) | Implemented; unsigned on macOS, no codesigning config (`desktop-release.yml:19-20`, `desktop/package.json:20-51`) |
| Paying customers / partners | Pricing and willingness-to-pay research (`docs/CONSUMER_RESEARCH.md`) | **Not validated. No payments, accounts, or gated beta exist.** `FinalCTA.tsx:12-18` calls it a "private beta" over an unguarded email form |

## Positioning

Implemented: a dark, cinematic static site with a working deterministic planner and an offline-capable desktop wrapper. Marketed: an "AI travel companion that lives on your phone" (`lib/site.ts:10`, `README.md:3,5`), with "checked against real places, hours, weather and routes" (`lib/site.ts:49-54`, `components/sections/Features.tsx:9-14`) and a "▶ Watch Concept" button that opens text, not video (`components/ui/ConceptModal.tsx:24,51`). There is no PWA manifest or service worker, and no tracking-free-but-instrumented funnel. **Positioning currently outruns the build**; closing that gap is short-term work (`P0-9`), not a marketing decision to defer.

Explicitly honest parts worth preserving: `README.md:23`, `Hero.tsx:33` and `HowItWorks.tsx:24` already label the data as a concept preview / curated dataset. `Idea.tsx:22-25` does **not** — it shows "Sushi Kai · 4.8 · 500m from you" as if live.

## Metrics

Two classes, kept separate:

**Measured (2026-11-25, commands in `progress.md`):** build pass (exit 0, 5 static routes); lint fail (exit 1); audit fail (3 vulnerabilities: 2 high, 1 critical); 0 tests; 42,979-byte `out/index.html`; 0 Google-font requests; 8 self-hosted `.woff2` preloads.

**Documented targets, NOT measured and NOT instrumented:** the go/no-go gates in `docs/REVISED_PLAN.md:21-54` (shortlist→city, budget-fit, per-plan cost) and the quality bar in `docs/REVISED_PLAN.md:132-137` (every stop sourced + checked-at, every transition physically possible). No analytics, benchmark or eval code implements any of them. Treat them as hypotheses until `M2-3` lands.

## Risks

1. **Correctness:** one `date` is passed to every day's validation (`lib/feasibility.ts:121-122`, called from `components/planner/Planner.tsx:112`), so a 7-day plan is checked as seven copies of the same weekday. Closed venues are soft warnings, not blockers (`:91-104,118`).
2. **Data drift:** venue lookup is an exact title-string key (`lib/feasibility.ts:47`); a rename silently falls back to `DEFAULT_META` (`lib/venue-meta.ts:66-73`). All 36 titles currently match (cross-checked by audit), but nothing enforces it.
3. **Unit honesty:** item prices look USD-equivalent (`lib/itineraries.ts:53,56,96`, aggregate explicitly USD at `:195-197`) yet are rendered with `city.currency` (`components/planner/Planner.tsx:319`), while the form note says the opposite (`:222-225`). No FX conversion exists.
4. **4–7 day trips repeat stops:** only three items per slot per city (`lib/itineraries.ts:49-59` ff.); `fallback[d % fallback.length]` re-serves them after day 3 (`:143`) despite the UI offering up to 7 days (`Planner.tsx:190`).
5. **Write-only save:** `localStorage.setItem` at `Planner.tsx:78`; no `getItem` exists anywhere (verified by grep). The feature is a stub presented as working (`README.md:18`).
6. **Supply chain:** pinned `next@16.2.9` (`package.json:13`) carries a critical advisory; npm 11 `allow-scripts` gating was observed for `sharp@0.34.5` during `npm ci`.
7. **Privacy/legal:** personal Gmail endpoint, CAPTCHA disabled, no consent/retention/privacy policy (`WaitlistForm.tsx:7,34`); GDPR duties are documented (`docs/PRODUCT_RESEARCH.md:79-90`) but unimplemented.
8. **Deployment coupling:** `basePath: '/synodos'` (`next.config.ts:9`) hard-wires the Pages project path; desktop `extraResources.from: '../out'` (`desktop/package.json:29`) requires a root build first.
9. **No quality gate:** `deploy-pages.yml:20-31` deploys on every push with no lint/test/typecheck step.

## Open questions

- Is the planner meant to stay free/lead-gen, or become the paid product? (Human; sets `M2`/`M3` business model.)
- Which processor replaces a personal Gmail for the waitlist, and who signs the DPA? (Human/legal.)
- Does "AI companion" get built, or does the copy get downgraded to "planner"? (Human decision; blocks `P0-10` direction.)
- Upgrade Next.js to 16.4.6+ now, or pin-and-accept with a written risk note? (Mixed; `P0-7`.)
- **Resolved 2026-11-26:** Phase 2 is re-authorised for local public-repo scaffolding (LICENSE notice, CONTRIBUTING, CHANGELOG, CI badge) under `P1-1`/`P1-2`, with the 2026-11-25 proprietary notice. Supersedes the earlier "currently **no**" answer. The human boundary remains final explicit confirmation before any push, publication or spend.

## Session history — exactly what was done

Rows below are derived from `git log --oneline -10` (run 2026-11-25) plus the current working session. Commit rows are recorded as commits, not reconstructed narratives.

| Date / ref | Session / commit | What was done (as recorded) |
|---|---|---|
| 2026-11-26 | hardening + CV-ready finish (uncommitted at write time) | Cleared all 20 short-term backlog IDs: real lint/typecheck/tests, per-day date-aware hard/advisory solver, 2–3 day cap, USD-only prices, saved-plan restore, env-gated consented waitlist + privacy page, reconciled copy, artefact/root-path checks, CI quality gates, browser e2e, CV docs, deterministic walkthrough and content-free events. Exact commands and results appended to `progress.md`; no push or release. |
| 2026-11-26 (this session) | plan-layer re-base only | New mandate: finish all agent-doable work up to the real-user pilot; six 2026-11-26 decisions appended to `decisions.md`; `P1-1`/`P1-2` re-opened as OPEN; new IDs `P0-11`, `V1-1` … `V1-3`, `CV-1` … `CV-4` added to the plan. Planning only — no source code changed and no commands beyond file reads/writes. No metrics claimed. |
| 2026-11-25 (this session) | uncommitted at write time → plan commit | Phase 1 audits of code/data, UI/docs, CI/packaging; ran `npm ci`, `build`, `lint`, `audit`; verified `out/index.html`; created `plan/` with six files and linked it from `README.md`. No source code fixed; publish phase skipped. |
| prior | `0ff3139 Add deterministic feasibility solver: hours, closures, travel and buffers` | Solver added (current defect: single date for all days). |
| prior | `317795e Document desktop builds and research docs` | Docs + desktop build notes. |
| prior | `e2e0278 Fix Debian package metadata for Linux build` | Debian metadata touched. |
| prior | `416d2f1 Fix budget currency model: USD-equivalent aggregates, local stop prices` | Aggregate made USD; per-stop price/label contradiction remains (`Planner.tsx:319`). |
| prior | `895dfc7 Add verified plan data, decision mode, competitor analysis, and desktop packaging` | Curated data, decision mode, research docs, packaging. |
| prior | `64889b7 Untrack local screenshots` | Screenshots removed from tracking. |
| prior | `bf17b1d Add print fallback for reveal animations` | Print fallback for reveals. |
| prior | `ae2e1f3 Make per-day rebuild swap stops so the day actually changes` | Cross-day swap added (`itineraries.ts:175-186`); comment now contradicts code. |
| prior | `4a0c5d7 Fix credibility claims, self-host display fonts, tighten feature strip` | Fonts self-hosted; some claims tightened, others remain (`lib/site.ts:49-54`). |
| prior | `4bab92d Add one-day re-planning and consumer research` | Rebuild + consumer research docs. |

Older commits exist beyond this window; this table is intentionally bounded to the command actually run.
