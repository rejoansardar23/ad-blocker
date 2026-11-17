# Foundation and dependency audit — 15 November 2026

Tracks [original issue #2](https://github.com/rejoansardar23/ad-blocker/issues/2). **Partial audit; no upstream integration or product license approved.** Unverified imported snapshots under `AnalyseFuture/` are preserved for review and are not active dependencies. The original repository has GitHub Issues enabled. Track the remaining work in Issue #2 and the ordered execution queue.

## Decision proposal

**KEEP the tested original runtime for current development. DEFER wholesale foundation replacement and third-party filter imports.** Existing native DNR and cosmetic functionality should remain until a measured, compatible replacement has a clear benefit. This is an engineering recommendation, not approval of any distribution license.

| Candidate and pinned revision | Inspected evidence | Decision and remaining work |
|---|---|---|
| Original runtime (upstream main plus reviewed fork enhancements) | No third-party runtime packages; 14 Node tests and 10 Chromium fixture cases pass. Two locked dev packages declare Apache-2.0. | KEEP for development. Starter coverage is intentionally limited. Product license/contributor terms and broad security/performance review remain open. |
| [Very Good AdBlock `9f8fc91262c1bd0e92fa382b5c457b773b5fd5c0`](https://github.com/chrisbbreuer/very-good-adblock/tree/9f8fc91262c1bd0e92fa382b5c457b773b5fd5c0) | [LICENSE](https://github.com/chrisbbreuer/very-good-adblock/blob/9f8fc91262c1bd0e92fa382b5c457b773b5fd5c0/LICENSE) is MIT, but [NOTICE.md](https://github.com/chrisbbreuer/very-good-adblock/blob/9f8fc91262c1bd0e92fa382b5c457b773b5fd5c0/NOTICE.md) and [filter-sources.json](https://github.com/chrisbbreuer/very-good-adblock/blob/9f8fc91262c1bd0e92fa382b5c457b773b5fd5c0/src/rules/filter-sources.json) identify generated/bundled EasyList and AdGuard data as GPL-3.0-or-later. Package 0.3.7 uses Bun/Stacks and a substantial development dependency tree. | DEFER the bundle. A top-level MIT label does not resolve its filter-data or dependency obligations. No files/data imported. Full build, dependency/file audit and comparative benchmarks not performed. |
| [Unblock `2cdca77654634aa535bda650bf7b20835d767fc4`](https://github.com/adyoi/unblock/tree/2cdca77654634aa535bda650bf7b20835d767fc4) | [LICENSE](https://github.com/adyoi/unblock/blob/2cdca77654634aa535bda650bf7b20835d767fc4/LICENSE) is MIT; package 1.0.0 declares no package dependencies. [Manifest](https://github.com/adyoi/unblock/blob/2cdca77654634aa535bda650bf7b20835d767fc4/src/extension/manifest.json) requests tabs, scripting, unlimitedStorage, userScripts and all-URL host access. Background includes a remote-list compiler/fetch path. | AUDIT focused reuse; DEFER replacing the product. Do not silently adopt its broader permissions. Complete file/data provenance, build, security and benchmark validation first. No source imported. |
| [Ghostery adblocker `6f0610bf5eec1f31c4975ce0e707cdf47023e5b5`](https://github.com/ghostery/adblocker/tree/6f0610bf5eec1f31c4975ce0e707cdf47023e5b5) | [Core package](https://github.com/ghostery/adblocker/blob/6f0610bf5eec1f31c4975ce0e707cdf47023e5b5/packages/adblocker/package.json) is 2.20.3 and declares MPL-2.0, confirmed by its LICENSE. Its runtime dependency graph has additional packages. | DEFER integration until a specific MV3 compilation/maintenance benefit and distribution plan are established. Do not add an overlapping matcher merely because it exists. Full transitive audit/build not performed. |

Repositories were accessible and not archived at inspection. That alone is not a security or maintenance approval. Source-level feature claims, real-site coverage, comparative speed/memory and complete candidate builds remain unverified. No competitor ranking is justified.

## Current dependency controls

The npm-generated lockfile contains Playwright and playwright-core 1.65.0, with registry SHA-512 integrity fields and Apache-2.0 metadata. Both are development-only and the package build excludes `node_modules`. The project runtime has no package dependencies. No external filtering engine or dataset is integrated into the active build; quarantined snapshots are excluded.

CI uses existing npm functionality instead of a bespoke dependency scanner:

```sh
npm ci --no-audit --no-fund
npm sbom --sbom-format cyclonedx
npm audit --audit-level=high
```

The CycloneDX SBOM is retained as a CI artifact. The audit fails CI for high/critical advisories and reports lower-severity findings in logs. A clean audit concerns the installed dependency graph and advisories available at run time; it does not prove the extension or upstream filter data secure. Review license notices from actual packages and any eventual distributed components before release.

## Owner decision and unresolved acceptance

The repository still has no project-wide source license. Choose the intended direction—proprietary binary, source-available, or open source—and contributor terms before approving the final license/attribution ADR. No license change is made by this audit.

- [ ] Owner distribution/license direction recorded
- [ ] Complete candidate file/dependency/filter provenance and required notices
- [ ] Reproduced candidate builds, tests and maintenance/advisory review
- [ ] Comparable benchmark evidence and migration-cost assessment
- [ ] Approved architecture/import ADR

Original-code security and settings maintenance can proceed because its prerequisite foundation is merged. Filter-source/compiler issues depend on this unresolved gate and remain pending. Publishing, commercial release and expanded permissions remain separately approval-gated.
