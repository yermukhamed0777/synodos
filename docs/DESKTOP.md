# Desktop demo — support and verification

The Electron wrapper in `desktop/` serves the already-built static export from
`out/` over `127.0.0.1`, so the planner works without a network connection. It
contains no planner logic of its own; the same `dist`-equivalent `out/` assets
are served to the browser.

## What is verified locally

- `desktop/server.js` is a plain CommonJS static server with the same path rules
  as the wrapper. `tests/unit/desktop-server.test.ts` starts it against a
  temporary export and checks:
  - `/` redirects to `/synodos/` for the Pages build;
  - `/synodos/` and `/synodos/planner/` return the expected HTML;
  - out-of-prefix paths return 404;
  - a root-path export (`SYNODOS_BASE_PATH=`) serves `/` and `/planner/` directly.
- `desktop/main.js` requires `./server.js`, selects `out/` from
  `process.resourcesPath` when packaged and from `../out` in development, and
  loads the local URL at the matching base path.
- `npm run verify:variants` proves both static-export path variants; the desktop
  server consumes whichever `out/` was built.

## What is not verified here

- Full Electron packaging was **not** run in this environment: `desktop/node_modules`
  is absent and no display server is available. `npm ci` inside `desktop/` plus
  `npm run dist` is required to exercise installers.
- macOS builds are **unsigned**. They require right-click → Open on first
  launch unless the owner supplies an Apple Developer identity and notarization.
- Windows and Linux installers are unsigned too by default. Signing credentials,
  notarization and any release upload are owner-only decisions.
- The desktop build depends on a root `npm run build` first: `extraResources`
  packages `../out`. A stale or missing `out/` packages stale or empty content,
  so always build before `npm run dist`.

## Supported formats

| Platform | Targets in `desktop/package.json` | Status here |
|---|---|---|
| Windows | NSIS installer + zip | Not built here; unsigned |
| macOS | dmg + zip | Not built here; unsigned, right-click → Open |
| Linux | AppImage + deb | Not built here; unsigned |

No installer is attached to a release by this work. `docs/PILOT_HANDOFF.md`
records publishing as a human-only action.
