# Incremental roadmap with exit criteria

**Status:** proposal as of 13 November 2026. Dates are not committed. No phase is complete simply because documentation exists.

## Milestone 0 — ownership, reproducibility, foundation choice (must be first)

**Goal:** know what we can reuse without wasting development effort or creating legal/security debt.

- Inventory current repository and document state.
- Confirm repository license/contributor/distribution choice with maintainer.
- Pin and audit Very Good AdBlock, Unblock and (if relevant) a minimal new MV3 implementation.
- Verify licenses and dependencies, test the current Chrome build and document gaps/unsupported features.
- Draft permission model, quality test plan and selected architecture.
- Select ONE viable baseline; record ADR.
- Build a working minimal Chrome extension and automated smoke test only after choice.

**Exit:** reviewed audit, licensing decision, reproducible build, installable MV3 package, tested rule blocking + pause, documented next work. Until then no “MVP complete” claim.

## Milestone 1 — genuinely functional Chrome core (P0)

- Stable network DNR rules and sample known-allowed/blocked fixtures.
- Build-time rule compilation/validation, deterministic priority and exception behavior.
- Local storage and settings versioning.
- Global and per-site toggles that truly affect filtering.
- Basic safe cosmetic hiding.
- Accessible popup with functioning controls.
- Basic tests, security review, install guide.

**Exit:** CI green, Chromium integration tests pass, permission audit complete, real-browser manual verification instructions and no known critical breakage in fixtures.

## Milestone 2 — competitive filtering and site compatibility (P1)

- Maintained legal filter sources and unsupported-syntax reporting.
- Cosmetic updates for dynamic pages, safe selector exceptions.
- User rules and element picker with undo.
- Tracker and annoyance protection profiles, regional lists where tested.
- Safe data updates/rollback and user-visible site-breakage reporting.
- Measured rule budget, memory/CPU and false positives.

**Exit:** dated benchmark suite, regressions fixed, source attribution and filter provenance documented.

## Milestone 3 — polished product and quality bar (P1)

- Complete accessible options dashboard and transparent diagnostics.
- Import/export settings with validation, themes and expert controls.
- Threat-model review, browser-permission review, CI/release automation.
- Documentation, changelog, privacy policy, support workflow and store assets.
- Third-party audit (licensing, dependencies, data sources) and release candidate tests.

**Exit:** reproducible packaged ZIP, release review checklist passed, public claims backed by data.

## Milestone 4 — market validation (P1/P2)

- Benchmarks against AdGuard, uBlock Origin Lite, Ghostery, AdBlock Plus on same test environment.
- Triaged user feedback, performance/site-breakage regression dashboard, fixes.
- Examine differentiated features that add genuine value rather than feature count.
- Confirm maintenance owners and sustainable updates.

**Exit:** published methodology, reproducible evidence, clear known limitations.

## Milestone 5 — expansion research (P2)

- Edge and Firefox targets with their own adapter/test matrix.
- Optional sponsor-segment/streaming experiments only after policy and license review.
- Feasibility studies for desktop ad blocking, DNS filtering, mobile products.
- Separate security, privacy, user-consent, deployment and operational plans per platform.

**Exit:** validated feasibility and go/no-go ADR for each platform, not automatic code generation.

## Prioritization mechanism

Score issues by user value, measured blocking/compatibility benefit, security risk, engineering effort, license certainty and maintenance burden. Prefer fixes to broken core filtering over dashboards, speculative AI features or competing runtime engines.

## Tracked artifacts

- [FEATURE_MATRIX.md](FEATURE_MATRIX.md) — canonical requirements and status.
- [DECISIONS.md](DECISIONS.md) — approved/advised choices.
- [TESTING.md](TESTING.md) — release gates and evidence.
- [RESEARCH_BACKLOG.md](RESEARCH_BACKLOG.md) — unresolved items.

A phase is not done until code, tests and documentation agree.
