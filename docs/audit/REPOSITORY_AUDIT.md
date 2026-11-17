# Repository inventory and reuse decisions

Audit baseline: `ce77ac5eb212ca6388e4cd733beb6c9ee8cee49f`. Recorded 18 November 2026 (Asia/Kolkata). The snapshot below precedes the audit tooling and subsequent mission changes; rerun the command for the current index.

## Reproduce the complete inventory

```bash
node scripts/audit-repository.mjs
node --test tests/unit/repository-audit.test.mjs
```

The first command writes ignored reports under `build/audit/`: `FILE_INVENTORY.json`, `FILE_INVENTORY.csv`, `DUPLICATES.json`, `DEPENDENCIES.json`, and `SUMMARY.md`. Large generated reports are reproducible artifacts rather than maintained source. Stage intended new files before generating a final index inventory; untracked and ignored files are deliberately excluded.

Every tracked path receives a functional classification and purpose, origin, size/type, Git index blob, working-file SHA-256, active/runtime/build-test flags, executable-code indicator, reference relationships, known validation files, integrity result, license-review status, security-review flag, and recommended action. CSV cells are quoted and spreadsheet formulas are neutralized. Symlinks, dangling links, and traversal outside the repository are refused; refused files remain counted with a visible error.

This is a static inventory, not a claim of manually understanding every third-party module. Every regular file is read and hashed. Reference scanning is limited to recognized text up to 1 MiB, literal imports/resources/Markdown links, manifest paths, known package commands, and explicitly maintained build/validation relationships. Dynamic dependencies and complete test coverage require engineering review. No audited file, package hook, archive, or nested workflow is executed. Outputs contain metadata and hashes, not copied file contents or credential values.

## Baseline results

| Metric | Result |
|---|---:|
| Tracked files | 1,455 |
| Tracked directory paths, excluding repository root | 327 |
| Files outside quarantine | 60 |
| Active packaged extension files | 11 |
| Quarantined files | 1,395 |
| Imported upstream module/configuration/asset files | 1,384 |
| Markdown files across all tracked collections | 87 |
| TXT files across all tracked collections | 179 |
| Unreadable/refused tracked files | 0 |
| Working files differing from Git index | 0 |
| Exact-content duplicate groups | 11 |
| Ghostery files matching the local snapshot | 321 / 321 |
| uBlock files matching the local snapshot | 1,063 / 1,063 |
| Unrecorded paths inside either snapshot | 0 |
| Supplied ZIP archives matching recorded SHA-256 | 2 / 2 |

Both `upstreamCommit` values are null. Matching Git/index/local snapshot hashes proves preservation of recorded inputs, not authentic upstream origin, security, ownership, or distribution rights.

## Dependency and placement conclusions

The active manifest references the worker, popup, options, shared domain helper, cosmetic content script, and starter DNR resource. Popup/options HTML reference their local CSS/JS and domain helper. Controls use runtime messages to the worker; the worker and cosmetic content script use local storage; the worker drives browser DNR. Unit tests validate isolated domain, worker, cosmetic, and UI behavior. The browser script loads only the generated active extension. Root package commands and CI operate on those first-party files.

The source, tests, scripts, topical docs, and generated-output boundaries are already functional. No large production-source migration is justified. The inventory includes every imported file without activating it. Documentation duplication/status drift and the older mixed-scope PR #20 require focused reconciliation; their existence does not justify another runtime rewrite.

## Duplicate decisions

All eleven exact-byte duplicate groups occur within preserved imported trees. There are no exact-byte duplicates between the active first-party files at the baseline.

| Duplicate family | Groups | Decision |
|---|---:|---|
| Country/territory flag images with distinct locale paths | 3 | Preserve paths; country assets can intentionally share pixels |
| Distribution/store descriptions for multiple locales | 2 | Preserve until upstream provenance and packaging requirements are known |
| Per-package Rollup, TypeScript, and npm-ignore configuration | 3 | Preserve package-local semantics even when bytes match |
| Repeated MPL license texts | 1 | Preserve required license evidence; identical notices are not disposable duplicates |
| Empty `.gitmodules`, `.gitkeep`, and web resource | 1 | Different semantic roles despite identical empty bytes |
| Three matching imported filter-data files | 1 | Keep isolated; review whether placeholders/data revisions are valid before any use |

The complete exact paths and hashes appear in `DUPLICATES.json`. Hash equality alone does not establish that a file is safe to consolidate or remove. Documentation with different bytes may still be semantically redundant and requires content review.

## Component decisions

| Component/function | Decision | Reason and next gate |
|---|---|---|
| Original Chrome DNR/settings/domain/cosmetic runtime | KEEP EXISTING | Working first-party foundation; fix demonstrated reliability gaps and retain regression evidence |
| Ghostery parser/network-filter semantics | DEFER | Useful reference, but archive revision is unknown; MPL/file/data/dependency obligations and an actual MV3 compiler benefit remain unresolved |
| Ghostery browser/desktop adapters and examples | REFERENCE / DEFER | Not required by the current Chrome runtime; separate adapters do not prove compatible DNR behavior |
| uBlock MV3 compiler/ruleset architecture | REFERENCE / DEFER | Relevant design study; imported revision and GPL/data obligations prevent silent copying into an undecided distribution |
| Imported scriptlets, cosmetics, lists, assets, and libraries | DEFER | Separate security, provenance, source/data/asset license, performance, and compatibility review required |
| Imported release, lifecycle, archive, and network scripts | EXCLUDE FROM ACTIVE EXECUTION | Preserve as evidence; never call them from root automation |
| Third-party project dumps as runtime dependencies | REJECT CURRENT INTEGRATION | Active build has no dependency on either tree; no measured benefit or legal approval supports wholesale integration |
| Independent UI synchronization and concurrency fixes | IMPLEMENT | Current first-party gaps can be addressed without external engines, permissions, services, or source imports |

Removal of an entire imported collection requires a recoverable reference, origin/content verification, review of any retained license/security evidence, proof of no active dependencies, and a focused tested cleanup decision. The unknown upstream revisions remain a real unresolved condition; the inventory does not invent them.
