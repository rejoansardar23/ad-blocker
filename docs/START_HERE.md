# Start here — no chat history required

This repository holds a first **original-code Chrome MV3 development preview** and a longer-term plan for a market-competitive ad blocker. It is not a finished or independently browser-validated product.

## First 10 minutes

1. Read [README](../README.md) for the mission and current status.
2. Follow [developer setup](DEVELOPER_SETUP.md) to run `npm run check`, `npm run build` and load `dist/chrome`.
3. Read the [ordered 60-task checklist](IMPLEMENTATION_CHECKLIST.md) and [feature matrix](FEATURE_MATRIX.md) to see what is present versus still required.
4. Review [architecture](ARCHITECTURE.md), [security/privacy](SECURITY_PRIVACY.md), and [reuse/licensing](REUSE_AND_LICENSES.md) before touching engine code.
5. Read [AGENTS.md](../AGENTS.md) if using Codex Cloud or other AI coding agents.
6. Submit a scoped issue with acceptance criteria; follow [CONTRIBUTING](../CONTRIBUTING.md).

## What we are building

An independent, privacy-first ad blocker competing on **measured** network filtering, tracker protection, low website breakage, resource overhead and user controls with AdGuard/uBlock/Ghostery. Chrome is the first target; Edge and Firefox are later, and desktop/DNS products require distinct engineering.

## What exists in the initial code milestone

- Manifest V3 extension package with locally bundled DNR rules.
- Background worker connecting local preferences to global and per-site filtering.
- Popup/options UI, deliberately narrow cosmetic selectors and domain validation.
- Node-native tests, validation/build scripts and GitHub Actions workflow.
- Comprehensive project strategy and new-developer documentation.

**Not yet verified:** Chrome/Chromium installation, real network-blocking behavior, UI behavior in a browser, performance and compatibility. **Not yet built:** comprehensive filter lists, auto-updates, advanced custom rules/element picker, production release.

## Product decisions

- One main repository with modular boundaries.
- Start with a small original dependency-free implementation; do a pinned-comparison audit before importing another engine.
- Very Good AdBlock, Unblock and Ghostery SDK are candidates to investigate, not imported dependencies.
- AdGuard/uBlock are competitive references, not freely combinable code.
- Licensing and downstream commercial distribution conditions need an explicit owner decision.
- No fabricated “blocked ad” counters or guaranteed video ad support.

## First contribution

Run the current checks, make the first Chromium fixture test pass, audit the license/permissions, and record the result in the [checklist](IMPLEMENTATION_CHECKLIST.md). For the next features, insist on a reuse audit instead of a rewrite.

For the long-term scope see [Vision](VISION.md), [Product Spec](PRODUCT_SPEC.md), [Roadmap](ROADMAP.md), [Competitor benchmarks](COMPETITIVE_BENCHMARK.md), [Codex Workflow](CODEX_WORKFLOW.md), and [Decision Log](DECISIONS.md).
