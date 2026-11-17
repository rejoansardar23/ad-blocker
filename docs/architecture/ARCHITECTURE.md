# Architecture — original Chrome MV3 preview and future design

**Updated 18 Nov 2026 (Asia/Kolkata).** The implementation is an original-code Chrome MV3 development preview. It has passed synthetic Chromium browser tests in CI; broad real-world compatibility remains unverified. The [handoff](../../HANDOFF.md) owns live task/status information and the [structure map](../../PROJECT_STRUCTURE.md) owns file placement.

## Current file structure

```text
src/extension/manifest.json                  # Chrome Manifest V3
src/extension/rules/starter.json             # small static DNR ruleset
src/extension/shared/domain.js               # hostname validation and exception matching
src/extension/background/service-worker.js   # storage, DNR switching, dynamic allow rules
src/extension/content/cosmetic.js            # narrow CSS-based hiding
src/extension/popup/                         # action popup UI
src/extension/options/                       # settings and trusted sites UI
scripts/verify.mjs             # structural JSON + JS checks
scripts/verify-repository.mjs  # documentation and active-package boundary checks
scripts/audit-repository.mjs   # static tracked-file inventory and hashes
scripts/build.mjs              # dependency-free dist/chrome package
tests/unit/                    # Node domain/worker/UI tests
tests/browser/                 # real Chromium fixtures
.github/workflows/checks.yml  # CI: npm ci, tests, Chromium, dependency audit + SBOM
docs/                          # product strategy and checklists
```

## Request and control flow

```text
External HTTP(S) request
  -> Chrome declarativeNetRequest static starter rules
  -> blocked or allowed by browser
  -> trusted top-level site may match dynamic allowAllRequests on navigation

Web page (HTTP/S)
  -> content script + storage preferences
  -> safe CSS ad container hiding only when enabled/not trusted

Popup/options UI
  -> chrome.runtime.sendMessage(...)
  -> background service worker validates and persists preferences
  -> updateEnabledRulesets / updateDynamicRules
  -> UI reports success or API errors
```

DNR is executed in the browser, not a JavaScript webRequest interception proxy. Exceptions have a higher rule priority and **require page reload to ensure frame navigation is re-evaluated**. Pausing global rules disables the packaged ruleset, clears project-created dynamic site rules and causes cosmetic CSS to be removed when storage updates.

The current `normalizeSite` routine supports ordinary DNS hostnames from HTTP(S) URLs; localhost, IP literals, browser-internal pages and wildcard hostname input are not currently supported as user exceptions. Site exceptions include subdomains. The simple known-domain static list has many gaps; it exists to prove mechanics before larger licensed rule lists are integrated.

## Runtime invariants

- A status read does not rewrite Chrome DNR rules. Reapplying unchanged dynamic rules would create unnecessary work and a temporary trusted-site remove/re-add window.
- Reconciliation compares the complete managed rule with deterministic object keys. It normalizes the order of the set-valued `requestDomains` and `resourceTypes` arrays so browser property/list ordering does not cause churn. Additional stale conditions are detected and repaired; unrelated dynamic-rule IDs are preserved.
- Cosmetic filtering retains the exact style-node reference it created. Pausing or trusting a site removes only that owned node, never a page element merely because its ID resembles an extension ID. Unit and browser fixtures cover a colliding page-owned element.
- Settings repair normalizes and deduplicates stored sites and defaults invalid values. Confirmed reset restores protection and clears managed exceptions. Full state-mutation concurrency and DNR/storage failure recovery require their own regressions; serializing reconciliation alone does not prove atomic writes.

These invariants consolidate the former `IDEMPOTENT_RULES.md` note. Its original text remains recoverable from commit `ce77ac5`.

## Privacy and permissions

- `declarativeNetRequest`: browser-native request filtering; installation warning possible.
- `storage`: local enabled/site list; no remote synchronization.
- `activeTab`: current page's hostname in popup and optional reload.
- Static `content_scripts` on HTTP(S) pages: required for minimal cosmetic CSS; broad site-access disclosures may apply.
- No third-party runtime dependencies, remote scripts, analytics or server in this preview. Playwright is a locked development-only dependency; GitHub Actions generates a dependency SBOM and high-severity advisory audit.

There is no project-wide source license yet. Do not add third-party filtering code until auditing code/data licenses and distribution obligations.

## Next architecture increments

1. Validate Chrome installation and DNR/browser tests, fix any discovered defects.
2. Audit reusable upstream foundations before deciding whether to retain this minimal code, adapt a compatible base or integrate a filter library.
3. Introduce versioned compiler and safe licensed filter lists with provenance and reliable update/rollback.
4. Add a rule management layer and custom user rules/element picker with safety gates.
5. Improve accessibility, error handling, diagnostics and performance.
6. Later split runtime into `apps/chrome-extension` plus reusable `packages/*` **only when the increased complexity is justified**. Firefox/Edge are independently tested; desktop/DNS are separate products.

## Official references

- [Chrome declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest)
- [Chrome extension Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
- [Chrome Web Store policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Playwright extension testing](https://playwright.dev/docs/chrome-extensions)

## Open design questions

- Choose legal distribution model and final source license.
- Determine which compatible external list compiler, filter syntax and UI modules justify integration.
- Validate extension requests/permissions, rule priorities and Chrome release targets.
- Establish a benchmark corpus, performance budgets and a transparent production statistic strategy.

See [DECISIONS](../governance/DECISIONS.md), [REUSE_AND_LICENSES](../governance/REUSE_AND_LICENSES.md), [TESTING](../testing/TESTING.md) and [IMPLEMENTATION_CHECKLIST](../product/IMPLEMENTATION_CHECKLIST.md).
