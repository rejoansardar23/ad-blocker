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
