# Plan index

This folder is the long-term execution record for Synodos. It is **internal planning material**, not marketing copy. Every claim in these files must be traceable to a command that was actually run; see `progress.md`.

| File | Purpose |
|---|---|
| [`strategy.md`](strategy.md) | Market thesis, users, positioning, metrics, risks, open questions, session-history table. |
| [`roadmap.md`](roadmap.md) | THE PLAN — short term / midterm / long term, each milestone split into Intelligence and Human work, plus the host/product expansion catalogue. |
| [`backlog.md`](backlog.md) | Ordered, executable tasks with stable IDs, `file:line` references, "Done when" criteria and a horizon map. |
| [`decisions.md`](decisions.md) | Append-only decision log: date, decision, why. Old rows are never rewritten. |
| [`progress.md`](progress.md) | Append-only session log: exact changes, exact commands and results, open items mapped to backlog IDs. |

## Status snapshot

- **Stage:** final constraint-engine validation and release freeze complete at `87ea728`; stopped at the real-user pilot boundary. The 2026-11-25 numbers below are a **baseline**; current measured results are in the final 2026-11-26 entry of `progress.md`.
- **Stage gate:** Phase 1 (inspect) and Phase 3 (plan folder) done. Phase 2 (publish) was **skipped by explicit user decision (2026-11-25)** and **re-authorised 2026-11-26**: `P1-1` and `P1-2` are now `DONE (2026-11-26)` for local work. LICENSE, CONTRIBUTING, CHANGELOG, THIRD_PARTY_NOTICES and a CI badge now exist and are linked from `README.md`; `SECURITY.md` was deliberately not added. Local work only — no push, publication or spend without final explicit confirmation.
- **Baseline measured numbers (all from commands in `progress.md`, 2026-11-25; baseline only — not a current re-run):**
  - `npm.cmd run build` → **PASS**, exit 0, 5 static routes, compile 2.9 s, TypeScript 2.1 s, static generation 445 ms.
  - `npm.cmd run lint` → **FAIL**, exit 1: `Invalid project directory provided, no such directory: ...\synodos\lint` (`next lint` removed in Next 16).
  - `npm.cmd audit` → **FAIL**, exit 1: 3 vulnerabilities (2 high, 1 critical) in `next@16.2.9` / `postcss` / `sharp`; fix suggests `next@16.4.6`, outside the pinned range in `package.json:13`.
  - Tests / benchmarks / eval harness: **absent** — no runner, no config, no script.
  - `out/index.html` → 42,979 bytes, 0 `fonts.googleapis`, 0 `fonts.gstatic`, 8 `.woff2` preloads (fonts are self-hosted), 1 `formsubmit` mention (disclosure text).
  - Environment: Node `v24.18.1`, npm `11.16.0` via `npm.cmd` (plain `npm` is blocked by PowerShell execution policy).
- **Baseline re-run at commit time (after all edits, 2026-11-25):** build **PASS**, exit 0, static generation 403 ms; lint **FAIL**, exit 1 (unchanged); audit **FAIL**, exit 1, 3 vulnerabilities (unchanged). Only `README.md` and new `plan/` files were modified.
- **Baseline CI (2026-11-25):** run `45625449117` (`Deploy Synodos to GitHub Pages`) **passed** — build ✓ 33 s, deploy ✓ 11 s. Annotation: runner forced Node-20-targeting actions onto Node 24 (Node 20 deprecated). Remote HEAD `39c44e4…` equals local HEAD at push time.
- **Final local results (2026-11-26, exact commands in `progress.md`):** `npm.cmd run validate:matrix` → 196 combinations, 476 generated days, 0 hard conflicts, 28 advisories, 0 duplicates, 0 incomplete builds, 476 rebuilds with 0 hard conflicts / 164 limited; `npm.cmd run verify` → exit 0 (typecheck, lint, 34 tests, build, artefact check); `npm.cmd test` → 36/36 pass after final tests; `npm.cmd run test:e2e` → 1/1 pass; `npm.cmd run verify:variants` → both `/synodos` and root builds pass; `npm.cmd run walkthrough` → deterministic manifest hash unchanged.
- **Delivery baseline:** the reviewed commit was `87ea728`, with CI run `45752043617` success and Pages deployment `8076068381`. Vercel reported `success` for `87ea728` at `2026-11-26T03:58:42Z` but its public path configuration could not be verified without dashboard access. This freeze adds local commits only; no push, tag, release or visibility/licence change.
- **Next actions:** none agent-doable. `F1-1`…`F1-5` are `DONE (2026-11-26)`; `F1-6` and the student pilot are human only. Mid/long-term IDs remain OPEN targets. Canonical demo: `https://yermukhamed0777.github.io/synodos/planner/`.

## Binding update convention

After **every** work session, in the **same commit** as the work:

1. Tick, split or add items in `backlog.md`.
2. Append a `progress.md` entry with exact changes, exact commands and their results.
3. Append to `decisions.md` if direction, scope or cost changed.
4. Update `roadmap.md` and the session-history table in `strategy.md` if the horizon, milestone or work split changed.
5. Update this status snapshot (stage, latest measured numbers, next action).
6. Re-run tests, benchmark/lint and build; record the results.

Research or scoping sessions still produce a plan entry. Append-only files (`decisions.md`, `progress.md`) are never rewritten.
