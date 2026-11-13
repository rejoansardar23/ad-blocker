# Architecture proposal — Chrome-first, modular monorepo

**Status:** proposal, not implemented. Start by auditing candidate upstream repositories before committing to a framework or engine.

## Design goals

1. Correct, efficient, testable request filtering under Chrome Manifest V3.
2. Local-first settings and minimal necessary extension privileges.
3. Portable filtering logic with browser-specific adapters rather than assuming identical Firefox/Chrome behavior.
4. Fast rule compilation, safe updates and reversible site exceptions.
5. Avoid duplicated filtering engines, runtime remote code and excessive complexity.

## Logical flow

    Website requests
         |
         v
    Chrome declarativeNetRequest (static/dynamic/session rules)
         |
         +--> allowed / blocked / redirected according to supported rules
         |
    Content script (approved permissions) --> cosmetic element hiding
         |
    Extension service worker <--> chrome.storage and browser APIs
         |
    Popup / options UI --> settings + site exceptions
         |
    Rule-pack build pipeline --> license-checked sources --> validated MV3 artifacts

DNR performs supported network actions via browser rules; the service worker is **not** a universal per-request proxy. Content scripts only operate under their granted host/match scopes. UI and scriptlets must follow browser security and store policies.

## Proposed repository layout (after engineering bootstrap)

    apps/
      chrome-extension/       # Manifest V3 browser entry points, popup, options
      edge-extension/         # future; adapters and testing
      firefox-extension/      # future; separate API/manifest verification
    packages/
      filter-compiler/        # list normalization and validated DNR output
      cosmetic/               # site-scoped CSS selectors, safe DOM application
      rule-management/        # enable/disable, allowlist, priorities, rollback
      privacy/                # opt-in protection and local settings policy
      ui/                     # accessible shared controls
      platform-adapters/      # Chrome/Edge/Firefox differences
      test-fixtures/          # synthetic websites, blocking cases, baselines
    docs/
    .github/

This tree is illustrative. Do not create empty code folders solely to make the repository look complete.

## Core design areas

### 1. Filtering pipeline

- Sources: bundled test rules first; maintained third-party filters only after license and quality audit.
- Offline build: normalize supported syntax, classify rules by type, deduplicate, validate, track provenance and emit MV3-compatible rulesets.
- Runtime: use chrome.declarativeNetRequest where possible; use enabled static rulesets and carefully constrained dynamic/session rules when necessary.
- Unsupported syntax: log in development diagnostics, never silently claim full filter-list parity.
- Rule priority and allowlist interaction must have deterministic test fixtures.
- Rule capacity is browser-version-specific; design for limits and record validation/test environment.

### 2. Cosmetic filtering

- Use site-scoped CSS and minimal DOM observers for dynamically inserted elements.
- Avoid generic selectors that remove legitimate navigation or interactive controls.
- Restore behavior and site exceptions must be testable. Track performance on long-lived pages.
- Treat any injected functionality/scriptlets as a separate security review.

### 3. User preferences

- Store non-sensitive preferences locally by default; avoid uploading browsing logs or full URLs.
- Validate imported settings, version stored schemas, provide migration/rollback behavior.
- Global and per-site pause should produce predictable, visible behavior.
- Decide if browser sync is ever justified; it is not necessary in MVP.

### 4. UI boundaries

- Popup: quick status, toggle, current-site controls, settings link.
- Options: rule list choices, custom rules, diagnostics and accessibility.
- Never display invented ad-blocking counts. In production MV3, per-request debug visibility is restricted; choose a defensible statistic or omit it.

### 5. Update model

- Executable extension code remains packaged according to Chrome Web Store rules.
- Updates to data-like filter rules need explicit provenance, transport validation, compatibility tests, safe rollback and licensing.
- Do not create a remote-code loader. Separate update releases, filter data and extension runtime code.

## Cross-platform reality

Chrome/Edge: DNR/MV3 differences and store policies to be checked. Firefox: independently inspect webRequest, DNR, cosmetic behavior and permissions. Desktop: requires a system integration architecture, installers and security boundaries. DNS: blocks domain resolution but cannot directly remove page elements or reliably distinguish all first-party ads. Mobile: platform-specific constraints.

## Decisions to make before coding

- Adopt a permissively licensed foundation vs build original scaffolding?
- Does Ghostery SDK materially beat a simpler native-DNR compiler for Chrome?
- Which list formats are first-class, and which cannot be translated?
- Exact host permissions model and optional-permission UX.
- Test matrix and browser versions.
- Public source and contribution licensing.

See [DECISIONS.md](DECISIONS.md) for status, [REUSE_AND_LICENSES.md](REUSE_AND_LICENSES.md) for candidates and [TESTING.md](TESTING.md) for gates.

## Official references

- [Chrome declarativeNetRequest API](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest)
- [Chrome Manifest V3 overview](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
- [Chrome extension security](https://developer.chrome.com/docs/extensions/develop/migrate/improve-security)
- [Playwright: Chrome extensions](https://playwright.dev/docs/chrome-extensions)
