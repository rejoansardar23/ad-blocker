# Feature matrix and delivery status

**All rows below are PLANNED unless updated with a merged implementation, test evidence, and release version.** No features are implemented by the documentation-only initialization.

Legend: P0 = working first extension; P1 = competitive Chrome release; P2 = research/expansion. Browser-dependent = Chrome Manifest V3 may limit feasibility.

| Category | Capability | Priority | Status | Notes |
|---|---|---|---|---|
| Foundation | Manifest V3 installable extension | P0 | Planned | build/test first |
| Foundation | TypeScript modules and reproducible build | P0 | Planned | framework decision pending audit |
| Network | DNR packaged static rules | P0 | Planned | Chrome version limits matter |
| Network | Domain/URL matching and exceptions | P0 | Planned | regression fixtures |
| Network | Blocking engine baseline validation | P0 | Planned | no unverified upstream claims |
| Cosmetic | CSS hiding for common ad containers | P0 | Planned | protect legitimate content |
| Controls | Global pause/resume | P0 | Planned | persistent |
| Controls | Per-site allowlist | P0 | Planned | ruleset/priority tested |
| Controls | Minimal functional popup | P0 | Planned | accessible |
| Privacy | Local settings, no telemetry by default | P0 | Planned | no histories uploaded |
| QA | Unit + Chromium integration fixtures | P0 | Planned | reproducible CI |
| QA | Security and dependency audit | P0 | Planned | initial license gate |
| Lists | Rule parser/compiler | P1 | Planned | syntax coverage tests |
| Lists | Multiple licensed list sources | P1 | Planned | provenance + dedupe |
| Lists | Safe updates and rollback | P1 | Planned | source validation |
| Lists | Regional rules | P1 | Planned | opt-in as appropriate |
| Controls | Custom user rules | P1 | Planned | reversible |
| Controls | Element picker | P1 | Planned | rule preview |
| Cosmetic | Dynamic DOM handling | P1 | Planned | memory/perf tests |
| Privacy | Tracker blocking | P1 | Planned | maintained sources |
| Privacy | Nuisance/cookie-banner filtering | P1 | Planned | breakage tests |
| UX | Advanced settings dashboard | P1 | Planned | avoid vanity rebuilds |
| UX | Settings backup/import/export | P1 | Planned | validate input |
| UX | Keyboard access and themes | P1 | Planned | accessibility checks |
| Diagnostics | Honest blocking activity reporting | P1 | Planned | MV3 API constraints |
| Reliability | Failure recovery and rollback | P1 | Planned | last known good |
| Reporting | Site breakage report workflow | P1 | Planned | no private URL by default |
| Research | Video-site blocking experiments | P2 | Planned | best effort only |
| Research | Anti-adblock compatibility | P2 | Planned | no broad guarantee |
| Research | Optional sponsor-segment skipping | P2 | Planned | SponsorBlock license/API review |
| Browsers | Edge package and tests | P2 | Planned | Chromium similarities |
| Browsers | Firefox package and tests | P2 | Planned | different API behavior |
| Platform | Desktop filtering app | P2 | Planned | separate engineering track |
| Platform | DNS-based filtering | P2 | Planned | cannot cosmetically hide page elements |
| Platform | Android/iOS options | P2 | Planned | separate platform constraints |

## Competitor scope

Use AdGuard for broad settings and list capabilities, uBlock Origin / Lite for expert controls and efficiency tradeoffs, Ghostery for privacy controls, and AdBlock/Adblock Plus for mainstream UX comparisons. No single “number one” or superiority claim is accepted without a dated benchmark.

## Status change procedure

For each row moved to In progress, add an issue/owner and target. For Done, link merged PR, test log, release artifact and verified supported browsers. Update this file alongside code so agents and contributors never mistake an aspiration for reality.
