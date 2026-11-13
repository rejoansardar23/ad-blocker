# Research backlog — unresolved facts and proposed investigations

Nothing in this file is a verified implementation claim. Each issue should be resolved with **primary source, commit/tag, reproducible command or recorded benchmark**, an owner and date.

## Immediate / block coding decisions

- [ ] Confirm product ownership, public/proprietary distribution model, project license and external contributor terms.
- [ ] Audit Very Good AdBlock at a pinned commit: license, dependency tree, actual Chrome MV3 build, test status and claimed features.
- [ ] Audit Unblock at a pinned commit and compare maintenance/security with other foundations.
- [ ] Evaluate small original MV3 shell as control; document build complexity and cost.
- [ ] Decide one baseline with reproducible comparison and ADR D-004.
- [ ] Evaluate Ghostery SDK only for documented gains over selected DNR implementation.
- [ ] Verify Chrome DNR current capacities, API capabilities and supported filter rules against official docs on target browser versions.
- [ ] Decide required/optional host permission UX and review with security.
- [ ] Decide first legal filter lists and provenance/update strategy.
- [ ] Set up Chrome/Playwright integration test environment in Codex Cloud and record exact commands.

## Later technical investigations

- [ ] Is WXT worth a framework migration? Only decide after evaluating existing baseline framework.
- [ ] Which AGLint/DiffBuilder workflows are useful given selected list compiler?
- [ ] Which cosmetic/scriptlet syntax is supportable under current browser policies?
- [ ] How should exact vs approximate block statistics be presented in a production MV3 extension?
- [ ] What common false positives need stable regression fixtures?
- [ ] How should remote filter *data* be distributed safely without remote executable code?
- [ ] Which regional lists are useful and legally redistributable?
- [ ] What video-site cases are measurable without promising complete blocking?
- [ ] SponsorBlock licenses, API/database conditions, commercial suitability, user consent.
- [ ] Edge/Firefox API differences, signing/store requirements and release automation.
- [ ] Feasibility of standalone desktop, DNS and mobile offerings; separate threat models.

## Business/product validation

- [ ] Establish competitor versions and a dated feature matrix.
- [ ] Design an objective benchmark set with repeatable runs.
- [ ] Conduct privacy and usability review on prototype.
- [ ] Validate whether target users value site-compatibility reporting or other differentiators.
- [ ] Draft actual release privacy policy, product name, branding and trademark review.
- [ ] Track support and update maintenance costs rather than assuming a free ongoing operation.

## Research task format

- Question / hypothesis
- Proposed decision it affects
- Upstream primary sources + date accessed
- Reproduction commands or test method
- Results (verified / unverified / limitation)
- License/privacy/security consequences
- Recommendation and evidence
- Follow-up issue / ADR update
