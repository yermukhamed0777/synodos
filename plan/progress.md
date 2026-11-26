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

## 2026-11-25 — Push and CI verification (same session, verification-only follow-up)

### What changed

- Appended this entry and the CI result to the status snapshot in `plan/README.md`. No other files changed; no source code fixed.

### Exact commands and results

| Command | Result |
|---|---|
| `git add README.md plan; git commit -m "Add long-term plan folder with strategy, roadmap, backlog and append-only logs"` | `[main 39c44e4]`, `7 files changed, 414 insertions(+)`. Git warned that LF will be normalised to CRLF in the working copy for the six `plan/*.md` files. |
| `git push origin main` | `PUSH_EXIT=0`, `0ff3139..39c44e4 main -> main`. A `git-credential-manager.exe ... No such file or directory` warning appeared on stderr but did not fail the push. |
| `git rev-parse HEAD` | `39c44e4de08f044c1fa9ebaf3e9ec784cf36f3c9`. |
| `git ls-remote origin refs/heads/main` | `39c44e4de08f044c1fa9ebaf3e9ec784cf36f3c9 refs/heads/main` — remote HEAD equals local HEAD. |
| `git status --short --branch` | `## main...origin/main`, clean. |
| `gh run list --limit 5` | New run `45625449117`, `Deploy Synodos to GitHub Pages`, `main`, push, initially `queued`; previous runs all `completed success`. |
| `gh run watch 45625449117 --exit-status` | `WATCH_EXIT=0`; `build` ✓ in 33 s (checkout, setup-node, `npm ci`, `npm run build`, configure-pages, upload-pages-artifact), `deploy` ✓ in 11 s. Annotation: **Node.js 20 is deprecated**; `checkout@v4`, `configure-pages@v5`, `setup-node@v4`, `upload-artifact@v4` were forced onto Node 24 by the runner. |

### Open items

Unchanged from the previous entry. The CI annotation is an environment/workflow observation, not a direction change, so no `decisions.md` row was added; record it under `P1-1` if the publish phase is re-opened.

## 2026-11-26 — New mandate: plan-layer re-base (planning only)

### What changed

- `plan/decisions.md`: appended six 2026-11-26 decision rows (mandate supersedes the 2026-11-25 publish-skip decision; human boundary at the real-user pilot; USD-only money labels; 3-day selector cap; env-gated waitlist with consent and a static privacy page; content-free event harness).
- `plan/backlog.md`: `P1-1`/`P1-2` changed from BLOCKED to `OPEN — re-authorised 2026-11-26`; horizon map and gate updated; added `P0-11`, `V1-1`, `V1-2`, `V1-3`, `CV-1`, `CV-2`, `CV-3`, `CV-4`, all OPEN.
- `plan/roadmap.md`: updated the P1-1/P1-2 sentence and the "publishing scaffolding stays skipped" note; added section 7 (CV-ready finish and verification) with Intelligence/Human split and Done-when.
- `plan/strategy.md`: resolved the Phase 2 open question as re-authorised, updated the commercial-posture note, and added a 2026-11-26 session-history row.
- `plan/README.md`: status snapshot now marks the 2026-11-26 mandate in progress, re-authorised `P1-1`/`P1-2`, and lists the new IDs as next actions; 2026-11-25 numbers retained verbatim and labelled baseline.
- No source code changed; no commands beyond file reads/writes were run in this session.

## 2026-11-26 — Hardening, verification matrix and CV-ready finish (implementation session)

### What changed (grouped by backlog ID)

- `P0-1`, `P0-7`: replaced `next lint` with ESLint flat config (`eslint.config.mjs`) and added `typecheck`; pinned `next@16.4.6`, added dev tooling; `npm ci` and `npm audit` now report 0 vulnerabilities.
- `P0-2`: added `tsx`/`node:test` harness and `tests/unit/` (25 tests) covering itineraries, feasibility, saved-plan parsing, content-free events and the artefact checker.
- `P0-3`: `lib/feasibility.ts` now derives a date per day (UTC-noon anchor), separates hard conflicts from advisories, exposes `totalHard`, and generates an accurate closing/last-entry message. `lib/itineraries.ts` schedules stops against closure days and slot fit, so default plans have zero hard conflicts.
- `P0-4`: removed `fallback[d % fallback.length]`; `maxDaysFor` clamps trips to the dataset-supported 2–3 days; `rebuildDay` never loses a day and avoids duplicate stops.
- `P0-5`: removed `City.currency`; every displayed money value is now `~$N USD` with an explicit USD-equivalent form note.
- `P0-6`: added `lib/saved-plan.ts` with version `synodos_saved_plan_v1`, validation and an automatic restore path; corrupt payloads are rejected.
- `P0-8`, `P0-11`: waitlist endpoint now comes from `NEXT_PUBLIC_WAITLIST_ENDPOINT` (form disabled when unset), CAPTCHA override removed, consent checkbox added, personal address removed from tracked source and desktop metadata, and `app/privacy/page.tsx` added and linked.
- `P0-9`: reconciled public copy with shipped behaviour across `lib/site.ts`, Hero/Idea/HowItWorks/Features/Business/Footer/ConceptModal; concept previews labelled; unused `JOURNEY_ALERTS` removed; OG/Twitter image metadata added.
- `P0-10`, `V1-2`: `scripts/verify-artifact.mjs` (pure `checkArtifact` + CLI) and `scripts/verify-variants.mjs`; `next.config.ts`, `lib/site.ts` and `desktop/main.js` derive the base path from `NEXT_PUBLIC_BASE_PATH`.
- `P1-1`: CI gates in both workflows (typecheck → lint → test → build → artefact → browser smoke), Node 24, least-privilege job permissions, CI badge in `README.md`.
- `P1-2`, `CV-1`: added `LICENSE` (proprietary notice), `CONTRIBUTING.md`, `CHANGELOG.md`, `THIRD_PARTY_NOTICES.md` and rewrote `README.md`. No push, tag, release or visibility change.
- `V1-3`: `tests/e2e/smoke.test.ts` + `tests/e2e/helpers.ts` use `playwright-core` against the locally installed Chrome/Edge with a local static server; no browser download or external service.
- `CV-2`: `scripts/capture-walkthrough.ts`, `docs/WALKTHROUGH.md`; deterministic fixtures in gitignored `artifacts/walkthrough/`.
- `CV-3`: `lib/events.ts` — allowlisted names + timestamp only, no payload, no storage, no network.
- `CV-4`: `docs/PILOT_HANDOFF.md` — seven-day pilot script, consent wording, go/no-go gates and an explicit human-only list.
- All 20 short-term IDs are now `DONE (2026-11-26)`.

### Verification matrix — exact commands and exact results

| Command | Result |
|---|---|
| `npm.cmd ci` | exit 0; "added 138 packages, and audited 139 packages in 14s"; "found 0 vulnerabilities"; npm 11 `allow-scripts` warning for `esbuild@0.28.2`; eslint@9 deprecation warning. |
| `npm.cmd audit --audit-level=low` | exit 0; "found 0 vulnerabilities". |
| `npm.cmd run typecheck` | exit 0; `tsc --noEmit`, no diagnostics. |
| `npm.cmd run lint` | exit 0; `eslint . --max-warnings 0`, no diagnostics. |
| `npm.cmd test` | exit 0; `tests 25`, `pass 25`, `fail 0`, `skipped 0`, `duration_ms` 172.49 (final `verify` run) / 230.07 (standalone run). |
| `npm.cmd run build` | exit 0; Next 16.4.6 Turbopack; compiled 766 ms, TypeScript 1263 ms, 6 static pages in 513 ms; 5 routes `/`, `/_not-found`, `/icon.svg`, `/planner`, `/privacy`. |
| `npm.cmd run verify:artifact` | exit 0; "PASS artifact check: 5 required files, base path '/synodos', 0 problems". |
| `npm.cmd run test:e2e` | exit 0; `tests 1`, `pass 1`, `fail 0`; browser test 2890.24 ms, suite 3320.99 ms; 0 console errors; 0 external font or FormSubmit requests. |
| `npm.cmd run verify:variants` | exit 0; subpath build → "PASS artifact check: 5 required files, base path '/synodos', 0 problems"; root build → "PASS artifact check: 5 required files, base path '', 0 problems"; "PASS both variants; out/ restored to the /synodos build." |
| `npm.cmd run walkthrough` (twice) | exit 0; fixtures 111 / 1094 / 2411 / 1661 / 298 bytes; `manifest.json` SHA-256 identical across runs: `0E93C98AC15E8B4770C5055329588BBCBFA467A71094385FBA6D0471E38363AC`. |
| `npm.cmd run verify` | exit 0; whole chain typecheck → lint → 25/25 tests → build → artefact check passed; recorded build timings 766/1263/513 ms and 5 routes. |
| CI gate probe (temporary `tests/unit/zz-gate-probe.test.ts`, removed after) | `npm.cmd test` → `tests 26`, `pass 25`, `fail 1`, `GATE_EXIT=1`; after removal `npm.cmd test` → `tests 25`, `pass 25`, `fail 0`. Proves a red test blocks the gated job. |
| `git diff --check` | exit 0; no whitespace errors (only LF→CRLF normalisation warnings). |

### Open items

All short-term IDs done. Remaining work is human only: recruit and consent participants, configure a real waitlist endpoint and review the privacy notice, run interviews and record go/no-go, sign partners/certificates, and explicitly authorise any push/tag/release. Mid/long-term IDs (`M1-1` … `M3-3`) remain OPEN targets, not measurements. Measured numbers above are local only; no CI run ID or deploy conclusion exists for this session because nothing was pushed.

### Final re-run after the last artefact-checker change (2026-11-26)

| Command | Result |
|---|---|
| `npm.cmd run verify` | exit 0; typecheck/lint clean; `tests 25`, `pass 25`, `fail 0` (211.44 ms); build compiled 184 ms, TypeScript 1500 ms, 6 static pages in 492 ms, 5 routes; artefact check PASS, 0 problems. |
| `npm.cmd run test:e2e` | exit 0; `tests 1`, `pass 1`, `fail 0`; browser test 2972.04 ms, suite 3432.63 ms. |
| `npm.cmd run verify:variants` | exit 0; subpath base path `/synodos` PASS 0 problems; root base path `''` PASS 0 problems; `out/` restored to the `/synodos` build. |
| `git diff --check` | exit 0; no whitespace errors (only LF→CRLF normalisation warnings). |
