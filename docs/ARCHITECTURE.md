# Architecture — original Chrome MV3 preview and future design

**Updated 13 Nov 2026.** The first implementation is a small, dependency-free original-code proof of concept. It is **not browser-validated** yet. The future modular monorepo is a design proposal, not an existing package suite.

## Current file structure

```text
manifest.json                  # Chrome Manifest V3
rules/starter.json             # small static DNR ruleset
shared/domain.js               # hostname validation and exception matching
background/service-worker.js   # storage, DNR switching, dynamic allow rules
content/cosmetic.js            # narrow CSS-based hiding
popup/                         # action popup UI
options/                       # settings and trusted sites UI
scripts/verify.mjs             # structural JSON + JS checks
scripts/build.mjs              # dependency-free dist/chrome package
tests/                         # Node domain + worker mock tests
.github/workflows/checks.yml  # CI verification and build artifact
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

## Privacy and permissions

- `declarativeNetRequest`: browser-native request filtering; installation warning possible.
- `storage`: local enabled/site list; no remote synchronization.
- `activeTab`: current page's hostname in popup and optional reload.
- Static `content_scripts` on HTTP(S) pages: required for minimal cosmetic CSS; broad site-access disclosures may apply.
- No third-party runtime dependencies, remote scripts, analytics or server in this preview.

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

See [DECISIONS](DECISIONS.md), [REUSE_AND_LICENSES](REUSE_AND_LICENSES.md), [TESTING](TESTING.md) and [IMPLEMENTATION_CHECKLIST](IMPLEMENTATION_CHECKLIST.md).
