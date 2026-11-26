# Contributing

Practical rules for working in this repository. Read [`plan/README.md`](plan/README.md) first: the
`plan/` folder is the internal execution record, not marketing copy.

## Ground rules

- Work locally. **Do not push, publish, change repository visibility or licence, create releases or
  tags, or spend money** without the owner's explicit confirmation for that action. The
  2026-11-26 mandate covers everything agent-doable up to the real-user pilot; interviews, real
  signups, partner conversations, accounts and legal sign-off stay with humans.
- No personal inbox, endpoint, token or secret belongs in tracked files. The waitlist endpoint is
  supplied at build time as `NEXT_PUBLIC_WAITLIST_ENDPOINT`; with no endpoint the form is disabled.
  `.env.example` only holds placeholders. The artefact check rejects a known personal address and a
  disabled-CAPTCHA override in built HTML.
- All money shown or documented is a **USD-equivalent estimate**. There is no FX conversion and no
  live pricing; do not relabel a number as local currency (decision `2026-11-26` in
  [`plan/decisions.md`](plan/decisions.md)).
- The planner is capped at **2–3 days depending on the city**: the curated dataset holds three
  unique items per slot, and some stops cannot fit their slot at all, so longer trips would repeat
  stops or report conflicts. `maxDaysFor` in `lib/itineraries.ts` drives the selector; prefer honesty
  over fake coverage.
- Prefer labelled concept previews to claims about shipped features. In-trip disruption handling,
  live inventory and booking are future work, not current behaviour.

## Stack

- Next.js **16.4.6**, App Router, static export (`next.config.ts`) → GitHub Pages at the
  `/synodos` subpath by default.
- React 19 + TypeScript; plain CSS design system (`app/globals.css`), no UI framework.
- Electron desktop wrapper in `desktop/` serves the static export locally (offline).
- Node `>=20.19.0` (`package.json` `engines`).

## Local setup

```bash
npm ci
npm run dev
```

The default `basePath` is `/synodos`, so locally the site is at `http://localhost:3000/synodos/`.
A root-path build is available by setting `NEXT_PUBLIC_BASE_PATH` to an empty value at build time;
keep `next.config.ts`, `lib/site.ts` and the value used by the artefact check in sync.

### Windows / PowerShell

Plain `npm` is blocked here (`npm.ps1 cannot be loaded because running scripts is disabled on this
system`). Use `npm.cmd` for every command, for example `npm.cmd ci` and `npm.cmd run verify`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local Next.js development server. |
| `npm run verify` | Full local gate: `typecheck` → `lint` → `test` → `build` → `verify:artifact`. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run lint` | `eslint . --max-warnings 0` (warnings are denied). |
| `npm test` | Unit tests in `tests/unit/` via `tsx --test`. |
| `npm run build` | Static export into `out/`. |
| `npm run verify:artifact` | Asserts required routes, base-path-prefixed asset URLs, no runtime Google Fonts request, no personal address and a linked privacy page. |
| `npm run test:e2e` | Browser smoke test via `playwright-core` against `tests/e2e/`. Needs a built `out/` (`npm run build` first) and a locally installed Chrome or Edge; no browser is downloaded. Runs load → city/day select → plan → rebuild → save/reload → privacy page. |
| `npm run verify:variants` | Builds and verifies both the `/synodos` subpath variant and a root-path variant, then restores `out/` to the subpath build. |
| `npm run walkthrough` | Runs `tsx scripts/capture-walkthrough.ts` and captures deterministic fixtures into `artifacts/walkthrough/` (gitignored). Running it twice produces a byte-identical `manifest.json`. |

Run `npm.cmd run verify` before handing work back, and record the exact command and observed result —
do not report a target or an inferred pass.

## Plan folder convention

- [`plan/backlog.md`](plan/backlog.md) holds ordered, executable tasks with **stable IDs**. Never
  renumber: add a new ID, or split one as `P0-7a`, and mark done as `DONE (date)`.
- [`plan/decisions.md`](plan/decisions.md) and [`plan/progress.md`](plan/progress.md) are
  **append-only**. Never rewrite or delete an old row or session entry; supersede with a new row.
- Every claim must be traceable to a command that was actually run. Record exact commands, exit
  codes and observed output in `progress.md`; append to `decisions.md` when direction, scope or cost
  changes; update the status snapshot in `plan/README.md` in the same commit as the work.
- Metrics in the research docs are targets, not achievements, until a recorded command measures
  them.

## Filing a failure as a new backlog ID

1. Reproduce it with a concrete command and capture the exact output.
2. Add a new, never-reused ID to the right horizon in `plan/backlog.md` with a `file:line` surface,
   the failing command and a testable **Done when** criterion. Split an existing ID (e.g. `X-1a`)
   instead of renumbering when the failure belongs to a larger task.
3. Append the command, result and open item to `plan/progress.md`. Append a `decisions.md` row if the
   fix changes direction, scope, licence posture or cost.
4. Do not silently fix a defect in the same session as the plan update unless the plan convention is
   followed; hardening first, with a test for the defect, is the recorded priority.

## Licensing

This repository is **proprietary**: see [`LICENSE`](LICENSE). Source is publicly viewable for
evaluation only; no licence to copy, modify, distribute or use it is granted. Do not change the
licence or add an open-source licence without the owner's explicit decision. Third-party package
metadata is in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
