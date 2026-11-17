# Project structure

This document is the authoritative map for the reorganized repository. The structure separates the active first-party Chrome extension from development support, durable documentation, generated output, and preserved material whose provenance or integration status is uncertain.

Files are grouped by functionality, responsibility, and dependency rather than extension. The earlier reorganization preserved existing work. The 18 November documentation cleanup consolidates nine redundant guidance files into maintained destinations; their originals remain recoverable from commit `ce77ac5` and remote branch `recovery/pre-mission-ce77ac5`. Unverified imports remain isolated under [`AnalyseFuture/`](AnalyseFuture/README.txt) pending their provenance and removal/reuse review.

## Organization principles

1. **One active product boundary.** `src/extension/` is the only Chrome extension source copied into the distributable package.
2. **First-party automation stays obvious.** Root `scripts/`, `tests/`, `package.json`, and `.github/workflows/` operate on the active project only.
3. **Documentation follows reader intent.** Architecture, development, governance, history, product, research, security, and testing records have separate collections.
4. **Imported work is preserved, not silently trusted.** ZIP inputs, extracted upstream trees, and disrupted-state integration files live in `AnalyseFuture/` with provenance and execution warnings.
5. **Upstream topology remains intact.** The two imported codebases are isolated as whole trees rather than rearranged internally, preserving their imports, build systems, licenses, recorded hashes, and forensic value.
6. **Generated output is reproducible.** `node_modules/`, `dist/`, `build/`, coverage, browser reports, caches, and temporary results remain ignored rather than becoming source collections.
7. **History remains Git-native.** Moves preserve Git rename ancestry where Git can detect it; no force push or history rewrite is required.

## Repository map

```text
.
├── .github/
│   ├── workflows/checks.yml          Active CI for the first-party extension
│   ├── ISSUE_TEMPLATE/               Bug, feature and research intake
│   └── PULL_REQUEST_TEMPLATE.md      Contribution evidence checklist
├── src/
│   └── extension/                    Active Chrome Manifest V3 application
│       ├── manifest.json             Permissions, entry points and DNR resources
│       ├── background/               Service worker and settings/DNR coordination
│       ├── content/                  Page-side cosmetic filtering
│       ├── shared/                   Runtime logic shared across extension contexts
│       ├── rules/                    Packaged declarative network rules
│       ├── popup/                    Toolbar action interface
│       └── options/                  Settings and trusted-sites interface
├── scripts/
│   ├── verify.mjs                    Active structure/manifest/source validation
│   ├── verify-repository.mjs         Active links, package paths and trust boundaries
│   ├── audit-repository.mjs          Static tracked-file inventory, hashes and references
│   └── build.mjs                     Builds only src/extension into dist/chrome
├── tests/
│   ├── unit/                         Node runtime and repository-tooling regressions
│   └── browser/                      Playwright Chromium extension fixtures
├── docs/
│   ├── architecture/                 Current design, flows and invariants
│   ├── audit/                        Static inventory method and reuse decisions
│   ├── development/                  Developer setup and release guidance
│   ├── governance/                   Decisions, reuse policy and audit templates
│   ├── history/                      Durable handoffs and recovered project context
│   ├── product/                      Requirements, feature matrix and 60-step checklist
│   ├── research/                     Candidate evidence, catalog and benchmark methodology
│   ├── security/                     Integrity investigation, privacy and permissions
│   └── testing/                      Strategy, baseline evidence and browser guidance
├── AnalyseFuture/
│   ├── README.txt                    Quarantine status, provenance and safety gate
│   ├── OriginalUploads/              Restored original ZIP inputs
│   └── ImportedUpstream/
│       ├── projects/                 Intact Ghostery and uBlock-derived trees + hashes
│       ├── docs/                     Preserved imported product-plan snapshot
│       ├── scripts/                  Preserved archive/import utilities
│       ├── tests/                    Preserved upstream-adapter test
│       └── root-integration/         Frozen disrupted-state root files
├── README.md                         Project entry point and honest capability status
├── HANDOFF.md                        Current operations, roadmap, tasks and review protocol
├── PROJECT_IDEA.txt                  Detailed long-term product/research charter
├── PROJECT_STRUCTURE.md              This structural source of truth
├── AGENTS.md                         Persistent coding-agent constraints
├── CONTRIBUTING.md                   Contributor workflow and quality bar
├── SECURITY.md                       Vulnerability reporting policy
├── package.json                      Active commands and dependency declaration
├── package-lock.json                 Reproducible development dependency lock
└── .gitignore                        Generated-output and local-secret exclusions
```

## Active dependency and execution flow

```text
package.json
  ├── verify/check ──> scripts/verify.mjs + verify-repository.mjs
  │                     └──> src/extension/ and maintained repository references
  ├── test ─────────> tests/unit/ ─────────> src/extension/
  ├── build ────────> scripts/build.mjs ───> src/extension/ ──> dist/chrome/
  ├── test:e2e ─────> build, then tests/browser/ ──> dist/chrome/
  └── audit:repository ──> static index/file reads ──> ignored build/audit/

.github/workflows/checks.yml ──> the root package commands above
```

Within the extension:

- `manifest.json` declares the background worker, popup, options page, content scripts, permissions, and packaged DNR rules.
- `background/service-worker.js` owns validated settings changes and Chrome declarativeNetRequest synchronization.
- `shared/domain.js` provides domain normalization and matching used by extension contexts and unit tests.
- `content/cosmetic.js` applies and removes narrowly scoped cosmetic CSS based on stored settings.
- `popup/` and `options/` are user interfaces that communicate with the service worker.
- `rules/starter.json` is the packaged proof-of-concept network ruleset.

Relative paths inside `src/extension/manifest.json`, extension HTML, and extension JavaScript remain relative to the extension package. They intentionally do not include the repository-level `src/extension/` prefix.

`AnalyseFuture/` has no runtime or executable build/test edge. Active commands do not install, execute, build, test, or package its contents. The repository audit may read/hash its tracked files as data; it never imports or runs them. Nested `.github/workflows/` below imported projects are inert because GitHub only loads workflows from the repository-root `.github/workflows/` directory.

## Old-to-new location map

| Previous location | Current location | Functional reason |
|---|---|---|
| `manifest.json` | `src/extension/manifest.json` | Keep the runtime manifest with the runtime it describes |
| `background/` | `src/extension/background/` | Extension background runtime |
| `content/` | `src/extension/content/` | Extension page runtime |
| `shared/` | `src/extension/shared/` | Shared extension runtime logic |
| `rules/` | `src/extension/rules/` | Packaged extension rules |
| `popup/` | `src/extension/popup/` | Extension toolbar UI |
| `options/` | `src/extension/options/` | Extension settings UI |
| `tests/*.test.mjs` | `tests/unit/*.test.mjs` | Node-scoped tests separated from browser automation |
| `tests/chromium-smoke.mjs` | `tests/browser/chromium-smoke.mjs` | Browser integration scope |
| root-level `docs/*` | `docs/<topic>/*` | Documentation grouped by purpose and audience |
| `projects/` | `AnalyseFuture/ImportedUpstream/projects/` | Unverified ZIP-derived code isolated from active source |
| archive/import utilities | `AnalyseFuture/ImportedUpstream/scripts/` | Preserve inactive imported tooling without activating it |
| upstream adapter tests | `AnalyseFuture/ImportedUpstream/tests/` | Preserve inactive imported verification material |
| disrupted replacement plan/config | `AnalyseFuture/ImportedUpstream/docs/` and `root-integration/` | Preserve uncertain integration work as evidence |
| original ZIP archives | `AnalyseFuture/OriginalUploads/` | Retain exact supplied inputs and fingerprints |

## Documentation routing

- `README.md` owns the short introduction and first commands; `AGENTS.md` owns coding-agent operating rules; `CONTRIBUTING.md` owns human contribution guidance.
- `HANDOFF.md` owns live operations, dependency-ordered tasks, milestones, issue/PR state, and next work. `PROJECT_IDEA.txt` retains distinct long-term research protocols rather than serving as a live status ledger.
- `docs/product/FEATURE_MATRIX.md` owns capability evidence; `IMPLEMENTATION_CHECKLIST.md` retains the original 60-item program. Update both only where evidence changes.
- Put system design, data flow, module boundaries, and invariants in `docs/architecture/`.
- Put inventory scope, static classification limitations, and reviewed reuse/removal conclusions in `docs/audit/`; generate detailed inventories under ignored `build/audit/`.
- Put setup, contributor execution, CI/release operation, and coding workflow in `docs/development/`.
- Put durable decisions, licenses, reuse rules, and review templates in `docs/governance/`.
- Put dated handoffs and reconstructed context in `docs/history/`; do not treat snapshots as current facts without rechecking.
- Put product requirements, feature evidence, and the retained checklist in `docs/product/`; current delivery priorities belong in the handoff.
- Put comparative evidence, candidate catalogs, and benchmark methods in `docs/research/`; open research work belongs in the handoff.
- Put privacy, threat, permissions, and vulnerability-design material in `docs/security/`.
- Put test scope, fixtures, commands, limitations, and evidence rules in `docs/testing/`.

## Rules for future files

- Add production extension code only under `src/extension/` and keep its package-relative imports valid.
- Add active first-party automation under root `scripts/`; do not call quarantine scripts from root commands.
- Put fast isolated Node coverage in `tests/unit/` and real browser/system behavior in `tests/browser/`.
- Keep only repository entry points and conventional configuration at root.
- Do not add speculative source dumps or duplicate planning documents. Any proposed import must have a demonstrated need, source/hash/license/security record, isolation boundary, and explicit reuse or removal decision. Existing uncertain evidence stays isolated until reviewed.
- Never move a file out of `AnalyseFuture/` merely because its name resembles an active component. Integration requires provenance, license, security, architecture, and test evidence.
- Preserve third-party project layouts as units unless a separately approved vendoring design explicitly maps and verifies every change.
- Keep generated directories out of Git. The current ignored outputs include `node_modules/`, `dist/`, `build/`, `coverage/`, `playwright-report/`, `test-results/`, `.cache/`, and `.tmp/`.
- Update this file, affected imports, root commands, CI, and documentation links whenever a structural change is intentionally made.

## Preservation and validation record

The production source paths are unchanged by the documentation consolidation. Nine redundant files are removed after transferring their useful content and repairing references. `AGENTS.md` and `HANDOFF.md` replace repeated agent/PR prompts; README replaces the extra starting guide; architecture retains the DNR/style invariant note; handoff retains vision, milestone gates, and open research; the reuse worksheet retains research-record fields.

`AnalyseFuture/README.txt` records archive hashes and unknown upstream revisions. Imported internals, licenses, original ZIPs, and disrupted-state evidence remain unchanged. The static audit compares them with the locally recorded snapshot without asserting upstream authenticity.

The earlier restructuring commit deliberately did not run application tests. Later tests and CI supersede that historical validation scope; see the [baseline report](docs/testing/BASELINE_TEST_REPORT.md), [test evidence](docs/testing/TEST_EVIDENCE.md), and [structure decisions](docs/architecture/STRUCTURE_MIGRATION_PLAN.md) for current results and remaining limits.
