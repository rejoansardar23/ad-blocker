# Reuse audit worksheet (copy for each candidate)

> Proposal only until a maintainer reviews legal and technical evidence.

## Identification

- Name:
- Accountable owner and review date:
- Question / falsifiable hypothesis:
- Product or architecture decision affected:
- Repository URL:
- Exact tag/commit SHA:
- Proposed version/package:
- Intended purpose:
- Why existing project code cannot already satisfy the same need:
- Primary sources and date accessed:

## Licensing

- Repository license at pinned commit:
- Relevant file-level license headers:
- Third-party dependency licenses:
- Filter/data licenses and redistribution/update terms:
- Copyright and attribution files to ship:
- Proprietary distribution compatible? Evidence and unresolved counsel questions:

## Technical verification

- Baseline and comparison method:
- Build environment and commands:
- Output/exit codes:
- Tested Chrome and MV3 version:
- Tests performed (fixture list):
- Unsupported behavior:
- Extension permissions required:
- Bundle size, enabled DNR rules, CPU/memory measurements:
- Known vulnerabilities / maintenance status:
- Rollback/removal cost:
- Result classification: verified / unverified / environment limitation:
- Privacy/security consequences and data handling:
- Success thresholds, stop conditions, and maintenance/cost budget:

## Comparison

| Option | Pros | Risks | Evidence |
|---|---|---|---|
| Keep current implementation | | | |
| Integrate candidate | | | |
| Implement small original solution | | | |
| Defer feature | | | |

## Recommendation

- Decision: KEEP / INTEGRATE / ADAPT / BUILD / DEFER / REJECT
- Maintainer review:
- Linked issue / PR:
- Acceptance criteria:
- Follow-up actions:
- Next review trigger:

This worksheet also holds the research-record fields formerly repeated in `docs/research/RESEARCH_BACKLOG.md`. Open research priorities belong in the [handoff](../../HANDOFF.md); immutable source evidence and decisions belong in the completed audit/ADR.
