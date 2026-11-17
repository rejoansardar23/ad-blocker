ANALYSEFUTURE — PRESERVED MATERIAL FOR REVIEW
==============================================

STATUS
------

Everything below this directory is preserved for forensic analysis, licensing
review, provenance recovery, security review, or possible future research. It
is NOT part of the active ad-blocker application, build, test suite, dependency
graph, release process, or trusted source base.

No preserved file was deleted during the repository reorganization. Imported
project trees retain their original internal paths because changing their
topology would damage provenance, licenses, imports, and future comparison.
Some frozen documents and commands therefore refer to their former repository
locations. Those references are historical evidence, not active instructions.

DIRECTORY MAP
-------------

OriginalUploads/
  The two original ZIP inputs restored from Git commit 893fcff364c52a941075ba646ad68c2c40434fe2.

ImportedUpstream/projects/
  ZIP-derived Ghostery Adblocker and uBlock Origin trees introduced by Git
  commit 9cde4e16e4d4e9580a2dcaa7b6ebb23858af31d5. Their internal layouts and
  file contents are preserved. projects/snapshots.json records per-file hashes.

ImportedUpstream/docs/
  A product-plan document introduced with the imported trees. It is retained
  for analysis but is not the active project plan.

ImportedUpstream/scripts/ and ImportedUpstream/tests/
  Archive verification, archive-derived build code, and an upstream adapter
  test from the disrupted root layout. They are preserved but not called by
  the active root package.json.

ImportedUpstream/root-integration/
  Frozen copies of the README, package configuration, and root workflow from
  the disrupted integration state. They preserve evidence of that design and
  may contain paths that no longer resolve from this location.

PROVENANCE AND INTEGRITY
------------------------

The local archives identify the supplied inputs, but no verified upstream Git
commit is known for either extracted tree. In projects/snapshots.json both
upstreamCommit values are null. Do not infer that a directory is an authentic,
current, or unmodified upstream checkout merely from its name.

Archive SHA-256 fingerprints:

  adblocker-master.zip
  4e8f01b9e54f3faf67e187988180550628b1a05890f10b56ff8b7e956b78ad2a

  uBlock-master.zip
  de1200bb89c40c4a4431465d156b84071179faefccf768f4ff118c3904ce4c4e

The imported snapshot currently contains 321 files in ghostery-adblocker and
1,063 files in ublock-origin. The recorded licenses differ: the Ghostery tree
declares MPL-2.0 and the uBlock Origin tree declares GPL-3.0-or-later. Reuse,
redistribution, or integration requires file-level, dependency, data-license,
notice, and distribution review; this notice is not legal approval.

SECURITY AND EXECUTION WARNING
------------------------------

Do not run package installation, lifecycle hooks, build scripts, release
scripts, archive scripts, tests, or workflows from this directory until the
exact input revision, dependency integrity, license compatibility, and runtime
behavior have been independently reviewed.

Concrete reasons for this boundary include:

* Nested .github/workflows files contain release and asset automation with
  write permissions and secret-name references. They are inert at their nested
  paths; never promote them to the repository root without review.
* Ghostery benchmark configuration includes a postinstall path and network
  downloads, including curl access to raw.githubusercontent.com.
* Imported scripts invoke child processes, Bash, git fetch/clone, build tools,
  or release tooling.
* Imported filter data, third-party assets, packages, and executable scripts
  have not been approved for the active product.
* The frozen root-integration workflow and package file would activate
  archive-derived commands if copied back to active root locations.

A static review did not identify committed credential values or private keys.
Workflow expressions that name secrets are references, not exposed values.
That limited observation does not make this material trusted or safe to run.

REVIEW GATE FOR FUTURE USE
--------------------------

Before moving any item out of AnalyseFuture, record all of the following:

1. Exact upstream repository and immutable commit or release.
2. Content/hash comparison against the authoritative upstream source.
3. Applicable source, dependency, asset, and filter-data licenses.
4. Security review of scripts, lifecycle hooks, network access, permissions,
   remote code/data, and supply-chain behavior.
5. Why the component is needed instead of the active first-party solution.
6. A narrowly scoped integration design, owner, acceptance criteria, rollback
   plan, and tests.
7. Explicit maintainer approval for any licensing or distribution impact.

Until that review is complete, this directory is evidence and research only.
