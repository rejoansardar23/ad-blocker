# Repository integrity audit

Audit date: 18 November 2026 (Asia/Kolkata). Baseline: `ce77ac5eb212ca6388e4cd733beb6c9ee8cee49f`. This is a static Git/source review. It establishes what changed, not who was authorized to change it.

## Findings

| Finding | Evidence | Assessment / disposition |
|---|---|---|
| Large import and documentation removal occurred | `9cde4e16e4d4e9580a2dcaa7b6ebb23858af31d5` added 1,389 paths, deleted 35, and modified 3 relative to its parent. Removed paths included `AGENTS.md`, `SECURITY.md`, issue/PR templates, and the former root-level product, architecture, testing, governance, and history documents. | Confirmed disruptive change. Its intent and authorization cannot be inferred from file counts or author metadata. |
| Imported code was activated in CI | That commit added `verify:archives`, `build:ublock`, and `test:ublock` to root `package.json`, and archive/uBlock commands to `.github/workflows/checks.yml`. The preserved build script invokes `bash tools/make-nodejs.sh` from the ZIP-derived source. | Confirmed former trust-boundary expansion without an authenticated upstream revision. Current root scripts/workflow no longer invoke it. |
| Recovery restored a coherent active boundary | `e5260c983e6cca9c6003001d8eedc886cfb74e76` restored documents/templates, grouped original runtime under `src/extension/`, and retained import/archive/integration evidence under `AnalyseFuture/`. | Recovered in existing history before this mission. No additional bulk source move is justified. |
| Imported-file preservation is intact | Independently hashed all 321 Ghostery and 1,063 uBlock files against `AnalyseFuture/ImportedUpstream/projects/snapshots.json`: 1,384 matches, zero mismatches. Both original ZIPs match the recorded SHA-256 values below. | Verifies equality with the local recorded manifest only. Both `upstreamCommit` values remain `null`; it does not authenticate either upstream tree or authorize reuse/removal. |
| Active permission/dependency declarations were preserved | `src/extension/manifest.json` is byte-identical to `6191c3c:manifest.json`; `package-lock.json` is byte-identical to the same historical commit. | No permission expansion or locked dependency substitution found in those comparisons. Active permissions remain `declarativeNetRequest`, `storage`, and `activeTab`. |
| Imported automation has privileged/network behavior | Ghostery `bench/comparison/package.json` has a `postinstall` download; its Makefile fetches a pinned request dataset. Imported Ghostery release/assets workflows use app-token secret references and publishing/PR automation; uBlock workflow has release write permission, and tools clone/fetch upstream assets. | These may be normal upstream operations, but are unapproved and inert in this repository's nested quarantine paths. Never execute or promote them from their names alone. |
| Current active CI is limited to validation | Root workflow uses `contents: read`, a 25-minute timeout, locked install, lockfile guard, audit/SBOM, checks, active build, Chromium fixtures, and artifacts. | No active release/deploy workflow found. Major-version GitHub Action tags remain a supply-chain hardening opportunity; they are not evidence of compromise. |
| No high-confidence secret signature matched current tracked text | Scanned all 1,148 text files among the 1,455 baseline tracked files for private-key headers and recognizable GitHub, AWS access-ID, Slack, and OpenAI token patterns. Zero matches; values were never printed. | Limited signature scan. Binary/archive contents, historical blobs, arbitrary credential formats, GitHub settings, and account audit logs were not covered. It cannot certify that no secret ever existed. |
| Active runtime has no observed exfiltration/dynamic-code path | Read the five active JavaScript modules and checked for HTTP clients, `eval`/`new Function`, and HTML-string writes. No such calls matched; UI uses DOM construction and `textContent`. | No active exfiltration or remote executable code identified in the inspected code. Formal outbound-traffic capture and broader security testing remain open. |
| Settings reliability gaps remain | Worker writes settings before DNR API success; site exception messages independently read/modify/write state; already-open UI views lack external storage refresh. | Reproducible reliability work belongs in focused first-party fixes. These gaps are not evidence of an attacker. |

The 19 quarantined `package.json` files were parsed as data; 18 define scripts. Six files reside under imported `.github/workflows/`. No imported installation hook, build, test, workflow, or release command was executed. Nested workflows are not loaded by GitHub Actions from their current locations.

## History and recovery evidence

| Commit | Observed role |
|---|---|
| `6191c3c0e011c7533db7866a991e7336a85f69c6` | Earlier first-party handoff/governance baseline, merged PR #21 |
| `893fcff364c52a941075ba646ad68c2c40434fe2` | Added `adblocker-master.zip` and `uBlock-master.zip`; its parent was `6191c3c` |
| `9cde4e16e4d4e9580a2dcaa7b6ebb23858af31d5` | Extracted the imports, removed original ZIP paths/documents, and activated archive-derived tests |
| `1630a4571d364a452e00568a330bb77f2b7772b7` | GitHub merge of PR #22; retained both parent histories |
| `c68d86190fe74d63df7a9a73e3d191826ed83513` | First-party malformed-settings repair and confirmed reset |
| `e5260c983e6cca9c6003001d8eedc886cfb74e76` | Recovery and functionality-based organization |
| `ee0519f`, `652fe40`, `215bd5c`, `ce77ac5` | Grouped active verification, test evidence, and current product/task handoff |

Fetched branch heads at inspection:

| Origin branch | SHA |
|---|---|
| `main` | `ce77ac5eb212ca6388e4cd733beb6c9ee8cee49f` |
| `docs/03-ordered-codex-review-queue` | `d1ec46e189d20af5e19c658f835e74d8181689fa` |
| `docs/permanent-project-handoff-2026-11-16` | `c2b80b08694f2c478d3fa4346e032d385fd748a9` |
| `feature/01-chromium-smoke-tests` | `5eee93fdbb2e9e531ca6792fe31f4c1286e07ec8` |
| `fix/02-idempotent-rules-and-cosmetic-safety` | `943dc7484eb1be3d889986fa393318ee9af87f5c` |
| `fix/live-settings-consistency` | `13176deab7b2b54d7149f67e2f85247ab16b195c` |
| `integration/resolve-pr-18-preserve-both` | `d3c56e3ca34cba1953ac7b1fcdfff6afbcfd5401` |

No tags were returned. The initial local audit branch points to the baseline and contains no separate recovery work. Remote `recovery/pre-mission-ce77ac5` was pushed and read back at `ce77ac5eb212ca6388e4cd733beb6c9ee8cee49f` before cleanup. A complete-history Git bundle was also created and successfully verified at `/tmp/ad-blocker-pre-mission.bundle`; that bundle is a temporary machine-local backup. The owner should keep an offline copy if independent disaster recovery is required. Restore into a separate checkout from the remote recovery branch, bundle, or immutable baseline SHA; do not reset shared `main` or force-push.

Archive fingerprints:

- `AnalyseFuture/OriginalUploads/adblocker-master.zip`: `4e8f01b9e54f3faf67e187988180550628b1a05890f10b56ff8b7e956b78ad2a`
- `AnalyseFuture/OriginalUploads/uBlock-master.zip`: `de1200bb89c40c4a4431465d156b84071179faefccf768f4ff118c3904ce4c4e`

## Attribution and remaining uncertainty

Git records author/committer labels and GitHub merge commits, but those labels do not prove the identity, account control, or authorization of the person initiating a change. No collaborator was identified as an attacker. The owner-reported unauthorized access remains unconfirmed by this source audit.

GitHub API access was denied in this environment; public PR/Actions pages and fetched Git refs provide only public repository evidence. Private audit events, collaborators, deploy keys, OAuth/GitHub Apps, Actions secrets, branch protection, account sessions, and organization settings were not available. See the operational handoff for the latest public PR/CI state; historical green CI does not validate later commits.

## Owner actions and next engineering work

1. Review GitHub security/audit events and active sessions; revoke unfamiliar sessions, personal tokens, OAuth/GitHub Apps, SSH/deploy keys, collaborators, and Actions credentials only after identifying their ownership and purpose. Enable strong two-factor authentication/passkeys and recovery methods.
2. Review branch protection, required checks/reviews, workflow permissions, repository access, and release authority. These are account-level controls; this mission did not change them.
3. If a credential was exposed in logs, history, or an unauthorized service, revoke/rotate it at its issuer. Removing a file alone does not invalidate a credential. No credential value was printed or committed by this audit.
4. Preserve unknown imports until authentic upstream revisions and code/data/asset/dependency rights are established. Ghostery declares MPL-2.0 and uBlock GPL-3.0-or-later at their roots; neither clears all bundled material. The project's distribution license is still an owner decision.
5. Keep static inventory and artifact-boundary checks reproducible, then fix current first-party settings synchronization/concurrency and API-failure recovery with regressions. Do not activate imported engines to solve those independent problems.

The report's confirmed remediation is the existing recovered isolation boundary plus the new reproducible audit/evidence work. It does not claim account compromise was resolved, third-party source was legally approved, every source line received manual review, or all security/performance/real-site tests passed.
