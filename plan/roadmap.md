# Synodos roadmap

Three horizons. Every milestone is split into **Intelligence** (what the assistant can do) and **Human** (what only the user can do). "Done when" / exit criteria are checks, not aspirations. Targets are explicitly labelled and are not measured results. Stable IDs match [`backlog.md`](backlog.md).

---

## 1. Short term — next concrete steps

These are the steps the assistant takes next, in order. Priority chosen by the user on 2026-11-25: **hardening first**. On 2026-11-26 the user re-authorised the publish phase: `P1-1` (CI quality gate) and `P1-2` (public-repo scaffolding) are now **OPEN — re-authorised 2026-11-26**, as listed in `backlog.md`. This is local work only — no push, publication or spend without final explicit confirmation.

**1. Repair the local verification path.** (`P0-1`, `P0-2`)
- **Intelligence:** replace `next lint` in `package.json:10` (removed in Next 16) with a working lint/typecheck path; add `typecheck` and `test` scripts; write the first unit tests around pure functions in `lib/itineraries.ts:130-150,156-190` and `lib/feasibility.ts:62-119`.
- **Human:** decide whether ESLint is worth the dependency, or whether `tsc --noEmit` is the intended "lint" for this repo.
- **Done when:** `npm run lint`, `npm run typecheck` and `npm test` all exit 0 locally; no `next lint` string remains; tests fail when a stop is duplicated or a closed venue is marked feasible.

**2. Make the solver tell the truth per day.** (`P0-3`)
- **Intelligence:** replace the single `date` passed to every day (`lib/feasibility.ts:121-122`, `Planner.tsx:112`) with `startDate + index`; separate hard constraints (closed venue, past closing) from advisory warnings (long transfer); fix the dead `city` parameter (`:68,:121`) and the misleading last-entry message (`:80-81,94-97`).
- **Human:** confirm that a venue closed on a given weekday should block the day rather than merely warn.
- **Done when:** a 3-day test starting Friday asserts weekdays Fri/Sat/Sun; a closed venue yields `feasible: false`; a >60 min transfer is advisory but visible.

**3. Stop the 4–7 day duplication and the currency lie.** (`P0-4`, `P0-5`)
- **Intelligence:** handle exhausted item pools explicitly in `buildItinerary` (`lib/itineraries.ts:139-143`) instead of `fallback[d % fallback.length]`; reconcile per-stop price vs `city.currency` (`Planner.tsx:319`) with the USD-equivalent aggregate (`:195-197`) and the form note (`:222-225`); make `rebuildDay` re-check feasibility (`:167-187`).
- **Human:** decide whether to expand the curated dataset to 7 days per city, cap the selector at 3 days, or add FX conversion.
- **Done when:** a 7-day plan has no repeated stop in any slot; every displayed price carries a currency consistent with its number; rebuild never produces a day that the validator marks infeasible.

**4. Restore the saved-plan feature or remove the claim.** (`P0-6`)
- **Intelligence:** implement the missing read path (`localStorage.setItem` at `Planner.tsx:78`; no `getItem` anywhere) and version the stored payload, or delete the button and correct `README.md:18`.
- **Human:** decide whether local-only persistence is sufficient or accounts are required (accounts imply privacy work).
- **Done when:** a generated plan survives reload without error, or the UI/README no longer claim saving works.

**5. Close the dependency and privacy exposure.** (`P0-7`, `P0-8`) — code changes first; publishing scaffolding re-authorised 2026-11-26 (`P1-2`).
- **Intelligence:** evaluate and apply the Next.js upgrade suggested by `npm audit` (`next@16.4.6`, currently pinned at `16.2.9` in `package.json:13`); make the FormSubmit endpoint configurable, re-enable CAPTCHA (`WaitlistForm.tsx:7,34`), add consent + privacy-link UI.
- **Human:** choose the email processor and sign the DPA; accept or reject the residual risk in writing; provide the privacy-policy text.
- **Done when:** `npm audit` exits 0 or a signed risk note is appended to `decisions.md`; no personal address is hard-coded in tracked source; the form cannot submit without consent; build still exits 0.

**6. Align the site's claims with the build.** (`P0-9`, `P0-10`)
- **Intelligence:** reconcile `lib/site.ts:49-54`, `README.md:3,5`, `ConceptModal.tsx:24,51`, `Idea.tsx:22-25` and `app/layout.tsx:44` (card promises an image that does not exist); remove the unused `JOURNEY_ALERTS` import (`Idea.tsx:1`); add a reproducible `out/`-vs-source check.
- **Human:** decide "AI companion" vs "planner" as the public promise; supply an OG image or accept a plain card.
- **Done when:** every capability claim maps to a file:line that implements it, or is explicitly labelled concept; `summary_large_image` has an image or is downgraded; the artifact check passes.

---

## 2. Midterm — larger milestones

**M1 — A verifiable place graph and honest solver.** (`M1-1`, `M1-2`, `M1-3`)
- **Intelligence:** add per-stop `source` + `checkedAt` + confidence to the `Item` type (`lib/itineraries.ts:1-29`) and render badges at `Planner.tsx:254`; give every day its own date and timezone; enforce closures as hard constraints; make the budget input a real constraint and reconcile local-price display with FX.
- **Human:** actually verify the curated hours/prices with primary sources; decide the review cadence; approve the currency policy.
- **Exit criteria:** 100% of items in `lib/venue-meta.ts` carry a source and checked-at date; automated coverage test passes; zero known closure/hours warnings on a default 3-day plan for all four cities; no mislabelled currency in rendered output.

**M2 — Consent, measurement and real-world proof.** (`M1-4`, `M1-5`, `M2-1`, `M2-3`)
- **Intelligence:** instrument the funnel against the gates in `docs/REVISED_PLAN.md:21-54`; build an eval harness (currently absent) for the "LLM drafts, solver decides" flow; ship self-serve export/delete for waitlist data (`docs/PRODUCT_RESEARCH.md:79-90`).
- **Human:** run structured user interviews, record demos, recommend the demo to peers, secure partner meetings, publish the privacy policy and price the product.
- **Exit criteria (targets, not measured):** ≥10 structured interviews; ≥3 partner/city conversations; ≥30 waitlist signups with recorded consent; documented go/no-go against each `REVISED_PLAN.md` gate; eval cost per plan < $0.05 (the documented target) with zero solver regressions.

**M3 — Distribution and packaging quality.** (`M1-6`, `M2-2`)
- **Intelligence:** add a root `dist:desktop` script that builds `out/` before packaging (`desktop/package.json:29` coupling); configure app icons and Debian metadata (`desktop/package.json:45-49`); implement one live handoff/partner integration with merchant-of-record and refund copy (`docs/REVISED_PLAN.md:40-41`).
- **Human:** obtain signing certificates/notarization credentials; negotiate the partner; approve refund terms.
- **Exit criteria:** signed Windows and macOS builds attached to a `v*` release; one city with live inventory; handoff flow states merchant of record and refund path explicitly.

---

## 3. Long term — the product awaiting

**Shape.** An AI-assisted but solver-governed trip companion: a verified place graph, deterministic day planning, in-trip disruption handling and a clean handoff to bookings. Deployment posture: static/PWA client (current `output: 'export'` at `next.config.ts:6`) plus an optional self-hosted API for LLM, eval and partner inventory — never a dependency on runtime secrets in the client. Business model: proprietary paid product (user decision 2026-11-25), likely B2C subscription plus B2B white-label; exact pricing is a Human decision.

- **Intelligence:** build the server-side planner API and eval loop; add PWA/offline support (`lib/site.ts:10` currently claims "lives on your phone" with no manifest); implement feature flags, observability and product analytics with consent; maintain the on-prem/desktop package; keep CI supply-chain checks current.
- **Human:** set pricing and terms, sign partners and DPAs, choose jurisdictions and data residency, record launch demos, decide open-source vs closed-source publication of any component, and fund the operation.
- **Quantitative exit criteria (targets, not measured):** ≥1,000 paying subscribers; ≥40% 30-day retention; ≥3 live partner cities; ≥99% of displayed stops with a source and checked-at date; p95 plan generation < 2 s; cost per plan < $0.05; zero critical `npm audit` findings; signed releases on all three desktop platforms.

---

## 7. CV-ready finish and verification (2026-11-26 mandate)

Supersedes the 2026-11-25 publish-skip decision. All items in this section are `DONE (2026-11-26)` for local work, verified by exact commands in `progress.md`; the real-user pilot remains human and unstarted. Nothing was pushed or published.

**7a. Hardening to the human boundary.** (`P0-11`, `P1-1`, `P1-2`)
- **Intelligence:** env-gated waitlist endpoint with explicit consent and a static privacy page; CI gate `npm ci → typecheck → lint → test → build`; proprietary-notice scaffolding (LICENSE notice, THIRD_PARTY_NOTICES, CONTRIBUTING, CHANGELOG, CI badge).
- **Human:** supply the real waitlist endpoint and privacy text, accept dependency risk in writing, approve the notice wording; run the pilot and real interviews.
- **Done when:** the form cannot submit without consent or an endpoint; a deliberately failing test blocks the Pages job; scaffolding files exist and are linked from `README.md`; no push/publication/spend without final explicit confirmation.

**7b. Verification matrix and reproducible artifacts.** (`V1-1`, `V1-2`, `V1-3`)
- **Intelligence:** record exact commands/results in `progress.md`; script the artifact check for root-path and `/synodos` subpath variants; add a browser smoke test driven by `playwright-core` against locally installed Edge/Chrome.
- **Human:** confirm which browser binary to use if auto-discovery finds more than one; no account or browser download by the agent.
- **Done when:** every matrix row names a command actually run; both build variants pass the artifact check; the e2e smoke run exits 0 locally.

**7c. CV-ready finish and pilot handoff.** (`CV-1`, `CV-2`, `CV-3`, `CV-4`)
- **Intelligence:** rewrite `README.md` and add the CV docs; capture a deterministic walkthrough whose gitignored fixtures reproduce byte-identically; emit only allowlisted event names + timestamp with no user text and no network; write the pilot handoff doc.
- **Human:** run the seven-day pilot, real interviews, real waitlist signups and partner conversations; give final explicit confirmation before any push/publish/spend.
- **Done when:** all five docs exist and every claim maps to a file:line or a recorded command; the event harness test proves no content and no network egress; the handoff doc lists human steps as unstarted targets.

---

## Expansion catalogue — alternatives by job

For each job: current choice, credible alternatives, watch-out. **Selection rule for every row: the cheapest boring option that preserves the product's core promise — offline-capable, private-by-default, deterministic planning with no covert tracking.**

| Job | Current | Alternatives | Watch-out |
|---|---|---|---|
| Static hosting | GitHub Pages (`deploy-pages.yml`) | Vercel, Netlify, Cloudflare Pages | `basePath: '/synodos'` (`next.config.ts:9`) is baked into every asset URL; custom domains need a deliberate config change. |
| Server DB / vector | none (curated TS data) | Supabase Postgres + pgvector, Neon, PlanetScale, Turso | Static export has no server runtime; any DB needs a separate API and new privacy surface. |
| Auth | none | Supabase Auth, Clerk, Auth0 | Adds PII and DPA obligations that the current consent-free form does not meet. |
| Storage / CDN | local WebP in `public/` | Cloudflare R2, S3, GitHub Releases | `output: 'export'` has no Next image-optimization server; do not assume `/_next/image`. |
| Edge functions | none | Vercel Edge, Cloudflare Workers | Not hostable inside the current Pages project; would split the deploy story. |
| Observability | none | Sentry, Axiom, Grafana Cloud | Error telemetry can capture emails; conflicts with "no tracking" unless scoped and disclosed. |
| Product analytics | none | PostHog, Plausible, Umami | "Private by default — no tracking" (`lib/site.ts:42-47`) must be reconciled before any analytics ships. |
| AI / eval | none (rule-based score, `Planner.tsx:45-56`) | OpenAI, Anthropic, local Ollama | All "AI companion" copy is currently unimplemented; no key may enter tracked files (`.gitignore:4`). |
| Payments | none | Stripe, Lemon Squeezy | Merchant of record and tax handling are Human/legal decisions, not code defaults. |
| Email | FormSubmit to a personal Gmail (`WaitlistForm.tsx:7`) | Resend, Buttondown, self-hosted SMTP | CAPTCHA is disabled (`:34`); no consent, retention or privacy link exists. |
| Docs | `README.md` + `docs/*.md` | GitHub Pages wiki, MkDocs, Docusaurus | `plan/` is internal first; do not publish it without a deliberate decision. |
| Feature flags | none (build-time only) | Flagsmith, Unleash, env-at-build-time | A static export cannot read runtime flags without a client-side config fetch. |
| On-prem packaging | Electron serving `out/` | Tauri, Docker, signed Electron | `extraResources.from: '../out'` (`desktop/package.json:29`) silently packages stale/missing output if the root build is skipped; macOS is unsigned (`desktop-release.yml:19-20`). |
| CI / supply chain | two GitHub Actions workflows | Dependabot/Renovate, Sigstore/cosign, `npm audit` gate | CI currently has **no** lint/test/typecheck step (`deploy-pages.yml:20-31`); npm 11 `allow-scripts` gating was observed locally; no `engines` field exists in either `package.json`. |
