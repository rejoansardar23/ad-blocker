# Coding agent instructions (Codex Cloud / GPT-6 Astra)

**Permanent cross-chat handoff:** Read [MASTER_PROJECT_HANDOFF](docs/history/MASTER_PROJECT_HANDOFF.md) and [RESEARCH_AND_CHAT_HISTORY_ARCHIVE](docs/history/RESEARCH_AND_CHAT_HISTORY_ARCHIVE.md) before continuing an existing project task. These are dated records: verify live main/PR/issue/CI state before relying on snapshots. For a reusable new-chat request, see [NEXT_CHAT_START.txt](docs/history/NEXT_CHAT_START.txt). Never pretend unavailable chats were exported verbatim.

**Read first:** [README](README.md), [START_HERE](docs/development/START_HERE.md), [IMPLEMENTATION_CHECKLIST](docs/product/IMPLEMENTATION_CHECKLIST.md), [ARCHITECTURE](docs/architecture/ARCHITECTURE.md), [DECISIONS](docs/governance/DECISIONS.md).

This repo contains a **minimal original Chrome MV3 implementation**, Node check/build scripts, unit tests and a comprehensive aspirational roadmap. It has passed synthetic Chromium fixture tests; it is **not** a finished or broadly browser-validated product. Inspect repository state before claiming a feature exists.

## Your mission

Build a market-competitive, independently branded, privacy-first ad blocker starting with Chrome. Optimize for blocking accuracy, low breakage, minimum permissions, performance, reliable updates and trustworthy tests. Avoid wasting credits building or integrating what working code already provides.

## Rules you must follow

1. **Inspect before coding.** Read actual source, docs, test outputs and current branch; never assume a feature is complete from its README.
2. **Run available checks immediately:** `npm run check`, `npm run build`. Report exact results, errors and environment. No `npm install` is needed for present scripts.
3. **Do real browser tests:** load `dist/chrome` in Chromium/Chrome, prove sample DNR blocking/allow, site exceptions, pause/restart, popup/options, cosmetic CSS. If browser testing is unavailable, say so and document manual work.
4. **Maintain documented status:** update [FEATURE_MATRIX](docs/product/FEATURE_MATRIX.md) and [IMPLEMENTATION_CHECKLIST](docs/product/IMPLEMENTATION_CHECKLIST.md) only with evidence. UI/code presence is not Chrome test success.
5. **License before import:** the repo is public but unlicensed as a whole; product/distribution rights require owner decision. Do not copy GPL-covered source into an intended proprietary distribution, and audit independent filter-list data licenses.
6. **Review reuse:** compare keep/integrate/adapt/build/defer/reject options before major functionality. Pin upstream commit/version, license and security/maintenance status. Avoid overlapping engines without measured benefit.
7. **Privacy and security:** no remote executable JS, telemetry, browsing history logs, token commits, unapproved external services, excessive permissions, or silent spending.
8. **Scope discipline:** small PRs, reproducible commands, regression tests, and verifiable acceptance criteria. Do not migrate frameworks or redesign UI just to create activity.
9. **No exaggerated claims:** no fake block counts, 100% video ad blocking, superiority rankings or production readiness without proof.
10. **No unapproved publishing:** don't submit to extension stores, pay fees, change repo visibility, distribute binaries as final, or deploy services without maintainer approval.

## Main technical files

- `src/extension/manifest.json`: Chrome MV3 config.
- `src/extension/rules/starter.json`: limited static DNR blocked domains.
- `src/extension/background/service-worker.js`: enabled flag, domain exceptions, dynamic allowAllRequests.
- `src/extension/shared/domain.js`: site validation/matching.
- `src/extension/content/cosmetic.js`: narrow CSS hiding.
- `src/extension/popup/` and `src/extension/options/`: working-control code, pending real-browser validation.
- `scripts/` and `tests/`: verification and build.
- `.github/workflows/checks.yml`: automatic CI.

## Next engineering tasks

The initial Chromium baseline and rule/cosmetic safety changes are merged as upstream PRs #3 and #4 (and independently tested fork PRs #1/#2). Read [the execution queue](docs/development/PR_EXECUTION_QUEUE.md) and current feature evidence before choosing work. Run `npm ci` and the complete `npm run test:e2e` suite in a browser-capable environment in addition to the dependency-free Node checks. Some cloud environments block browser sockets or npm downloads; use the exact CI logs when local runs are unavailable, and clearly distinguish those results from local validation.

Finish the phase-0 licensing/foundation audit before importing third-party filtering engines or lists. Settings consistency and security maintenance are independently eligible after the merged foundation; do not mark all security/accessibility gates done from unit tests alone.

## Done criteria

Every completed feature needs merged source, reproducible build/test evidence, verified Chrome behavior where relevant, security/license review and updated docs. Report limitations and next smallest improvement. See [Codex workflow](docs/development/CODEX_WORKFLOW.md).
