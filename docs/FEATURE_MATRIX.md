# Features — planned versus implemented

**Updated 13 Nov 2026.** **Implemented in source** is different from **browser verified**. No current release is certified ready. Status must be updated with test evidence.

| Capability | Priority | Status | Evidence / required follow-up |
|---|---|---|---|
| MV3 manifest and installable folder layout | P0 | Source present | `manifest.json`, build script; test Chrome |
| Bundled small DNR network rules | P0 | Source present | `rules/starter.json`; browser fixture needed |
| Global protection toggle | P0 | Source present | service worker + popup; browser persistence needed |
| Per-site allowlist using frame rules | P0 | Source present | DNR allowAllRequests; browser reload behavior needed |
| Narrow cosmetic hiding | P0 | Source present | content CSS; verify no site breakage |
| Popup and options controls | P0 | Source present | browser functional review needed |
| Local preferences, no explicit telemetry | P0 | Source present | privacy review and outbound-traffic check |
| Node unit, structural checks and build | P0 | Source present | `npm run check`, `npm run build`; CI evidence pending |
| CI build artifact | P0 | Workflow added | verify GitHub Actions result |
| Real Chromium integration tests | P0 | Planned | browser fixture |
| Complete site compatibility and accessibility review | P0 | Planned | multiple pages, screen reader |
| Imported license-reviewed filter sources | P1 | Planned | provenance and attribution |
| Full filter-list compilation and quota management | P1 | Planned | benchmark vs existing parsers |
| Tracker/nuisance/region protection | P1 | Planned | separate profiles, breakage tests |
| Custom user blocking and exception rules | P1 | Planned | settings + tests |
| Element picker | P1 | Planned | safe selector generation |
| Safe rule updates and rollback | P1 | Planned | validation and offline fallback |
| Rich diagnostics and statistics | P1 | Planned | only verified production-compatible counts |
| Advanced settings, backup/restore | P1 | Planned | input validation |
| Release/security/privacy policy/store listing | P1 | Planned | human approvals |
| Competitive benchmarking | P1 | Planned | pinned baseline and published evidence |
| Video ad best-effort experiments | P2 | Planned | browser restrictions; no guarantees |
| Edge and Firefox | P2 | Planned | separate adapter and browser tests |
| Desktop, DNS and mobile | P2 | Research only | separate architectures, products and threat models |

See [full ordered implementation checklist](IMPLEMENTATION_CHECKLIST.md) and [Product Spec](PRODUCT_SPEC.md).

## Meaning of “done”

Only mark Done after the code is merged, relevant tests pass, Chrome behavior is verified where applicable, license and security implications are resolved, and results are linked. A source file or attractive UI is not sufficient.
