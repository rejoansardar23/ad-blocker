# Features — planned versus implemented

**Updated 18 Nov 2026 (Asia/Kolkata).** Source presence, Node tests, bundled Chromium, and manual Stable-browser evidence are distinct. No current release is certified ready. Audit checkpoint `c9e54b2` passed [CI](https://github.com/rejoansardar23/ad-blocker/actions/runs/44182569555); current local evidence is recorded in [TEST_EVIDENCE](../testing/TEST_EVIDENCE.md).

| Capability | Priority | Status | Evidence / required follow-up |
|---|---|---|---|
| MV3 manifest and installable folder layout | P0 | Chromium fixture verified | Packaged extension and service worker load in Chromium 158 |
| Bundled small DNR network rules | P0 | Chromium fixture verified | Explicit blocked-request errors and server receipt counts; limited starter coverage |
| Global protection toggle | P0 | Chromium fixture verified | Options pause/resume and paused restart; popup save behavior has Node regressions |
| Per-site allowlist using frame rules | P0 | Chromium fixture verified | Reload, subdomain boundaries, removal and restart |
| Narrow cosmetic hiding | P0 | Chromium fixture verified | Reversible CSS and page-owned node collision tests; broad site compatibility remains open |
| Popup and options controls | P0 | Partly verified | Browser options controls and Node pending/error tests; actual toolbar popup and accessibility review remain open |
| Local preferences, no explicit telemetry | P0 | Source present | privacy review and outbound-traffic check |
| Node unit, structural checks and build | P0 | CI verified | 30 Node/tooling tests at audit checkpoint, plus literal boundary/link guards |
| Settings reset and malformed-state repair | P0 | Chromium + Node verified | Confirmed recovery, cancel, invalid state normalization, unrelated-rule preservation |
| Complete static inventory and quarantine hashes | P0 | Verified | All tracked files accounted for; 1,384 snapshot file hashes + 2 ZIP hashes match; upstream authenticity remains unknown |
| Live popup/options synchronization | P0 | Node + Chromium verified | External local changes refresh open views; pending edits, stale reads/failures, initial races and reset status have regressions; five browser checkpoints |
| Concurrent settings operations | P0 | Node + Chromium verified | Full worker-operation queue; simultaneous additions, removal/reset/pause ordering, repair races and rejected-write recovery; one browser concurrency checkpoint |
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

Current evidence: [pre-mission local baseline](../testing/BASELINE_TEST_REPORT.md), current [test evidence](../testing/TEST_EVIDENCE.md), and exact audit-checkpoint CI above. Earlier PR/fork results remain historical evidence. Every new commit needs fresh validation. See [Chromium guide](../testing/CHROMIUM_TEST_GUIDE.md) for commands and environment limits.

See [full ordered implementation checklist](IMPLEMENTATION_CHECKLIST.md) and [Product Spec](PRODUCT_SPEC.md).

## Meaning of “done”

Only mark Done after the code is merged, relevant tests pass, Chrome behavior is verified where applicable, license and security implications are resolved, and results are linked. A source file or attractive UI is not sufficient.
