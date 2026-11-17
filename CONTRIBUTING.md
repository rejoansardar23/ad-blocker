# Contributing

This project is a Chrome MV3 development preview with working source and controlled Playwright Chromium evidence. Broad site compatibility, manual Chrome Stable UX, accessibility, security, and production release gates remain open. Start with [README](README.md), [HANDOFF](HANDOFF.md), [developer setup](docs/development/DEVELOPER_SETUP.md), and the [feature matrix](docs/product/FEATURE_MATRIX.md).

## Propose one reviewable change

1. Check current main, issues, PRs, and the handoff task queue so work is not duplicated.
2. Define the user problem, existing behavior, files in scope, acceptance criteria, tests, failure recovery, and rollback.
3. For proposed code, data, or assets, record the immutable source, license/notices, dependencies, permissions, and security/maintenance impact. Project-wide licensing and contributor terms remain an owner decision; public visibility does not grant arbitrary redistribution rights.
4. Submit a focused branch/PR using the repository template unless the owner explicitly directs another delivery workflow. Do not combine unrelated research, bulk moves, formatting, and implementation.
5. Include commands actually run, results for the final commit, browser/OS versions, CI URL, limitations, and the next task. Address findings after every new push; old successful checks do not validate a later commit.

## Quality bar

- Preserve existing valid functionality, unrelated work, notices, and Git history. Never force-push shared history.
- Run a frozen install, lockfile guard, `npm run check`, `npm run build`, and relevant real-browser tests. Distinguish local policy blocks from application failures.
- Include targeted positive, negative, failure, and recovery regressions where the change needs them.
- Keep `AnalyseFuture/` isolated. Its code, hooks, tests, and workflows are not active dependencies and must not be executed during ordinary contribution work.
- Explain every added dependency, endpoint, permission, data flow, filter source, and license effect.
- Do not commit credentials, private browsing data, unlicensed assets, remote executable code, or unapproved telemetry.
- Update the checklist, feature matrix, handoff, and ADRs only where the change alters their facts. Every new maintained document needs a distinct purpose.
- Report only measured blocking, compatibility, privacy, accessibility, and performance results.

Security vulnerabilities should follow [SECURITY.md](SECURITY.md), not a public issue. Keep reviews technical and respectful, and support conclusions with reproducible evidence.
