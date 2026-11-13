# Real Chromium extension smoke testing

This suite tests the locally packaged Manifest V3 build without external ad services. It does **not** establish broad, real-site blocking performance.

## Run

- Use Node.js 22.
- Run `npm install --no-audit --no-fund` to install the exact-pinned `playwright` development dependency.
- Run `npm run build`.
- Run `npx playwright install --with-deps chromium` (Linux CI; on your OS use `npx playwright install chromium`).
- Run `npm run test:e2e`.

The test launches Playwright's **bundled Chromium** with a persistent profile, explicitly side-loads `dist/chrome`, starts a synthetic local HTTP fixture, and maps the reserved fixture hostnames `publisher.test` and `ads.adblocker.test` to loopback. No public ad websites or personal browsing records are used.

### Evidence checked
- Extension MV3 service worker starts and settings page loads.
- Bundled DNR blocks the designated fake ad resource and allows a benign control image.
- Disabling protection allows the fake ad resource and restores cosmetic element.
- Per-site exception allows the fake ad after page reload; removal restores blocking.
- Reopening a persistent Chromium profile retains trusted-site settings.
- A legitimate non-ad element remains visible.

### Limits
- Tests do **not** yet cover third-party filter-list parsing, Chrome Web Store distribution, MV3 release-mode statistics, or millions of real ads.
- Chrome and Edge stable no longer support the command-line extension flags required by this workflow; test with Playwright's `chromium` channel as documented by Playwright.
- If the smoke test fails in cloud CI, preserve failure logs and fix fixture/extension issues rather than claiming browser verification.
- The first test runs locally on loopback with custom hostname resolution. It makes no network connections to actual ad networks.
