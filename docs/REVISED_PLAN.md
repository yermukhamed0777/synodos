# Synodos — revised product plan

Revised 2026-11-24 after consumer research, competitor analysis and the first working prototype.

## 1. Revised thesis

**Synodos is not an itinerary generator. It is a feasibility engine for the blank page.**

Two jobs, in order:
1. **Decide** — turn constraints (budget, dates, mood, flight tolerance, companions) into a short, defensible destination shortlist.
2. **Make it real** — turn a chosen city into a day plan where every stop is verified (exists, open, roughly priced) and every handoff goes somewhere a human can actually book.

The product promise is **"nothing in this plan is invented"**, not "AI writes your trip". That is the only defensible position against free frontier models and OTA supply.

## 2. What we will build

### P0 — Decision engine (the blank page)
- Constraint input: budget band, month/season, trip length, flight tolerance, interests, companions.
- Shortlist of 2–3 cities with a **reason per city** and an explicit trade-off ("Lisbon: cheaper, cooler; Bali: warmer, longer flight").
- No "top 10" lists. The output is a ranked argument, not a catalogue.
- Success metric: shortlist → city chosen rate; time to decision.

### P0 — Feasibility layer (the machine that does the job)
- Hard constraints: opening hours, last entry, transfer time, time zones, closure days, seasonal closures.
- One-day rebuild: change one day, keep the rest, keep buffers.
- Visible validation: "2h 10m door-to-door, 25 min buffer" per transition.
- Success metric: plans with zero impossible transitions; per-stop edit rate.

### P0 — Verification ledger
- Every stop: source link + **checked-at date** + confidence (verified / likely / unverified).
- Never label data "live" unless it is fetched live. Distinguish "curated, checked 24 Nov" from "live".
- Success metric: % of plan lines with a source; user-reported "this place didn't exist/closed" rate.

### P1 — Budget truth
- Total + category split (stay / food / activities / local transport) with ranges, not point estimates.
- Flag when the plan exceeds the stated budget.
- Success metric: budget overrun rate; edits after seeing budget.

### P1 — Credible half-loop handoff
- One category only at first: **city experiences / tickets** (not flights, not hotels).
- Every handoff states: search link, merchant of record, "nothing is booked here", refund path.
- Success metric: handoff click-through; booking conversion; support contacts per 100 bookings.

### P2 — In-trip mode
- "What still fits today", rain alternatives, last transport, offline plan.
- Success metric: D1/D7 retention during a trip; in-trip sessions per day.

### P2 — Desktop/offline
- Electron/Tauri build for Windows, macOS, Linux; offline plan access.
- Success metric: install → plan created rate; offline sessions.

### P3 — B2B2C (only after consumer proof)
- White-label shortlist + verified city plan for DMOs/hotels.
- Success metric: 3 paid pilots; renewal.

## 3. What we will NOT build

| Not building | Why |
|---|---|
| General chat itinerary generator | ChatGPT/Gemini/Layla free tiers own it; no pricing power |
| Full OTA checkout (flights + hotels + tickets + payments + refunds) | Becomes a worse OTA; needs supply, PCI, after-sales |
| Inspiration content feed | Matador/Tripadvisor corpus and economics are unbeatable |
| "AI pays for you" | Only 8% of travellers accept it; trust, not tech, is the blocker |
| Multi-city/multi-country at launch | Hardest, lowest-frequency; Layla's strength, Mindtrip's weakness |
| Subscription price war | Competitors are free or OTA-subsidised; differentiate on workflow |
| Custom waitlist database/dashboard now | Not the JOB; FormSubmit is enough until ~100 signups, then migrate to a real DB with auth |
| Live price claims without live APIs | Credibility is the product; a false "live" label is worse than "checked on 24 Nov" |

## 4. Architecture to get there

```
Constraints → Candidate cities → Plan draft → Feasibility solver → Verification ledger → Handoff
```

- **Content/POI layer:** start with a curated, human-checked dataset (current). Then add a Places provider (Google Places New or Mapbox) behind an adapter, with field masks capped to Essentials to control cost. Cache aggressively; respect ToS.
- **Hours/closure layer:** provider hours + holiday calendar + manual overrides. Store `checkedAt` and `source`.
- **Feasibility solver:** deterministic rules (opening windows, transfer buffers, timezone normalisation), not an LLM. LLM only drafts; the solver decides.
- **LLM role:** constrained to summarising, ranking and phrasing. Never the source of hours, prices, or existence.
- **Handoff:** deep links with explicit merchant-of-record copy. Affiliate IDs added only when contracts exist.
- **Desktop:** Electron wrapper serving the static export from a local HTTP server; electron-builder targets NSIS/zip (Windows), dmg/zip (macOS), AppImage/deb (Linux); GitHub Actions matrix builds all three on native runners.

## 5. Phased roadmap

**Phase 0 — now (done in prototype)**
- Curated 4-city dataset, planner, budget ranges, one-day rebuild, map/source links, handoff block, real waitlist delivery, desktop scaffold.

**Phase 1 — 4–6 weeks: decision + verification**
- Add month/season and flight tolerance to the decision engine; expand to 8–10 cities.
- Add `checkedAt` + source per item; add "verified / likely / unverified" badges.
- Add opening-hours and transfer-buffer validation; block impossible days.
- Instrument: plan completion, per-stop edits, rebuild rate, handoff clicks.

**Phase 2 — 6–10 weeks: single-category handoff**
- Integrate one experiences API (GetYourGuide/Viator affiliate) with real availability.
- Add merchant-of-record and refund copy; measure conversion and support load.
- Migrate waitlist to a real DB (Supabase or WorkBuddy cloud) once >100 signups.

**Phase 3 — 10–16 weeks: in-trip + desktop**
- In-trip "what still fits" view, offline cache, rain alternatives.
- Ship signed desktop builds; auto-update.
- Add accounts and cross-device plan sync.

**Phase 4 — 4–6 months: B2B pilots**
- White-label shortlist + verified plan for 3 DMOs/hotels.
- Price per seat/usage, not subscription.

## 6. Metrics that decide go/no-go

| Stage | Metric | Gate |
|---|---|---|
| Decision | shortlist → city chosen | > 35% |
| Planning | plan completed (all days kept or rebuilt) | > 50% |
| Trust | "place didn't exist / was closed" reports | < 2% of plans |
| Budget | plans within stated budget | > 70% |
| Handoff | plan → handoff click | > 20% |
| Retention | D7 return after trip creation | > 25% |
| Unit cost | cost per completed plan | < $0.05 (excluding live API) |

## 7. Desktop demo decision

Ship the demo as an Electron app built in CI, not hand-packaged:
- Windows: NSIS installer + portable zip.
- macOS: dmg + zip (unsigned; users right-click → Open).
- Linux: AppImage + deb.
- The app serves the static export locally, so the planner works offline.
- Release artefacts attach to a GitHub Release tagged `v0.1.0`.

Unsigned macOS builds will warn on first open. That is acceptable for a prototype; signing/notarisation comes with a paid Apple Developer account.

## 8. The quality bar

A plan is only "done" when:
1. Every stop exists and has a source + checked-at date.
2. Every transition is physically possible with a buffer.
3. Every price is a range, not a false precision.
4. Every handoff says who books it and who fixes it.
5. The user can change one day without losing the rest.

If a feature cannot meet that bar, it does not ship. That is the machine that does the JOB.
