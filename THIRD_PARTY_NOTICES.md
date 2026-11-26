# Third-party notices

This notice covers the **direct dependencies** reported by `npm ls --depth=0` in this checkout.
Names, versions, licence identifiers and URLs below were read from each installed package's
`package.json` under `node_modules/`; nothing here is inferred from the package name.

| Package | Version | Licence (`package.json` `license`) | Homepage / repository from package metadata |
|---|---|---|---|
| `next` | 16.4.6 | MIT | homepage `https://nextjs.org`; repository `vercel/next.js` (https://github.com/vercel/next.js) |
| `react` | 19.0.0 | MIT | homepage `https://react.dev/`; repository `https://github.com/facebook/react.git` |
| `react-dom` | 19.0.0 | MIT | homepage `https://react.dev/`; repository `https://github.com/facebook/react.git` |
| `@eslint/js` | 9.39.5 | MIT | homepage `https://eslint.org`; repository `https://github.com/eslint/eslint.git` |
| `@types/node` | 20.19.43 | MIT | homepage `https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node`; repository `https://github.com/DefinitelyTyped/DefinitelyTyped.git` |
| `@types/react` | 19.3.0 | MIT | homepage `https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react`; repository `https://github.com/DefinitelyTyped/DefinitelyTyped.git` |
| `@types/react-dom` | 19.3.0 | MIT | homepage `https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom`; repository `https://github.com/DefinitelyTyped/DefinitelyTyped.git` |
| `eslint` | 9.39.5 | MIT | homepage `https://eslint.org`; repository `eslint/eslint` (https://github.com/eslint/eslint) |
| `playwright-core` | 1.65.1 | Apache-2.0 | homepage `https://playwright.dev`; repository `git+https://github.com/microsoft/playwright.git` |
| `tsx` | 4.23.15 | MIT | homepage `https://tsx.hirok.io`; repository `privatenumber/tsx` (https://github.com/privatenumber/tsx) |
| `typescript` | 5.9.3 | Apache-2.0 | homepage `https://www.typescriptlang.org/`; repository `https://github.com/microsoft/TypeScript.git` |
| `typescript-eslint` | 8.74.0 | MIT | homepage `https://typescript-eslint.io/packages/typescript-eslint`; repository `https://github.com/typescript-eslint/typescript-eslint.git` |

Full licence texts are shipped with every package under `node_modules/` (for example
`node_modules/next/license.md`, `node_modules/typescript/LICENSE.txt` and each package's `LICENSE`
file) and are also available from the npm registry entry for each package. This is a notice of
direct dependencies only; transitive dependency licences remain with their respective packages.

## Fonts

`app/layout.tsx` imports `Space_Grotesk` and `IBM_Plex_Mono` from `next/font/google`; Next downloads
them at build time and self-hosts the resulting `.woff2` files in the static export, so the browser
makes no Google Fonts request. These typefaces are commonly distributed under the SIL Open Font
License (OFL), but **that licence could not be verified from this checkout**: no OFL text or font
licence metadata was found under `node_modules/next` (including `node_modules/next/license.md`) or
in the project docs. Confirm the upstream font licences before asserting the OFL here.
