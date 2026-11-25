# Backlog

Ordered, executable tasks. IDs are stable: never renumber, only add, split (e.g. `P0-7a`) or mark done with a date. Every item names a `file:line` surface and a testable "Done when". Status values: `OPEN`, `SPLIT`, `BLOCKED (reason)`, `DONE (date)`. Baseline evidence is in [`progress.md`](progress.md).

## Horizon map

| Horizon | IDs | Meaning |
|---|---|---|
| Short term | `P0-1` … `P0-10`, `P1-1`, `P1-2` | Next assistant sessions. Concrete, local, verifiable (`P1-1`/`P1-2` are blocked pending a publish decision). |
| Midterm | `M1-1` … `M1-6`, `M2-1` … `M2-3` | Real-world validation, product/team milestones, GTM proof. |
| Long term | `M3-1` … | Product shape, deployment posture, business model, scale exits. |

Gate: `P1-2` is **BLOCKED — publish phase skipped by explicit user decision (2026-11-25)**. Do not start it without a new decision.

---

## Short term

- [ ] **`P0-1` — Replace the broken `lint` script and add `typecheck`.** `OPEN`
  - Surface: `package.json:6-11` (`"lint": "next lint"`); `next lint` removed in `next@16.2.9` — verified failure: `Invalid project directory provided, no such directory: ...\synodos\lint`.
  - Do: choose ESLint flat config or `tsc --noEmit`; add scripts; ensure Windows/PowerShell ergonomics (`npm.cmd`, since plain `npm` is blocked by execution policy).
  - **Done when:** `npm.cmd run lint` and `npm.cmd run typecheck` both exit 0; no `next lint` remains; result recorded in `progress.md`.

- [ ] **`P0-2` — Add a test runner and first unit tests for pure logic.** `OPEN`
  - Surface: no test runner/config/script exists; targets `lib/itineraries.ts:130-150` (`buildItinerary`), `:156-190` (`rebuildDay`), `lib/feasibility.ts:62-66` (`travelMinutes`), `:68-119` (`validateDay`).
  - Do: add `test` script; cover duplicate-stop exhaustion, closed-weekday handling, past-midnight close, swap behaviour and a malformed-title fallback.
  - **Done when:** `npm.cmd test` exits 0 and each named function has at least one assertion that fails on the current known defect.

- [ ] **`P0-3` — Validate each day with its own date; separate hard from advisory constraints.** `OPEN`
  - Surface: `lib/feasibility.ts:121-122` (one `date` for all days), `:68-69` (weekday from that date), `:91-104,118` (all warnings), `:80-81,94-97` (last-entry blamed on closing), `components/planner/Planner.tsx:112`.
  - Do: per-day date = start + index; closed/past-closing → infeasible; long transfer → advisory; fix or remove the unused `city` parameter.
  - **Done when:** a Fri/Sat/Sun 3-day test reports three different weekdays; a closed venue produces `feasible: false`; a >60 min transfer remains visible but advisory.

- [ ] **`P0-4` — Eliminate repeated stops on 4–7 day plans.** `OPEN`
  - Surface: `lib/itineraries.ts:139-143` (`pool[0] ?? fallback[d % fallback.length]`); only 3 items per slot per city (`:49-59` ff.); UI allows 2–7 days at `Planner.tsx:190`.
  - Do: explicitly cap, expand the dataset, or degrade gracefully with a visible notice; make `rebuildDay` re-check feasibility (`:167-187`); fix the contradicting comment (`:152-155`).
  - **Done when:** a 7-day plan for every city has no repeated item in any slot; `rebuildDay` output passes `validatePlan`.

- [ ] **`P0-5` — Reconcile per-stop currency with the USD-equivalent model.** `OPEN`
  - Surface: `components/planner/Planner.tsx:319` renders `item.price` with `city.currency`; `lib/itineraries.ts:195-197` says the aggregate is USD; `Planner.tsx:222-225` claims local stop prices; no FX code exists.
  - Do: pick one truth (convert, relabel, or remove per-stop prices) and apply it to data comment, form note and rendered output.
  - **Done when:** no displayed number is followed by a currency it does not represent; a test asserts the rendered symbol for Tokyo and Bali.

- [ ] **`P0-6` — Implement or retract "Save plan".** `OPEN`
  - Surface: `components/planner/Planner.tsx:78` (`setItem` only); no `getItem` in the repo; `README.md:18` advertises save.
  - Do: versioned read path with corrupt-payload handling, or remove the button and correct the README.
  - **Done when:** a generated plan is restored after reload, or neither UI nor docs claim saving works.

- [ ] **`P0-7` — Resolve the critical/high dependency advisories.** `OPEN`
  - Surface: `package.json:13` pins `next@16.2.9`; `npm.cmd audit` → 3 vulnerabilities (2 high, 1 critical) in next/postcss/sharp; suggested fix `next@16.4.6` is outside the stated range.
  - Do: upgrade in a controlled branch, run build + tests, or record a written risk acceptance in `decisions.md`.
  - **Done when:** `npm.cmd audit` exits 0, or an explicit accepted-risk decision is appended and the build still exits 0.

- [ ] **`P0-8` — Harden the waitlist form's data handling.** `OPEN`
  - Surface: `components/ui/WaitlistForm.tsx:7` (hard-coded personal Gmail), `:34` (`_captcha: 'false'`), `:59-74` (client-only regex, `noValidate`), no consent/retention/privacy link; `README.md:19`.
  - Do: env-configured endpoint, CAPTCHA on, consent checkbox, privacy link, server-side validation where possible; no secrets in tracked files.
  - **Done when:** no personal address in tracked source; submission requires consent; a privacy-policy URL is linked or the form is disabled pending one.

- [ ] **`P0-9` — Reconcile marketing claims with implemented capabilities.** `OPEN`
  - Surface: `lib/site.ts:10,49-54`, `README.md:3,5`, `components/ui/ConceptModal.tsx:24,51`, `components/sections/Idea.tsx:22-25`, `components/sections/Features.tsx:9-14`, `app/layout.tsx:44` (no OG image), `Idea.tsx:1` (unused import).
  - Do: downgrade or implement claims; label concept data consistently; add an OG image or lower the Twitter card type.
  - **Done when:** each public claim maps to an implementing `file:line` or is labelled concept; no unused import; social card has an image or no image claim.

- [ ] **`P0-10` — Verify generated artefacts against source, repeatably.** `OPEN`
  - Surface: `next.config.ts:6-10`, `out/index.html` (42,979 bytes; 0 Google-font requests; 8 `.woff2` preloads; 1 FormSubmit disclosure mention).
  - Do: encode the check (clean build → assert route set, asset URLs carry `/synodos`, no CDN font requests) in a script.
  - **Done when:** the check runs from one command and fails on a deliberately broken `basePath`.

- [ ] **`P1-1` — Add a CI quality gate before deploy.** `BLOCKED — publish phase skipped (user decision 2026-11-25)`
  - Surface: `.github/workflows/deploy-pages.yml:20-31` (no lint/test/typecheck); `desktop-release.yml:9-10` grants `contents: write` workflow-wide.
  - Do: gate `npm ci → typecheck → lint → test → build → deploy`; least-privilege permissions.
  - **Done when:** a deliberately failing test blocks the Pages job; no write permission on build-only jobs.

- [ ] **`P1-2` — Public-repo scaffolding (LICENSE notice, THIRD_PARTY_NOTICES, CONTRIBUTING, CHANGELOG, CI badge).** `BLOCKED — publish phase skipped by explicit user decision (2026-11-25)`
  - Surface: repo is already `PUBLIC` with `licenseInfo: null` (`gh repo view`); no `LICENSE`, `CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md` or `THIRD_PARTY_NOTICES` exists.
  - Do (only after a new decision): proprietary notice per the 2026-11-25 licence choice; source-linked third-party notices; contribution/change policy; CI badge. Never make the repo public or push without fresh confirmation.
  - **Done when:** user explicitly re-authorises Phase 2, files exist and are linked from `README.md`, and the remote state is verified.

---

## Midterm

- [ ] **`M1-1` — Per-stop verification ledger.** `OPEN`
  - Surface: `lib/itineraries.ts:1-29,23` (city-level `verifiedAt` only), `lib/venue-meta.ts:1-14,66-73` (title-keyed lookup, `DEFAULT_META`), `Planner.tsx:254`.
  - Exit: 100% of items carry `source`, `checkedAt`, confidence; a test asserts coverage and the exact-title lookup cannot silently degrade.

- [ ] **`M1-2` — Hard-constraint solver with per-day dates and timezones.** `OPEN`
  - Surface: `lib/feasibility.ts:27,61-66,68-119,121-128`; `docs/REVISED_PLAN.md:7,24,77,90`.
  - Exit: closed venues block a day; timezones handled per city; no seasonal/holiday claim remains undocumented; test matrix covers 4 cities × 7 weekdays.

- [ ] **`M1-3` — Budget truth: input constrains plan, prices display honestly.** `OPEN`
  - Surface: `Planner.tsx:28,45-56,165,319`, `lib/itineraries.ts:192-215`, `docs/REVISED_PLAN.md:36`.
  - Exit: an over-budget plan is flagged in the UI; category sums equal the headline total; no FX mislabelling.

- [ ] **`M1-4` — Consent, retention and deletion for waitlist data.** `OPEN`
  - Surface: `WaitlistForm.tsx:7,34,79-82`, `docs/PRODUCT_RESEARCH.md:79-90` (none implemented).
  - Exit: privacy policy live; consent recorded; export/delete path tested; Human/legal sign-off appended to `decisions.md`.

- [ ] **`M1-5` — Real-world validation.** `OPEN`
  - Surface: `docs/CONSUMER_RESEARCH.md`, `docs/REVISED_PLAN.md:21-54` (targets only, no instrumentation).
  - Exit: ≥10 structured interviews (target), ≥3 partner conversations (target), go/no-go recorded against each documented gate.

- [ ] **`M1-6` — Desktop packaging quality.** `OPEN`
  - Surface: `desktop/package.json:20-51` (no icon, minimal deb metadata), `:29` (`../out` coupling), `desktop-release.yml:19-20` (unsigned), `README.md:42`.
  - Exit: root `dist:desktop` script; icons + deb fields set; signed builds on Windows/macOS; no stale-`out` packaging.

- [ ] **`M2-1` — LLM drafting with eval harness.** `OPEN`
  - Surface: `docs/REVISED_PLAN.md:77-78` (documented only); no AI/eval code exists.
  - Exit: eval dataset + scorer in repo; solver remains authoritative; cost per plan < $0.05 target measured, not assumed.

- [ ] **`M2-2` — One live inventory/bookings handoff.** `OPEN`
  - Surface: `lib/itineraries.ts:217-245` (four static provider links), `Planner.tsx:340`, `docs/REVISED_PLAN.md:40-41`.
  - Exit: one city with live data; merchant of record and refund path stated; no unauthorised affiliate IDs.

- [ ] **`M2-3` — Funnel instrumentation for documented gates.** `OPEN`
  - Surface: `docs/REVISED_PLAN.md:21-54`; no analytics found in source or built HTML.
  - Exit: each gate has a measurable event and a dashboard; consent respected; "no tracking" copy reconciled first.

---

## Long term

- [ ] **`M3-1` — Product shape: solver-governed companion with a verified place graph.** `OPEN`
  - Exit: in-trip disruption mode, PWA/offline support (currently claimed at `lib/site.ts:10` with no manifest), and ≥3 live partner cities.

- [ ] **`M3-2` — Deployment posture: static client + optional self-hosted API.** `OPEN`
  - Exit: no runtime secret in tracked files (`.gitignore:4`); documented self-host path; on-prem/desktop package maintained.

- [ ] **`M3-3` — Business model and scale exit.** `OPEN`
  - Exit (targets): ≥1,000 paying subscribers; ≥40% 30-day retention; ≥99% sourced stops; p95 plan generation < 2 s; cost per plan < $0.05; zero critical advisories; signed releases on all three platforms.
