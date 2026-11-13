# Codex Cloud — Review, test and merge guide

Open [docs/PR_EXECUTION_QUEUE.md](../docs/PR_EXECUTION_QUEUE.md) before picking tasks. This project expects a **human-approved** licensing choice and reviewable code commits. Codex may perform tests and merges when connected and authorized by the owner; this document is not an autonomous background job.

## First task: PR #3

1. Read `AGENTS.md`, `README.md`, PR #3 description and diff.
2. Check out PR #3's head branch and run `npm install --no-audit --no-fund`, `npm run check`, `npm run build`, `npx playwright install --with-deps chromium` and `npm run test:e2e`.
3. Generate/commit a reproducible `package-lock.json` if absent, switch CI from `npm install` to `npm ci` once the lock is verified. Test again.
4. Read browser logs and inspect the synthetic fixture; protect user data and avoid real ad server traffic.
5. Confirm CI passes on the final head commit and merge PR #3 only then.

## Next task: PR #4

1. Update PR #4 with latest main after #3 merges.
2. Inspect rule idempotency, managed-rule ID ranges and cosmetic style ownership.
3. Run the full **combined** Node and Chromium test suite from #3.
4. Check for regressions, conflicts and unnecessary permissions; correct and retest.
5. Merge only when green and review requirements are satisfied.

## Future tasks

Execute the [ordered queue](../docs/PR_EXECUTION_QUEUE.md) one issue at a time. Create a real implementation PR and test evidence; do not pre-open empty pull requests. The license audit issue is an approval gate before copying upstream code or filter datasets.

## Prompt for Codex Cloud

> Inspect the connected `rejoansardar23/ad-blocker` repository. Read `AGENTS.md`, `docs/PR_EXECUTION_QUEUE.md`, `docs/IMPLEMENTATION_CHECKLIST.md` and `.github/CODEX_REVIEW_GUIDE.md`. Start with PR #3. Review and test its real implementation, fix issues, and merge only if all required checks pass. Then update/retest/merge PR #4. After both merges, follow the linked GitHub issues in the documented order; preserve existing working code, audit any reused components' licenses, and only mark features complete when verified. Do not change licensing, publish extensions, incur expenses or collect browsing histories without explicit owner permission. Report test commands, links and blockers after each milestone.
