# Vision, principles and boundaries

## Mission

Build an independently branded, privacy-first, reliable ad-blocking platform that can earn the trust of users and compete with leaders by **verified** performance, blocking quality, low site breakage, helpful controls and transparent operation.

We aim to minimize incremental development cost with Codex Cloud, effective reuse of open-source tools and reproducible automation. Do not confuse low initial infrastructure costs with free long-term product maintenance.

## Target users

- Everyday Chrome users: want pages that work, fewer intrusive ads and a simple on/off control.
- Privacy-conscious users: want tracker protection and understandable permissions.
- Power users: need custom rules, trusted-site exceptions, filter lists and diagnostics.
- Developers/testers: need deterministic behavior, documented limits and verifiable builds.

## What winning means

Not “number one” by unverified download rankings. Our measurable objectives are:
- competitive ad/tracker blocking on a fixed, documented test corpus;
- low false-positive / site-breakage rates;
- acceptable memory, CPU, load-time and rule-budget overhead;
- minimal default data collection and justified permissions;
- trustworthy updates and useful error recovery;
- approachable UI plus advanced expert controls;
- sustainable maintenance, issue triage and transparent releases.

See [competitive benchmark plan](COMPETITIVE_BENCHMARK.md). Targets are goals until results exist.

## Product principles

1. **Privacy by default:** keep processing on-device and avoid unnecessary telemetry.
2. **Work before polish:** real blocking comes before flashy analytics.
3. **Proof over claims:** tested capability, not README promises or invented counters.
4. **No unnecessary rewrites:** audit reusable components before building.
5. **One coherent architecture:** modular monorepo, limited overlapping engines.
6. **Clear licensing:** honor upstream licenses, data licenses and attribution.
7. **Resilience:** minimal permissions, easy disable/allowlist, safe update rollback.
8. **Accessible and understandable:** simple default UX; expert mode without confusion.

## Initial boundaries

### In scope (Chrome MVP)

Manifest V3, native DNR request blocking, select cosmetic filtering, local preferences, per-site exceptions, basic popup, curated/bundled safe rule sets, QA and release-ready packaging.

### Deliberately later

Custom list subscriptions, advanced element picker, nuisance filters, richer diagnostics, advanced anti-tracking, experimental video-site rules, Firefox/Edge distribution and full competitor benchmarking.

### Out of scope for the Chrome extension itself

Claims of guaranteed blocking on every site, device-wide VPN functionality, OS-wide packet interception, arbitrary web page code rewriting beyond Chrome API constraints, bypassing paywalls or DRM, collecting browsing history, or a guarantee of blocking all YouTube ads.

Standalone DNS/desktop/mobile products may become separate milestones but cannot be delivered merely by adding browser extension modules.

## Business/ownership posture (decision pending)

The owner wishes to control original software and branding and may want proprietary distribution. A public repo with no license is **not** itself an open-source license. Choose the final distribution license and contributor terms explicitly before accepting external code or shipping binaries. Reused MIT/MPL/GPL components each impose distinct obligations; see [license audit](REUSE_AND_LICENSES.md).

## Governance

Technical changes require scoped review. Decisions with architectural, legal, permission or data-collection impact must be documented in [DECISIONS.md](DECISIONS.md). Avoid claims about popularity rankings without time-stamped independent evidence.
