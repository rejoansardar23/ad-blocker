# Contributing to Ad Blocker

Thank you for helping build a competitive, privacy-first ad blocker. This repository currently contains **planning documentation**, not a working extension. Before coding, read [START HERE](docs/START_HERE.md), [Vision](docs/VISION.md), [Roadmap](docs/ROADMAP.md), and [AGENTS.md](AGENTS.md).

## Before contributing

1. Check existing issues, the [feature matrix](docs/FEATURE_MATRIX.md) and [research backlog](docs/RESEARCH_BACKLOG.md).
2. Open an issue describing the problem, expected behavior, alternatives and acceptance criteria.
3. For a proposed library, filter list or code reuse, include its upstream URL, pinned version/commit, license, data license, dependencies, maintenance status, security risks and why reusing it is preferable.
4. Wait for a maintainer decision on **code licensing and contribution terms** before submitting substantive code. The repository has no project-wide license yet; public visibility is not permission to redistribute others' work.

Documentation fixes and factual research with sources are appropriate early contributions.

## Pull requests

- Work in a dedicated branch. Keep changes small and focused.
- Describe why the change matters, how it was tested, any privacy/permissions effects and any third-party notices.
- Update related docs and acceptance criteria; do not mark planned features as implemented without test evidence.
- Never add private information, leaked lists, copyrighted content without rights, telemetry or bundled third-party source without review.
- Use the pull request template; maintainers may request a design or licensing review before merge.

## Review quality bar

Every user-visible behavior needs an acceptance test or clear manual verification plan. Ensure unchanged behavior stays tested. For browser extension changes, test Chrome MV3 behavior, rule budgets, site exceptions and restart persistence where relevant. Benchmark claims require methodology and saved results.

## Code of conduct

Be constructive, specific and respectful. Review ideas rather than individuals. Don't harass contributors or expose private browsing details. Flag security problems privately as described in [SECURITY.md](SECURITY.md).

## First contributions

Useful first tasks: clarify documentation, verify third-party project licenses, reproduce upstream build instructions, establish initial extension scaffolding, create local synthetic test pages, or design performance/compatibility test cases. Don't promise a feature is complete based only on a README.
