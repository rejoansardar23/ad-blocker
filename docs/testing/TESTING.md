# Testing and release evidence (current + planned)

**State:** Node-native structural checks, unit tests and a build script are present; GitHub Actions is configured. **Synthetic Chromium integration tests now run in CI; broad real-site compatibility remains unverified.** Current implementation is a development preview.

See [the latest grouped test evidence](TEST_EVIDENCE.md) for exact commands, results, environment limitations and remaining gaps tied to a specific commit.

## Commands

```bash
npm run verify       # JSON/manifest/files and JavaScript syntax checks
npm run test:unit    # all Node unit behavior tests
npm test             # conventional alias for test:unit
npm run check        # structural verification plus unit tests
npm run build        # verify, then copy src/extension to dist/chrome
npm run test:browser # browser fixtures against an already-built dist/chrome
npm run test:e2e     # build current source, then run the browser fixtures
npm run test:all     # check, build and run every active automated test group
```

Node.js 22+ required. `npm ci --no-audit --no-fund` installs lockfile-pinned Playwright for the browser tests. Run `npx playwright install chromium`, then `npm run test:e2e`.

## Active test groups

| Group | Primary command | Purpose |
|---|---|---|
| Structure and syntax | `npm run verify` | Required runtime files, manifest/rules JSON, references, JavaScript syntax and remote-script guard |
| Unit behavior | `npm run test:unit` | Domain matching, service-worker/DNR state, cosmetic ownership and popup/options recovery behavior |
| Package integrity | `npm run build` | Recreate `dist/chrome` from only the active `src/extension` tree |
| Browser integration | `npm run test:e2e` | Rebuild, side-load in Playwright Chromium and exercise DNR, controls, cosmetics, exceptions and persistence |
| Complete active pipeline | `npm run test:all` | Run every group above in dependency order |
| Supply chain | CI workflow | Frozen install, lockfile check, high-severity audit and CycloneDX SBOM |

`npm run test:browser` is the low-level browser-only group used by CI after its explicit build step. For normal local use, prefer `npm run test:e2e` so the browser cannot receive a missing or stale package. Nothing under `AnalyseFuture/` belongs to the active test pipeline.

## What the existing tests measure

- Hostname normalization and safe exact/subdomain exception matching.
- Mocked service-worker global toggles, settings repair/reset, DNR ruleset selection, idempotence and managed dynamic allowAllRequests generation.
- Invalid command/input handling and preservation of unrelated browser rules.
- Cosmetic filtering ownership and reversibility without removing page-owned content.
- Popup/options pending-save behavior, rejected-save recovery and confirmed settings reset.
- Packaging consistency of manifest, JavaScript files and DNR JSON.

Mock-based unit tests **do not** prove Chrome rules work in a browser or that real websites are safe.

## Additional verification gates (required for alpha release)

1. Repeat the pinned Chromium synthetic suite on the final integration commit and record actual browser version; manually load `dist/chrome` in stable Chrome for UX smoke tests.
2. Use a synthetic HTTP(S) test site and a reserved `.test` ad hostname, track request errors before/after enabled flag.
3. Test trusted top-level site reload and confirm no blocked subrequests when allowAllRequests matches.
4. Test removal of trust and blocking restoration after reload.
5. Test global pause/resume including cosmetic hiding; service worker suspension and browser restart.
6. Verify popup/options controls, no errors in extension service worker console, keyboard operation and proper disclosures.
7. Test normal page content isn't hidden or broken.
8. Save Chromium build version, commands, logs and failures in PR.

## Later testing pyramid

- Unit tests of list parsing, DNR priorities, schema migrations and exceptions.
- Browser fixture tests for blocking, cosmetic selectors and dynamically inserted nodes.
- Compatibility test pages for ordinary sites, SPA navigation, safe media playback and legitimate widgets.
- Performance comparisons against no-extension baseline and pinned competitive extensions.
- Security/privacy audits of permissions, imported filters, source provenance, remote executable code, outbound network behavior and build chain.

## Benchmark integrity

Record test dates, exact Chrome/extension versions, enabled lists, domain tests, OS/hardware, repetition counts and run conditions. Compare same controlled workloads independently (not overlapping blockers in one profile). Report medians/distributions and breakages. **Never invent exact counts or claim 100% video-ad blocking.** MV3 production visibility into matched rules is restricted.

## External references

- [Playwright browser extension testing](https://playwright.dev/docs/chrome-extensions)
- [Chrome declarativeNetRequest API](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest)
- [Competitive methodology](../research/COMPETITIVE_BENCHMARK.md)
