# Competitor study and reproducible benchmark plan

There is no objectively established “number one” for every ad-blocker dimension. Popularity, functionality, privacy and blocking efficacy must be evaluated separately.

## Competitive set

- [AdGuard Browser Extension](https://github.com/AdguardTeam/AdguardBrowserExtension): extensive user controls, filter rules and platform coverage.
- [uBlock Origin](https://github.com/gorhill/uBlock): advanced filtering benchmark, with important differences by browser and MV2/MV3 support.
- [uBlock Origin Lite](https://github.com/uBlockOrigin/uBOL-home): Chrome MV3 native filtering and performance tradeoffs.
- [Ghostery](https://github.com/ghostery/ghostery-extension): tracker/privacy UX benchmark.
- [AdBlock](https://getadblock.com/) and [Adblock Plus](https://adblockplus.org/): mainstream UX and user adoption comparisons.

Above are research targets, not endorsements, current rankings or verified performance results.

## Feature comparison method

For each release/version, document whether a feature is fully functional, partly supported, requires permission, unsupported, experimental or untested. Suggested categories:
- network filtering and list syntax coverage
- cosmetic filtering and dynamically injected elements
- site exceptions / user-defined rules / element picker
- anti-tracking and nuisance blocking
- video site best-effort behavior
- error recovery / list updates / settings backup
- ease of install, onboarding, accessibility and privacy practices
- supported browsers and maintenance state

Include primary-source links with access dates and test artifacts. Avoid treating marketing copy as independent verification.

## Controlled test methodology

1. Use the same OS, browser version and hardware class.
2. Record extension versions, permissions, enabled lists and customization settings.
3. Test independently (not side-by-side within the same profile).
4. Include synthetic fixtures for controlled accuracy and a consent-respecting representative real-site sample.
5. Cold- and warm-cache runs, multiple repetitions and reproducible test results.
6. Count legitimate functions broken; distinguish false positives from network changes.
7. Measure resource overhead relative to a browser-without-extension baseline.
8. Explain which features Chrome MV3 cannot support; do not compare incompatible browser engines as if identical.
9. Report uncertainty and cases omitted from testing.
10. Store benchmark commands, dates, configurations, data and issues alongside results.

## Scorecard template

| Dimension | Metric | Baseline | Our project | Evidence |
|---|---|---|---|---|
| Blocking | eligible synthetic requests blocked / total | TBD | TBD | test run |
| False positives | allowed synthetic requests blocked | TBD | TBD | test run |
| Website breakage | severity-weighted broken functions | TBD | TBD | issue/test |
| Performance | incremental CPU/memory/page-load overhead | TBD | TBD | sample data |
| Privacy | permissions and unexpected outbound calls | TBD | TBD | review |
| Reliability | update failure recovery, restart persistence | TBD | TBD | CI |
| Usability | success on common user tasks | TBD | TBD | usability notes |

**No measurements exist yet.** Do not replace TBD cells with guesses.

## Differentiation strategy

Win by minimizing false positives, strong defaults, minimal tracking, intuitive controls, readable diagnostics and disciplined release quality. Simply copying every competitor feature is not a winning metric.
