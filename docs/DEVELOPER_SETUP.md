# Developer setup and first implementation task

**Important:** The repository currently contains only documentation. There is no package.json, manifest.json, installable extension, npm dependency tree or test runner. Do not assume setup commands exist.

## Current setup

1. Clone: https://github.com/rejoansardar23/ad-blocker
2. Read [START_HERE.md](START_HERE.md), [ARCHITECTURE.md](ARCHITECTURE.md), [REUSE_AND_LICENSES.md](REUSE_AND_LICENSES.md) and [DECISIONS.md](DECISIONS.md).
3. Open an issue for a scoped research/engineering task. Avoid committing copied project code before license/distribution review.
4. Use a branch for changes; submit a PR with evidence according to [CONTRIBUTING.md](../CONTRIBUTING.md).

## First engineering bootstrap (proposed)

- Decide candidate baseline and verify licenses, bundle dependencies and build reproducibility.
- Add toolchain versions (Node.js, package manager) and lockfile.
- Create valid MV3 manifest, DNR JSON and a minimal popup tied to real settings.
- Add a synthetic two-resource fixture proving block and allow behavior.
- Add automated checks and CI for supported build/test paths.
- Add exact commands here for installing packages, building, testing and loading unpacked extension.
- Verify Chrome permissions, service worker lifecycle, and restart/allowlist behavior.
- Mark features as implemented **only** after passing tests.

## Required onboarding quality

A new contributor should be able to:
- identify actual shipped code vs aspirational features;
- install pinned dependencies using one documented command;
- run checks and understand failures;
- load the built extension in Chromium/Chrome with no missing files;
- reproduce a known blocked request;
- see license and security policies;
- find a small open issue with acceptance criteria.

Do not describe the product as ready for use until the above steps are demonstrably true.

## Common misconceptions

- A public GitHub repo is not permission to reuse third-party code.
- An MIT licensed starting project may include assets/data/dependencies governed by other terms.
- “Chrome + Firefox” in a project's README is not proof of tested portability.
- Browser MV3 cannot guarantee all video ads or entire-device ad blocking.
- A nice popup without real DNR rules is only a UI prototype.
