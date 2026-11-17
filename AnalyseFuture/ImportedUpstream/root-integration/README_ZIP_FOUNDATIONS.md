# Ad Blocker — ZIP-based foundations

This repository organizes the two supplied ZIP projects as separate codebases. **Integration is deferred.** Existing extension code is preserved; the previous planning and AI handoff documents have been removed. The worldwide ad-blocking direction is described in the [product plan](docs/ADBLOCK_PRODUCT_PLAN.md).

**Current capability:** extracted ad-blocking source code, a tested ZIP-derived Node filtering engine, and a small Chrome MV3 preview. Broad worldwide blocking coverage remains a development goal.

## Project structure

```text
projects/
  ghostery-adblocker/       # extracted adblocker-master.zip; MPL-2.0
  ublock-origin/            # extracted uBlock-master.zip; GPL-3.0-or-later
  snapshots.json           # input ZIP hashes and SHA-256 of every source file
background/                # preserved original preview service worker
content/                   # preserved original preview cosmetic filtering
shared/                    # preserved original preview domain utilities
popup/                     # preserved original preview toolbar interface
options/                   # preserved original preview settings interface
rules/                     # preserved original preview starter DNR rules
manifest.json              # original preview Chrome MV3 manifest
scripts/
  verify.mjs               # original preview validation
  build.mjs                # original preview packaging
  verify-snapshots.mjs      # verifies both extractions against the ZIP inventory
  build-ublock-node.mjs     # builds the ZIP's Node engine, fixes a missing copy
tests/
  *.test.mjs               # original preview unit tests
  chromium-smoke.mjs       # original preview Chromium integration suite
  upstream/ublock.test.mjs # ZIP-derived engine functional test
docs/ADBLOCK_PRODUCT_PLAN.md # current product direction and delivery gates
.github/workflows/          # existing preview CI
package.json               # development commands; no merged filtering engines
package-lock.json          # preserved pinned preview test dependencies
build/ublock-node/          # generated ZIP-derived engine (ignored)
dist/chrome/               # generated original preview extension (ignored)
```

The Ghostery project contains **321 files**, and uBlock contains **1,063 files**. Every extracted file was checked byte-for-byte using SHA-256. The two redundant ZIP copies were removed after extraction. Git history retains the original archives. Snapshot hashes identify the supplied files; their precise upstream Git commits are unknown.

Upstream source layouts, licenses, notices, tests, and build configuration are preserved. Files with identical contents at different required paths—including license notices—remain in place so imports and packaging do not break. They are not separate engines to run together. Nested upstream workflows are retained as source material; GitHub only discovers this repository's root `.github/workflows`.

## Verify and develop

Requires Node.js 22+; the uBlock Node build also requires Bash. Validated here with Node.js 24.22.1.

```bash
cd /workspace/ad-blocker  # or your local checkout
npm run verify:archives
npm run test:ublock
npm run check
npm run build
```

The first two commands need no npm installation. `test:ublock` builds the archive's Node engine and checks blocking, an explicit allow exception, and a benign control using synthetic filters and a synthetic public-suffix list. It does not validate a browser or full production filter coverage. The build adapter copies `src/js/publicsuffix.js` from the same ZIP into the generated package because the archived build script omits it. It also declares the generated package as an ES module; upstream sources remain unchanged.

`check` runs the original preview's 14 unit tests and structural checks. `build` packages that original preview into `dist/chrome`. The extracted upstream projects have separate build systems; neither engine has been merged into the preview. To load the preview, select `dist/chrome` using Chrome's **Load unpacked** control in developer mode.

For the original preview's browser tests:

```bash
npm ci --cache /workspace/.cache/npm --no-audit --no-fund
PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npx --no-install playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e
```

The workspace-specific cache locations above avoid an unavailable home cache. Local development can use normal npm and Playwright defaults instead, provided installation and testing use the same browser cache.

## ZIP project build status

| Component | Local result | Remaining work |
|---|---|---|
| Both ZIP extractions | 1,384 file hashes verified | Integration deliberately deferred |
| uBlock Node engine | Built; block/exception/control test passed | Production datasets and browser behavior not tested |
| Original preview | 14 unit tests and packaging passed | Browser download blocked by network policy |
| uBlock Lite Chrome MV3 | Build attempted; failed | ZIP omits CodeMirror and serializer submodule contents; the normal build also downloads external filter lists |
| Ghostery workspace | Yarn 4.18.0 obtained; initial dependency fetch failed; proxy-adjusted retry interrupted when scope changed | Complete dependency installation before claiming its build or tests work |

uBlock's upstream MV3 instructions are in [its README](projects/ublock-origin/platform/mv3/README.md). Running `make mv3-chromium` from its project directory currently fails at the missing CodeMirror submodule. The ZIP's `.gitmodules` records dependency URLs but does not provide their pinned Git commits; do not silently replace these with arbitrary current versions.

Ghostery retains its Yarn workspace and lockfile. Its documented workflow is `yarn install --immutable`, `yarn build`, and `yarn test` from `projects/ghostery-adblocker`, using the `packageManager` version in its manifest. Verify the selected adapter's browser API requirements before integration into a Chrome MV3 extension.

## Licenses and next direction

Retain [Ghostery's MPL-2.0 license](projects/ghostery-adblocker/LICENSE) and [uBlock's GPL license](projects/ublock-origin/LICENSE.txt), along with their file-level and bundled dependency notices. Extraction does not change these terms or grant ownership of upstream work. The original preview has no project-wide license selected.

The [ad-blocking product plan](docs/ADBLOCK_PRODUCT_PLAN.md) is the single new planning document. It describes the roles of the supplied projects, worldwide coverage, testing, updates, and delivery gates. No other filtering engine has been added, and neither extracted engine has been merged into the preview.
