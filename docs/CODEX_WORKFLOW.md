# Codex Cloud / GPT-6 Astra development playbook

Use this document as the operating procedure for any AI coding agent. [AGENTS.md](../AGENTS.md) is the short mandatory checklist; this file adds task templates and checkpoints.

## The problem we are solving

We want to build a strong, independent ad blocker with minimal wasted coding credits. Blindly rebuilding existing features or merging unrelated repositories costs engineering time and creates security/license issues. The agent must behave like a careful maintainer, not a demo generator.

## First-run orientation

1. Read README, START_HERE, VISION, PRODUCT_SPEC, FEATURE_MATRIX, ARCHITECTURE, REUSE_AND_LICENSES, ROADMAP, DECISIONS, TESTING.
2. Inspect exact files present; early revision is documentation-only.
3. Report what is **verified** vs a proposal from the project conversation.
4. Check git status, branch and available tests. Protect existing code and uncommitted changes.
5. Explain what cannot be run in the current Codex Cloud environment.
6. Do not make external purchases, publish extensions, deploy services, change repository visibility or upload user data without explicit authorization.

## Phase-gated master mission prompt

> You are the principal engineer and security-conscious software architect of this project. Build a privacy-first, independently branded ad blocker that can compete on verified merit with AdGuard, uBlock Origin Lite, Ghostery, AdBlock and AdBlock Plus. Start with Chrome Manifest V3. Work in this repository and follow AGENTS.md. Do not claim existing code is ready without inspecting it. Prioritize working browser filtering, low breakage and permission hygiene. Reuse legally compatible code where it improves delivery; do not copy GPL code into a planned proprietary implementation. Before a major feature, provide a KEEP/INTEGRATE/ADAPT/BUILD/DEFER/REJECT audit. Make small tested changes, document exact commands, and update the feature matrix and decision log. First complete Milestone 0; do not jump straight to a huge interface redesign. Maintain honest limitations and clean commits.

## Per-task instruction template

**Goal:** exact change and user-facing behavior.

**Existing functionality:** paths found and test evidence (not guesses).

**Reuse research:** source URL, commit/version, licenses and security, alternatives, decision.

**Acceptance criteria:** 3–8 observable assertions, negative cases and permissions.

**Implementation limit:** minimal affected packages, no unapproved framework migration.

**Validation:** command(s), expected outputs, browser fixture(s), regression checks.

**Reporting:** implementation summary, commands and pass/fail, release status, documentation updated, remaining risks and next smallest task.

## Cost-control rules

- Use the code already in the repo; do not replace working code for cosmetic reasons.
- Avoid parallel implementations of identical functionality.
- No second filtering engine without data showing it improves a defined case.
- Do not build your own list compiler if a compatible project can be legally adopted with a lower total maintenance cost.
- But do not integrate unreviewed libraries just to minimize short-term coding.
- Avoid 100-feature prompts; slice milestones into reviewable PRs.
- Use synthetic test pages rather than repeated manual browsing while developing core rules.
- Run cheap type/build/unit checks before slower browser integration and full benchmarks.
- Keep issue and PR context concise; document architectural decisions once in docs.
- Do not create dashboards or misleading stats while the filtering core is unfinished.

## Cloud and browser testing

Codex Cloud can typically execute build tools and tests installed in its environment. Real extension testing requires the correct Chromium setup, supported display/headless constraints and permissions. When tests cannot be executed, disclose the limitation, provide exact manual steps, and do not assert success.

## Done checklist

- [ ] Code is present and reviewed
- [ ] Dependency/data licenses and required notices recorded
- [ ] Build and relevant tests pass, with commands and output
- [ ] Chrome MV3 and permissions evaluated
- [ ] Privacy/security consequences reviewed
- [ ] Docs/feature status/ADR updated
- [ ] Remaining limitations and manual validation documented
- [ ] No unsupported marketing/benchmark claims

## First recommended Codex task

“Perform Milestone 0: audit candidate bases (Very Good AdBlock, Unblock and minimal original MV3). Verify exact licenses, source dependencies, current build, working filtering and testability. Produce a concise comparison and ADR D-004; then implement only the smallest verified extension shell after the chosen direction is approved. Avoid rewriting or copying unrelated source.”
