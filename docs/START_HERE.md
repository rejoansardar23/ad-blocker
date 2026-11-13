# Start here: project orientation

**Reading time:** roughly 15 minutes. This file is written for developers who have not seen the project's ChatGPT planning conversation.

## What are we building?

We want an independent, commercial-capable ad-blocking product that aspires to compete with leading market offerings. The initial deliverable is a reliable **Chrome Manifest V3 extension**. The longer-term vision includes multi-browser support, with desktop and DNS products evaluated later as distinct deployments.

## What exists right now?

As of 13 November 2026, only project planning and contributor documentation are present. No codebase, filtering engine, UI, test infrastructure, verified third-party import, Chrome Web Store listing or benchmark is completed. **All proposed features are planned**, not shipped.

## What decisions have we made?

- Start with a single modular GitHub repository rather than merging whole codebases.
- Reuse legally compatible, well-maintained components **only when they provide measurable benefit**.
- Evaluate Very Good AdBlock as an MIT-licensed *candidate foundation*, but first verify actual repository state, dependency licenses, build reproducibility and testing.
- Evaluate Ghostery's adblocker library for potential selective integration, rather than assuming multiple engines help.
- Reference AdGuard and uBlock projects for behavior and benchmark criteria, not automatically import their GPL-covered code into proprietary modules.
- Prioritize low breakage, privacy, reliable blocking and speed over raw feature count.
- Develop with Codex Cloud where possible, but require real browser verification and human review.

## Reading order

1. [Vision](VISION.md): product mission, success and non-goals.
2. [Product spec](PRODUCT_SPEC.md): users, scope and quality bar.
3. [Feature matrix](FEATURE_MATRIX.md): priorities and explicitly planned status.
4. [Architecture](ARCHITECTURE.md): proposed package boundaries, MV3 constraints.
5. [Reuse and licenses](REUSE_AND_LICENSES.md): upstream candidates and legal review gates.
6. [Roadmap](ROADMAP.md): incremental milestones.
7. [Testing](TESTING.md) + [competitive benchmarks](COMPETITIVE_BENCHMARK.md): how to prove functionality.
8. [Security and privacy](SECURITY_PRIVACY.md) + [Decisions](DECISIONS.md).
9. [Codex workflow](CODEX_WORKFLOW.md), [AGENTS](../AGENTS.md), [Contributing](../CONTRIBUTING.md).

## First contribution: Milestone 0

Open a scoped proposal with a reproducible upstream audit. For each candidate, capture upstream commit, license text, dependency/data licenses, latest maintenance signal, build/install instructions, automated test result, Chrome MV3 support and gaps. Recommend one foundation with evidence and record an ADR.

Only after that review should the initial extension shell and actual blocking tests be written. Never tell users a feature works based on an unverified vendor description.

## Set up today

Clone using GitHub: https://github.com/rejoansardar23/ad-blocker

There are no app dependencies or build commands yet. Do **not** run npm install or expect a browser extension build to exist from this documentation-only revision. When scaffolding is added, update this page with pinned tool versions, exact commands, expected outputs and troubleshooting.

## Need help?

Open a GitHub issue using the research, feature or bug template; never post passwords, tokens, private browsing URLs or vulnerability details in public issues.
