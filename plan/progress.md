# Session log (append-only)

Rules: append one entry per work session, including research/scoping-only sessions. Record exact commands and their results. Never rewrite an old entry.

## 2026-11-25 — Phase 1 inspection + Phase 3 plan folder (research/planning session)

### What changed

- Created `plan/README.md`, `plan/strategy.md`, `plan/roadmap.md`, `plan/backlog.md`, `plan/decisions.md`, `plan/progress.md` (`plan/` did not exist before).
- Linked `plan/` from the root `README.md`.
- **No source code, workflows, dependency versions, lockfiles or generated artefacts were modified.** The publish phase was skipped on the user's explicit instruction.
- Three parallel read-only audits were run: (a) core code/data layer, (b) UI/i18n/styles/docs, (c) tests/eval/CI/packaging. Their findings were cross-checked with direct reads/greps before being written into the plan.

### Exact commands and results

| Command | Result |
|---|---|
| `git status --short --branch` | `## main...origin/main`, no changes. |
| `git log --oneline -10` | `0ff3139` Add deterministic feasibility solver…; `317795e` Document desktop builds…; `e2e0278` Fix Debian package metadata…; `416d2f1` Fix budget currency model…; `895dfc7` Add verified plan data…; `64889b7` Untrack local screenshots; `bf17b1d` Add print fallback…; `ae2e1f3` Make per-day rebuild swap stops…; `4a0c5d7` Fix credibility claims…; `4bab92d` Add one-day re-planning… |
| `git remote -v` | `origin https://github.com/yermukhamed0777/synodos.git` (fetch + push). |
| `gh auth status` | Logged in to github.com as `yermukhamed0777` (keyring); scopes `delete_repo, gist, read:org, repo, workflow`. |
| `gh repo view --json nameWithOwner,visibility,isPrivate,licenseInfo,defaultBranchRef` | `nameWithOwner=yermukhamed0777/synodos`, `visibility=PUBLIC`, `isPrivate=false`, `licenseInfo=null`, `defaultBranchRef=main`. |
| `node --version` | `v24.18.1`. |
| `npm --version` | Blocked: PowerShell `npm.ps1 cannot be loaded because running scripts is disabled on this system`. |
| `npm.cmd --version` | `11.16.0`. All later npm commands used `npm.cmd`. |
| `npm.cmd ci` | "added 27 packages, and audited 28 packages in 18s"; "3 vulnerabilities (2 high, 1 critical)"; npm 11 `allow-scripts` warning for `sharp@0.34.5`; tool reported exit 1 because warnings went to stderr. |
| `npm.cmd run build` | **PASS**, `EXITCODE=0`. Next 16.2.9 (Turbopack); compiled in 2.9 s; TypeScript 2.1 s; 5 static pages in 445 ms; routes `/`, `/_not-found`, `/icon.svg`, `/planner`. |
| `npm.cmd run lint` | **FAIL**, `EXITCODE=1`: `Invalid project directory provided, no such directory: C:\Users\erm1h\Documents\Projects\synodos\lint`. Cause: `next lint` removed in Next 16 (`package.json:10`). |
| `npm.cmd audit` | **FAIL**, `EXITCODE=1`: 3 vulnerabilities — `next@16.2.9` critical (many advisories), `postcss <=8.5.22` high, `sharp <=0.35.5-rc.1` high. Suggested fix `next@16.4.6`, outside the pinned range at `package.json:13`. |
| `Get-Item out\index.html` | 42,979 bytes after the successful build. |
| `Select-String` on `out/index.html` | `fonts.googleapis` 0, `fonts.gstatic` 0, `formsubmit` 1, `FormSubmit` 1, `_next/static/media` 1, `.woff2` occurrences 8 → fonts self-hosted, no runtime font CDN. |
| `Test-Path plan` | `NO plan/ dir`. |
| `Test-Path PLAN.md` | `NO`. |
| `git ls-files public` | Three tracked WebP files: `hero-aurora.webp`, `hero-globe.webp`, `hero-terminal.webp`. |
| `git rev-parse HEAD` (before work) | `0ff31395e8dc86acb88c3677e6786fc9a6390bd8`. |

### Cross-checked code findings (direct reads/greps, not just audit reports)

- `package.json:10` → `"lint": "next lint"`; confirmed broken by execution above. No `test`/`typecheck` script; no lint config; no test runner.
- `lib/feasibility.ts:68-69` → `validateDay(city, day, date)` computes `weekday` from one `date`; `:121-122` passes that same `date` to every day; `components/planner/Planner.tsx:112` supplies `startDate`. `city` is unused in both function bodies.
- `lib/feasibility.ts:91-104,118` → closed days / late arrival / past closing / long transfers are all warnings; `feasible = warnings.length === 0`.
- `lib/itineraries.ts:139-143` → `const chosen = pool[0] ?? fallback[d % fallback.length]`; `components/planner/Planner.tsx:190` offers 2–7 days.
- `lib/itineraries.ts:195-197` → aggregate explicitly USD; `components/planner/Planner.tsx:319` renders `item.price` with `city.currency`; `:222-225` claims local stop prices. No FX code found.
- `components/planner/Planner.tsx:78` → `localStorage.setItem('synodos_saved_plan', ...)`; grep for `getItem` returned no matches.
- `components/ui/WaitlistForm.tsx:7` → hard-coded FormSubmit AJAX endpoint pointing at a personal Gmail inbox (address redacted here; it is already present in the tracked source file); `:34` → `_captcha: 'false'`.
- `components/sections/Idea.tsx:1` imports `JOURNEY_ALERTS`; `:24` renders "Sushi Kai · 4.8 · 500m from you" as a live-looking card.
- `components/ui/ConceptModal.tsx:24` → "▶ Watch Concept"; `:51` admits it is not a video.
- `app/layout.tsx:44` → `card: 'summary_large_image'`; no OG image file or metadata found.
- `.github/workflows/deploy-pages.yml:20-31` → checkout/setup-node/npm ci/build/configure-pages/upload, no lint/test/typecheck step.

### Verification re-run at commit time (after all file changes)

| Command | Result |
|---|---|
| `npm.cmd run build` | **PASS**, `BUILD_EXIT=0`; 5 static routes unchanged; static generation 403 ms (vs 445 ms on the first run). |
| `npm.cmd run lint` | **FAIL**, `LINT_EXIT=1`; same `Invalid project directory ... \lint` error. Unchanged — the broken script is intentionally left for `P0-1`. |
| `npm.cmd audit` | **FAIL**, `AUDIT_EXIT=1`; still `3 vulnerabilities (2 high, 1 critical)`. Unchanged — left for `P0-7`. |
| ID consistency check | `Select-String` over `plan\*.md` found exactly `P0-1`…`P0-10`, `P1-1`, `P1-2`, `M1-1`…`M1-6`, `M2-1`…`M2-3`, `M3-1`…`M3-3`; no orphan references. |
| `git status --short` | ` M README.md`, `?? plan/`. No other files modified. |

### Open items mapped to backlog

`P0-1` … `P0-10` all open; `P1-1` and `P1-2` blocked on a new publish decision; `M1-1` … `M2-3` and `M3-1` … `M3-3` open. Single next action: `P0-1`.
