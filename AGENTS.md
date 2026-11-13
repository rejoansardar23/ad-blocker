# Coding agent instructions (Codex Cloud / GPT-6 Astra)

**Read first:** [README](README.md), [START_HERE](docs/START_HERE.md), [IMPLEMENTATION_CHECKLIST](docs/IMPLEMENTATION_CHECKLIST.md), [ARCHITECTURE](docs/ARCHITECTURE.md), [DECISIONS](docs/DECISIONS.md).

This repo contains a **minimal original Chrome MV3 implementation**, Node check/build scripts, unit tests and a comprehensive aspirational roadmap. It is **not** a finished, Chrome-browser-validated product. Inspect repository state before claiming a feature exists.

## Your mission

Build a market-competitive, independently branded, privacy-first ad blocker starting with Chrome. Optimize for blocking accuracy, low breakage, minimum permissions, performance, reliable updates and trustworthy tests. Avoid wasting credits building or integrating what working code already provides.

## Rules you must follow

1. **Inspect before coding.** Read actual source, docs, test outputs and current branch; never assume a feature is complete from its README.
2. **Run available checks immediately:** `npm run check`, `npm run build`. Report exact results, errors and environment. No `npm install` is needed for present scripts.
3. **Do real browser tests:** load `dist/chrome` in Chromium/Chrome, prove sample DNR blocking/allow, site exceptions, pause/restart, popup/options, cosmetic CSS. If browser testing is unavailable, say so and document manual work.
4. **Maintain documented status:** update [FEATURE_MATRIX](docs/FEATURE_MATRIX.md) and [IMPLEMENTATION_CHECKLIST](docs/IMPLEMENTATION_CHECKLIST.md) only with evidence. UI/code presence is not Chrome test success.
5. **License before import:** the repo is public but unlicensed as a whole; product/distribution rights require owner decision. Do not copy GPL-covered source into an intended proprietary distribution, and audit independent filter-list data licenses.
6. **Review reuse:** compare keep/integrate/adapt/build/defer/reject options before major functionality. Pin upstream commit/version, license and security/maintenance status. Avoid overlapping engines without measured benefit.
7. **Privacy and security:** no remote executable JS, telemetry, browsing history logs, token commits, unapproved external services, excessive permissions, or silent spending.
8. **Scope discipline:** small PRs, reproducible commands, regression tests, and verifiable acceptance criteria. Do not migrate frameworks or redesign UI just to create activity.
9. **No exaggerated claims:** no fake block counts, 100% video ad blocking, superiority rankings or production readiness without proof.
10. **No unapproved publishing:** don't submit to extension stores, pay fees, change repo visibility, distribute binaries as final, or deploy services without maintainer approval.

## Main technical files

- `manifest.json`: Chrome MV3 config.
- `rules/starter.json`: limited static DNR blocked domains.
- `background/service-worker.js`: enabled flag, domain exceptions, dynamic allowAllRequests.
- `shared/domain.js`: site validation/matching.
- `content/cosmetic.js`: narrow CSS hiding.
- `popup/` and `options/`: working-control code, pending real-browser validation.
- `scripts/` and `tests/`: verification and build.
- `.github/workflows/checks.yml`: automatic CI.

## Exact first engineering task

Validate this first commit's code, fix any failures, and add **a genuine Chromium integration test** of the packaged extension. Include failed and passing test evidence. Make sure trusted-site exception priority works on Chrome navigation/reload, and global pause affects both network filtering and CSS.

Then finish the phase-0 licensing/foundation audit before importing third-party filtering engines or lists.

## Done criteria

Every completed feature needs merged source, reproducible build/test evidence, verified Chrome behavior where relevant, security/license review and updated docs. Report limitations and next smallest improvement. See [Codex workflow](docs/CODEX_WORKFLOW.md).
