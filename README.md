# Ad Blocker — Chrome MV3 Development Preview

> **Version 0.1.0 · Early implementation · 13 November 2026**  
> A small, original-code browser extension foundation now exists. **It has not yet passed recorded live Chrome/Chromium end-to-end tests and is not production ready.** Full AdGuard/uBlock/Ghostery feature parity is a long-term goal, not a current claim.

## Vision

Build a market-competitive, independently branded, privacy-first ad-blocking software platform, starting with Chrome Manifest V3. Compete on **measured blocking quality, low website breakage, efficient resource use, privacy and user experience**. Use AI coding agents such as Codex Cloud and compatible open-source components only when they reduce total effort without compromising legality, security or maintainability.

**New developer?** Start with [START HERE](docs/START_HERE.md) and the **[60-step implementation checklist](docs/IMPLEMENTATION_CHECKLIST.md)**. You do **not** need the original planning chat.

## Current code: what is actually here

| Capability | Code state | Required proof |
|---|---|---|
| Chrome Manifest V3 package | Added | Load in Chrome |
| Bundled sample blocking rules (few ad networks) | Added | Real browser request fixture |
| Global protection toggle | Added | Browser + restart |
| Per-site trusted website list | Added | Browser reload and subdomain scenarios |
| Basic cosmetic CSS | Added | Safe hiding/no false positives |
| Popup, options and local settings | Added | Chrome UI interaction |
| Node unit tests and structural checks | CI verified | [Passing GitHub Actions run](https://github.com/rejoansardar23/ad-blocker/actions/runs/43469964379) |
| Dependency-free extension packaging | CI verified | GitHub Actions artifact; Chrome load still unverified |
| Comprehensive filter-list support, tracker modes, custom rules, element picker | Not yet built | Milestones P1 |
| Chrome Store release, Chrome/Firefox/desktop/DNS products | Not yet built | Separate approval/testing |

This is a **starter ruleset**, not a market-leading blocker yet. No telemetry or remote code is implemented. Do not make unsupported claims of 100% blocking, exact ad counts or YouTube ad removal.

## Verified CI build

The [successful validation/build run](https://github.com/rejoansardar23/ad-blocker/actions/runs/43469964379) ran structural checks, Node unit tests and the package build and uploaded the `ad-blocker-chrome-unpacked` artifact. It has **not** proved live Chrome filtering, reload behavior or website compatibility.

## Quick start

Requires **Node.js 20+** and Chrome/Chromium 121+ for testing.

```bash
git clone https://github.com/rejoansardar23/ad-blocker.git
cd ad-blocker
npm run check
npm run build
```

Open `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select `dist/chrome`.

**There is no need to run `npm install`:** these scripts use built-in Node APIs and the extension contains no third-party runtime packages. The Chrome/browser smoke tests are still a pending verification gate. See [developer setup](docs/DEVELOPER_SETUP.md).

## Documentation map

- **[START_HERE.md](docs/START_HERE.md)** — orientation for humans and AI developers.
- **[IMPLEMENTATION_CHECKLIST.md](docs/IMPLEMENTATION_CHECKLIST.md)** — 60 sequential tasks with status.
- [VISION.md](docs/VISION.md) — competitive goals and principles.
- [PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md) / [FEATURE_MATRIX.md](docs/FEATURE_MATRIX.md) — product requirements and verified/planned states.
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — existing request/permission design and future modules.
- [ROADMAP.md](docs/ROADMAP.md) — phase delivery and exit gates.
- [REUSE_AND_LICENSES.md](docs/REUSE_AND_LICENSES.md) / [REUSE_AUDIT_TEMPLATE.md](docs/REUSE_AUDIT_TEMPLATE.md) — public repository evaluation before integration.
- [TESTING.md](docs/TESTING.md) / [COMPETITIVE_BENCHMARK.md](docs/COMPETITIVE_BENCHMARK.md) — quality proof and competitor benchmarking.
- [SECURITY_PRIVACY.md](docs/SECURITY_PRIVACY.md) / [SECURITY.md](SECURITY.md) — security, privacy and vulnerability disclosures.
- [CODEX_WORKFLOW.md](docs/CODEX_WORKFLOW.md) / [AGENTS.md](AGENTS.md) — Codex Cloud instructions and credit-saving workflow.
- [DEVELOPER_SETUP.md](docs/DEVELOPER_SETUP.md) / [RELEASE_GUIDE.md](docs/RELEASE_GUIDE.md) — local workflow and future releases.
- [DECISIONS.md](docs/DECISIONS.md) / [RESEARCH_BACKLOG.md](docs/RESEARCH_BACKLOG.md) — open decisions and research.
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to propose scoped, testable changes.

## Reuse strategy and competitor references

We propose **one main modular product repo**, not a blind merge of several GPL codebases. The current minimal implementation is original code without imported upstream engines. Before larger features, audit possible foundations [Very Good AdBlock](https://github.com/chrisbbreuer/very-good-adblock), [Unblock](https://github.com/adyoi/unblock), [Ghostery's adblocker SDK](https://github.com/ghostery/adblocker), [WXT](https://github.com/wxt-dev/wxt) and filtering datasets. Use [AdGuard](https://github.com/AdguardTeam/AdguardBrowserExtension) and [uBlock Origin](https://github.com/gorhill/uBlock) as competitor references, not license-free source.

**Ownership/license warning:** the repo is public, but a project-wide source license is not yet selected. The founder must decide licensing/distribution and external contribution terms before a public release or major third-party code import. Original code ownership does not imply ownership of upstream components.

## Next milestone (Codex Cloud)

1. Run `npm run check` and `npm run build`; capture CI evidence and fix failures.
2. Load build in real Chrome and test DNR block/allow and pause/allowlist/restore cases.
3. Perform security and permission review; record results in the checklist.
4. Audit compatible existing engines and filter data before rebuilding more features.
5. Only then expand toward a competitive filter compiler and coverage benchmark.

**The goal is real working software, not a feature checklist without evidence.**
