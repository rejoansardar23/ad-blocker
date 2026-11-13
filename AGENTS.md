# Instructions for Codex Cloud and other coding agents

Read [README.md](README.md), [docs/START_HERE.md](docs/START_HERE.md), and [docs/DECISIONS.md](docs/DECISIONS.md) before changing files. This repository is an early-stage *documented plan*, not a completed application. Treat plans and vendor README claims as hypotheses to verify.

## Mission and constraints

- Build a market-competitive, privacy-first ad blocker starting with Chrome Manifest V3.
- Keep all implementation in this single repository unless maintainers approve splitting projects.
- Preserve user ownership of *original* code and branding; do not claim ownership of imported upstream code.
- Prefer free and reproducible tools; do not incur charges, deploy services, publish releases or enable data collection without explicit maintainer approval.
- Codex Cloud may build/test code but must not imply it has installed anything in a user's local Chrome.
- Keep extensions compatible with Chrome MV3 and Chrome Web Store policies. No remotely hosted executable code or speculative extension permissions.
- **Do not silently copy GPL-covered source code into a proposed proprietary implementation.**

## Mandatory cycle for EVERY engineering task

1. **Inspect:** list existing functionality, tests, third-party licenses and current branch; never assume files exist.
2. **Reuse audit:** search approved compatible dependencies before rewriting substantial functionality; record KEEP / INTEGRATE / ADAPT / BUILD / DEFER / REJECT and why.
3. **Plan narrowly:** define smallest increment, exact acceptance criteria, test method, expected risks.
4. **Implement:** make focused edits; avoid unrelated rewrites, migrations and broad formatting churn.
5. **Verify:** run available automated checks; attempt real Chromium extension tests when available; document all unrun tests.
6. **Report:** list changed files, commands and outcomes, tested limitations, unresolved questions and next task.

Do not mark a feature “done” until its acceptance criteria and relevant tests pass. If Cloud cannot access a compatible browser/display, say that and provide manual verification instructions.

## Documentation is a contract

- Update [docs/FEATURE_MATRIX.md](docs/FEATURE_MATRIX.md) when scope or verified status changes.
- Update [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) when implementation diverges from the proposal.
- Add decisions, rationale and alternatives to [docs/DECISIONS.md](docs/DECISIONS.md).
- Update [docs/REUSE_AND_LICENSES.md](docs/REUSE_AND_LICENSES.md) with any new third-party package, source, rule list, version, copyright notices and license obligations.
- Record verified benchmarks with date, environment and artifacts; do not invent blocking percentages or performance claims.

## Initial engineering priorities

1. Decide the licensing/distribution strategy and audit foundations.
2. Reproduce the selected candidate's builds/tests (or justify original build).
3. Establish a minimal working MV3 extension with declarativeNetRequest, safe sample rules, local state and a popup.
4. Add reliable cosmetic filtering and site exceptions.
5. Implement filter-list compilation, testing and updates incrementally.
6. Benchmark accuracy, breakage, privacy and performance.

## Security requirements

Avoid broad host permissions unless necessary and justified. Do not collect browsing histories, log full URLs by default, introduce analytics or remote code. Do not commit credentials, signing keys, account data, real browsing histories or production secrets. Use GitHub's private security reporting for vulnerabilities.

## Effective use of Codex credits

- Read before writing; do not re-implement already working features.
- Choose one filter runtime for each browser target unless measured evidence shows benefit from another.
- Prefer current repo tooling over framework migrations.
- Ask a precise question only when a missing product/legal choice prevents safe progress; otherwise document a reversible assumption and complete a small useful task.
- Keep PRs small, include reproducible tests, and stop expanding scope after the acceptance criteria pass.

## Deliverable for initial pull requests

A newcomer should be able to clone, follow exact documented commands, reproduce tests, understand what is implemented vs planned, and install a verified extension when the build exists. Until then, clearly mark the setup as **not yet implemented**.
