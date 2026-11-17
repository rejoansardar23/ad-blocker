# Start here — no chat history required

This repository holds a first **original-code Chrome MV3 development preview** and a longer-term plan for a market-competitive ad blocker. It is not a finished product. Synthetic Chromium integration tests are recorded in CI; broad site compatibility remains unverified.

## First 10 minutes

1. Read [README](../../README.md) for the mission and current status.
2. Follow [developer setup](DEVELOPER_SETUP.md) to run `npm run check`, `npm run build` and load `dist/chrome`.
3. Read the [ordered 60-task checklist](../product/IMPLEMENTATION_CHECKLIST.md) and [feature matrix](../product/FEATURE_MATRIX.md) to see what is present versus still required.
4. Review [architecture](../architecture/ARCHITECTURE.md), [security/privacy](../security/SECURITY_PRIVACY.md), and [reuse/licensing](../governance/REUSE_AND_LICENSES.md) before touching engine code.
5. Read [AGENTS.md](../../AGENTS.md) if using Codex Cloud or other AI coding agents.
6. Submit a scoped issue with acceptance criteria; follow [CONTRIBUTING](../../CONTRIBUTING.md).

## What we are building

An independent, privacy-first ad blocker competing on **measured** network filtering, tracker protection, low website breakage, resource overhead and user controls with AdGuard/uBlock/Ghostery. Chrome is the first target; Edge and Firefox are later, and desktop/DNS products require distinct engineering.

## What exists in the initial code milestone

- Manifest V3 extension package with locally bundled DNR rules.
- Background worker connecting local preferences to global and per-site filtering.
- Popup/options UI, deliberately narrow cosmetic selectors and domain validation.
- Node-native tests, validation/build scripts and GitHub Actions workflow.
- Comprehensive project strategy and new-developer documentation.

**Verified in synthetic Chromium fixtures:** package load, network blocking/allowing, options controls, trust boundaries, reversible cosmetics and restart persistence. **Not yet verified:** broad performance/compatibility, manual alpha installation, complete toolbar popup and accessibility review. **Not yet built:** comprehensive filter lists, auto-updates, advanced custom rules/element picker, production release.

## Product decisions

- One main repository with modular boundaries.
- Start with a small original dependency-free implementation; do a pinned-comparison audit before importing another engine.
- Very Good AdBlock, Unblock and Ghostery SDK are candidates to investigate, not imported dependencies.
- AdGuard/uBlock are competitive references, not freely combinable code.
- Licensing and downstream commercial distribution conditions need an explicit owner decision.
- No fabricated “blocked ad” counters or guaranteed video ad support.

## First contribution

Run the current checks and Chromium suite, follow the dependency queue, audit the license/permissions, and record verified results in the [checklist](../product/IMPLEMENTATION_CHECKLIST.md). For the next features, insist on a reuse audit instead of a rewrite.

For the long-term scope see [Vision](../product/VISION.md), [Product Spec](../product/PRODUCT_SPEC.md), [Roadmap](../product/ROADMAP.md), [Competitor benchmarks](../research/COMPETITIVE_BENCHMARK.md), [Codex Workflow](CODEX_WORKFLOW.md), and [Decision Log](../governance/DECISIONS.md).
