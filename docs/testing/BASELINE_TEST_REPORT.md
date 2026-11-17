# Pre-mission baseline

Recorded 18 November 2026 (Asia/Kolkata). Active source tested: `ce77ac5eb212ca6388e4cd733beb6c9ee8cee49f`. No production files were moved or changed before these runs. The working tree contained only new, untracked audit tooling during the browser run.

## Reproduction and results

Environment: Linux, Node 24.22.1, npm 11.9.0, Playwright 1.65.0, bundled Chromium 158.0.8127.18. The new machine permits official browser downloads and unpacked extension loading. Earlier machines' HTTP 403/policy blocks do not apply to this run.

| Group | Command | Result |
|---|---|---|
| Frozen installation | `npm ci --cache /workspace/.cache/npm --no-audit --no-fund` | PASS, two locked packages |
| Lockfile | `git diff --exit-code -- package-lock.json` | PASS, unchanged |
| Structure/unit | `npm run check` | PASS, 18 tests, 0 failed/skipped |
| Package | `npm run build` and `diff -qr src/extension dist/chrome` | PASS, 11 source/package files match |
| Browser installation | `PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npx --no-install playwright install chromium` | PASS |
| Chromium | `PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e` | PASS, ten scenarios, ad/control server counts 5/10 |
| Dependencies | `npm audit --cache /workspace/.cache/npm --audit-level=high` | PASS, 0 reported vulnerabilities |
| SBOM | `npm sbom --sbom-format cyclonedx` | PASS, generated under ignored `build/` |
| Exact baseline CI | [Run 44049261704](https://github.com/rejoansardar23/ad-blocker/actions/runs/44049261704) | SUCCESS |

The two invalid-input error logs in the unit suite are expected negative assertions.

## Feature matrix before changes

| Feature | Baseline | Evidence / limit |
|---|---|---|
| Extension and worker startup | PASS | Actual Chromium service worker and options load |
| Network blocking / legitimate controls | PASS | Explicit blocked-client error and server request counts |
| Global pause/resume | PASS | Network and cosmetic behavior, including restart |
| Trusted sites/subdomains/lookalikes | PASS | Exact trust, inheritance, unrelated rejection, removal, restart |
| Cosmetics/page-owned content | PASS | Owned style, reversible hide, legitimate content preserved |
| Options/reset | PASS | Actual controls and reset in Chromium; Node confirmation/cancel |
| Popup | PASS for Node save/recovery; NOT TESTED for toolbar | Browser suite does not yet open popup view |
| Cross-view synchronization | FAIL by source inspection | No UI storage listener; reproduced by new regression before fix |
| Concurrent mutation/failure convergence | NOT TESTED | Separate reliability work remains |
| Manual Stable/accessibility/performance | NOT TESTED | No invented device, assistive technology, or benchmark results |

Recovery source: remote `recovery/pre-mission-ce77ac5`, full SHA above. A verified local Git bundle was also created at `/tmp/ad-blocker-pre-mission.bundle`; the remote reference is durable across machine loss. Never force-reset shared main to recover a change; make a targeted revert commit after checking subsequent work.
