# Competitor analysis — AI travel planning, 2026

Compiled 2026-11-24. Sources at the end.

## The one-line read

The market has moved from "who can generate an itinerary" to **who owns real inventory, first-party data, and distribution**. Expedia acquired Layla on 2026-07-31 — a 25-person, ~€5M-funded team with 5M users and 2M+ itineraries — which tells you the standalone planning layer has a low ceiling. A new entrant that only writes prettier itineraries gets squeezed between free frontier models and OTA supply.

## The six players

| | Layla (Expedia) | Wanderlog | Mindtrip | GuideGeek | Google Gemini / AI Mode | Tripadvisor |
|---|---|---|---|---|---|---|
| Core job | Conversational agent for travellers **without a destination** | Map-first collaborative itinerary workbench | Bookable travel workspace + DMO infrastructure | Messaging-native assistant + white-label | Travel as an extension of Search | Review corpus turned into a marketplace |
| Starting assumption | "I don't know where" (40%+ of users) | Destination already chosen | Any starting point (photo, PDF, post) | Any, no app install | Search box | Browsing reviews |
| Transaction | Redirects to Booking/Skyscanner; human agents | Email import + small commission | In-chat flight/hotel payment (Sabre + PayPal) | In-chat booking | US hotel checkout via Google Pay; flights handed off | Viator / TheFork |
| First-party data | User itineraries, creator video | User trips, places | 11M+ POIs + local experts | Matador content + DMO content | Maps, Gmail, Photos, Flights | 20 years of reviews + forums |
| Model | $49/yr + commission + human service | $39.99–49.99/yr + commission | Consumer free; B2B subscription + commission | Consumer free; pure B2B | Free + subscription; ad ecosystem | Ads + commission + $99/yr membership |
| Strongest | Multi-city judgment + AI×human | Collaboration, map, split bills | Grounding + booking depth + DMO channel | Zero-install distribution + white-label | Real-time data + distribution monopoly | Review depth + experiences inventory |
| Weakest | Independence lost | AI is a bolt-on; output doesn't land in the itinerary | Multi-city logic | Weak on complex trips; Meta dependency | Fragmented across three surfaces; no drag-to-edit; geography limits | Hotel base declining |

## Where the gaps actually are

1. **The blank page.** 40%+ of Layla's users start without a destination, up from ~12% in 2023. Every OTA and Google still opens with "where?". This is the structural opening.
2. **Feasibility, not prose.** Google's own research and independent tests show LLM plans break on opening hours, transfer times, time zones, closures and last entry. Gemini cannot drag-to-reorder; Wanderlog's AI output stays in chat. A hard-constraint validator is low-compute, high-perception value.
3. **A credible half-loop.** Mindtrip proved in-chat payment is possible but still hands off independent tickets; Google hands flights to airlines. Pick **one** high-frequency category (city experiences, transfers) and own the handoff language: who is merchant of record, who fixes problems.
4. **In-trip.** Most competitors are pre-trip tools. In-trip is high-frequency, high-retention, and where transactions naturally occur (rebooking, add-ons, nearby, translation, offline).
5. **B2B2C via DMOs.** Mindtrip (Brand USA, Visit California, Madeira) and GuideGeek (60–70 DMOs) show destinations will pay for AI surfaces because zero-click search hurts them. This validates PMF without consumer CAC.
6. **Verification as product.** Only 8% of travellers will let AI book; trust is the scarce resource. Show existence + open-now + price band + **checked-at timestamp** on every recommendation.

## What this means for Synodos

**Do:**
- Start from constraints (budget, month, mood, flight tolerance) and recommend a shortlist — own the blank page.
- Make the plan editable and validated: one-day rebuild, transfer buffers, opening windows.
- Verify every line: source link + checked-at date; never claim live data we don't have.
- Hand off to real search/booking pages in one click, with explicit "nothing is booked here".
- Ship a desktop/offline demo early — Wanderlog puts offline behind a paywall, so it is valued.
- Later: single-category inventory, in-trip mode, DMO white-label.

**Do not:**
- Build another general chat itinerary generator — ChatGPT/Gemini/Layla free tiers own it.
- Build a full OTA (flights + hotels + tickets + payments + after-sales) — that is a worse OTA, and needs supply, payments, refunds, support.
- Build an inspiration content feed — Matador and Tripadvisor have the corpus and the economics.
- Claim an "AI recommendation engine" without first-party data or verification.
- Start with multi-city/multi-country long trips — hardest, lowest frequency.
- Bet distribution on one messaging platform.
- Push "AI pays for you" — only 8% accept it.
- Compete on subscription price against free products.

## Sources

1. Expedia Group IR — acquisition of Layla (2026-07-31) — https://ir.expediagroup.com/news-and-events/news/news-details/2026/Expedia-Group-acquires-Layla-accelerating-its-AI-powered-trip-planning-and-booking-strategy/default.aspx
2. SlickTrip — what the Layla acquisition signals — https://slicktrip.com/travel-talk/expedia-bought-a-chatbot-what-the-layla-acquisition-says-about-ai-travel
3. AgentsIndex — Mindtrip profile — http://agentsindex.ai/mindtrip
4. AI Market Watch — GuideGeek profile — https://ai-market-watch.com/company/guidegeek
5. InfotechLead — Tripadvisor AI strategy — https://infotechlead.com/cio/tripadvisor-ai-strategy-drives-experiences-first-digital-transformation-93709
6. AirGuide — Tripadvisor Q1 2026 — https://airguide.info/tripadvisor-q1-revenue-falls-as-ai-and-experiences-expand/
