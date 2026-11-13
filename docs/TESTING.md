# Test strategy and evidence requirements

**Current state:** no test runner or extension code exists yet. These are requirements for the build team.

## Testing pyramid

1. **Unit:** URL/domain normalization, rule priority and exceptions, settings schema, parser coverage, local state migration.
2. **Fixture/integration:** synthetic local pages with known allow/block resources and cosmetic classes, dynamic DOM changes, exception reversibility.
3. **Extension/browser:** load unpacked build in Playwright Chromium, assert Manifest V3 startup, toggle behavior, DNR effects, persistence, popup/options navigation.
4. **Compatibility:** real sites sampled ethically and consistently, including normal page functions, sign-in interfaces without capturing credentials, media playback with appropriate caveats.
5. **Performance:** memory, CPU, build/rule footprint, page load and injection overhead compared against a no-extension baseline.
6. **Security/privacy:** permission review, script injection surfaces, dependency risk, remote code checks, unexpected outbound connections.

## Minimum automated P0 gates

- TypeScript typecheck and lint (once tooling exists).
- License/dependency report; explicit review of new dependencies.
- Build a valid MV3 manifest and static-rule JSON.
- DNR fixture: expected request blocked, neighboring benign request not blocked.
- Global disable/re-enable and per-site exception behavior.
- Storage versioning across reopen/restart.
- Cosmetic fixture: intended element hidden, legitimate content visible.
- Popup controls wired to real runtime behavior.
- No unapproved outbound analytics/telemetry.
- CI artifact installs in a known tested Chromium version.

## Benchmark design

Record test timestamp, browser and extension versions, OS/environment, filter-list versions, list configuration, network conditions, workload, warm/cold caches, sample count and which requests/ads were actually measured. Run baseline and tested extension under comparable conditions; ensure the same test website state and deterministic synthetic fixtures.

Measure: blocked eligible requests, false positives, breakages, script/CPU overhead, memory, install/package size, enabled rules and recovery from failed updates. Do not infer visual-ad absence from request count alone.

Use medians and distributions where possible. Do not publish “100% ads blocked”, “10x faster”, or “most users” without current reproducible evidence. Chrome per-request debug API access is limited for published extensions; **do not fake exact production counters**.

## Browser cases

- New install with no settings
- Existing settings after extension upgrade
- Pause/re-enable globally
- Exception for one site and restore
- Site with same-origin and cross-origin assets
- Multiple tabs and tab changes
- SPA/dynamic ads inserted after load
- Safe domains / malicious patterns (use synthetic test domains)
- Rule budget exceeded and rule update failed
- Browser restart and service-worker suspension
- Offline update fallback
- Keyboard-only and screen-reader navigability

## Evidence for pull requests

Record exact commands, test output summary, links to CI run, versions, limitations and manual verification cases. If test cannot run in Codex Cloud, mark it “not run” and provide clear human steps. Screenshots are supporting material, not proof of filter efficacy.

## Supporting references

- [Playwright: test Chrome extensions](https://playwright.dev/docs/chrome-extensions)
- [Chrome declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest)
