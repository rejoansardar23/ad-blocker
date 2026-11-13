# Ordered implementation and pull-request execution queue

**Updated:** 13 November 2026. **Owner:** repository maintainer. **Goal:** implement and validate a competitive Chrome MV3 ad blocker by merging one tested, reviewable increment at a time.

The GitHub issues below represent **future PR scopes**, not already-written code. Do not create empty PRs for unfinished features. New implementation PRs should be opened only when there is a real diff and the preceding gates are satisfied. Final license and commercial distribution decisions belong to the owner.

## Merge these existing PRs first

| Order | Artifact | Contents | Required review before merge |
|---|---|---|---|
| 01 | [PR #3](https://github.com/rejoansardar23/ad-blocker/pull/3) | Real Playwright Chromium DNR/cosmetic/allowlist tests and settings checkbox fix | CI green; verify e2e logs, generate and commit a reproducible npm lockfile, review test fixture safety |
| 02 | [PR #4](https://github.com/rejoansardar23/ad-blocker/pull/4) | Avoid redundant DNR rewrites, safer cosmetic style ownership, unit tests | Merge after #3; update against main, rerun full combined Chromium CI and review compatibility |

These PRs are **ready for review, not merged**. The maintainer plans for Codex to review, test and merge. No actor should merge around failed required checks or bypass security/license gates.

## Complete work in this order

| Order | Issue | Dependency | Deliverable |
|---|---|---|---|
| 03 | [#2](https://github.com/rejoansardar23/ad-blocker/issues/2) | Owner must select license and distribution approach | Pinned foundation + dependency + license audit and ADR; no copied unapproved code |
| 04 | [#5](https://github.com/rejoansardar23/ad-blocker/issues/5) | PR #3 and #4 | Permission, privacy, settings consistency and MV3 security fixes with browser regressions |
| 05 | [#6](https://github.com/rejoansardar23/ad-blocker/issues/6) | Issue #2 | Licensed filter-source catalog and provenance; no unapproved subscriptions bundled |
| 06 | [#7](https://github.com/rejoansardar23/ad-blocker/issues/7) | Issue #2 and #6 | A chosen, tested filter-to-DNR compiler with quotas/coverage checks |
| 07 | [#8](https://github.com/rejoansardar23/ad-blocker/issues/8) | Issue #7 | Filter updates, integrity checks, versioning, last-known-good rollback |
| 08 | [#10](https://github.com/rejoansardar23/ad-blocker/issues/10) | Issue #7 | User rules, exception priority, validated import/export, persistence tests |
| 09 | [#9](https://github.com/rejoansardar23/ad-blocker/issues/9) | Chrome test baseline, browser constraints | Dynamic cosmetics, accessible reversible element picker |
| 10 | [#11](https://github.com/rejoansardar23/ad-blocker/issues/11) | Issue #6, #7 | Tracker/nuisance/region filtering profiles with attribution and false-positive checks |
| 11 | [#12](https://github.com/rejoansardar23/ad-blocker/issues/12) | Stable filtering core | Polished accessible dashboard and honest production-compatible diagnostics |
| 12 | [#14](https://github.com/rejoansardar23/ad-blocker/issues/14) | Feature-complete candidate | Objective competitor benchmark and performance regression corpus |
| 13 | [#13](https://github.com/rejoansardar23/ad-blocker/issues/13) | Core + security + benchmark results | Privacy/security/legal review, release ZIP, changelog, store readiness |
| 14 | [#15](https://github.com/rejoansardar23/ad-blocker/issues/15) | Chrome release stability | Edge and Firefox adapter feasibility + verified browser builds |
| 15 | [#16](https://github.com/rejoansardar23/ad-blocker/issues/16) | Separate platform approval | Desktop and DNS product research, cost/security ADRs |

**Original request:** aim for a world-class AdGuard/uBlock/Ghostery competitor while conserving Codex credits. That means a verified baseline, compatible reused components, low site breakage and strict feature acceptance, **not** a mass merge of four open-source products.

## Definition of an implementation PR

Every PR should:
- Link its issue and concrete acceptance criteria.
- Identify existing functionality and reused/borrowed components with pinned commits and licenses.
- Have focused code changes; avoid changing many modules without need.
- Include unit and/or Chromium integration tests covering positive and negative behavior.
- Include exact command results, CI URL, browser version and restrictions.
- Explain new manifest permissions, privacy and security implications.
- Update `docs/FEATURE_MATRIX.md`, `docs/IMPLEMENTATION_CHECKLIST.md`, and ADRs honestly.
- Leave production completeness and competitor benchmarks **unclaimed** until tested.

## Codex review/merge protocol

1. Open the **oldest eligible PR**, read its diff, issue and this plan.
2. Run `npm run check` and `npm run build`, then `npm run test:e2e` when PR #3's Chromium test tooling exists. Install dependencies and browser as documented.
3. Diagnose and fix failures on the PR branch (or propose review changes), re-run CI and check browser regressions.
4. Review security, licensing, source attribution and data collection effects.
5. **Merge only when checks and scope acceptance pass** and the maintainer has approved any unresolved licensing/release choice.
6. Update main, rebase next PR if needed and repeat.
7. For future issues, implement the smallest working increment, open a PR, review and merge before starting dependent work.

## Blockers to return to the maintainer

- Choice of proprietary vs source-available vs open-source distribution and contributor terms
- Payments, publishing or changing repo visibility
- Third-party code or filter datasets with ambiguous copyright/redistribution terms
- Permissions that materially expand browsing access or data collection
- Competing architectural proposals requiring product direction
- Any security vulnerability not safely addressable in ordinary PR review

If blocked, create an issue stating evidence, choices and a recommendation, not a vague request to "fix all".

## Progress tracking

The [60-step checklist](IMPLEMENTATION_CHECKLIST.md) remains the high-level product goal and issue tasks are the implementation queue. Only mark completed after merged source, tested behavior and documentation evidence. Planned tasks do not imply work in the background; Codex runs only when explicitly tasked.
