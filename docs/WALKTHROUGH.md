# Scripted walkthrough and deterministic capture

This is the recording script for a short demo video. It needs no user accounts, no network calls
to third parties and no re-running of the whole app to reproduce its artefacts.

## Deterministic fixture capture

```bash
npm ci
npm run walkthrough
```

`scripts/capture-walkthrough.ts` writes six files to `artifacts/walkthrough/`:

| File | Contents |
|---|---|
| `01-input.json` | Fixed input: Tokyo, 2 days, food + culture, start date 2026-11-27 |
| `02-plan.md` | The exported Markdown plan a user would download |
| `03-feasibility.json` | Per-day dates, weekdays, hard conflicts, advisories and legs |
| `04-saved-plan.json` | The versioned local-storage payload |
| `05-events.json` | Allowlisted event names with timestamps normalised to `0` |
| `manifest.json` | Byte size and SHA-256 of each fixture |

The inputs are fixed and no wall-clock time enters the output, so a second run is byte-identical.
Verify that with:

```bash
npm run walkthrough
Get-FileHash artifacts\walkthrough\manifest.json -Algorithm SHA256
```

`artifacts/` is gitignored. The fixtures are capture output, not source.

## Screen-recording script (about 90 seconds)

1. Start the site with `npm run build && npm run dev`, then open
   `http://localhost:3000/synodos/`.
2. **0:00–0:12** — Show the hero. Read the eyebrow “Deterministic travel planner” and the
   “Concept preview — not live data” label on the alert stack.
3. **0:12–0:25** — Click “See the concept”. Show the three text steps, then close with Escape.
   Do not call it a video demo.
4. **0:25–0:40** — Click “Start Your Journey”. On `/planner`, choose Tokyo, 3 days, 2 travellers,
   keep Food and Culture, set the start date to 2026-11-27.
5. **0:40–0:55** — Click “Build my plan”. Point at the day count, the USD budget range, the
   feasibility summary and one `~$NN USD` stop price.
6. **0:55–1:10** — Click “Rebuild this day” on Day 1. Show that the trip still has three days and
   no stop is repeated.
7. **1:10–1:20** — Click “Save plan”, reload, and show that the plan returns (“Saved ✓”).
8. **1:20–1:30** — Open the footer privacy link. State that the waitlist is disabled until a
   submission endpoint is configured and that no tracking runs.

Do not show a real email address in the recording. The captured fixtures above are sufficient to
recreate any frame if the app is unavailable later.
