# Synodos — from marketing site to working product

Research compiled 2026-11-24. Sources listed at the end.

## 0. The one thing to understand

The current site is a **funnel, not a product**. It describes an AI travel companion; a working product must turn a sentence into *bookable, temporally valid inventory* — real places, real prices, real opening hours, real transfer times, with liability attached. Everything below flows from that gap.

Sequencing principle: **facts before bookings, redirects before payments, web before native, one geography before many.** Every step skipped becomes a liability inherited at 10× the cost.

## 1. Core architecture

The LLM is the easy 5%. Three hard problems need their own layers:

| Problem | Failure mode | Required layer |
|---|---|---|
| Prose → real supply | Invented hotels/activities, stale prices | Tool calling into supplier APIs + deterministic post-processing + retries/fallbacks |
| Time/space consistency | 30-minute transfer errors, closed museums, timezone bugs | Validation service: constraint rules, opening hours, geospatial routing, timezone normalization |
| Hallucination & safety | Wrong visa/fare policy, fabricated places | RAG grounding, strict schema validation, adversarial eval prompts, conservative defaults |

Pipeline: `extract goals → plan → enrich with real inventory → validate → price → present`.

Stack shape:
- **Orchestration:** structured LLM outputs + staged prompts; specialist sub-agents (logistics / local experience / risk) behind a tool interface.
- **Backend:** stateless Python/FastAPI or Node services, queue for long searches, rate limiters, Postgres + Redis cache.
- **Validation:** separate service with hard business rules; OR-Tools or routing API for stop order.
- **Observability (P0, not P3):** trace every prompt/tool call, prompt version registry, offline eval sets, human review of edge cases. Without trace + eval you cannot debug or improve the agent.
- **Frontend:** the existing React/Next site becomes the shell — itinerary editor, map, calendar, inline upsell.

## 2. LLM layer — model routing and cost

Do not hard-wire one premium model. Route: small model for classification/FAQ/summaries, mid model for planning/extraction, frontier only for hard multi-city constraint reasoning.

Indicative list prices per 1M tokens (verify before contracting — repriced quarterly):

| Tier | Example | Input | Output |
|---|---|---|---|
| Nano | Gemini 2.5 Flash-Lite | $0.02–0.10 | $0.10–0.40 |
| Small | GPT-5 Nano / Mini | $0.05–0.25 | $0.40–2.00 |
| Mid | Claude Sonnet 4.5 / GPT-5 / Gemini 2.5 Pro | $1.25–3.00 | $10–15 |
| Frontier | Claude Opus / GPT-5 Pro | $5–30 | $25–90 |

Cost levers, highest leverage first:
1. **Prompt caching** on the stable prefix only (system prompt + tool schemas), 60–90% off cached input. Never cache volatile tool results.
2. **Tool-result compression** — a 5,000-token flight search response cleaned to 500–1,000 tokens, ~4× saving.
3. **Deterministic caching** of identical searches within an hour — absorbs 30–40% of queries.
4. **Context summarization** — three-tier memory (last 10 turns verbatim → rolling summary → goals only) cuts peak tokens 26–54%.
5. **Batch API** for price monitoring, notifications, post-trip summaries (~50% off).
6. Output caps and programmatic tool calling so intermediate results don't re-enter context.

Don't over-invest in per-token micro-optimization: inference cost has fallen ~10×/year. Optimize **external API calls and caching**, where prices aren't falling.

Latency: stream the first token (~200 ms perceived), parallelize independent tool calls, draft with a small model and refine only the hardest ~25% of stops with a frontier model (~40% compute saving). Target time-to-first-itinerary under 5–8 s.

## 3. Travel data tiers

**Tier A — facts (cheap, start here).** Google Places API (New): 10k free Essentials/mo then $5/1k; Pro $7–32/1k; a single Enterprise field like `reviews` in the field mask bills the whole request at that tier. ToS restricts storage/caching — an architecture constraint. Cheaper: Mapbox (~$2/1k after 100k free), HERE (~$0.88/1k), OSM/MapTiler. Add weather (Open-Meteo), currency, holidays, timezone, attraction content (GetYourGuide / Viator / Klook APIs).

**Tier B — flights.** Search ≠ book.
- **Amadeus Self-Service:** free sandbox, no IATA needed, 400+ airlines; free monthly quota then ~$0.003–0.046/call. Excludes AA/Delta/BA and most NDC. Issuing tickets needs a consolidator/host agreement.
- **Duffel:** provides IATA/ARC umbrella, removes the ticketing barrier; commission per booking.
- **Kiwi Tequila:** virtual interlining, 750+ carriers, affiliate/CPA — good for price-first generation.
- **Skyscanner / Kayak / Booking affiliate:** free, redirect-out, 1–5% commission — best MVP monetization without booking liability.
- **No free official Google Flights API** (QPX shut down 2018); scraping is legally and technically fragile.

**Tier C — hotels.** Booking.com Demand API (tiered content → redirect → full booking), Expedia Rapid (~700k hotels), Hotelbeds wholesale, Amadeus Hotel (~€0.015–0.025/call after quota; booking calls free).

Sequence: affiliate redirect → search-with-prices → own checkout. Each step adds liability, PCI scope and support load.

## 4. Mobile

Ship the existing web app as a **PWA** first ($15–45k, 2–4 mo; no store review, instant updates; iOS limits: ~50 MB storage, Face ID/NFC/BT unavailable, push only 16.4+). Then wrap the same React code in **React Native + Expo** once the itinerary flow works (~90% code reuse). Native Swift/Kotlin is not justified.

App Store rules that bite:
- **4.1(c)** (Nov 2025): no other developer's brand/name/icon in your app identity; clone-looking UI rejected — differentiate the first three screens.
- **5.1.2(i)** (Nov 2025): must clearly disclose sharing personal data with third-party AI and get **explicit** permission — a privacy-policy line is insufficient. Build a dedicated consent screen naming the provider and what is sent; cite it in review notes and demo video.
- **4.2/2.1:** thin WebView wrappers rejected; ~40% of rejections are completeness issues. Ship a live backend, real demo data, no hidden flags.

## 5. Privacy & compliance

A travel companion is high-risk data: passports, dietary/health data, live location, payment data.

- GDPR lawful basis per purpose; **Art. 9 special-category data** (dietary/health/allergy) needs explicit separate consent.
- Data minimization and privacy by default (Art. 5, 25); delete trip data after itinerary is finalized unless the user opts into a profile — enforce retention in code.
- **DPIA-Lite before beta**, full DPIA before public launch.
- DPAs with LLM, maps and supplier processors: no training on user data, subprocessor/transfer lists, data export/reversibility.
- **Human-in-the-loop** confirmation screen before any financial transaction (Art. 22).
- Self-serve export/delete in settings before launch. Audit log every agent action (timestamp, data field, legal basis, authorizing user).
- Never reuse trip history for model training without separate consent — €18M aviation-sector and €15M Italian DPA precedents. Max fine 4% of global turnover.
- Also scope CCPA/CPRA, LGPD, PIPL, DPDP, PDPA, PIPA, APPI; EU AI Act transparency/human oversight if you rank options, set prices or deny bookings.

## 6. Economics

Build cost (vendor estimates, wide range): MVP $8–40k offshore / $40–80k agency, 8–12 weeks; mid $25–150k; advanced $80–400k. A credible *bookable* MVP is usually $100–150k; full-featured $200–400k. Maintenance 15–25% of build per year.

Unit economics: a simple query is nearly free; a multi-city family query costs 10–100× more. 3-day trip benchmark ~$0.0375 naive, ~$0.012/session optimized. Expect $0.15–0.50 AI cost per booking vs $50–100 human agent labor and $40–60 OTA CAC. Infra ~$500/mo MVP → $5,000+/mo scaled. TCO ≈ 1.5–2× raw API spend. Set per-user token budgets and per-session caps on day one.

Monetization: affiliate commission (Booking up to ~40% on some services, Expedia up to ~12% hotels, Kiwi ~3% CPA), freemium subscription (unlimited trips, offline maps, PDF export, live re-planning), sponsored placements, white-label licensing.

## 7. Phased plan for Synodos

**Phase 0 — decide & de-risk (weeks 0–4).** Pick one city/region and one traveler segment; define one job, e.g. "4–7 day leisure trip to Japan: plan + book hotels and activities." Write DPIA-Lite. Choose Places + weather + one flight search + one hotel content API. Define cost/session target and an itinerary quality rubric before coding.

**Phase 1 — grounded web MVP (weeks 4–12).** Replace the marketing CTA with `extract → plan → enrich → validate → present`. Structured outputs, tool calling, validation service, affiliate redirect (no payment liability), trace logging + eval set from day one. KeepPages domain as the acquisition funnel. No apps yet.

**Phase 2 — closed beta & economics (weeks 12–20).** Invite 100–500 users. Measure itinerary completion, edit/skip per stop, time-to-first-plan, cost/session, D7/D30 retention, affiliate conversion. Fix hallucination classes found in traces. Full DPIA, DPAs, consent vault, self-serve delete/export. Gate public launch on p95 latency, cost within budget, zero unresolved fabricated-place incidents.

**Phase 3 — monetize & mobile (weeks 20–32).** Subscription + affiliate optimization. PWA → React Native app with dedicated AI-consent screen, original branding, live demo account in review notes. Push notifications for price drops and trip-day reminders.

**Phase 4 — transact & scale (months 8–15).** Own checkout via Duffel/Amadeus + consolidator agreement, PCI-aware payments, human confirmation, disruption handling (70–80% of post-booking support is automatable at <$0.10 vs $8–25 human). Multi-city, model routing by market, regional data residency.

## 8. Immediate next step

The current Pages site is a static brochure. The smallest real product slice: an email-capture waitlist backed by a data store, plus one grounded itinerary demo for a single city, with trace logging. That converts the live page from a dead-end `mailto:` into a measurable funnel and validates demand before any booking integration.

## Sources

1. Tildee — "Crafting a Seamless Travel AI: The Journey from Concept to Reality" — https://www.tildee.com/crafting-a-seamless-travel-ai-the-journey-from-concept-to-reality/
2. AI 4U — "Agentic AI Trip Planning: Architecture, Costs & Optimization Tutorial" — https://ai4u.space/blog/implement-agentic-ai-trip-planning-optimization-architecture-costs
3. Nowah — "The Cost of Intelligence — LLM Economics at Scale" — https://nowah.xyz/blog/cost-of-intelligence-llm-economics
4. SmartTripAI — "What are the AI travel agent GDPR compliance requirements for 2026?" — https://smarttripai.com/knowledge/what_are_the_ai_travel_agent_gdpr_compliance_requirements_for_2026.php
5. Google Developers — "Google Maps Platform 2025 年 3 月变更" — https://developers.google.com/maps/billing-and-pricing/march-2025?hl=zh-cn
