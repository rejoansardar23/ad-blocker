# AD BLOCKER — RESEARCH AND CHAT HISTORY ARCHIVE

**Historical record:** The dated findings below remain preserved. Current operations and task priorities are in [HANDOFF.md](../../HANDOFF.md). On 18 November 2026, links to consolidated guidance were maintained; the original files are recoverable from commit `ce77ac5` and remote branch `recovery/pre-mission-ce77ac5`.

**Consolidated on 2026-11-16 (Asia/Kolkata).** This is a source-linked **reconstruction of relevant conversations and researched decisions**, not a verbatim archive of every historical ChatGPT message. The original transcript and private ChatGPT message identifiers are not stored in GitHub. Future contributors should prefer current main and CI to any dated observation.

**First read [MASTER_PROJECT_HANDOFF.md](MASTER_PROJECT_HANDOFF.md)**; this companion captures project origin, prior user requirements, research reasoning, rejected alternatives, exact source links and chronological work.

## A. Original owner mission — preserved requirements

The owner directed ChatGPT and Codex to develop the existing repository at https://github.com/rejoansardar23/ad-blocker into an independent product able to compete with established ad blockers. The owner repeatedly requested:
- Do not begin from scratch; inspect implementation code, not marketing README statements.
- Study market-leading products and permissively licensed candidates to save AI developer credits. Prefer compatible maintained open-source tools but **not a wholesale import of everything**.
- Keep all goals, instructions, repo links, architecture, charts, issue plans and research in GitHub for developers who have no access to long chats.
- Build actual features, tests and PRs in dependency order, review and merge only after checks pass; maintain the 60-step implementation checklist.
- Prioritize Chrome Manifest V3, user privacy, security, speed, correct ad blocking, site exceptions and low breakage, with future cross-browser and desktop/DNS research.
- Maintain the owner's control over code and branding, no surprise licensing or commercial publication, no unapproved GPL-derived proprietary integrations and no unapproved filter-list data.

For an exhaustive engineering task-by-task specification, see [60-step checklist](../product/IMPLEMENTATION_CHECKLIST.md), [product requirements](../product/PRODUCT_SPEC.md), [current roadmap and handoff](../../HANDOFF.md), [CI/test plan](../testing/TESTING.md) and [developer rules](../../AGENTS.md).

## B. Historical conversation and implementation timeline

| When (approximate) | Owner request and resulting durable state |
|---|---|
| **13 Nov 2026** | “Build a market-leading ad-blocker competitor,” document the vision, identify existing reusable repositories, and push handoff documents into [our project repository](https://github.com/rejoansardar23/ad-blocker). The project adopted a Chrome-MV3-first modular direction and did not authorize third-party source imports. |
| **13–14 Nov 2026** | Requests to list *every* previously suggested study repository rather than only a shortlist. The canonical 18-item catalog was preserved in [OPEN_SOURCE_REFERENCE_REPOS.txt](../research/OPEN_SOURCE_REFERENCE_REPOS.txt), later merged via [PR #17](https://github.com/rejoansardar23/ad-blocker/pull/17). |
| **14–15 Nov 2026** | User demanded real implementation and dependency-ordered PR workflow, review/test/merge PRs #3, #4 and #17, repair conflicts, preserve both fork/upstream implementations, avoid wasting Codex credits. Merged [#3](https://github.com/rejoansardar23/ad-blocker/pull/3) (Chromium/lockfile), [#4](https://github.com/rejoansardar23/ad-blocker/pull/4) (idempotent DNR/owned cosmetics), [#17](https://github.com/rejoansardar23/ad-blocker/pull/17) (catalog/queue), and reconciliation [#19](https://github.com/rejoansardar23/ad-blocker/pull/19) (fork+upstream histories). Fork work is credited in the repository documentation. |
| **15 Nov 2026: detailed mission** | User provided a comprehensive investigation specification: read all docs/code/tests/issues/PRs; run npm ci/check/build/e2e, inspect 18 repositories beyond READMEs, pin SHAs/licenses, compare scores with legal compatibility weighted 25%, feature gap 20%, MV3 15%, quality/security/tests 15%, health 10%, integration cost 10%, measured performance 5%; choose **EXACTLY TWO** primary refs; record ADR, next tasks, real code and CI; never fabricate tests or license approvals. |
| **15 Nov 2026: investigation** | Inspected current repository tree/modules, all 18 reference identities and top-level trees, 17 pinned root licenses, and selected upstream implementation modules. Final two study repositories chosen: **uBlock Origin MV3 source** and **Ghostery Adblocker SDK**. Kept current original runtime, no external imports. Full detailed study added in [PR #20 research report](https://github.com/rejoansardar23/ad-blocker/blob/fix/live-settings-consistency/docs/TWO_PRIMARY_REPOS_EVALUATION.md). |
| **15 Nov 2026: actual fix** | Baseline popup/options did not update while already open after another extension view changed settings. Implemented `chrome.storage.onChanged` UI refresh with pending-save guard and epoch-stale response protection, plus Node/Chromium regression tests in [draft PR #20](https://github.com/rejoansardar23/ad-blocker/pull/20). [Exact-head Actions CI](https://github.com/rejoansardar23/ad-blocker/actions/runs/43729820205) passed 20 Node tests and 10 Chromium fixture cases, build and audit. Remained OPEN DRAFT at snapshot; not silently merged. |
| **16 Nov 2026: preservation request** | Owner requested **all the research, links, diagrams and recoverable chat context** committed as durable project documentation, because a new ChatGPT session may not load old lengthy conversations. This master+archive documentation work is the response; it is separate from code feature PR #20. |

These are reconstructed topic summaries. Past messages outside available project/context sources are not silently represented as exact quotes.

## C. Existing code review findings and concrete references

**Main source snapshot**: https://github.com/rejoansardar23/ad-blocker/tree/10c877039de4f7c41122f882d731a187df6f8a0d

| Codepath | Observed function / purpose | Evidence and limitations |
|---|---|---|
| [src/extension/manifest.json](../../src/extension/manifest.json) | Chrome MV3, minimum version 121, native DNR, storage/activeTab, HTTP(S) cosmetic content script | No broad remote code or telemetry features observed |
| [src/extension/background/service-worker.js](../../src/extension/background/service-worker.js) | `getState`, `siteRule`, `ruleSignature`, `syncFromStorage`, `queueSync`, `handleMessage`; serializes reconciliation for local settings and Chrome DNR | Rule state API failure paths and concurrent read/modify/write exception updates need negative tests |
| [src/extension/shared/domain.js](../../src/extension/shared/domain.js) | `normalizeSite`, `isAllowlisted`, exact/subdomain matching with DNS host validation | IP/localhost and internal pages deliberately not supported yet |
| [src/extension/content/cosmetic.js](../../src/extension/content/cosmetic.js) | Small static stylesheet injection and remove-by-owned-node reference | No element picker, filter syntax engine or advanced cosmetics |
| [src/extension/rules/starter.json](../../src/extension/rules/starter.json) | Four static rules and controlled `.test` fixture | Insufficient to claim production ad/tracker coverage |
| [src/extension/popup/popup.js](../../src/extension/popup/popup.js), [src/extension/options/options.js](../../src/extension/options/options.js) | Message-based saved settings controls | Live external view changes fixed only on PR #20, not baseline main |
| [scripts/verify.mjs](../../scripts/verify.mjs) | MV3 manifest/layout/static DNR/syntax checks | Structural checks do not prove all runtime behavior |
| [scripts/build.mjs](../../scripts/build.mjs) | Copies original source files into `dist/chrome` | No runtime compiler for large legal filter lists |
| [tests/browser/chromium-smoke.mjs](../../tests/browser/chromium-smoke.mjs) | Actual Chromium extension loading + local fixture blocked requests/allowlist/cosmetics/restarts | Not a real-site browser compatibility or benchmark corpus |
| [.github/workflows/checks.yml](../../.github/workflows/checks.yml) | Node 22, npm ci, SBOM, npm audit, unit/check/build, Playwright browser tests, unpacked artifact | Exact commit CI must be inspected for each PR |

## D. Weighed study rubric and preliminary candidate comparison

The owner mandated 25% legal compatibility, 20% feature gaps, 15% MV3, 15% quality/security/testing, 10% maintenance, 10% integration/long-term cost, 5% **measured** performance. Since no independent end-to-end candidate performance comparison took place, performance = **UNKNOWN**, and totals must not be presented as completed evidence-based scores out of 100.

The deeper report from PR #20 recorded these **tentative and subjective source-review-only subtotal scores /95** (not a measured ranking, never a license clearance):

| Candidate | Legal /25 | Gap /20 | MV3 /15 | Quality /15 | Health /10 | Integration /10 | Perf /5 | Subtotal /95 |
|---|---:|---:|---:|---:|---:|---:|---|---:|
| uBlock Origin MV3 | 7 | 20 | 15 | 14 | 9 | 7 | UNKNOWN | 72 |
| Ghostery SDK | 16 | 18 | 6 | 12 | 8 | 7 | UNKNOWN | 67 |
| uBO Lite generated home | 7 | 19 | 15 | 12 | 9 | 5 | UNKNOWN | 67 |
| AdGuard extension | 7 | 18 | 15 | 13 | 9 | 4 | UNKNOWN | 66 |
| Unblock | 21 | 11 | 13 | 6 | 5 | 6 | UNKNOWN | 62 |
| Very Good AdBlock | 9 | 13 | 12 | 8 | 6 | 2 | UNKNOWN | 50 |
| Chroma | 7 | 12 | 11 | 5 | 5 | 5 | UNKNOWN | 45 |

**Interpretation:** GPL code receives a lower proprietary *import* score despite being highly valuable to study, and no numerical score overrides the license blocker. Ghostery webextension adapter isn't a generic MV3 DNR compiler. Real builds and benchmarking may change these choices.

### Candidate source evidence (deeply sampled)

- uBlock Origin [MV3 ruleset manager](https://github.com/gorhill/uBlock/blob/591b5ac8006b496b3307bcd1963b552a7b46f138/platform/mv3/extension/js/ruleset-manager.js): priority/ID ranges and DNR regex validation. [MV3 scripting manager](https://github.com/gorhill/uBlock/blob/591b5ac8006b496b3307bcd1963b552a7b46f138/platform/mv3/extension/js/scripting-manager.js): permissions and script registration. [MV3 generator](https://github.com/gorhill/uBlock/blob/591b5ac8006b496b3307bcd1963b552a7b46f138/platform/mv3/make-rulesets.js): build-time list conversion.
- Ghostery [core engine](https://github.com/ghostery/adblocker/blob/6f0610bf5eec1f31c4975ce0e707cdf47023e5b5/packages/adblocker/src/engine/engine.ts), [list parser](https://github.com/ghostery/adblocker/blob/6f0610bf5eec1f31c4975ce0e707cdf47023e5b5/packages/adblocker/src/lists.ts), [webextension adapter](https://github.com/ghostery/adblocker/blob/6f0610bf5eec1f31c4975ce0e707cdf47023e5b5/packages/adblocker-webextension/src/index.ts): parsing and matching but adapter uses WebRequest patterns.
- Very Good AdBlock [MIT source](https://github.com/chrisbbreuer/very-good-adblock/blob/9f8fc91262c1bd0e92fa382b5c457b773b5fd5c0/LICENSE) with [NOTICE.md](https://github.com/chrisbbreuer/very-good-adblock/blob/9f8fc91262c1bd0e92fa382b5c457b773b5fd5c0/NOTICE.md), [filter source manifest](https://github.com/chrisbbreuer/very-good-adblock/blob/9f8fc91262c1bd0e92fa382b5c457b773b5fd5c0/src/rules/filter-sources.json) acknowledging GPL-labeled upstream data; [dynamic rules](https://github.com/chrisbbreuer/very-good-adblock/blob/9f8fc91262c1bd0e92fa382b5c457b773b5fd5c0/src/rules/dynamic-rules.ts) for implementation comparison.
- Unblock [manifest](https://github.com/adyoi/unblock/blob/2cdca77654634aa535bda650bf7b20835d767fc4/src/extension/manifest.json) includes all-URL host permission and `tabs`, `scripting`, `userScripts`, `unlimitedStorage` in addition to Chrome DNR; [background implementation](https://github.com/adyoi/unblock/blob/2cdca77654634aa535bda650bf7b20835d767fc4/js/background.js) includes exception and remote-list paths; important migration/security questions.
- AdGuard [package manifest](https://github.com/AdguardTeam/AdguardBrowserExtension/blob/69965fa59a5d5a44531768780850d3e788fa93e1/package.json) includes filter conversion and MV2/MV3 tests; GPL source is not automatically importable into a proprietary product.

The complete source pin / all 18 inventory is in [MASTER_PROJECT_HANDOFF.md](MASTER_PROJECT_HANDOFF.md#5-all-18-previous-repository-research-links-and-pins) and the original [18-item catalog](../research/OPEN_SOURCE_REFERENCE_REPOS.txt).

## E. Why a two-primary approach was selected

**uBlock Origin MV3** provides architecture for browser-native rule compilation, quotas, priorities, exceptions, permissions and cross-browser packaging. Its implementation is reference-only under GPL conditions.

**Ghostery SDK** provides mature filter syntax/engine abstractions to research for future offline parsing, but not a direct replacement for Chrome DNR. MPL distribution obligations, dependencies, unsupported syntax and performance remain blockers before any reuse.

Other candidates serve as benchmarks or specific auxiliary tools (AGLint, DiffBuilder, Playwright, WXT), not primary runtime foundations. It is not a goal to merge multiple open-source codebases wholesale. Current original native-DNR runtime stays.

## F. Test evidence and how to avoid false claims

| Exact source state | Evidence | Actual results |
|---|---|---|
| **main** `10c877039de4f7c41122f882d731a187df6f8a0d` | [GitHub Actions 43724956889](https://github.com/rejoansardar23/ad-blocker/actions/runs/43724956889) | npm ci, 14 Node tests, build, 10 Chromium fixture cases, high-level audit 0 reported, SBOM |
| **draft PR #20** `13176deab7b2b54d7149f67e2f85247ab16b195c` | [GitHub Actions 43729820205](https://github.com/rejoansardar23/ad-blocker/actions/runs/43729820205) | npm ci, 20 Node tests, build, 10 Chromium fixture cases, audit 0 reported, SBOM |
| **external competitor repos** | Source layout / selected pinned files only | **No candidate builds, comprehensive vulnerability audits or measured speed/coverage benchmarks** |
| **actual Google Chrome toolbar / representative public sites** | No manual validation evidence | **Not verified** |

Baseline browser: Node v22.23.4, Playwright Chromium 158.0.8127.18. Synthetic fixture browser cases are **actual Chromium with the extension loaded**, not mocked rules, but are *not* real-world representative-site evidence.

## G. Decisions never to silently override

1. No approved project-wide source/distribution license and no approved contributor terms.
2. No approval to copy GPL-covered extensions, bundled filters, upstream data or scriptlets into the current project.
3. Do not change permissions or collect browsing history without security/privacy review.
4. Do not import Ghostery runtime merely because its filtering engine exists; use Chrome native DNR for the existing runtime unless measured tests justify a different architecture.
5. Do not claim all ads, YouTube ads, video ads or blockers-per-second statistics are accurate.
6. Do not mark checklist issue complete because docs were drafted.
7. Do not merge PR #20 on the basis of this archived CI alone; independently review head, CI freshness, conflicts and behavior.
8. Do not make unapproved payments, publish extensions, change repository visibility or announce commercial launch.
9. Do not overwrite or force-push another developer's work.

## H. Handoff questions for the next maintainer

- Has PR #20 been reviewed and merged into main? If not, what remains?
- Does `src/extension/background/service-worker.js` maintain consistency when Chrome DNR updates throw, and can tests force that case?
- Can simultaneous `SET_SITE_ALLOWED` writes lose updates? Reproduce before fixing.
- What are the exact owner-approved license and filter-data distribution conditions?
- Which single parser-to-DNR approach meets coverage, resource budget and compliance gates?
- Are compatibility and performance measured on the *same* browser/config/list corpus as competitors?
- Is the actual toolbar popup keyboard/screen-reader accessible and does manual Chrome Stable behave as fixtures predict?

**Next recommended engineering action at snapshot:** finish PR #20 independent review/merge, then add worker failure/concurrency regression tests under [issue #5](https://github.com/rejoansardar23/ad-blocker/issues/5). No new engine imports are necessary to make progress.

## I. Safe archival policy for this repository

When future conversations add material decisions or implementation milestones:
- Update master summary, link exact issue/PR/commit/CI, and note date and evidence.
- Keep new changes in GitHub Markdown (easy to diff, search and read), with diagrams in Mermaid; use Word/PDF exports only as optional readable copies.
- Archive summarized user intent and technical outcomes, **not private ChatGPT data, login emails, passwords, tokens or unrelated personal details**.
- If previous chat messages are inaccessible, do **not** assert that they were copied; preserve the verifiable facts and invite further source references.
