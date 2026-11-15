# Testing and release evidence (current + planned)

**State:** Node-native structural checks, unit tests and a build script are present; GitHub Actions is configured. **Synthetic Chromium integration tests now run in CI; broad real-site compatibility remains unverified.** Current implementation is a development preview.

## Commands

```bash
npm run verify   # JSON/manifest/files and JS syntax checks
npm run test     # Node unit tests for domain logic and mock service worker
npm run check    # both of the above
npm run build    # validate then copy unpacked extension to dist/chrome
npm run test:e2e # real Chromium synthetic request/cosmetic/restart fixtures
```

Node.js 22+ required. `npm ci --no-audit --no-fund` installs lockfile-pinned Playwright for the browser tests. Run `npx playwright install chromium`, then `npm run test:e2e`.

## What the existing tests measure

- Hostname normalization and safe exact/subdomain exception matching.
- Mocked service-worker global toggles, DNR ruleset selection and dynamic allowAllRequests generation.
- Invalid command/input handling.
- Packaging consistency of manifest, JS files and DNR JSON.

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
- [Competitive methodology](COMPETITIVE_BENCHMARK.md)


## Exact-commit CI evidence — 15 Nov 2026

- Upstream main **10c877039de4f7c41122f882d731a187df6f8a0d**: [run 43724956889](https://github.com/rejoansardar23/ad-blocker/actions/runs/43724956889) passed npm ci, 14 Node tests, build, npm audit (0 reported), and 10 synthetic Chromium fixtures. Node v22.23.4, Chromium v158.0.8127.18.
- Settings consistency [PR #20](https://github.com/rejoansardar23/ad-blocker/pull/20): [run 43728775822](https://github.com/rejoansardar23/ad-blocker/actions/runs/43728775822) passed 20 Node tests, build, 10 Chromium fixtures. Added second options view and popup.html-as-tab UI synchronization checks. **Only the PR implementation revision was tested by this run; re-run CI for later documentation commits before merge.**
- Local container has Node v22.16.0 and /usr/bin/chromium but cannot clone GitHub because external DNS resolution fails. The npm/Chromium results above are GitHub Actions evidence, **not local runs**. No full accessibility/manual toolbar popup or representative real-world benchmark has been run.
