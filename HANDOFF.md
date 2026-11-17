# Project handoff

Updated 18 November 2026 (Asia/Kolkata). Inspected baseline: `ce77ac5`. Recovery/audit checkpoint: `c9e54b2`, [CI passed](https://github.com/rejoansardar23/ad-blocker/actions/runs/44182569555). Read live Git state and the [feature ledger](docs/product/FEATURE_MATRIX.md) before assuming this snapshot is current.

Mission results: 1,454 tracked files (11 runtime; 1,395 preserved quarantine), nine redundant documents consolidated/removed, **60 passing tests**, ten original Chromium scenarios plus five live-view and one concurrency checkpoint. Direct builds reject untracked source before replacing output, and CI rebuilds after Chromium generates its local rules cache. See the [full engineering outcome](docs/audit/REPOSITORY_AUDIT.md) and [latest evidence](docs/testing/TEST_EVIDENCE.md). Next: complete remaining CORE-03 failure/restart cases, then CORE-04 migration/lifecycle; manual and release gates remain open.

## Recovery and reliability follow-up — 18 November 2026

Three focused changes have now been merged without deleting or replacing preserved implementation files:

- [PR #23](https://github.com/rejoansardar23/ad-blocker/pull/23), merge `946f46b`: `scripts/recover-history.mjs` can compare historical Git trees and stage exact original source/binary bytes beneath ignored `build/recovery/`. It refuses overwrites, unsafe paths and historical symlinks.
- [PR #24](https://github.com/rejoansardar23/ad-blocker/pull/24), merge `ac3d7fd`: the comparison also suggests *possible* moved-and-modified counterparts, rather than assuming a historical path with different bytes represents lost functionality. This suggestion does not establish ownership or code equivalence.
- [PR #25](https://github.com/rejoansardar23/ad-blocker/pull/25), merge `3e43a83`: the worker restores affected prior preferences and reconciles existing rules after a one-time DNR API failure. [Exact PR CI](https://github.com/rejoansardar23/ad-blocker/actions/runs/44201035109) passed **68 Node tests**, including four new DNR failure-injection scenarios, and the existing Chromium smoke suite.

Historical comparison of commit `6191c3c` found the earlier first-party manifest, worker, popup, options, cosmetic script, shared domain logic and browser/unit suites have corresponding current locations. Some source is byte-identical; other source has been moved and modified. Old paths alone are not evidence of missing product features. **No content under `AnalyseFuture/` was deleted, executed or activated.**

Remaining reliability work: CORE-03 is **partially implemented**, not fully complete. Test sustained/failed rollback, read API failures, external writes and restart convergence before claiming transactional guarantees. Then proceed to CORE-04 migrations and lifecycle tests. The project's broader filtering, licensing and release tasks remain governed by the existing task matrix.

## Purpose and prior work

Build privacy-first ad/tracker protection with measurable coverage, low breakage, local controls, accessibility, safe updates, and recovery. The existing Chrome MV3 application is the starting product. Preserve its working DNR rules, pause/resume, trusted sites, reversible cosmetics, popup/options, settings repair/reset, tests, build, and Git history. Do not start over.

The ambition includes websites, web apps, YouTube/video, other browsers, native apps, mobile, desktop, and DNS. Each needs a suitable platform mechanism and independent evidence. A Chrome extension cannot filter arbitrary native-app traffic. DNS cannot provide cosmetics or separate paths on a shared hostname. Server-inserted encrypted video may not expose a reliable distinction between an ad and wanted media. Universal 100% blocking, zero breakage, permanent anti-block invisibility, or exact universal counters cannot be promised.

The detailed idea, audiences, architecture layers, AI research owners/evaluations/stop conditions, and multi-year horizons remain in [PROJECT_IDEA.txt](PROJECT_IDEA.txt). This handoff owns current tasks; it does not repeat the charter. Chrome comes first. Future platform work requires an owner, approved design, legal/permission review, tests, budgets, and a go/no-go decision.

## Where authoritative information belongs

| Question | Source |
|---|---|
| What does it do; how do I run it? | [README](README.md) |
| How should a contributor/agent work? | [AGENTS](AGENTS.md), [CONTRIBUTING](CONTRIBUTING.md) |
| What is implemented and how was it proven? | [Feature matrix](docs/product/FEATURE_MATRIX.md), [test evidence](docs/testing/TEST_EVIDENCE.md) |
| What comes next? | This handoff and the retained [60-step checklist](docs/product/IMPLEMENTATION_CHECKLIST.md) |
| Where does each file belong? | [Project structure](PROJECT_STRUCTURE.md), generated inventory described below |
| How do runtime modules interact? | [Architecture](docs/architecture/ARCHITECTURE.md) |
| How are licenses and imports decided? | [Decisions](docs/governance/DECISIONS.md), [reuse policy](docs/governance/REUSE_AND_LICENSES.md) |
| What did earlier sessions discover? | Dated `docs/history/` records; their old statuses are history |

## Recovery and repository audit

The remote branch `recovery/pre-mission-ce77ac5` preserves the complete pre-mission tree. A verified local bundle was also made; unlike the remote reference it may disappear with the machine. Restore individual files from the recovery commit into a reviewed change; do not reset shared main or force-push.

The [integrity audit](docs/security/REPOSITORY_INTEGRITY_AUDIT.md) confirms that `9cde4e1` removed governance/docs and activated archive-derived commands in CI. `e5260c9` had already restored the active first-party boundary. Git evidence does not establish unauthorized account access or identify an attacker.

All 1,455 baseline files were inventoried: 60 outside quarantine, 1,395 in quarantine, 327 directories. Every one of the 1,384 imported source-file hashes and both ZIP hashes matches the local recorded manifest. Upstream commits remain unknown. Eleven exact-duplicate groups are confined to imported trees, including licenses, package configuration, locale assets, and empty resources with distinct roles.

Run `npm run audit:repository` for every current tracked file's purpose/classification, origin, size, hash, runtime/build flags, literal relationships, validation files, integrity, license-review status, duplicate groups, and proposed action. Reports are in ignored `build/audit/` and uploaded by CI as `ad-blocker-repository-audit`. [Inventory scope and limits](docs/audit/REPOSITORY_AUDIT.md) distinguish static heuristics from manual review. No imported script is executed.

The active runtime is already organized by functionality. [Migration decisions](docs/architecture/STRUCTURE_MIGRATION_PLAN.md) require no production move. Nine overlapping docs/prompts were consolidated into README, AGENTS, this handoff, architecture, and the reuse worksheet. Their originals remain in the remote recovery tree. No upstream license, source, ZIP, or forensic record was removed: unknown source provenance still blocks disposal or reuse.

Remaining structure concerns: preserve one current status owner per document; keep generated files ignored; split browser helpers only when coverage benefits; create future source/test modules only alongside real approved functionality. New repository checks reject broken literal file links, package-reference escapes/symlinks, tracked generated/credential-format files, and root commands/workflows that reactivate quarantine. They are guardrails, not complete code or secret analysis.

## Current code and validation

CORE-01 is implemented: open popup/options views subscribe to relevant local changes, read canonical worker state, defer refresh while saving, and discard older responses or failures. Twenty new Node regressions passed at its 50-test checkpoint. Real Chromium passes ten original scenarios plus five live-view checkpoints. The popup page is loaded in a tab for logic testing; toolbar presentation/accessibility remains manual.

CORE-02 is also implemented: one queue serializes complete messages, repair-capable reads, and install/start/storage reconciliation. Eight new worker regressions bring the current suite to **58 passing tests**. Chromium adds a concurrent-mutation checkpoint proving both site exceptions survive in storage and DNR. CORE-03 now has a tested rollback path for one-time static/dynamic DNR failures (PR #25); sustained failures, other API errors and restart convergence still need tests.

`src/extension/manifest.json` declares one MV3 service worker, popup, options, shared/content scripts, and starter DNR rules. The worker validates local state and reconciles Chrome rules; UI sends messages to it; page-side cosmetics use an owned reversible stylesheet. The runtime ships no Node package dependencies. `scripts/build.mjs` copies only this source tree to `dist/chrome`.

Baseline tests passed locally: 18 Node tests and ten Chromium page scenarios on Node 24.22.1 / Chromium 158.0.8127.18. The audit checkpoint adds twelve tooling regressions: 30 total tests pass, plus CI browser validation. [Baseline report](docs/testing/BASELINE_TEST_REPORT.md) and [current evidence](docs/testing/TEST_EVIDENCE.md) preserve exact scopes. Formal Stable-toolbar, accessibility, outbound-traffic, performance, real-site, and platform evidence remain separate open gates.

## GitHub and delivery

Public metadata checked during the mission: fourteen open issues (#1, #2, #5–#16) and one open draft [PR #20](https://github.com/rejoansardar23/ad-blocker/pull/20), head `13176deab7b2b54d7149f67e2f85247ab16b195c`. The complete PR diff was reviewed. Its live-view synchronization remains useful, but twelve old-path documentation changes and the research bundle must not be merged wholesale. Preserve attribution and adapt only the needed logic/tests to current paths. The old successful run cannot validate a new change. Issue #1 needs acceptance-based reconciliation; it is still open despite the established browser baseline.

The owner explicitly requested incremental commits pushed directly to `main` because machines can disappear. That instruction governs this mission; no new PR is claimed. Other tools may use focused PRs when the owner requests them. A temporary empty audit branch exists only at the original baseline. Account-level collaborator/session/token/audit-log review remains the owner's responsibility; public Git/PR access cannot prove account security.

## Milestones and research gates

Existing issue scope remains: #2 = licensing/foundation, #5 = settings/security, #6 = data registry, #7 = compiler, #8 = updates, #9 = cosmetics/picker, #10 = custom rules/portability, #11 = protection profiles, #12 = UX/diagnostics, #13 = release, #14 = benchmarks, #15 = browser expansion, #16 = desktop/DNS feasibility. Reuse those issues before opening duplicates. Issue #1 is the existing Chromium-baseline issue and remains open until its full acceptance is reconciled.

| Stage | Exit evidence |
|---|---|
| Ownership/foundation | Approved license/contributor/distribution model, one architecture, known provenance, reproducible build |
| Reliable Chrome alpha | Consistent settings/DNR state, real controls, permission/privacy/accessibility review, no critical fixture regressions |
| Mature filtering | Approved sources/compiler, unsupported/quota reports, regional review, updates/rollback, dated coverage and breakage results |
| Controlled release | Accessible UX, privacy/support policies, security/legal review, reproducible artifacts, staged rollout and rollback owner |
| Competitive proof | Same workloads/configuration, repeated distributions, wanted-content controls, published uncertainty |
| Expansion | Independent owner, threat model, platform evidence, cost and maintenance capacity for every browser/app/network target |

Research questions still open include parser/library benefit versus original DNR, current quotas/permission UX, legal initial lists, safe remote data delivery, regional rights, production diagnostics, optional sponsor APIs, and sustainable support costs. WXT/AGLint/DiffBuilder require a measured use case before adoption. Exactly two deep architectural references remain uBlock MV3 and Ghostery parser semantics; neither imported snapshot is an approved dependency. AI may propose redacted issue groups, tests, or candidate rules; it cannot approve licensing or autonomously promote source/rules/releases. No raw browsing data should be sent to a model by default.

## Complete testing backlog

Keep mock/unit, bundled-Chromium, manual Chrome Stable, representative-site, accessibility, privacy, performance, security, release, and future-platform results as separate evidence groups. Passing one group never silently completes another.

| ID | Priority / dependency | Missing tests and completion evidence |
|---|---|---|
| `TEST-01` | P0, current core | Define and test IDN/punycode, public-suffix, hostname/label limits, trailing dots, ports, localhost/IP/internal URLs, malformed/unknown messages, and 0/1/99/100/101-site boundaries. Done when explicit policy and positive/negative unit fixtures agree. |
| `TEST-02` | COMPLETED, `CORE-02` | Eight regressions force interleaved add/add, add/remove, reset/site, toggle/site, repair and rejection recovery; a Chromium checkpoint verifies concurrent storage/DNR state. |
| `TEST-03` | P0, `CORE-03` | Inject storage failures and failures from `getEnabledRulesets`, `updateEnabledRulesets`, `getDynamicRules`, and `updateDynamicRules`. Done when UI/state are honest, retry/restart converges, and unrelated rules survive. |
| `TEST-04` | P0, `CORE-04` | Exercise corrupt, partial, old, and unknown-future settings; install/startup/storage events; migration rollback; worker suspension/restart. Done with a versioned matrix and no silent data loss. |
| `TEST-05` | PARTLY COMPLETED, `CORE-01` | Cross-view changes, pending edits, stale responses/failures, initialization and reset races now pass Node and multi-view Chromium tests. Full toolbar/site navigation, unavailable/internal-tab UX and broader API failures still need coverage. |
| `TEST-06` | P0, stable core | Test cosmetic startup on trusted sites, storage failure, missing/replaced document roots, irrelevant changes, duplicate prevention, hostile DOM, CSP, frames, shadow DOM, and SPA navigation. Done when behavior stays bounded/reversible and never deletes page-owned content. |
| `TEST-07` | P0, `CORE-01–04` | Manually load the exact build in Chrome Stable; test the real toolbar popup, options, worker console, disable/enable, extension reload/update, browser restart/suspension, uninstall, and clean/existing profiles. Record exact OS, Chrome, SHA, and errors. |
| `TEST-08` | P0/P1, core reliability | Expand synthetic browser fixtures to HTTPS, redirects, frames, multiple tabs/windows, rapid toggles, 100 exceptions, worker wake/suspension, two extension views, and failure recovery. Every block assertion needs a benign server-count control. |
| `TEST-09` | P0, stable core | Review manifest permissions, broad HTTP(S) content-script scope, `activeTab`, install warnings, CSP, remote-code prohibition, and permission diffs. Done with approved least-privilege rationale and real Chrome prompt evidence. |
| `TEST-10` | P0, core reliability | Send unexpected-context, malformed, oversized, replayed, overlapping, and prototype-shaped messages; disconnect the worker. Done when requests reject without mutation, privilege escalation, crash, or data leakage. |
| `TEST-11` | P0/P1, stable core; repeat after network features | Capture outbound traffic during install, toggle, trust, reset, restart, and updates; inspect storage/logs for URLs, history, content, credentials, and account data. Done with a recorded inventory showing no unexplained traffic/data. |
| `TEST-12` | P0, after core changes | Test real popup/options keyboard order, visible focus, names/roles/states, live announcements, confirmations/errors, zoom/reflow, contrast/high-contrast mode, reduced motion, and screen readers. Record exact browser, OS, and assistive technology. |
| `TEST-13` | P1, stable UI | Stress popup size, narrow/zoomed options, long domains/errors, light/dark/high-contrast, localization expansion, and right-to-left text. Done when controls remain visible, understandable, and reachable. |
| `TEST-14` | P1, stable filtering pipeline | Build a consent-safe HTTPS compatibility corpus for news, shopping, media, SPAs, controlled authenticated flows, frames, widgets, forms, downloads, payments, CSP/shadow DOM, accessibility-heavy pages, and anti-adblock behavior. Measure coverage and severity-weighted breakage. |
| `TEST-15` | P1, `DATA-01`/`COMP-01` | Version a golden compiler corpus for supported grammar, explicit unsupported reports, exception/priority behavior, stable IDs/hashes, deduplication, regex validity, malformed/adversarial input, fuzz/property tests, and deterministic output. |
| `TEST-16` | P0 docs quality, `DOCS-01` | Check all tracked active links, file inventory, task/checklist mapping, duplicated live-status claims, outdated SHAs/runs, and quarantine exclusion. Add a reproducible root command and CI step without rewriting dated history. |
| `TEST-17` | P1, `COMP-01` | Test browser-version-specific static/dynamic/session quotas, safe/unsafe categories, 100 site exceptions, maximum approved lists, and partial API failure. Produce a threshold report and reject overflow without silent rule loss. |
| `TEST-18` | P1, `DATA-01`/`COMP-01`/`UPDATE-01` | Test valid/invalid integrity data, wrong source/version, truncation, corruption, replay/downgrade, timeout, network loss, interrupted promotion, offline startup, and last-known-good restore. Complete a staged rollback drill. |
| `TEST-19` | P1, licensed lists and regional owners | Measure per-language/site coverage, wanted-content controls, reviewer agreement, source drift, update cadence, and attribution. Every regional pack needs a qualified named reviewer and sustainable owner. |
| `TEST-20` | P1, `COSMETIC-01`/`PICKER-01` | Test dynamic DOM, selector cost, frames/shadow limits, preview/cancel/undo, keyboard operation, and legitimate controls. Require browser, accessibility, and performance evidence within budgets. |
| `TEST-21` | P1, representative corpus | Measure cold/warm load, startup/worker wake, CPU, memory, long-lived DOM, large lists, 100 exceptions, repeated sync, package/rule size, and battery proxy against a no-extension baseline. Record repetitions, distributions, hardware, and regression budgets. |
| `TEST-22` | P1, stable core/update system | Soak repeated toggles, updates, restarts, many tabs, long-running profiles, rapid SPA navigation, worker suspension, network loss, and update failure. Done when defined duration/repetitions show no divergence, leak, crash, or unrecovered failure. |
| `TEST-23` | P0/P1, every build/dependency change | Audit dependency provenance/lifecycle hooks, secrets/keys, artifact allowlist, notices/licenses, action versions, tamper detection, and quarantine exclusion. Preserve SBOM/audit plus exact artifact inventory/hash. |
| `TEST-24` | P1, `QA-01`/`BUILD-01` | Compare two clean builds, ZIP bytes/contents, checksums, clean-profile install, update/downgrade/uninstall, artifact rollback, notices, SBOM, and changelog. Produce an immutable exact-commit artifact and rollback rehearsal. |
| `TEST-25` | Release gate | Review Chrome Web Store remote-code, permission, data-use, screenshots/copy, privacy policy, and support requirements. Human owner/legal approval is mandatory before submission. |
| `TEST-26` | P1, stable candidate | Benchmark isolated profiles on the same hardware/browser/list versions and workloads. Report blocking recall, wanted-content precision, breakage, CPU, memory, load, and reliability distributions with uncertainty—never an unsupported ranking. |
| `TEST-27` | Research, stable core plus legal/policy review | Separate video network ads, overlays, companion ads, client insertion, sponsorship, and server-side insertion by account/region/version. Protect playback and define stop conditions; indistinguishable wanted media is not guaranteed blockable. |
| `TEST-28` | Future, separately approved products | Create independent Edge, Firefox, Safari/iOS, Android, desktop, DNS, router, smart-TV, and native-app matrices covering APIs, permissions, signing, power/network transitions, consent, privacy, updates, rollback, compatibility, and OS/device versions. Chrome success is not evidence. |

Every evidence record must include: task/owner, exact commit SHA, date/time and timezone, commands and exit results, fixtures and data/list versions, OS/hardware, browser/tool versions, repetitions where relevant, logs/artifacts, pass/fail/blocked status, known gaps, rollback result, and next action. A policy-blocked local browser attempt is neither an application pass nor an application failure. Never execute quarantine merely to increase test coverage.

## Complete dependency-ordered task queue

Status meanings: **Ready** can start from current `main`; **Blocked** needs a dependency or owner decision; **Future** must wait for earlier product evidence; **Owner** cannot be decided by a coding tool.

### Immediate core and alpha work

| ID | Status / dependency | Deliverable and acceptance evidence |
|---|---|---|
| `CORE-01` | **COMPLETED** | Current-path UI synchronization, pending-edit protection, stale response/failure epochs, twenty new Node regressions, and five Chromium checkpoints. PR #20's unrelated old docs were excluded. |
| `CORE-02` | **COMPLETED** | Full operation serialization, deterministic interleaving/repair/reset tests, recovery after rejected writes, idempotent storage-event reconciliation, and a real Chromium concurrency checkpoint. |
| `CORE-03` | **IN PROGRESS; one-time DNR failure rollback verified in PR #25** | Make storage/DNR failure behavior consistent. Inject failures from enabled-ruleset and dynamic-rule APIs; UI reports the failure honestly; status does not claim unapplied protection; retry/restart converges; unrelated browser rules remain intact. |
| `CORE-04` | **Blocked by CORE-02/03** | Add a versioned settings schema and migrations. Preserve current data, safely repair corrupt/partial state, define future-version behavior, and test install/startup/storage changes after worker suspension. |
| `QA-01` | **Blocked by CORE-01–04** | Manual Chrome Stable, permission, privacy, and accessibility gate: exact OS/browser/version, actual toolbar popup and options, keyboard/focus/labels/contrast/screen reader, pause/trust/reload/restart, permission disclosure, service-worker console, and outbound-traffic capture. File every failure as a scoped issue. |
| `ALPHA-01` | **Blocked by QA-01** | Create a deterministic developer alpha ZIP containing only the verified extension; compare two clean builds, publish SHA-256, test install/update/uninstall/rollback, and document limitations. Public distribution remains owner-gated. |
| `STRUCTURE-01` | **COMPLETED in c9e54b2 and consolidation** | Reconcile documentation ownership and `PROJECT_STRUCTURE.md`, add the active file/link/status consistency command from `TEST-16`, and prove no active imports/paths are broken. Do not perform another mass move or alter quarantine. |
| `DOCS-01` | **COMPLETED for current guides; historical facts retained** | Reconcile stale current docs with live code/evidence without rewriting history: feature matrix, checklist, security/privacy, contributor guide, agent guide, research backlog, issue #1 status, and exact CI/test counts. Keep dated history explicitly dated. |
| `TEST-MATRIX-01` | **Program task; implemented incrementally** | Track `TEST-01`–`TEST-28`, owners, fixtures, results, and gaps. Each product PR implements only its relevant tests; never create one unreviewable “test everything” change. |

### Governance, data, and filtering foundation

| ID | Status / dependency | Deliverable and acceptance evidence |
|---|---|---|
| `GOV-01` | **Owner** | Owner chooses project license, contributor terms, distribution model, brand/trademark path, and store-account ownership. Record a signed-off decision; tools must not infer it. |
| `GOV-02` | **Blocked by GOV-01** | Complete pinned source/data/dependency/license/security audit and approve one architecture ADR. Compare KEEP/INTEGRATE/ADAPT/BUILD/DEFER/REJECT; reject overlapping engines without measured value; do not promote quarantine. |
| `DATA-01` | **Blocked by GOV-01/02** | Create a filter-source registry with exact origin, version/hash, license/notice, redistribution decision, update cadence, owner, and fixture/production separation for every source. |
| `COMP-01` | **Blocked by DATA-01** | Build or approve one deterministic list-to-DNR compiler. Define supported syntax, report every unsupported construct, produce stable hashes, deduplicate, enforce priority/ID ownership and quotas, and test malformed plus legitimate-control input. |
| `FILTER-01` | **Blocked by COMP-01** | Add baseline tracker handling with defined first-/third-party policy, controlled tracker fixtures, legitimate controls, coverage/breakage results, and DNR-budget evidence. |
| `COSMETIC-01` | **Blocked by COMP-01** | Add safe production cosmetics with dynamic-DOM tests, exceptions, reversibility, page-owned-content protection, accessibility checks, and performance limits. |
| `REGION-01` | **Blocked by DATA-01/COMP-01** | Add opt-in regional/language packs only with provenance, a qualified reviewer, wanted-content controls, a regional corpus, measured breakage, and a sustainable update owner. |
| `RULES-01` | **Blocked by COMP-01/CORE-04** | Add custom blocking/allow rules with preview, strict validation, precedence/conflict explanation, undo, persistence, and invalid-input tests. Never silently accept unsupported syntax. |
| `PICKER-01` | **Blocked by COSMETIC-01/RULES-01** | Add an accessible reversible element picker with stable minimal selector generation, preview/cancel/undo, keyboard use, legitimate-control safety, and dynamic-page browser tests. |
| `UPDATE-01` | **Blocked by DATA-01/COMP-01** | Add provenance/integrity/version checks, staged promotion, corrupted/truncated/wrong-version rejection, offline startup, last-known-good rollback, and a documented rollback drill. Remote endpoint approval is required. |

### Product maturity, proof, and release

| ID | Status / dependency | Deliverable and acceptance evidence |
|---|---|---|
| `REPORT-01` | **Blocked by stable rules** | Privacy-safe breakage reporting with local preview/redaction, explicit opt-in, cancellation/deletion, and no raw history, cookies, credentials, or page contents by default. Any server/retention policy requires owner approval. |
| `COVERAGE-01` | **Blocked by stable filtering pipeline** | Build the representative HTTPS compatibility corpus from `TEST-14`, including category, region, legitimate controls, consent/account rules, breakage severity, privacy handling, owner, and reproducible versioning. |
| `PROFILE-01` | **Blocked by FILTER-01/REGION-01** | Clearly separated tracker/nuisance profiles with visible source/version, opt-in controls, false-positive corpus, and per-profile rollback. |
| `PRIVACY-01` | **Blocked by stable core** | Audit every permission/content script and actual outbound traffic; inventory stored data; minimize access; update threat model; remediate high-risk findings. |
| `UX-01` | **Blocked by stable settings/filter core** | Accessible simple/expert dashboard with keyboard/screen-reader task completion, visible errors, recovery, and browser regressions. |
| `SETTINGS-01` | **Blocked by CORE-04/RULES-01** | Strict versioned import/export, backup/restore/reset, safe parsing, migration, rollback, and malicious/corrupt fixture coverage. |
| `DIAG-01` | **Blocked by stable filtering pipeline** | Honest MV3 diagnostics for versions, quotas, errors, and browser-supported facts only; never invent universal block counts. |
| `PERF-01` | **Blocked by representative corpus** | Measure no-extension baseline versus product for page load, CPU, memory, startup, battery proxy, rule footprint, and long-lived DOM; record repeated distributions and enforce budgets. |
| `BUILD-01` | **Blocked by UPDATE-01/PERF-01** | Reproducible clean-build hash comparison, pinned toolchain, SBOM, notices, checksums/signing design, release notes, and artifact rollback path. |
| `POLICY-01` | **Blocked by PRIVACY-01/DIAG-01** | Publish owner/legal-approved privacy policy, permissions/limitations disclosure, and support/incident process that match actual data flows. |
| `SEC-01` | **Blocked by PRIVACY-01/BUILD-01/UPDATE-01** | Internal threat, supply-chain, update, content-script, storage, and release review; severity triage; high-priority remediation; exact-commit retest. |
| `RELEASE-01` | **Owner; blocked by all release gates** | Prepare Chrome Web Store assets/disclosures and staged rollout/rollback plan. Submission, account use, payment, and publication require explicit owner approval. |
| `BENCH-01` | **Blocked by feature candidate** | Pin browser, hardware, competitors, versions, and filter configurations; define identical synthetic and privacy-safe representative-site workloads. |
| `BENCH-02` | **Blocked by BENCH-01** | Measure coverage, wanted-content precision, breakage, CPU/memory/load/reliability distributions; repair/retest; publish methods, uncertainty, and omissions without unsupported superiority claims. |
| `OPS-01` | **Blocked by controlled alpha** | Establish consensual feedback, severity triage, update cadence, incident response, regional/list ownership, and time-to-reproduce/repair metrics. |

### Later platform and research work

| ID | Status / dependency | Deliverable and acceptance evidence |
|---|---|---|
| `EDGE-01` | **Future after stable Chrome release** | Edge-specific manifest/package/store/enterprise-policy review and full regression matrix; do not infer support merely because Edge is Chromium-based. |
| `FIREFOX-01` | **Future after stable Chrome release** | Firefox API/manifest adapter, permission model, signing/distribution path, filtering semantics, and independent unit/browser/manual matrix. |
| `SAFARI-01` | **Owner / future feasibility** | Safari content-blocker/extension architecture, signing, App Store policy, privacy, performance, supported syntax, updates, and macOS/iOS matrices with go/no-go ADR. |
| `ANDROID-01` | **Owner / future separate product** | Compare Android browser extension, Private DNS, local VPN, and approved OS mechanisms; document consent, battery, encrypted/same-host limits, app compatibility, store policy, updates, rollback, and device/OS matrix. |
| `IOS-01` | **Owner / future separate product** | Evaluate Safari content blocking and permitted DNS/VPN mechanisms under iOS signing, background, battery, privacy, store, update, and device-version constraints. |
| `DESKTOP-01` | **Owner / future separate product** | Evaluate native desktop DNS/proxy/VPN/content-filter mechanisms for Windows, macOS, and Linux with certificate policy, least privilege, app compatibility, security, updates, rollback, and support cost. |
| `DNS-01` | **Owner / future separate product** | Design an opt-in DNS service/local resolver with domain-level block policy, privacy/retention model, shared-domain false-positive controls, encrypted DNS, availability, updates, rollback, and operations ownership. |
| `NETWORK-01` | **Owner / future feasibility** | Research router, smart-TV, and embedded-device support with hardware/vendor matrices, safe configuration, consent, recovery, updates, DNS limitations, and sustainable support. |
| `VIDEO-01` | **Future after stable core and legal/API review** | Separate network ads, overlays, sponsorship, and server-inserted streams in a version/account/region corpus; protect playback; publish stop conditions; never promise universal removal. |
| `SPONSOR-01` | **Owner / future optional feature** | Review sponsor-segment API/database rights, user consent, accuracy, privacy, controls, attribution, moderation, and policy before any user-controlled integration. |
| `AI-01` | **Research after deterministic baselines** | Evaluate redacted issue triage, fixture generation, rule suggestions, regional-gap discovery, and optional on-device classifiers against human/deterministic baselines. No raw browsing data by default and no autonomous promotion. |
| `BUSINESS-01` | **Owner / future** | For every proposed platform, record audience, value, staffing, infrastructure, legal/security burden, support/incident cost, maintenance ownership, funding model, and explicit go/no-go decision. |

### Mapping to the original 60-step checklist

This queue covers every still-open checklist range; the mapping prevents a future tool from overlooking work or declaring a broad stage complete from one PR.

| Checklist item(s) | Handoff task(s) |
|---|---|
| 004–006 | `GOV-01` |
| 007–010 | `GOV-02` |
| 024 | `QA-01`, `TEST-07`, `TEST-09`, `TEST-11`, `TEST-12` |
| 025 | `ALPHA-01`, `TEST-24` |
| 026 | `DATA-01` |
| 027–028 | `COMP-01`, `TEST-15`, `TEST-17` |
| 029 | `FILTER-01` |
| 030 | `COSMETIC-01`, `TEST-20` |
| 031 | `REGION-01`, `TEST-19` |
| 032 | `RULES-01` |
| 033 | `PICKER-01` |
| 034 | `UPDATE-01`, `TEST-18` |
| 035 | `REPORT-01` |
| 036 | `PROFILE-01` |
| 037 | `PRIVACY-01`, `TEST-09`–`TEST-11` |
| 038 | `UX-01`, `TEST-12`, `TEST-13` |
| 039 | `SETTINGS-01`, `CORE-04` |
| 040 | `DIAG-01` |
| 041 | `PERF-01`, `TEST-21`, `TEST-22` |
| 042 | `BUILD-01`, `TEST-23`, `TEST-24` |
| 043 | `POLICY-01` |
| 044 | `SEC-01` |
| 045 | `RELEASE-01`, `TEST-25` |
| 046–051 | `BENCH-01`, `BENCH-02`, `COVERAGE-01`, `TEST-14`, `TEST-26` |
| 050 and 052 | `OPS-01` |
| 053–054 | `EDGE-01`, `FIREFOX-01`, `SAFARI-01`, `TEST-28` |
| 055–056 | `VIDEO-01`, `SPONSOR-01`, `TEST-27` |
| 057–060 | `ANDROID-01`, `IOS-01`, `DESKTOP-01`, `DNS-01`, `NETWORK-01`, `BUSINESS-01`, `TEST-28` |

Every task record must name an accountable role, issue/PR, state, dependencies, baseline SHA, files in scope, acceptance criteria, test groups, privacy/security/license effects, rollback/recovery, exact-head CI, known gaps, and next eligible task. “AI” or “the community” is not an accountable owner.

### Recommended work for the next coding tool

Finish remaining CORE-03 failure/restart cases unless the maintainer assigns a different unblocked task. CORE-01 and CORE-02 are implemented. The useful synchronization approach from PR #20 has attribution and current regressions; do not merge that old mixed-scope PR wholesale or execute anything in `AnalyseFuture/`.

After `CORE-01`, the safe reliability order is:

```text
CORE-01 -> CORE-02 -> CORE-03 -> CORE-04 -> QA-01 -> ALPHA-01
```

Governance can proceed in parallel with owner participation, but external filter data/compiler work must wait for `GOV-01`, `GOV-02`, and `DATA-01`.

## Continuation and review contract

Assign one accountable owner to one unblocked task. Record the baseline SHA, issue, files, acceptance criteria, tests, security/privacy/license effects, rollback, and next task. Preserve a reproducing regression, then change the smallest working boundary.

Run frozen installation, lockfile diff, `npm run check`, `npm run audit:repository`, build, source/package comparison, and relevant real Chromium tests. Inspect CI for the final pushed SHA. A new push invalidates earlier run evidence. Check every permission, dependency, endpoint, data source, and license change. Store publication, product license, external source/data integration, spending, and account-level access changes require owner decisions.

Maintain task states as COMPLETED / IN PROGRESS / BLOCKED / NOT STARTED / DEFERRED; do not mark a feature done from documentation alone. Update the feature ledger and checklist in the same completed change. Leave history dated.

Monitoring requires an active session and a PR URL/number when PR work is requested. Results belong in commits, tests, CI, and the PR conversation so a new session can continue. No background watcher is implied after the session ends.
