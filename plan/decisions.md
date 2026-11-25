# Decision log (append-only)

Rules: append new rows only. Never rewrite or delete an old row. If a decision is reversed, append a new row that supersedes it and name the old row.

| Date | Decision | Why |
|---|---|---|
| 2026-11-25 | Phase 2 (publish) skipped. No LICENSE, THIRD_PARTY_NOTICES, CONTRIBUTING, CHANGELOG, CI badge or new workflow was added. | User explicitly chose "Skip publishing". The remote already exists at `yermukhamed0777/synodos`; no repo creation was needed and no visibility change was made. |
| 2026-11-25 | Licence posture: **proprietary notice** — source visible, commercial rights retained. **No `LICENSE` file was created this session.** | User chose it when asked. Because publishing was skipped, the choice is recorded here and deferred to `P1-2`, which is blocked pending a new authorisation. |
| 2026-11-25 | Commit the plan locally **and push** to `origin/main`; verify CI afterwards. | User explicitly authorised commit + push. `gh auth status` was checked first (logged in as `yermukhamed0777`; scopes `delete_repo, gist, read:org, repo, workflow`). |
| 2026-11-25 | Plan priority: **hardening first** (lint/tests/audit/privacy) ahead of GTM or feature expansion. | User chose it. It also follows the measured baseline: build passes, lint fails, audit fails, zero tests. |
| 2026-11-25 | `P1-1` (CI quality gate) and `P1-2` (public-repo scaffolding) marked **BLOCKED**, not done. | They belong to the skipped publish phase. Hardening-first applies to code and tests; adding CI/scaffolding without a new decision would contradict the user's choice. |
| 2026-11-25 | Keep the current stack and deploy posture: Next static export (`next.config.ts:6-10`) → GitHub Pages, plus Electron desktop (`desktop/package.json:20-51`). No host/database migration. | No measured evidence the current host fails; per the selection rule, the cheapest boring option wins. Alternatives are catalogued in `roadmap.md` for later. |
| 2026-11-25 | `plan/` created from scratch; no root `PLAN.md` existed (`Test-Path PLAN.md` → `NO`), so nothing was moved. | Ground rule: inspect before overwriting. No source file was deleted or replaced. |
| 2026-11-25 | Baseline captured but no source code fixed this session; all defects went into `backlog.md`. | Publishing was skipped and the session was scoped to inspection + planning. Fixing code without tests (`P0-2`) first would be unverifiable. |
| 2026-11-25 | Treat the hard-coded FormSubmit endpoint and disabled CAPTCHA (`components/ui/WaitlistForm.tsx:7,34`) as defects, not an accepted design. | It routes user email to a personal Gmail with no consent/retention UI, while docs prescribe GDPR controls (`docs/PRODUCT_RESEARCH.md:79-90`). Tracked as `P0-8` / `M1-4`. |
| 2026-11-25 | Do not claim any documented metric as achieved. Gates in `docs/REVISED_PLAN.md:21-54` are labelled targets, not measurements. | Ground rule: never fabricate metrics. No instrumentation or eval code exists in the repo. |
