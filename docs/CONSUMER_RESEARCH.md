# Synodos — consumer research and feature priorities

Compiled 2026-11-24 from 2026 third-party surveys and trade reporting. Sources at the end.

## 1. The headline

AI has moved from novelty to default: awareness above 90%, usage near 75–80%, and it is now the third most-used travel decision channel after friends/family and social. But the industry is stuck between **planning** and **transacting**. Travellers will let AI draft a trip; they will not let it pay. They will pay for "make this easier / fix this problem", not for "another pretty itinerary".

Direct implication for Synodos: **real-time, verified data → in-trip recovery → budget awareness → verifiable, one-click handoff**. "A better itinerary chatbot" is the lowest-value place to compete.

## 2. What travellers actually value

Amadeus, *Tailored Horizons* (US travellers, Aug 2026), most useful AI capabilities:

| Capability | Share |
|---|---|
| Local guidance after arrival | 55% |
| Budget-aware suggestions | 52% |
| Real-time rebooking / re-planning when plans change | 49% |

China (《2026 上半年中国 AI 旅游应用趋势洞察报告》): top expectations are **real-time price comparison**, **in-trip translation and guiding**, and **discovering non-mainstream, personalised places**.

Entry points: maps/navigation AI first, then content platforms, then OTA-embedded AI, then vertical travel apps. That means **location and transport are the highest-frequency real context**, and a standalone app has to earn its place.

What travellers reject: 64% say AI recommends familiar destinations or the same options; Chinese users complain about identical "internet-famous" lists. The product must **broaden choice**, not recycle top-10 lists.

## 3. The four failure points

| Failure | Evidence | Product response |
|---|---|---|
| Accuracy / hallucination | 68% of AI-planning users hit at least one "nearly acted on it" error (CNBC, Mar 2026); ~14% of specific factual claims wrong, 22% for obscure destinations; ~1/3 saw fake or stale info | Opening hours, tickets, schedules, visa rules and prices must come from live sources, with freshness visible. Never rely on model memory for these. |
| Planning ≠ booking | 52% of US travellers plan with AI, only ~2% book through it (Phocuswright 2026); China: 84.6% search with AI, 70.2% re-check on an OTA, 0.9% complete a booking | Keep "AI drafts, human confirms, platform fulfils". Do not pretend to book. Make verification one click. |
| Fake personalisation / real constraints | 64% see repetitive recommendations; AI misses time zones, fatigue, children, allergies, accessibility, road closures | Model a small set of hard constraints (budget, pace, companions, dietary) instead of open-ended chat. |
| Brittle plans / high re-check cost | 15–20 hours average trip planning; one change invalidates the whole plan | **Local re-planning**: change one day, keep the rest. This is the clearest paid reason. |

## 4. Willingness to pay

- US: 50% think travel companies should provide AI free; only 4% see AI itself as worth a premium. 29% would never let AI pay; 43% only under strict conditions; 20% within a preset budget.
- But 64% would pay for **in-trip real-time help** (Amadeus / PhocusWire).
- China: 86.1% say they would pay for a more professional, precise, reliable "AI travel concierge" — an attitude measure, skewed to higher-income respondents, so discount it.
- Price anchors (Sept 2026): Layla Premium $49/yr or $9.99/mo; Wanderlog Pro $39.99/yr; Tineo $39.99/yr; Plotline $49/yr; TripAgent.ai $24–49/mo. Consumer ceiling is roughly **$40–50/year**.
- Most free players monetise via **booking commission**, not subscription.

Implication: price against a **specific outcome** (delay recovery, one-day rebuild, verified plan), not an "AI membership" label.

## 5. Segments

- Highest-frequency, highest-income, younger: AI travellers median age 41 vs 52; millennials 74% and Gen Z 72% usage.
- China's surprise majority: lower-tier cities are more active (28.4% frequent use in tier-4 vs 14.8% tier-1); women 67.5% vs men 60.9%. Don't design only for sophisticated tier-1 travellers.
- Business travel is a separate logic: efficiency and compliance, fear of out-of-policy hotels; 72.7% would authorise automatic booking, senior managers 41.8% "very willing".

## 6. Feature priority for Synodos

**P0 — Verified facts layer.** Live opening hours, ticket/booking requirements, transit times, visa/entry rules, weather, closures. Show source + "checked at" time. This is the trust foundation.

**P0 — One-day re-planning.** When something changes, rebuild only the affected day; keep the rest, keep buffers. This is the paid hook.

**P1 — Budget-aware plan.** Total + category budgets (stay / food / tickets), every line priced, deviation flagged. 52% US / #1 China expectation.

**P1 — Verifiable handoff.** Every recommendation links to a source and a booking path; confirmation screen before any transaction. Don't auto-book.

**P2 — Constraint profile.** Budget band, pace, companions (children / older travellers), dietary, accessibility. Reject repetitive recommendations by design.

**P2 — Arrival guidance tied to the itinerary.** "What still fits today", rain alternatives, last transport — not generic POI lists.

**P3 — Voice and autonomous booking.** Voice is commoditised; autonomous payment trust is not there (only 20% allow it).

**Do not differentiate on:** generic itinerary generation, inspiration-only chat, static top-10 lists.

## 7. What we built now (prototype slice)

- **Planner** at `/planner`: city + days + travellers + interests → day-by-day draft, estimated on-ground budget, save / copy / download. Curated dataset for Tokyo, Lisbon, Bali, Paris. No live inventory yet.
- **Real waitlist delivery** via FormSubmit to the owner inbox (one activation click required on first submission).
- **Scroll choreography** on sections and cards, with reduced-motion support.

## 8. Next build steps, in order

1. Replace the curated dataset with a **live places + hours source** and stamp every line with "verified at".
2. Add **one-day rebuild**: user locks days, changes one, others stay.
3. Add **budget categories** and a per-line cost breakdown.
4. Add **source links + booking handoff** (affiliate redirect first; no payment liability).
5. Add **constraint profile** (pace, companions, dietary, accessibility).
6. Instrument the planner: completion rate, per-stop edits, time-to-first-plan, cost per session.

## Sources

1. Insider Travel Report — Amadeus *Tailored Horizons* — https://www.insidertravelreport.com/amadeus-survey-finds-more-travelers-use-ai-but-dont-trust-it
2. 环球旅讯 / 三个皮匠 — AI 旅游应用 84.6% 搜索、0.9% 成交 — https://www.sgpjbg.com.cn/labels/ailuyouyingyong/1/7613779.html
3. 上海文旅产业研究院 — 《2026 上半年 AI 旅游应用趋势洞察报告》解读 — https://www.sh-act.org/index.php?r=article/Content/index&content_id=2854
4. 环球旅讯 — AI 旅行管家付费意愿 86.1% — https://www.sgpjbg.com/labelsyh/ailuxingguanjiafufeiyiyuan/1/6612586.html
5. CNBC — AI travel planners, hallucinations and trust gaps — https://www.cnbc.com/2026/03/11/ai-travel-planners-tourism-popularity-trust-hallucinations.html
6. HotelTechUpdate — Phocuswright 2026: planning vs booking gap — http://www.hoteltechupdate.com/news/phocuswright-2026-the-gap-between-ai-planning-and-ai-booking-defines-day-1
7. The Pass Brief — 52% plan with AI, 2% book — https://thepassbrief.com/articles/52-of-us-travelers-plan-trips-with-ai-only-2-book-through-it
8. AI Tools Library — 10 best AI travel planners 2026 — https://aitools.sh/blog/ai-travel-planners
9. TripAgent — Layla pricing comparison — https://tripagent.ai/layla-ai-pricing
