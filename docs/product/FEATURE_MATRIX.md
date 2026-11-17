# Features — planned versus implemented

**Updated 15 Nov 2026 (Asia/Kolkata).** **Implemented in source** is different from **browser verified**. No current release is certified ready. Status must be updated with test evidence.

| Capability | Priority | Status | Evidence / required follow-up |
|---|---|---|---|
| MV3 manifest and installable folder layout | P0 | Chromium fixture verified | Packaged extension and service worker load in Chromium 158 |
| Bundled small DNR network rules | P0 | Chromium fixture verified | Explicit blocked-request errors and server receipt counts; limited starter coverage |
| Global protection toggle | P0 | Chromium fixture verified | Options pause/resume and paused restart; popup save behavior has Node regressions |
| Per-site allowlist using frame rules | P0 | Chromium fixture verified | Reload, subdomain boundaries, removal and restart |
| Narrow cosmetic hiding | P0 | Chromium fixture verified | Reversible CSS and page-owned node collision tests; broad site compatibility remains open |
| Popup and options controls | P0 | Partly verified | Browser options controls and Node pending/error tests; actual toolbar popup and accessibility review remain open |
| Local preferences, no explicit telemetry | P0 | Source present | privacy review and outbound-traffic check |
| Node unit, structural checks and build | P0 | CI verified | [Passing run](https://github.com/rejoansardar23/ad-blocker/actions/runs/43469964379) on commit `4a069f6` |
| CI build artifact | P0 | CI verified | GitHub Actions artifact; automated Chromium loading verified; manual alpha installation pending |
| Real Chromium integration tests | P0 | CI verified | 10 synthetic cases using locked Playwright 1.65.0 |
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

Current evidence: [original PR #3](https://github.com/rejoansardar23/ad-blocker/pull/3), [original PR #4](https://github.com/rejoansardar23/ad-blocker/pull/4), and the fork's [14 Node tests and 10 Chromium cases](https://github.com/renoukhan39-bit/ad-blocker/actions/runs/43647171852). The upstream integration CI must also pass on the final commit. See [Chromium guide](../testing/CHROMIUM_TEST_GUIDE.md) for commands and environment limits.

See [full ordered implementation checklist](IMPLEMENTATION_CHECKLIST.md) and [Product Spec](PRODUCT_SPEC.md).

## Meaning of “done”

Only mark Done after the code is merged, relevant tests pass, Chrome behavior is verified where applicable, license and security implications are resolved, and results are linked. A source file or attractive UI is not sufficient.
