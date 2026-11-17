# Ad Blocker — Chrome MV3 development preview

An original, local-first Chrome extension with a small bundled DNR ruleset, global pause, trusted websites, reversible cosmetic hiding, popup/options controls, and settings recovery.

Start with [HANDOFF.md](HANDOFF.md) for current tasks, recovery findings, and the next implementation. See [features](docs/product/FEATURE_MATRIX.md) for proven capabilities and [testing evidence](docs/testing/TEST_EVIDENCE.md) for exact commands and limitations.

## Run

Requires Node.js 22+ and a browser that permits developer-loaded extensions.

```bash
npm ci --no-audit --no-fund
npm run check
npm run build
```

Load `dist/chrome` through **chrome://extensions → Developer mode → Load unpacked**. For the automated browser fixtures:

```bash
npx playwright install chromium
npm run test:e2e
```

In this cloud machine use `npm ci --cache /workspace/.cache/npm --no-audit --no-fund` and set `PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright` for browser installation and execution. The current machine passed local Chromium tests; older machines' policy blocks are recorded as dated evidence.

## Recover historical implementation files

The repository retains Git history and a recovery branch. Compare earlier implementation files with the current tree **without deleting or replacing anything**:

```bash
node scripts/recover-history.mjs compare recovery/pre-mission-ce77ac5
node scripts/recover-history.mjs compare 6191c3c0e011c7533db7866a991e7336a85f69c6 src
```

To recover the exact bytes of a particular historical file or an entire historical folder into the ignored staging area:

```bash
node scripts/recover-history.mjs stage recovery/pre-mission-ce77ac5 src/extension/manifest.json
node scripts/recover-history.mjs stage-prefix recovery/pre-mission-ce77ac5 AnalyseFuture/ImportedUpstream/projects
```

Recovered files appear under `build/recovery/<commit>/`. They are **not executed, installed, automatically integrated, or written over the current source tree**. Compare their behavior, source history, dependencies, and applicable license obligations before applying a selected restoration as a reviewed code change. See `tests/unit/recovery-history.test.mjs` for recovery safety regressions.

## Current scope

The extension has four sample DNR rules and three narrow cosmetic selector families. It supports persistent pause/resume, up to 100 trusted DNS hostnames with subdomain inheritance, malformed-setting repair, and confirmed reset. Controlled real Chromium fixtures verify blocking, benign controls, trust boundaries, cosmetics, persistence, and recovery.

Broad real-site coverage, actual Stable-browser toolbar accessibility, performance, formal privacy traffic capture, production lists/compiler, safe updates/rollback, custom rules, and release readiness remain open. No universal ad, app, or YouTube-blocking guarantee is made. Native app/device-wide filtering needs separate products.

## Repository and contribution guide

| Read | Purpose |
|---|---|
| [HANDOFF](HANDOFF.md) | Current mission state, complete task queue, test gaps, and continuation |
| [PROJECT_STRUCTURE](PROJECT_STRUCTURE.md) | Functional folder and file placement |
| [Architecture](docs/architecture/ARCHITECTURE.md) | Runtime modules and invariants |
| [Checklist](docs/product/IMPLEMENTATION_CHECKLIST.md) | Preserved 60-item program |
| [AGENTS](AGENTS.md) / [CONTRIBUTING](CONTRIBUTING.md) | Agent/contributor rules |
| [Testing](docs/testing/TESTING.md) | Grouped commands and required evidence |
| [Integrity audit](docs/security/REPOSITORY_INTEGRITY_AUDIT.md) | Investigated disruption, evidence, and owner actions |
| [Repository inventory](docs/audit/REPOSITORY_AUDIT.md) | Reproduce every tracked file's classification/hash/dependencies |
| [Project idea](PROJECT_IDEA.txt) | Detailed long-term charter and bounded AI research |
| [SECURITY](SECURITY.md) | Private vulnerability reporting |

Run `npm run audit:repository` for JSON/CSV reports under ignored `build/audit/`; GitHub Actions saves them as artifacts. Root verification checks active resource boundaries and documentation links.

Imported Ghostery/uBlock material under [AnalyseFuture](AnalyseFuture/README.txt) remains isolated. No upstream engine is integrated into the active runtime. Recorded hashes prove preservation, while upstream revisions and code/data licenses still need review. The remote `recovery/pre-mission-ce77ac5` branch preserves removed redundant docs and the entire pre-mission tree.

The project-wide distribution license and contributor terms remain owner decisions. Public source availability does not approve third-party code/filter redistribution or store publication. Historical fork contributions and research provenance remain in [the dated archive](docs/history/MASTER_PROJECT_HANDOFF.md).
