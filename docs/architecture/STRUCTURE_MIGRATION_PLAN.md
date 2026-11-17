# Structure and consolidation decisions

Baseline: `ce77ac5`, 18 November 2026 (Asia/Kolkata). See the [baseline tests](../testing/BASELINE_TEST_REPORT.md), [integrity audit](../security/REPOSITORY_INTEGRITY_AUDIT.md), and [inventory](../audit/REPOSITORY_AUDIT.md).

The active extension already has coherent functional boundaries. No production move, framework migration, empty package hierarchy, or upstream-tree merge is justified.

| Current location | Proposed location/action | Reason | Dependencies | Risk | Test required |
|---|---|---|---|---|---|
| `src/extension/` | KEEP | One verified MV3 product | Manifest, HTML, scripts, tests | Unnecessary move would add churn | Existing structure/unit/browser suite |
| `scripts/`, `tests/` | KEEP; add static audit/boundary checks | Missing reproducible repository inventory and docs/package guards | Root commands and CI | Tooling must read quarantine only as data | Fixture tests, complete inventory, package comparison |
| Overlapping onboarding/agent/PR documents | Consolidate into README, AGENTS, HANDOFF; remove verified redundant originals in separate commit | Contradictory live instructions and stale prompts | Redirect inbound links; transfer unique material first | Loss of unique historical evidence | Link/file accounting; recovery ref; reviewed diff |
| Repeated vision/roadmap/invariant notes | Consolidate into HANDOFF and ARCHITECTURE | One current task source and technical invariant record | Preserve milestone exit gates and research fields | False status updates | Checklist mapping, source comparison, docs guard |
| `AnalyseFuture/` imported trees/ZIPs | DEFER removal or reuse | Unknown upstream commits and unresolved source/data licensing | Independent provenance/security/license review | Irreplaceable evidence or unauthorized redistribution | Local snapshot hashes only; never execute imports |
| Future browser/core/mobile/DNS modules | DEFER until implemented consumers exist | Avoid imaginary architecture | Approved ADR, owner, real code and tests | Maintenance and permission scope | Independent platform matrix |

No active import/build changes are needed for the proposed documentation consolidation. Deeper runtime separation and any move out of quarantine require additional tests or license/security approval. The full baseline remains accessible at remote `recovery/pre-mission-ce77ac5`; removal does not rewrite history.
