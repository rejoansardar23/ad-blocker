# Testing and release evidence (current + planned)

**State:** Node-native structural checks, unit tests and a build script are present; GitHub Actions is configured. **No live Chrome/Chromium integration test has yet been recorded.** Current implementation is a development preview.

## Commands

```bash
npm run verify   # JSON/manifest/files and JS syntax checks
npm run test     # Node unit tests for domain logic and mock service worker
npm run check    # both of the above
npm run build    # validate then copy unpacked extension to dist/chrome
```

Node.js 20+ required. No `npm install` necessary for present scripts.

## What the existing tests measure

- Hostname normalization and safe exact/subdomain exception matching.
- Mocked service-worker global toggles, DNR ruleset selection and dynamic allowAllRequests generation.
- Invalid command/input handling.
- Packaging consistency of manifest, JS files and DNR JSON.

Mock-based unit tests **do not** prove Chrome rules work in a browser or that real websites are safe.

## Next verification gate (required)

1. Load `dist/chrome` into a pinned Chrome/Chromium build 121+; record actual browser version.
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
- [Competitive methodology](COMPETITIVE_BENCHMARK.md)
