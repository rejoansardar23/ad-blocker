# Codex Cloud — Review, test and merge guide

Read [the ordered execution queue](../docs/PR_EXECUTION_QUEUE.md), [AGENTS.md](../AGENTS.md) and [open-source reference catalog](../docs/OPEN_SOURCE_REFERENCE_REPOS.txt).

## Completed and validated
- PR #3: Chromium MV3 smoke test plus tested Playwright dependency lockfile, merged 15 Nov 2026. Validation: https://github.com/rejoansardar23/ad-blocker/actions/runs/43709953216
- PR #4: idempotent DNR updates and safe cosmetic stylesheet handling, updated to include PR #3 and merged 15 Nov 2026. Validation: https://github.com/rejoansardar23/ad-blocker/actions/runs/43710088283
- PR #17: this documentation + reference catalog, still subject to review/merge until GitHub reports it merged.

## Next task

The next dependency gate is [Issue #2](https://github.com/rejoansardar23/ad-blocker/issues/2): research reusable software, dependency/data licenses, maintenance, and advise the owner on project-wide source and distribution licensing. **Do not unilaterally add a LICENSE, import GPL-covered code into proprietary modules, or publish commercially.**

After #2, follow the issue sequence in `docs/PR_EXECUTION_QUEUE.md`. For each real implementation PR:
1. Re-read current source, user-visible requirements and approved decisions.
2. Record KEEP/INTEGRATE/ADAPT/BUILD/DEFER/REJECT comparison and pinned upstream commit/license.
3. Implement the smallest working increment.
4. Run `npm ci --no-audit --no-fund`, `npm run check`, `npm run build`, `npx playwright install --with-deps chromium` (if needed), and `npm run test:e2e`.
5. Fix regressions, cite CI artifacts, review security/privacy/permissions/licenses.
6. Merge only when validated; update [60-step checklist](../docs/IMPLEMENTATION_CHECKLIST.md) with actual evidence.

## Codex prompt

> Continue the connected `rejoansardar23/ad-blocker` repository from the latest main branch. PRs #3 and #4 are merged and tested. Read AGENTS.md, docs/PR_EXECUTION_QUEUE.md, docs/OPEN_SOURCE_REFERENCE_REPOS.txt, and docs/REUSE_AND_LICENSES.md. Start with Issue #2's pinned reuse and licensing audit, do not reimplement an existing solution without justification, and do not change product licensing or distribute unapproved code. Proceed through the implementation issues one tested PR at a time, always reporting commands/results and any owner decision needed.
