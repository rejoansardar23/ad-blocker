# Two primary open-source repositories — source-level architecture study

**Research snapshot:** 2026-11-15 (UTC); original project main at [10c877039de4f7c41122f882d731a187df6f8a0d](https://github.com/rejoansardar23/ad-blocker/tree/10c877039de4f7c41122f882d731a187df6f8a0d).
**Status:** research recommendation, NOT licensing approval, source import, security certification, a successful third-party build, or a benchmark ranking. Maintainer distribution/licensing decision remains open.

## Method and limits

1. Read AGENTS, current source (manifest, DNR rules, background worker, domain/cosmetic logic, popup/options, scripts, Node tests, Playwright tests, CI) and project planning/queue.
2. Captured GitHub HEAD commit and metadata for **all 18** candidates from the existing [catalog](OPEN_SOURCE_REFERENCE_REPOS.txt), and inspected their top-level source tree. Read pinned LICENSE files where present (17 repos); EasyList root did not expose a standalone LICENSE in the inspected root tree, so list-specific license is **not independently established here**.
3. Inspected actual modules in the seven full-extension/engine candidates, and source layouts of the 11 remaining tooling, filter-list and future-platform candidates. Inspected manifest, package metadata, rule/data provenance and selected implementation functions in strongest candidates. A source-tree inspection is **not** equivalent to an end-to-end code audit.
4. Confirmed original current-main [Actions run](https://github.com/rejoansardar23/ad-blocker/actions/runs/43724956889): npm ci, 14/14 Node tests, build, 10 Chromium fixture cases, npm audit (0 reported); Node v22.23.4, Playwright 1.65.0, Chromium 158.0.8127.18.
5. Verified [Chrome DNR specification](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest) and [Playwright's extension test guidance](https://playwright.dev/docs/chrome-extensions). **No candidate's full dependency tree or browser performance was benchmarked.** Local git clone failed DNS resolution; existing project verification comes from exact-commit CI logs, not an independent local checkout.
6. The pin is a reproducible *source revision*. A successful build on that pin is separately required before adoption.

## Existing architecture: read from source

- [manifest](../manifest.json): MV3, minimum Chrome 121, declarativeNetRequest/storage/activeTab; HTTP(S) content script on all pages; no explicit remote script or telemetry permission.
- [starter rules](../rules/starter.json): four static DNR block rule objects (small domain families plus a .test fixture); no broad licensed lists or parser.
- [worker](../background/service-worker.js): getState normalizes/de-duplicates up to 100 site exceptions; GET_STATUS reads storage; SET_ENABLED / SET_SITE_ALLOWED writes local preferences; queueSync serializes reconciliation to Chrome's static ruleset and managed dynamic allowAllRequests rules. Signature comparison avoids unnecessary updates; no background network fetcher.
- [domain helper](../shared/domain.js): HTTP(S) hostname validation, strict exact/subdomain allowlist matching; no IP/local/wildcard exceptions.
- [cosmetics](../content/cosmetic.js): three simple CSS selector families, inserted/removed as an owned style node, applying state from storage; no filter list syntax, dynamic picker, scriptlets or selector exceptions.
- [options](../options/options.js), [popup](../popup/popup.js): background messaging for settings; **PR #20 adds missing live synchronization** while other settings windows are open. UI changes in this PR require its own validation/merge.
- [build/check](../scripts/build.mjs), [verify](../scripts/verify.mjs), [Node tests](../tests), [CI](../.github/workflows/checks.yml): copied unpacked Chrome extension, structural/unit validation, real synthetic Chromium fixtures, dependency SBOM and npm audit.

### Actual runtime dependency graph

    User action -> popup/options -> chrome.runtime.sendMessage
      -> MV3 background/service-worker.js -> chrome.storage.local
                                        -> chrome.declarativeNetRequest
                                             -> static starter_rules + dynamic site exceptions
    Chrome HTTP(S) network request -> browser DNR engine -> blocked/allowed
    HTTP(S) document -> content/cosmetic.js -> chrome.storage.local
                                           -> shared/domain.js -> owned CSS style
    npm scripts -> verify/unit/build -> dist/chrome
    Playwright persistent Chromium -> dist/chrome service worker + local HTTP fixtures
    GitHub Actions -> npm ci + audit/SBOM + check/build/e2e

**Verified:** installation/service worker, request blocking, pause/resume, trusted site and subdomains, negative domain boundaries, persistence across browser restarts, safe cosmetic node handling, on fixture domains in CI. **Not verified:** real-world site breadth, production false positives, CPU/memory, active toolbar popup accessibility, permissions UX, Chrome Stable manual installation, security audit of every web surface, Safari/Firefox/Edge compatibility.

### Evidence-backed gaps and risks

- Four network rule objects cannot cover comprehensive filter syntax; no list parser/compiler, provenance, custom rules or update/rollback path exists in source.
- An open popup/options view did not subscribe to chrome.storage.onChanged on baseline main. Consequence: it could display stale enabled/site settings after a different view changed them. A regression/implementation is in [PR #20](https://github.com/rejoansardar23/ad-blocker/pull/20).
- Existing message handler writes preferences before DNR reconciliation. If the browser DNR API throws, persisted preference and actual browser rules may diverge. This is a **failure-mode risk needing injected-fault reproduction**, not a claimed observed live defect.
- Service-worker synchronization serializes DNR changes but separate concurrent read-modify-write allowlist messages could overwrite each other's additions. Requires reproducible concurrency test before describing as a confirmed failure.
- Cosmetic script starts with local default state before asynchronous storage retrieval, so trusted pages can temporarily receive default CSS. Treat as a potential transient UI issue, not tested live.
- No implemented settings versioning/migration, dynamic filter catalog or runtime performance thresholds.
- Current content script matches HTTP(S) broadly; permissions/host-site disclosures and user consent require a release review. No new permissions proposed.

## Full 18-repository inventory

**License notation:** verified means root pinned LICENSE (or license.txt/Licence.md) content read; metadata alone or per-data rights do not prove a redistributable bundle. Dates/revisions are from the GitHub API HEAD observed 2026-11-15. Links pin every inspected tree.

| # | Source at pinned commit | Root license status | Relevant source/architecture | Assessment and research depth |
|---|---|---|---|---|
| 01 | [Very Good AdBlock](https://github.com/chrisbbreuer/very-good-adblock/tree/9f8fc91262c1bd0e92fa382b5c457b773b5fd5c0) | MIT verified, bundled filter data separately GPL-labeled | TypeScript; src/rules/dynamic-rules.ts, src/rules/filter-sources.json, NOTICE.md; Bun/Stacks, Ghostery SDK and uBO-core development deps | Full-extension candidate; pinned manifest/package and rule code sampled; high data/license/migration overhead; defer |
| 02 | [Unblock](https://github.com/adyoi/unblock/tree/2cdca77654634aa535bda650bf7b20835d767fc4) | MIT verified | JS MV3 manifest, js/background.js, picker/scriptlets, multiple bundled rulesets, local and remote list options; zero package deps declared | Viable experiments, but broad tabs/scripting/userScripts/unlimitedStorage/all-URL permissions and provenance need audits; defer replacement |
| 03 | [Chroma Ad-Blocker](https://github.com/Dabrogost/Chroma-Ad-Blocker/tree/a85f1a8e017c7843d3cd973855720cd3a8fcbfed) | GPL-3.0 verified | JS MV3 extension/core/content/rules/subscriptions; proxy-router angle | MV3 comparison only; source tree and license reviewed; no build/behavior verification |
| 04 | [AdGuard Browser Extension](https://github.com/AdguardTeam/AdguardBrowserExtension/tree/69965fa59a5d5a44531768780850d3e788fa93e1) | GPL-3.0 verified | TypeScript Extension/src/background/engine, pnpm, @adguard/agtree, @adguard/dnr-converter, dual MV2/MV3 test commands | Valuable benchmark for compatibility/rules updates/UI; no proprietary source copying; sizeable integration cost |
| 05 | [uBlock Origin](https://github.com/gorhill/uBlock/tree/591b5ac8006b496b3307bcd1963b552a7b46f138) | GPL-3.0 verified | JS; platform/mv3/make-rulesets.js, extension/js/ruleset-manager.js, scripting-manager.js, plus full uBO engine | **PRIMARY #1** for MV3 architecture; reference-only source |
| 06 | [uBO Lite home/build](https://github.com/uBlockOrigin/uBOL-home/tree/a58a26f1f76c9d880f406c53cbe4cb7f3e284e36) | GPL-3.0 verified | Chromium generated manifest, JS, rulesets and uBlock submodule; build output/provenance | Useful secondary deployed-artifact companion to #05; redundant as separate primary architecture |
| 07 | [Ghostery extension](https://github.com/ghostery/ghostery-extension/tree/8854d665120e8085fedffbf06327995b55efa7f5) | GPL-3.0 metadata; root license not independently read | JS browser extension, tracker/privacy UX | Benchmark/reference only; source tree not deeply inspected here |
| 08 | [Ghostery Adblocker SDK](https://github.com/ghostery/adblocker/tree/6f0610bf5eec1f31c4975ce0e707cdf47023e5b5) | MPL-2.0 verified | TypeScript @ghostery/adblocker 2.20.3, network/cosmetic parsers, filter buckets, engine, webextension adapters | **PRIMARY #2** for parser/engine boundaries; MPL and dependency audit gate |
| 09 | [Brave adblock-rust](https://github.com/brave/adblock-rust/tree/4d525b7c6dce1608aa192e771524f0406f4d1a39) | MPL-2.0 verified | Rust blocker/engine, filters, optimizer, benchmarks, fuzz/test directories | Future WASM/native evaluation; browser-native DNR interop/perf untested |
| 10 | [WXT](https://github.com/wxt-dev/wxt/tree/f9fa638f895f58b1054813f055949b23e3899e26) | MIT verified | TypeScript extension framework, cross-browser bundles, storage/runner | Consider only after build-system migration benchmark; existing zero-runtime-dependency build works |
| 11 | [AGLint](https://github.com/AdguardTeam/AGLint/tree/a4d3e4515c124d50faf19b901269b6dd70e02068) | MIT verified | TypeScript rule linter (src/linter, compatibility tables, CLI) | Candidate offline validation tool once filter formats are chosen |
| 12 | [AdGuard DiffBuilder](https://github.com/AdguardTeam/DiffBuilder/tree/c8a7daef6cef8d515801786856d28aabb619809c) | MIT verified | TypeScript src/diff-builder and diff-updater | Potential data update optimization; defer until signed/provenance/rollback plan |
| 13 | [shadcn/ui](https://github.com/shadcn-ui/ui/tree/e62c9435fff729a175f38983dee73b2cb4f6a069) | MIT verified | TypeScript React/accessible UI primitives | UI design reference only; don't migrate current plain JS UI without clear need |
| 14 | [Playwright](https://github.com/microsoft/playwright/tree/b4d016aadc5cbd2b898a284307975fe73e05483d) | Apache-2.0 verified | TypeScript browser testing framework | Already used in repo at version 1.65.0 (locked dev dependency); keep |
| 15 | [EasyList/EasyPrivacy](https://github.com/easylist/easylist/tree/3ee6b5fce83b9fa238374dee71de37fa5c0e5a20) | **UNKNOWN for each list at this pin**; no root LICENSE found; downstream catalog flags GPL terms | Text filter sections, exceptions, cosmetics, privacy lists | Filter-data rights/attribution and redistribution require separate explicit legal verification; don't bundle |
| 16 | [StevenBlack hosts](https://github.com/StevenBlack/hosts/tree/35c74714ad86b36806b3f40f3c36abf8b2063cb5) | MIT root verified; aggregated upstream list rights independent | Python hosts aggregation, many source subdirectories | Domain-only experiments, no cosmetics; provenance audit required |
| 17 | [HaGeZi DNS lists](https://github.com/hagezi/dns-blocklists/tree/8c023c4a80650d7852181c4035c9b6d3a16cd01e) | GPL-3.0 verified | Multiple DNS/adblock formats, native platform categories | Future DNS/data study; filter/data terms and false positives remain gating |
| 18 | [SponsorBlock](https://github.com/ajayyy/SponsorBlock/tree/8cdda0b0b04de6f9cfe444031f035c1218c7da3b) | GPL-3.0 verified; API/database rights separate | TypeScript sponsor skipping extension (src/content.ts, background.ts) | P2 user-consented sponsor segments, not a replacement network ad blocker |

**Coverage honesty:** the top-level file trees and HEAD metadata of all 18 were inspected; pinned root licenses were read for 16, Ghostery extension license remains metadata-only, and EasyList needs list-level primary terms. All upstream tests/builds, vulnerability scans and transitive license audits remain outstanding. No downloaded competitor executable was run.

## Serious-candidate comparison

Scores are **tentative source-review judgment, not measured benchmark results**. Columns are points against weights L=25 legal, G=20 feature-gap fit, M=15 MV3, Q=15 code/testing/security evidence, H=10 health, I=10 cost/integration. Performance P=5 is **UNKNOWN for all**; comparable real measurements did not occur. Thus no score out of 100 is asserted and the selection is subject to review.

| Candidate | L /25 | G /20 | M /15 | Q /15 | H /10 | I /10 | P /5 | Subtotal /95 |
|---|---:|---:|---:|---:|---:|---:|---:|---|---:|
| uBlock Origin (including platform/mv3) | 7 | 20 | 15 | 14 | 9 | 7 | UNKNOWN | 72 |
| Ghostery SDK | 16 | 18 | 6 | 12 | 8 | 7 | UNKNOWN | 67 |
| uBO Lite home | 7 | 19 | 15 | 12 | 9 | 5 | UNKNOWN | 67 |
| AdGuard extension | 7 | 18 | 15 | 13 | 9 | 4 | UNKNOWN | 66 |
| Unblock | 21 | 11 | 13 | 6 | 5 | 6 | UNKNOWN | 62 |
| Very Good AdBlock | 9 | 13 | 12 | 8 | 6 | 2 | UNKNOWN | 50 |
| Chroma | 7 | 12 | 11 | 5 | 5 | 5 | UNKNOWN | 45 |

Legal scores reflect *potential proprietary code import*, **not** whether reading or independently applying an idea is lawful. Large GPL projects are valuable **for architectural study only**. Top-level MIT does not make included GPL data freely interchangeable. Quality/health scores are provisional: source structure, declared test commands and observed recent commits were checked; there is no independent candidate test report or CVE/security clearance. No numerical score overrides the license gate.

## EXACTLY TWO final primary repositories

### PRIMARY REPOSITORY #1 — uBlock Origin (specifically its uBO Lite MV3 source)

- **URL:** https://github.com/gorhill/uBlock
- **Pinned SHA:** [591b5ac8006b496b3307bcd1963b552a7b46f138](https://github.com/gorhill/uBlock/tree/591b5ac8006b496b3307bcd1963b552a7b46f138)
- **Verified root license:** GPL-3.0; the inspected MV3 modules carry GPL notices.
- **Why:** direct code-level model of mature MV3 DNR rule generation, priorities, quotas, static rulesets, filtering modes, dynamic rules, content script registrations, exception scopes and recovery, with browser-specific build targets.
- **Study exactly:** [MV3 generator](https://github.com/gorhill/uBlock/blob/591b5ac8006b496b3307bcd1963b552a7b46f138/platform/mv3/make-rulesets.js), [ruleset manager](https://github.com/gorhill/uBlock/blob/591b5ac8006b496b3307bcd1963b552a7b46f138/platform/mv3/extension/js/ruleset-manager.js), [scripting manager](https://github.com/gorhill/uBlock/blob/591b5ac8006b496b3307bcd1963b552a7b46f138/platform/mv3/extension/js/scripting-manager.js), [MV3 build notes](https://github.com/gorhill/uBlock/blob/591b5ac8006b496b3307bcd1963b552a7b46f138/platform/mv3/README.md). uBOL-home pin above is the secondary packaged artifact evidence.
- **Potentially reimplement originally:** ruleset provenance/manifest generator, quota preflight, deterministic priority/ID reservations, permission-scoped cosmetic registrations and synthetic breakage tests.
- **Do not import:** GPL source, scripts, generated GPL filter data or assets into an intended proprietary product absent owner-approved licensing and obligations.
- **Integration effort:** low for conceptual reference and independently written tests; high/blocked for code incorporation or wholesale replacement.
- **Security/license risks:** content script/scriptlet scopes, remote filter data, host permission growth and copyleft compliance; inspect rule priority behavior and policy on each target browser.
- **Benefit:** avoids avoidable architecture mistakes when graduating from four fixed rules to multi-list MV3, while preserving the existing original runtime.

### PRIMARY REPOSITORY #2 — Ghostery Adblocker SDK

- **URL:** https://github.com/ghostery/adblocker
- **Pinned SHA:** [6f0610bf5eec1f31c4975ce0e707cdf47023e5b5](https://github.com/ghostery/adblocker/tree/6f0610bf5eec1f31c4975ce0e707cdf47023e5b5)
- **Verified root/core license:** MPL-2.0; [core package](https://github.com/ghostery/adblocker/blob/6f0610bf5eec1f31c4975ce0e707cdf47023e5b5/packages/adblocker/package.json) version 2.20.3.
- **Why:** focused filter syntax, network/cosmetic parsing, list ingestion, matching, bucket indexing, exceptions, serialization/metadata; the subset relevant to our missing compiler/parser can be evaluated without adopting a competing full extension.
- **Study exactly:** [engine](https://github.com/ghostery/adblocker/blob/6f0610bf5eec1f31c4975ce0e707cdf47023e5b5/packages/adblocker/src/engine/engine.ts), [list parser](https://github.com/ghostery/adblocker/blob/6f0610bf5eec1f31c4975ce0e707cdf47023e5b5/packages/adblocker/src/lists.ts), [network filters](https://github.com/ghostery/adblocker/blob/6f0610bf5eec1f31c4975ce0e707cdf47023e5b5/packages/adblocker/src/filters/network.ts), [webextension adapter](https://github.com/ghostery/adblocker/blob/6f0610bf5eec1f31c4975ce0e707cdf47023e5b5/packages/adblocker-webextension/src/index.ts).
- **Key limitation verified:** the inspected webextension adapter imports WebRequest types and is not itself a ready-to-integrate Chrome MV3 DNR compiler. A separate supported-syntax-to-DNR translation stage, policy checks, quotas and browser tests would still be required.
- **Potential reuse only after approval:** narrowly scoped parser/codecs, preferably offline at build time rather than a second always-on runtime filtering engine.
- **Do not import yet:** MPL source or dependencies before file-level notices, licensing/distribution choice, complete dependency audit and performance/feature validation; do not bundle the webRequest adapter as if it provided Chrome MV3 blocking.
- **Integration effort:** moderate-high for a build-time parser bridge; high and duplicative for runtime engine. Dependency footprint and unsupported syntax require measurement.
- **Security/license risks:** unsafe filter/scriptlet processing, remote list input, MPL file-source obligations on distribution, bundled package licenses and supply-chain size.
- **Benefit:** strong basis for explicit supported/unsupported syntax taxonomy and robust tests, reducing pressure to hand-write a complex general parser.

**With just these two:** learn a production-oriented MV3 declarative filtering/list generation and permissions architecture (#1), plus tested filter language/engine abstractions and syntax semantics (#2). Together they address the largest architectural uncertainty without combining whole products. They do **not** automatically provide legally redistributable lists, a Chrome-ready parser-to-DNR bridge, update signatures/rollback, user interface or product QA. WXT/AGLint/DiffBuilder/Playwright remain supporting *tools* rather than additional primary study repositories.

## Architecture decision record — ADR D-008 (proposed)

- **Decision:** KEEP existing original native-DNR MV3 runtime; BUILD only demonstrated missing capabilities; STUDY the two pinned references; DEFER any upstream source/data import until owner distribution approval plus legal/security/performance validation.
- **Alternatives:** adapt Very Good AdBlock or Unblock outright (licensing/data, permissions or migration cost); import entire AdGuard/uBlock/Ghostery extension (GPL and overlapping architecture); embed full Ghostery matcher alongside Chrome DNR (duplicate filtering, no proven gain).
- **Reasons:** original code already passes synthetic Chromium tests, has zero runtime npm deps, limited permissions and reliable packaging. Chrome DNR is browser-native; an overlapping request matcher would not bypass MV3 limits. Current source-replacement benefit is unmeasured.
- **Consequences:** predictable small PRs, preserve source ownership; more work required for syntax compiler/coverage. Do not claim equivalent blocking to mature products.
- **Validation/rollback:** keep existing request fixtures; add compiler conformance, unsupported syntax, priority, quota and false-positive tests before enabling new lists. Any future parser adoption must have a reversible feature flag and benchmark.
- **Owner gating:** project license/distribution, data redistribution, credits/purchases, broader permissions, and store publishing remain explicitly unapproved.

## Prioritized execution plan with acceptance gates

| Tier/Task | Status + dependencies | Existing source, required work and reuse | Test/acceptance; complexity and blocker |
|---|---|---|---|
| P0-001: current integration baseline | CI verified; no dependency | current manifest, worker, scripts/tests; keep existing code | Exact SHA CI green; manual Chrome review still open; S |
| P0-002: live UI synchronization | PR #20, needs review/merge | popup/options, settings-ui.test.mjs, chromium-smoke.mjs; no external reuse | Concurrency, error and cross-tab UI regressions, full CI; S; no owner blocker |
| P0-003: DNR/API failure recovery | open; depends P0-002 | background/service-worker.js and service-worker.test.mjs; inject update failures and test observed state vs saved preferences | No false success or silent partial state; mock + Chromium where feasible; M; no third-party import |
| P0-004: concurrent allowlist writes | investigation; depends P0-003 | worker storage read-modify-write and queue; test two simultaneous messages, preserve all updates | Reproduce defect first, then serialize writes or use single authoritative mutation queue; M |
| P0-005: security + permissions and manual UX | open; depends stable settings | manifest, content, popup/options HTML/CSS, SECURITY docs | host access warning, CSP, service worker restart, popup focus and screen reader checks; M; manual browser needed |
| P0-006: licensing/governance | BLOCKED owner decision (checklist 004–010) | FOUNDATION_AUDIT, DECISIONS, REUSE_AND_LICENSES; no source import | owner selects distribution and terms; third-party notices approved; M/legal |
| P1-007: filter provenance | BLOCKED P0-006 | new data/source manifest, CI integrity/license audit; EasyList/AdGuard/hosts only after approval | pinned hash, URLs, license/attribution, no unreviewed redistribution; M |
| P1-008: DNR compiler | BLOCKED P1-007 | new offline compiler/tests linked into scripts/build, manifest and rules; study primary #1/#2 and AGLint | valid/invalid fixture corpus, priority, quota, unsupported syntax report, equal-or-better regression suite; L |
| P1-009: safe filter updates/rollback | BLOCKED P1-008 | new versioned data fetch/verify and last-good store; DiffBuilder later | failed network/corrupt update retains known-good set; no remote executable scripts; L |
| P1-010: user rules/settings portability | depends P1-008 | new validation/undo controls, options/storage migrations, tests | roundtrip and invalid-data negative tests; L |
| P1-011: dynamic cosmetics and picker | depends P1-008 | content/cosmetic.js + new selector lifecycle/picker and test fixtures; study uBO MV3 | reversible selectors, no unrelated nodes, accessibility and dynamic content tests; L |
| P1-012: tracker/region/nuisance profiles | depends P1-007–009 | licensed list bundles + options; separate source provenance | toggle each profile, breakage sample, size/quota report; L |
| P1-013: benchmarks, diagnostics and release | depends stable feature set | tests/ and .github workflows, UX/docs, packaging/signing research | dated Chrome and competitor versions, false-positive/CPU/memory measurements, owner store approval; L |
| P2-014: Edge/Firefox | depends Chrome QA | browser-specific adapter/manifest, Playwright cross-browser where supported | own browser integration results and permissions matrix; L |
| P2-015: sponsor/video, desktop, DNS/mobile | separate feasibility approval | no reuse of browser runtime by assumption; study selected secondary candidates | separate requirements, data licenses, security/cost gates and small prototypes before commitment; XL |

**Checklist reconciliation:** 001–003 documentation/source present; 004–010 incomplete (007 only preliminary research), 011–018 source present, 019–023 fixture/CI verified, 024–025 open, 026–060 not complete. Do not mark P0-002 complete until PR #20 is merged and CI on resulting main commit passes.

## Work done vs unresolved

**Completed in this research pass:** source read of current project, exact baseline CI evidence, 18 pinned repository identities/source trees, 16 pinned root license files plus one GPL-confirmed via metadata and EasyList marked unresolved, detailed modules of MV3 uBO, Ghostery SDK, Unblock, Very Good AdBlock, AdGuard; verified current official Chrome DNR and Playwright guides; two primary architecture study selections. **Not completed:** full code audits of every file in 18 projects, 18 dependency/advisory audits, candidate builds, real-site comparative benchmark, commercial legal clearance, independent local npm/browser run. The remaining constraints do not justify importing or replacing production code.

**Immediate next task after PR #20:** fault-injection tests for worker storage/DNR disagreement and concurrent allowlist updates (issue #5), followed by a minimal fix only on reproduced failures. No new permissions or data source needed.
