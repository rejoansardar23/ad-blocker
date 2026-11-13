# Reuse strategy, candidate repositories and license gates

**Core rule:** Do not spend Codex credits rebuilding existing functionality **or** combine source just because it is available. Every proposed import must pass security, legal, maintenance, compatibility and measurable-value checks.

## Candidate project inventory (not yet approved dependencies)

| Project | Public repository | Potential role | License to verify at pinned commit | Proposed decision |
|---|---|---|---|---|
| Very Good AdBlock | https://github.com/chrisbbreuer/very-good-adblock | possible initial Chrome extension foundation | reported MIT; verify all files/deps | AUDIT |
| Unblock | https://github.com/adyoi/unblock | smaller extension alternative | reported MIT; verify | AUDIT |
| Ghostery adblocker SDK | https://github.com/ghostery/adblocker | filter parsing/matching | reported MPL-2.0; verify | AUDIT |
| Brave adblock-rust | https://github.com/brave/adblock-rust | potential future engine/desktop | reported MPL-2.0; verify | DEFER |
| WXT | https://github.com/wxt-dev/wxt | extension build/dev framework | reported MIT; verify | CONDITIONAL |
| AGLint | https://github.com/AdguardTeam/AGLint | filter syntax checking | inspect license/dependencies | AUDIT |
| AdGuard DiffBuilder | https://github.com/AdguardTeam/DiffBuilder | filter-list delta updates | inspect license/dependencies | DEFER |
| StevenBlack hosts | https://github.com/StevenBlack/hosts | domain lists | verify data license and attribution | AUDIT |
| EasyList/EasyPrivacy | https://github.com/easylist/easylist | ad/tracker lists | verify list-specific terms | AUDIT |
| HaGeZi DNS lists | https://github.com/hagezi/dns-blocklists | DNS protection datasets | verify per-list use terms | DEFER |
| shadcn/ui | https://github.com/shadcn-ui/ui | reusable UI primitives | verify applicable licenses | CONDITIONAL |
| SponsorBlock | https://github.com/ajayyy/SponsorBlock | optional sponsor skipping concept | check API/database and code terms, commercial restrictions | DEFER |
| AdGuard browser extension | https://github.com/AdguardTeam/AdguardBrowserExtension | competitive UX and functionality reference | reported GPL-3.0 | REFERENCE ONLY |
| uBlock Origin | https://github.com/gorhill/uBlock | power-user capability reference | reported GPL-3.0 | REFERENCE ONLY |
| uBlock Origin Lite | https://github.com/uBlockOrigin/uBOL-home | MV3 filter architecture reference | verify source/license | REFERENCE ONLY |
| Ghostery extension | https://github.com/ghostery/ghostery-extension | privacy UX reference | verify source/license | REFERENCE ONLY |

**Important:** Labels such as “reported MIT” are *previous research leads*, not current pinned-license verification. The current development-preview code is original and has no imported upstream filtering engine; this documentation and implementation commit does not approve any of the candidates. Neither GitHub publicity nor permissive branding automatically licenses third-party bundled data.

## Ownership and licensing policy

The founder wants control of original code and possibly proprietary commercial distribution. That objective is compatible with some permissive code under conditions, but not with pretending third-party code becomes exclusively owned. Imported MIT software normally requires retaining notices; MPL-covered files can carry source-availability duties when distributed; GPL derivatives generally require corresponding source-distribution obligations. Seek qualified legal review for uncertain combinations.

**Current repository:** public, no project-wide LICENSE selected. Before substantial external contributions or distribution, maintainers should approve a license, contributor terms and any attribution policy. Do not quietly add a license or copied source on behalf of maintainers.

## Reuse decision rubric

For each proposed component, fill in all fields:

- Repository, pinned tag and commit SHA, package/version, license SPDX and copied copyright notices
- Dependency tree and *each* relevant license; rule/dataset licensing separately
- Maintenance signals, security advisories, archive state and release cadence
- Build success in Codex Cloud, supported Chrome version, MV3 compatibility
- Actual feature parity under test fixtures; unsupported formats/permissions
- Resulting bundle size, rule-budget impact, CPU/memory use, site breakages
- Integration complexity, replacement cost, long-term maintenance owner
- Recommendation: **KEEP, INTEGRATE, ADAPT, BUILD, DEFER, REJECT**
- Evidence: commands, benchmark artifacts, source URLs and review approval

## Integration rules

1. Prefer using proven code **when it meets our legal and quality bar**.
2. Avoid two overlapping filter engines in the same runtime unless one fills a measured gap.
3. Do not migrate from one extension framework to another for aesthetics alone.
4. Do not copy code, assets or filter subscriptions with incompatible terms into a proprietary distribution.
5. Reuse filter data only if updating, distribution, attribution, format and commercial use are permitted.
6. Pin versions initially; run SBOM/license scanning and security updates before release.
7. Separate reference-only projects from actual direct dependencies in documentation.
8. Bundled libraries and rule data must be attributed in distribution as required.

## First research task

Create a source-verified comparative audit of Very Good AdBlock vs Unblock vs a minimal original MV3 shell. Select **one** baseline, with reproducible build/test data and a written ADR. Then evaluate Ghostery SDK only if it offers verified technical gains. This decision supersedes previous conversational suggestions to “merge everything.”

## External official references

- [Choose a License](https://choosealicense.com/)
- [SPDX license list](https://spdx.org/licenses/)
- [Chrome Web Store program policies](https://developer.chrome.com/docs/webstore/program-policies/)
