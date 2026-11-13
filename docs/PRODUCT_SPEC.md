# Product requirements — proposed

**Status:** draft planning specification, not a shipped product. Prioritization is documented in [FEATURE_MATRIX.md](FEATURE_MATRIX.md).

## Chrome MVP use cases

1. A user loads a page with known ad-network requests; valid DNR rules block those requests while ordinary page functionality continues.
2. A user sees a visible advertising placeholder; safe content CSS hides it without deleting legitimate content.
3. A user disables protection globally or for the current website; the choice persists and can be reversed.
4. A user opens the popup and understands whether protection is on, which site is affected and what controls are available.
5. A user imports or updates rule data through a safe, validated workflow in later milestones.
6. A user can report a broken website without exposing private browsing records.

## Requirements / proposed acceptance tests

| ID | Requirement | Acceptance evidence | Priority |
|---|---|---|---|
| F-001 | Installable MV3 package | Browser loads unpacked extension and reports no manifest errors | P0 |
| F-002 | Network request blocking | Synthetic test page shows targeted request blocked and control request allowed | P0 |
| F-003 | Safe rule packaging | Repeatable, validated static ruleset within browser limits | P0 |
| F-004 | Global control | Toggle affects filtering and persists across browser restart | P0 |
| F-005 | Per-site allowlist | Site exception works, clears correctly and survives reload | P0 |
| F-006 | Basic cosmetic filtering | Fixture hides a known ad container without harming controls/content | P0 |
| F-007 | Local-first preferences | No unexpected outbound data/telemetry; preference restore tested | P0 |
| F-008 | List subscriptions | Parser handles supported syntax; unsupported rules disclosed | P1 |
| F-009 | Custom rules | Validated user rules applied/reverted deterministically | P1 |
| F-010 | Element picker | Correct element is selected; resulting rule reversible and safe | P1 |
| F-011 | Filter updates | Signed/trusted source policy, validate, fallback, version/provenance | P1 |
| F-012 | Stats/diagnostics | Only verifiable metrics, transparent limits; no fake counts | P1 |
| F-013 | Accessibility | Keyboard navigation, screen-reader labels and focus states audited | P1 |
| F-014 | Video ad best-effort | Measured results and explicit caveats, never “100%” claims | P2 |
| F-015 | Multi-browser packages | Platform-specific feature parity matrix and tests | P2 |

## Experience requirements

- Simple popup: protection status, per-site pause/restore, settings link, understandable message.
- Advanced settings separated from basic mode; clearly labeled experimental features.
- Privacy-sensitive pages never sent to a remote analytics service by default.
- No fake “ads blocked” counter. If exact statistics cannot be reliably obtained in a published MV3 extension, show a clearly labeled alternative or omit the count.
- Explain permissions in plain language and offer reversible controls.

## Nonfunctional requirements

- Build is reproducible with pinned versions and documented commands.
- No uncaught fatal errors in normal usage; recovery path for corrupt settings/rules.
- Prefer browser-native filtering and efficient DOM changes.
- Evaluate performance with representative baseline/extension-on tests rather than asserting absolute thresholds early.
- Run CI checks before merge; security review for new permissions, dependencies, update pathways and content-script surfaces.
- Respect upstream licenses, published filters' licensing and distribution requirements.

## Platform constraints

Chrome Manifest V3 does not give an extension unrestricted network interception. Declarative Net Request rule capacities and behaviors depend on Chrome version; verify against official Chrome documentation at implementation time. Runtime script injection, dynamic rules and content scripts have strict permission/security boundaries. Browser-specific solutions must be independently verified.

## Definition of done

A feature is DONE only with code present on the default branch, documented configuration, passing tests appropriate to its scope, an installable build where relevant and a reviewed security/license impact. UI sketches, screenshots and upstream README statements do not count.
