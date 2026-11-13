# Architecture and product decision log

This log distinguishes **accepted direction**, **proposals** and **unresolved owner decisions**. An approved ADR should name decision maker, date, alternatives, rationale and consequences.

## D-001 — One modular repository

**State:** proposed working direction, 13 Nov 2026

**Context:** owner wants one controlled software project, fast Codex onboarding and avoiding incompatible wholesale merges.

**Decision direction:** use a single modular monorepo for Chrome first, then adapters for other browsers. Split repositories only if maintenance and release boundaries prove necessary.

**Alternatives:** separate repositories per feature; direct merge of four upstream repositories.

**Tradeoff:** simpler coordination and docs, but monorepo needs clear ownership/testing boundaries.

## D-002 — Prefer reuse, not duplicate engines

**State:** working principle, 13 Nov 2026

**Direction:** inspect compatible libraries and existing implementations before writing code; measure benefits of any imported engine. Do not combine overlapping engines merely because they exist.

**Alternatives:** write all code from scratch; bundle every major upstream engine.

**Tradeoff:** audits cost up front but reduce maintenance, licensing conflict and wasted credit.

## D-003 — Chrome MV3 first

**State:** working product direction, 13 Nov 2026

**Direction:** deliver a genuinely functional Chrome extension with native DNR rules and basic cosmetics; later study Edge/Firefox. Desktop, DNS and mobile are separate future investigations.

**Reason:** fastest narrow route to a verifiable product and a stable competitor benchmark.

## D-004 — Reuse starting point

**State:** open / requires reproducible audit. A small original MV3 source implementation now exists as a control baseline; no third-party engine has been imported.

**Candidates:** Very Good AdBlock (possible permissive foundation), Unblock (small foundation), original small MV3 build. Ghostery SDK may be selectively evaluated.

**Decision rule:** license compatibility, versioned dependencies, maintenance, passing tests, Chrome feature support and integration value. AdGuard/uBlock sources are reference-only absent an approved distribution strategy compatible with their licenses.

## D-005 — Source and contribution license

**State:** OWNER DECISION REQUIRED

The repository is public and has no project-wide license. Owner aims to control original code and may want a proprietary product. Maintainers must choose a legally coherent contributor/distribution strategy before accepting substantive code or shipping binaries. Do not equate private repo with exclusive ownership of third-party code.

## D-006 — Honest feature and performance claims

**State:** accepted engineering quality principle

No feature marked shipped without code, tests and release evidence. No invented blocking statistics, “number one”, 100% YouTube or universal ad removal claims.

## ADR template

### D-XXX — Title
- Date:
- State: proposed / accepted / superseded / rejected
- Decision owner:
- Context and constraints:
- Options considered:
- Choice and why:
- Risks and tradeoffs:
- Validation/rollback plan:
- Evidence/PR:
