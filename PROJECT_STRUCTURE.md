# Project structure

This document is the authoritative map for the reorganized repository. The structure separates the active first-party Chrome extension from development support, durable documentation, generated output, and preserved material whose provenance or integration status is uncertain.

The reorganization is functionality-first: files are grouped by what they do and how they relate, not merely by extension. No existing tracked work was intentionally deleted. Uncertain and imported material is retained under [`AnalyseFuture/`](AnalyseFuture/README.txt) instead of being mixed into the active product.

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
│   ├── PULL_REQUEST_TEMPLATE.md      Contribution evidence checklist
│   └── CODEX_REVIEW_GUIDE.md         Coding-agent review handoff
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
│   └── build.mjs                     Builds only src/extension into dist/chrome
├── tests/
│   ├── unit/                         Node tests for domain, worker, cosmetic and UI logic
│   └── browser/                      Playwright Chromium extension fixtures
├── docs/
│   ├── architecture/                 Current design, flows and invariants
│   ├── development/                  Setup, workflow, release and execution guidance
│   ├── governance/                   Decisions, reuse policy and audit templates
│   ├── history/                      Durable handoffs and recovered project context
│   ├── product/                      Vision, requirements, matrix, roadmap and backlog
│   ├── research/                     Comparative studies and open research questions
│   ├── security/                     Privacy, permissions and security design
│   └── testing/                      Test strategy and browser-test guidance
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
  ├── verify/check ──> scripts/verify.mjs ──> src/extension/
  ├── test ─────────> tests/unit/ ─────────> src/extension/
  ├── build ────────> scripts/build.mjs ───> src/extension/ ──> dist/chrome/
  └── test:e2e ─────> tests/browser/ ──────> dist/chrome/

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

`AnalyseFuture/` has no edge in the active dependency flow. Root scripts, root package commands, and the root workflow do not install, build, test, or package its contents. Nested `.github/workflows/` below imported projects are inert because GitHub only loads workflows from the repository-root `.github/workflows/` directory.

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

- Put system design, data flow, module boundaries, and invariants in `docs/architecture/`.
- Put setup, contributor execution, CI/release operation, and coding workflow in `docs/development/`.
- Put durable decisions, licenses, reuse rules, and review templates in `docs/governance/`.
- Put dated handoffs and reconstructed context in `docs/history/`; do not treat snapshots as current facts without rechecking.
- Put product goals, requirements, feature evidence, checklists, and delivery phases in `docs/product/`.
- Put comparative studies, candidate catalogs, benchmarks, and unanswered questions in `docs/research/`.
- Put privacy, threat, permissions, and vulnerability-design material in `docs/security/`.
- Put test scope, fixtures, commands, limitations, and evidence rules in `docs/testing/`.

## Rules for future files

- Add production extension code only under `src/extension/` and keep its package-relative imports valid.
- Add active first-party automation under root `scripts/`; do not call quarantine scripts from root commands.
- Put fast isolated Node coverage in `tests/unit/` and real browser/system behavior in `tests/browser/`.
- Keep only repository entry points and conventional configuration at root.
- Place uncertain, damaged, unexplained, externally supplied, or unapproved imported work under a clearly described `AnalyseFuture/` subdirectory. Record source, hashes, license, risks, and a review gate.
- Never move a file out of `AnalyseFuture/` merely because its name resembles an active component. Integration requires provenance, license, security, architecture, and test evidence.
- Preserve third-party project layouts as units unless a separately approved vendoring design explicitly maps and verifies every change.
- Keep generated directories out of Git. The current ignored outputs include `node_modules/`, `dist/`, `build/`, `coverage/`, `playwright-report/`, `test-results/`, `.cache/`, and `.tmp/`.
- Update this file, affected imports, root commands, CI, and documentation links whenever a structural change is intentionally made.

## Preservation and validation record

The active source, configuration, tests, documentation, imported trees, original ZIP inputs, and disrupted-state files are all retained in the reorganized tree. `AnalyseFuture/README.txt` records the archive hashes and known provenance limitations. Imported codebase internals were deliberately left unchanged so `projects/snapshots.json` and Git blob history can be used for comparison.

Per the repository owner's instruction for this reorganization, application tests and builds were not run. Validation for this change is limited to path/reference inspection, JSON parsing, Git diff checks, file/hash accounting, and remote branch synchronization. This statement does not claim new runtime behavior or production readiness.
