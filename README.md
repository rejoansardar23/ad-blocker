# Ad Blocker — Open Project Handbook

> **Status (13 November 2026): Planning and documentation only.** This repository does not yet contain a working browser extension, production filtering engine, released application, or independently measured benchmark.

## The mission

Build an independently branded, privacy-first ad-blocking software platform that can credibly compete with leading products such as AdGuard, uBlock Origin / uBlock Origin Lite, Ghostery, AdBlock and Adblock Plus. Competition means *measurable blocking quality, low website breakage, privacy, resource efficiency, usability and reliable updates* — not inflated feature claims.

Start with a Chrome Manifest V3 extension; design reusable packages so Edge and Firefox may follow, then evaluate desktop and DNS-based products as **separate future work**. We intend to develop with Codex Cloud and human contributors, keep costs low, reuse legally compatible open-source work, and avoid rewriting solved problems.

## Start here (new developers and AI coding agents)

1. [START HERE](docs/START_HERE.md) — reading order, repository status, and first contribution.
2. [Vision and success criteria](docs/VISION.md) — the why, boundaries and product values.
3. [Product specification](docs/PRODUCT_SPEC.md) and [Feature matrix](docs/FEATURE_MATRIX.md) — planned functionality and definition of done.
4. [Architecture](docs/ARCHITECTURE.md) — proposed MV3 design and limits.
5. [Reuse and licenses](docs/REUSE_AND_LICENSES.md) — evaluate external repositories *before copying anything*.
6. [Roadmap](docs/ROADMAP.md) and [Research backlog](docs/RESEARCH_BACKLOG.md) — implementation order and open decisions.
7. [Quality and benchmarks](docs/TESTING.md) — evidence needed for claims.
8. [Security and privacy](docs/SECURITY_PRIVACY.md) — safety requirements.
9. [Codex workflow](docs/CODEX_WORKFLOW.md) and [AGENTS.md](AGENTS.md) — efficient AI-assisted development.
10. [Contribution guide](CONTRIBUTING.md) and [Security policy](SECURITY.md).

See also [competitive benchmark plan](docs/COMPETITIVE_BENCHMARK.md) and [decision log](docs/DECISIONS.md).

## Scope and priorities

**P0 — first reliable extension:** valid MV3 package, DNR network blocking, rule build/validation, local settings, protection switch, per-site exceptions, essential cosmetic filtering, permissions review, tests, install instructions.

**P1 — competitive extension:** quality filter-list management, custom rules, element picker, user controls, diagnostics, accessible dashboard, update/rollback strategy, performance measurements.

**P2 — research/expansion:** advanced anti-tracking, optional nuisance filters, video-site best-effort handling, Edge/Firefox compatibility, desktop and DNS products. Different platforms have different capabilities; none is promised in the MVP.

See the [feature matrix](docs/FEATURE_MATRIX.md) for status. **All features are planned until code and tests demonstrate otherwise.**

## Approach: one product, reuse selectively

- Maintain **one main modular monorepo** for product code and documentation. This is the current architecture recommendation, not evidence the packages already exist.
- Evaluate [Very Good AdBlock](https://github.com/chrisbbreuer/very-good-adblock) as a *candidate foundation*, not an approved/verified dependency.
- Evaluate [Ghostery adblocker](https://github.com/ghostery/adblocker), [WXT](https://github.com/wxt-dev/wxt), [AGLint](https://github.com/AdguardTeam/AGLint), and maintained filter lists where they demonstrably reduce maintenance.
- Use [AdGuard Browser Extension](https://github.com/AdguardTeam/AdguardBrowserExtension), [uBlock Origin](https://github.com/gorhill/uBlock), and [uBlock Origin Lite](https://github.com/uBlockOrigin/uBOL-home) as implementation/benchmark references, **not as license-free code to merge**.
- Never install several overlapping filtering engines just to increase the feature count; benchmark integration cost and benefits first.

## Current state and next milestone

The initial repository contained only the heading “ad-blocker”. This commit documents the agreed vision and contributor workflow. **No runnable extension has been built by this documentation commit.**

**Milestone 0 (first engineering contribution):** audit candidate foundations and licenses, document verified facts, choose a foundation, create reproducible build/test scaffolding, and deliver the smallest genuinely working Chrome MV3 package. Do not claim tested behavior until tests have run.

## Ownership, visibility and licensing

This repository is **public**. Public visibility does **not** automatically grant permission to reuse source. A project-wide license has **not yet been selected**; maintainers must make a deliberate licensing decision before accepting substantive external code contributions or publishing binaries. Third-party software, filter subscriptions, and data sets have their **own** obligations. See [Reuse and licenses](docs/REUSE_AND_LICENSES.md).

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). Propose a scoped issue, show a reuse audit, implement with tests, and submit a reviewable pull request. Security issues should be reported privately via [SECURITY.md](SECURITY.md).

**Product philosophy:** deliver fewer verified capabilities rather than many unchecked claims.
