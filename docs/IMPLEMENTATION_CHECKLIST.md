# Master implementation checklist — strictly ordered

**Updated:** 15 Nov 2026 (Asia/Kolkata). **Target:** compete credibly with leading ad blockers through measurable, privacy-first reliability.

**Status key:** [x] = documentation or source artifact present; [ ] = still pending/requires verification. The presence of source code is **not** a claim that it passed Chromium tests. See [FEATURE_MATRIX](FEATURE_MATRIX.md). Do not skip licensing/security gates before shipping.

## Stage 0 — project governance, ownership and requirements

- [x] **001** Create the GitHub repository and document the mission for newcomers.
- [x] **002** Document comprehensive product requirements, competitor set, architecture and risks.
- [x] **003** Add AGENTS.md, CODEX workflow, contribution templates, vulnerability policy.
- [ ] **004** Choose the product's project-wide source license and contributor terms with the owner.
- [ ] **005** Decide intended distribution model (proprietary binary, source-available or open source) and brand.
- [ ] **006** Finalize trademark/name and Chrome Web Store account strategy.
- [ ] **007** Perform pinned-commit audit of candidate foundations (Very Good AdBlock, Unblock, minimal original code).
- [ ] **008** Audit/filter licenses, file-level notices, dependency tree, maintenance and vulnerabilities.
- [ ] **009** Benchmark chosen code against proven alternatives before importing large upstream implementations.
- [ ] **010** Record architecture ADR approving one runtime and a clear attribution/distribution policy.

## Stage 1 — working Chrome MV3 foundation (P0)

- [x] **011** Add an original minimal Chrome Manifest V3, popup/options pages, bundled rules and background worker.
- [x] **012** Add a small offline starter DNR blocklist (includes a reserved `.test` fixture).
- [x] **013** Add ruleset enable/disable from persistent local settings.
- [x] **014** Add domain validation and persistent per-site exceptions with DNR allowAllRequests.
- [x] **015** Add basic cosmetic CSS hiding and persistent on/off behavior.
- [x] **016** Add a functional, accessible-first popup and options control wiring.
- [x] **017** Add Node-native unit/structural tests and build script, without downloading dependencies.
- [x] **018** Add GitHub Actions validation workflow and packaged-build artifact creation.
- [x] **019** Run automated CI successfully on the exact merged commit; fix any failing tests. **Evidence:** [GitHub Actions run 43469964379](https://github.com/rejoansardar23/ad-blocker/actions/runs/43469964379) on commit `4a069f6638fd801e091cddf270ebadb8b65abf55` (unit tests, structural checks, build and artifact upload passed).
- [x] **020** Load packaged output in real Chromium and inspect the manifest permission set (`declarativeNetRequest`, `storage`, `activeTab`; HTTP(S) cosmetic content scripts). Verified in headless Chromium 158.0.8127.18; manual store/install review remains in 024–025.
- [x] **021** Confirm blocked and allowed network requests with a controlled synthetic website.
- [x] **022** Test global pause/resume, per-site exceptions, reload and Chrome restart.
- [x] **023** Verify cosmetic hiding and legitimate UI on multiple fixture pages.
- [ ] **024** Run accessibility, permission and security reviews and fix blockers.
- [ ] **025** Create a developer-installable alpha ZIP with tested install instructions.

**Browser evidence for 020–023:** upstream [PR #3](https://github.com/rejoansardar23/ad-blocker/pull/3) and [PR #4](https://github.com/rejoansardar23/ad-blocker/pull/4), supplemented by the fork's [combined CI run 43647171852](https://github.com/renoukhan39-bit/ad-blocker/actions/runs/43647171852): `npm ci`, 14 Node tests, build, 10 Chromium fixture cases. Includes exact blocking failures/server counts, trusted subdomains and unrelated-domain rejection, pause/exception persistence across restarts, and preservation of page-owned content. Node v22.23.4, Playwright 1.65.0, Chromium 158.0.8127.18. [Post-merge CI for PR #1](https://github.com/renoukhan39-bit/ad-blocker/actions/runs/43647078763) passed on `85e761b4f9bc15de88cacb37816ba9527abb2bde`. No real-site breadth, full accessibility/security audit, or alpha ZIP is claimed.

**Stage 1 evidence gate:** all of 019–025 pass, with browser version, commands, failure logs and manual verification captured. Do **not** describe the extension as a finished competitor before this gate.

## Stage 2 — mature filtering and tracking protection (P1)

- [ ] **026** Audit and select legally usable maintained filter datasets with attribution.
- [ ] **027** Build or integrate a compatible list-to-DNR compiler and unsupported-syntax report.
- [ ] **028** Add filter-list deduplication, priority resolution and static/dynamic quota management.
- [ ] **029** Add baseline tracker protection and test third-party/first-party handling.
- [ ] **030** Add site-safe cosmetic filters and dynamic content regression tests.
- [ ] **031** Add region/language packs with per-list provenance and opt-in controls.
- [ ] **032** Add user-defined blocking/allow rules with preview, validation and undo.
- [ ] **033** Add an element picker; verify it never silently removes unrelated content.
- [ ] **034** Add safe filter data updates with provenance, rollback and offline resilience.
- [ ] **035** Add a website breakage-report flow that does not transmit browsing history automatically.

## Stage 3 — privacy, UI and engineering maturity (P1)

- [ ] **036** Define optional protection profiles for trackers and nuisance/cookie banners.
- [ ] **037** Review every content script/permission and test no unapproved network telemetry.
- [ ] **038** Build an advanced accessible settings dashboard with error recovery.
- [ ] **039** Add validated settings import/export, reset and schema migration.
- [ ] **040** Add accurate MV3-compatible diagnostics, no invented block counts.
- [ ] **041** Optimize UI, CPU, memory, list footprint and long-lived DOM performance.
- [ ] **042** Add release notes, checksums, reproducible CI builds and dependency/license audits.
- [ ] **043** Publish an accurate privacy policy, limitations page and support procedures.
- [ ] **044** Conduct internal security review and remediate high-priority issues.
- [ ] **045** Complete an approval-gated Chrome Web Store submission.

## Stage 4 — measurable competition (P1/P2)

- [ ] **046** Establish dated baseline extensions/versions and pinned filter configurations.
- [ ] **047** Create synthetic plus representative real-site benchmark methodology.
- [ ] **048** Measure coverage, false positives, breakage, speed, memory and reliability.
- [ ] **049** Fix regressions and retest against AdGuard, uBlock Origin Lite and Ghostery.
- [ ] **050** Collect consensual user feedback and prioritize proven differentiators.
- [ ] **051** Publish reproducible results rather than unverified “number one” claims.
- [ ] **052** Establish ongoing issue triage, list updates and release maintenance ownership.

## Stage 5 — platform expansion (P2, separate approval)

- [ ] **053** Evaluate and implement Microsoft Edge packaging and tests.
- [ ] **054** Evaluate Firefox-specific filtering capabilities and separate browser tests.
- [ ] **055** Study media/video-site best-effort handling with realistic limitations.
- [ ] **056** Evaluate optional SponsorBlock-like workflows only after license/API audit.
- [ ] **057** Design a *separate* desktop ad-blocking product if feasible and approved.
- [ ] **058** Design a *separate* DNS protection product if feasible and approved.
- [ ] **059** Study mobile platform constraints and privacy requirements.
- [ ] **060** Review business models and ongoing operating costs before broad launch.

## Immediate next actions

1. Follow [the dependency queue](PR_EXECUTION_QUEUE.md) and finish the pinned reuse/license audit without importing unapproved sources.
2. Obtain the owner's distribution/license choice before closing Stage 0 gates.
3. Complete settings consistency and MV3 security regressions, including concurrent writes, API failure recovery, and worker suspension.
4. Preserve `npm ci` and full Chromium validation on every behavior change.
5. Complete accessibility, manual installation and alpha packaging before closing 024–025.

**Important:** This remains a small starter blocker, not full AdGuard/uBlock parity, comprehensive tracker filtering, or guaranteed video ad removal.


## Verification addendum — live settings consistency (15 Nov 2026)

- The **60 original items retain their existing completion states**. The exact merged baseline [CI run 43724956889](https://github.com/rejoansardar23/ad-blocker/actions/runs/43724956889) has 14/14 Node tests, 10/10 synthetic Chromium cases, an unpacked build and a passing high-severity dependency audit.
- [Draft PR #20](https://github.com/rejoansardar23/ad-blocker/pull/20) adds cross-view popup/options synchronization and negative/pending-save regressions for issue #5. [PR CI run 43728775822](https://github.com/rejoansardar23/ad-blocker/actions/runs/43728775822) passed 20/20 Node tests and 10/10 Chromium cases on the first implementation commit. **Do not mark checklist 024 or 038 complete yet.**
- [Detailed audit of all 18 pinned candidates and exactly two selected primary study repositories](TWO_PRIMARY_REPOS_EVALUATION.md). Source/license study does **not** close 004–010: owner choice, transitive audits, comparative builds, measured benchmarks and approval are still pending.
- Next P0: review and merge #20 after final branch CI; reproduce background DNR storage/API failure disagreement and concurrent allowlist writes before proposing a targeted fix; then manual Chrome popup/accessibility/security audit.
