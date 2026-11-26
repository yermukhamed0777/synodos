# Pilot handoff (human work starts here)

Everything in this repository that can be built without real users is finished. This document is
the boundary: **the seven-day pilot is the last step that needs real people**, and it has not been
run. No usage, user, conversion or revenue claim in this repo is measured; the gates below are
targets copied from `docs/REVISED_PLAN.md:107-117`, not results.

## Goal

Find out whether a deterministic, verifiable day plan — not an AI chat itinerary — is enough to make
a traveller keep a plan and change one day. The pilot tests the promise, not the marketing.

## Cohort and consent wording

Target cohort (human decision required): 10–12 self-directed travellers planning a trip in the next
6–8 weeks, recruited by the owner from personal networks. Do not recruit on behalf of the agent.

Use this wording, adapted only for accuracy:

> Synodos is a prototype travel planner. For seven days we will ask you to create plans for your own
> trip and tell us where the plan was wrong. We collect only the email address you choose to give
> us, your session counts (event names only — no text, no locations, no emails), and your written
> feedback. Plans stay in your browser. We do not book anything, run ads or track you across sites.
> You can stop at any time and ask us to delete your address. This is research, not a product
> launch; there is no payment and no service guarantee.

Required before the first participant: a real submission endpoint configured at build time via
`NEXT_PUBLIC_WAITLIST_ENDPOINT`, a named data controller, and a human/legal review of
`app/privacy/page.tsx`. Until then the waitlist form is intentionally disabled.

## Schedule (seven days, owner-executed)

| Day | Action |
|---|---|
| 0 | Owner confirms endpoint, privacy notice, controller and cohort. Send consent wording. |
| 1 | 45-minute remote walkthrough; participant creates one plan for a real trip. |
| 2–6 | Participant uses the planner when they need it; owner logs failures only, no prompting. |
| 7 | 20-minute structured interview; record go/no-go against the gates below. |

"What to collect": the content-free event counts already emitted by `lib/events.ts` (`plan_generated`,
`plan_rebuilt`, `plan_saved`, `plan_downloaded`, `plan_copied`), participant feedback text stored by
the owner outside this repo, and the count of wrong/closed stops reported. Do not add user text to
the event harness — that would break its automated no-content assertion.

## Filing a failure as a new backlog ID

1. Append a row to `plan/backlog.md` in the correct horizon with the next free stable ID.
2. Give a `file:line` surface, reproduction steps, a "Done when" criterion and status `OPEN`.
3. Append a row to `plan/progress.md` with the exact command/output that demonstrated the failure.
4. If the fix changes direction, scope or cost, append to `plan/decisions.md` rather than editing an
   old row.
5. Fix it with a regression test before marking it `DONE (date)`.

## Go / no-go gates (targets, not measured)

| Gate | Target | Measured? |
|---|---|---|
| Shortlist → city chosen | > 35% | No |
| Plan completed (all days kept or rebuilt) | > 50% | No |
| “Place didn’t exist / was closed” reports | < 2% of plans | No |
| Plans within stated budget | > 70% | No |
| Plan → handoff click | > 20% | No |
| D7 return after plan creation | > 25% | No |
| Cost per completed plan | < $0.05 | No |

Go only if the trust gate (< 2% bad stops) and the completion gate (> 50%) both pass on the recorded
counts, with no unresolved hard-conflict regression. Otherwise record a no-go with the failing IDs
and return to the backlog; do not reinterpret a target after seeing the result.

## Explicitly human only

- Recruiting, consenting and scheduling real participants.
- Creating the email/processor account and signing any DPA; choosing the data controller.
- Legal review of the privacy notice and any retention/deletion commitment.
- Running interviews, reading feedback and recording the go/no-go decision.
- Negotiating partners, signing certificates, paying for code signing or any hosting beyond the
  existing GitHub Pages project.
- Pushing, publishing, changing repository visibility/licence or creating a release — all require
  the owner's explicit confirmation at delivery time.
