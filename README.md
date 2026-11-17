# Ad Blocker — Chrome MV3 Development Preview

> **Current project handoff:** Read [HANDOFF.md](HANDOFF.md) for the live feature inventory, purpose of every active file/folder, complete dependency-ordered task queue, current PR state, and reviewer monitoring protocol.

> **Lost the old ChatGPT chat? Start with [the permanent master project handoff](docs/history/MASTER_PROJECT_HANDOFF.md), [conversation/research archive](docs/history/RESEARCH_AND_CHAT_HISTORY_ARCHIVE.md), and [copy/paste prompt for a new agent](docs/history/NEXT_CHAT_START.txt).** These GitHub-native documents preserve the recoverable product vision, pinned external sources, architecture diagrams, CI evidence, PR history and next tasks; they are not a verbatim transcript export.


> **Version 0.1.0 · Development preview · 15 November 2026**
> A small, original-code browser extension foundation now exists. **The synthetic Playwright Chromium MV3 test suite has passed, but broad real-world browser compatibility and production readiness are NOT verified.** Full AdGuard/uBlock/Ghostery feature parity is a long-term goal, not a current claim.

## Vision

Build a market-competitive, independently branded, privacy-first ad-blocking software platform, starting with Chrome Manifest V3. Compete on **measured blocking quality, low website breakage, efficient resource use, privacy and user experience**. Use AI coding agents such as Codex Cloud and compatible open-source components only when they reduce total effort without compromising legality, security or maintainability.

**New developer?** Start with [START HERE](docs/development/START_HERE.md) and the **[60-step implementation checklist](docs/product/IMPLEMENTATION_CHECKLIST.md)**. You do **not** need the original planning chat.

## Current code: what is actually here

| Capability | Code state | Required proof |
|---|---|---|
| Chrome Manifest V3 package | Chromium CI verified | Test real users' Chrome environments separately |
| Bundled sample blocking rules (few ad networks) | Synthetic Chromium fixture verified | Extend filter coverage only after license review |
| Global protection toggle | Synthetic Chromium CI verified | More browser/profile compatibility tests later |
| Per-site trusted website list | Chromium CI verified on fixture | Subdomain/real-site variations need more tests |
| Basic cosmetic CSS | Fixture CI verified | Broad false-positive testing still required |
| Popup, options and local settings | Options + Node UI regression tests | Manual toolbar popup and accessibility checks pending |
| Node unit tests and structural checks | CI verified | [Passing GitHub Actions run](https://github.com/rejoansardar23/ad-blocker/actions/runs/43469964379) |
| Runtime dependency-free extension packaging | CI verified | Synthetic Chromium load verified; manual installation remains |
| Comprehensive filter-list support, tracker modes, custom rules, element picker | Not yet built | Milestones P1 |
| Chrome Store release, Chrome/Firefox/desktop/DNS products | Not yet built | Separate approval/testing |

This is a **starter ruleset**, not a market-leading blocker yet. No telemetry or remote code is implemented. Do not make unsupported claims of 100% blocking, exact ad counts or YouTube ad removal.

## Verified CI build

The [successful validation/build run](https://github.com/rejoansardar23/ad-blocker/actions/runs/43469964379) ran structural checks, Node unit tests and the package build and uploaded the `ad-blocker-chrome-unpacked` artifact. It has **not** proved live Chrome filtering, reload behavior or website compatibility.

## Quick start

Requires **Node.js 22+** and Chrome/Chromium 121+ for testing.

```bash
git clone https://github.com/rejoansardar23/ad-blocker.git
cd ad-blocker
npm run check
npm run build
```

Open `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select `dist/chrome`.

**The extension runtime has no third-party packages.** Run `npm ci --no-audit --no-fund` and `npx playwright install chromium` to execute the real Chromium suite with `npm run test:e2e`. See [developer setup](docs/development/DEVELOPER_SETUP.md).

## Documentation map

- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** — authoritative directory map, dependency flow, preservation rules and old-to-new path mapping.
- **[AnalyseFuture/README.txt](AnalyseFuture/README.txt)** — quarantine status, provenance and safety rules for preserved imported material.
- **[START_HERE.md](docs/development/START_HERE.md)** — orientation for humans and AI developers.
- **[IMPLEMENTATION_CHECKLIST.md](docs/product/IMPLEMENTATION_CHECKLIST.md)** — 60 sequential tasks with status.
- [VISION.md](docs/product/VISION.md) — competitive goals and principles.
- [PRODUCT_SPEC.md](docs/product/PRODUCT_SPEC.md) / [FEATURE_MATRIX.md](docs/product/FEATURE_MATRIX.md) — product requirements and verified/planned states.
- [ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) — existing request/permission design and future modules.
- [ROADMAP.md](docs/product/ROADMAP.md) — phase delivery and exit gates.
- [REUSE_AND_LICENSES.md](docs/governance/REUSE_AND_LICENSES.md) / [REUSE_AUDIT_TEMPLATE.md](docs/governance/REUSE_AUDIT_TEMPLATE.md) — public repository evaluation before integration.
- **[FOUNDATION_AUDIT.md](docs/research/FOUNDATION_AUDIT.md)** — preliminary pinned audit of existing engine and selected candidates.
- **[OPEN_SOURCE_REFERENCE_REPOS.txt](docs/research/OPEN_SOURCE_REFERENCE_REPOS.txt)** — complete list of previously suggested public repositories to study.
- [TESTING.md](docs/testing/TESTING.md) / [COMPETITIVE_BENCHMARK.md](docs/research/COMPETITIVE_BENCHMARK.md) — quality proof and competitor benchmarking.
- [SECURITY_PRIVACY.md](docs/security/SECURITY_PRIVACY.md) / [SECURITY.md](SECURITY.md) — security, privacy and vulnerability disclosures.
- [CODEX_WORKFLOW.md](docs/development/CODEX_WORKFLOW.md) / [AGENTS.md](AGENTS.md) — Codex Cloud instructions and credit-saving workflow.
- [DEVELOPER_SETUP.md](docs/development/DEVELOPER_SETUP.md) / [RELEASE_GUIDE.md](docs/development/RELEASE_GUIDE.md) — local workflow and future releases.
- [DECISIONS.md](docs/governance/DECISIONS.md) / [RESEARCH_BACKLOG.md](docs/research/RESEARCH_BACKLOG.md) — open decisions and research.
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to propose scoped, testable changes.

## Reuse strategy and competitor references

We propose **one main modular product repo**, not a blind merge of several GPL codebases. The active minimal implementation is original code; no imported upstream engine is integrated into its runtime, build, or dependency graph. Unverified ZIP-derived source snapshots are preserved for review under [`AnalyseFuture/`](AnalyseFuture/README.txt), outside the active product. Before larger features, audit possible foundations [Very Good AdBlock](https://github.com/chrisbbreuer/very-good-adblock), [Unblock](https://github.com/adyoi/unblock), [Ghostery's adblocker SDK](https://github.com/ghostery/adblocker), [WXT](https://github.com/wxt-dev/wxt) and filtering datasets. Use [AdGuard](https://github.com/AdguardTeam/AdguardBrowserExtension) and [uBlock Origin](https://github.com/gorhill/uBlock) as competitor references, not license-free source.

**Ownership/license warning:** the repo is public, but a project-wide source license is not yet selected. The founder must decide licensing/distribution and external contribution terms before a public release or major third-party code import. Original code ownership does not imply ownership of upstream components.

## Fork integration and independent research

The fork [renoukhan39-bit/ad-blocker](https://github.com/renoukhan39-bit/ad-blocker) contributed stronger synthetic browser regressions, additional settings UI tests, a more complete DNR comparison, and CI dependency SBOM/auditing. Both commit histories are preserved through the integration; no third-party filter engine or dataset is integrated into the active runtime. Separate unverified snapshots remain quarantined in `AnalyseFuture/`. The 18-repository research list remains in [OPEN_SOURCE_REFERENCE_REPOS.txt](docs/research/OPEN_SOURCE_REFERENCE_REPOS.txt). Original product licensing remains undecided.

## Next milestone (Codex Cloud)

1. Run `npm ci --no-audit --no-fund`, `npm run check`, `npm run build` and `npm run test:e2e`; verify the exact integration PR CI.
2. Complete the owner-controlled project licensing decision and pinned dependency/filter data research.
3. Perform security, permissions, accessibility and manual Chrome installation reviews; record results in the checklist.
4. Expand filter compilation and coverage only after legal reuse evaluation and actual browser tests.

**The goal is real working software, not a feature checklist without evidence.**
