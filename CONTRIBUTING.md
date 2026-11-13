# Contributing

This is an **early Chrome Manifest V3 development preview** with real source code, but no independently recorded browser verification or production release. The mission is to compete with market leaders through privacy-first, dependable blocking. Read [START HERE](docs/START_HERE.md), [the 60-task checklist](docs/IMPLEMENTATION_CHECKLIST.md), [AGENTS.md](AGENTS.md) and [the developer setup](docs/DEVELOPER_SETUP.md).

## How to contribute

1. Check existing issues and [feature matrix](docs/FEATURE_MATRIX.md).
2. Propose a scoped issue with user problem, acceptance tests, Chrome constraints, data/permission impact and reuse alternatives.
3. For any proposed library or ruleset, specify pinned commit/version, license, dependencies, provenance and security maintenance.
4. Agree with maintainer on **contribution and project-wide licensing** before submitting substantial external code. This public repository does not yet have a project-wide license; visibility is not a broad license to redistribute source.
5. Work on a branch, submit a small PR and use the template with commands actually run and resulting evidence.

## Quality bar

- Run `npm run check` and `npm run build` for current source changes.
- Do relevant browser integration tests (if unavailable, say so and document manual steps).
- Keep existing valid functionality; no needless rewrites or duplicate filter engines.
- Do not invent ad-blocking statistics, browser compatibility or competitive performance numbers.
- Review new permissions, imported filter-data terms, update paths and browser breakage.
- Do not commit keys, user browsing data, private information, unlicensed assets or remote executable code.
- Update checklist, feature matrix and ADRs with tested results.

Documentation improvements, security reviews, build reproduction and browser fixture tests are especially welcome. Bugs that disclose security vulnerabilities should follow [SECURITY.md](SECURITY.md), not a public issue.

## Conduct

Contribute constructively, keep reviews technical and respectful, protect users' privacy and explain decisions with reproducible evidence.
