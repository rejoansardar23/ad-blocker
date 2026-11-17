import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { classifyFile, collectRepositoryAudit, csvCell, duplicateGroups, safePath, sha256, verifySnapshots, writeAuditReports } from "../../scripts/audit-repository.mjs";

test("repository audit keeps quarantine outside active product/build classifications", () => {
  const active = classifyFile("src/extension/background/service-worker.js", "const a = 1;");
  assert.equal(active.classification, "ACTIVE_PRODUCT");
  assert.equal(active.extension_runtime, true);
  const imported = classifyFile("AnalyseFuture/ImportedUpstream/projects/ublock-origin/src/js/start.js", "const a = 1;");
  assert.equal(imported.classification, "UNVERIFIED_IMPORT");
  assert.equal(imported.active_use, false);
  assert.equal(imported.extension_runtime, false);
  assert.equal(imported.build_test_process, false);
  assert.equal(imported.security_review_required, true);
  assert.match(imported.license, /require review/);
  assert.equal(classifyFile("unexpected-file.xyz").classification, "UNKNOWN");
});

test("inventory CSV quotes fields and neutralizes spreadsheet formulas", () => {
  assert.equal(csvCell('one,"two"\nthree'), '"one,""two""\nthree"');
  for (const value of ["=1+1", "+cmd", "-value", "@SUM(A1)", " \t=1", "\rhello"]) {
    assert.ok(csvCell(value).startsWith('"\''));
  }
  assert.equal(csvCell("normal/path.js"), '"normal/path.js"');
});

test("audit paths reject traversal and symlink ancestors without reading their contents", () => {
  const root = mkdtempSync(path.join(tmpdir(), "audit-path-"));
  const outside = mkdtempSync(path.join(tmpdir(), "audit-outside-"));
  try {
    mkdirSync(path.join(root, "ordinary"));
    writeFileSync(path.join(outside, "secret.txt"), "must not be read");
    symlinkSync(outside, path.join(root, "linked"), "dir");
    symlinkSync(path.join(outside, "missing"), path.join(root, "dangling"));
    assert.equal(safePath(root, "ordinary/file.txt"), path.join(root, "ordinary", "file.txt"));
    for (const value of ["../secret", "/tmp/secret", "ordinary/../secret", "ordinary\\secret", "ordinary//file"]) {
      assert.throws(() => safePath(root, value), /Unsafe/);
    }
    assert.throws(() => safePath(root, "linked/secret.txt"), /Symlink/);
    assert.throws(() => safePath(root, "dangling"), /Symlink/);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(outside, { recursive: true, force: true });
  }
});

test("duplicate detection uses complete hashes and keeps separate preservation decisions", () => {
  const same = sha256(Buffer.from("same bytes"));
  const groups = duplicateGroups([{ path: "b", sha256: same }, { path: "a", sha256: same }, { path: "c", sha256: sha256(Buffer.from("different")) }]);
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0].paths, ["a", "b"]);
  assert.match(groups[0].decision, /do not justify deletion/);
});

test("local snapshot checks expose changed, missing and unrecorded files without claiming authenticity", () => {
  const base = "AnalyseFuture/ImportedUpstream/projects/ghostery-adblocker/";
  const hash = sha256(Buffer.from("original"));
  const manifest = { projects: [{ directory: "ghostery-adblocker", archive: "input.zip", archiveSha256: hash, files: { "same.js": hash, "changed.js": hash, "missing.js": hash }, upstreamCommit: null }] };
  const results = verifySnapshots(manifest, [
    { path: base + "same.js", sha256: hash },
    { path: base + "changed.js", sha256: sha256(Buffer.from("changed")) },
    { path: base + "extra.js", sha256: hash },
    { path: "AnalyseFuture/OriginalUploads/input.zip", sha256: hash }
  ]);
  assert.equal(results[0].matched_files, 1);
  assert.deepEqual(results[0].mismatches.map((item) => item.status), ["HASH_MISMATCH", "MISSING"]);
  assert.deepEqual(results[0].extra_files, [base + "extra.js"]);
  assert.equal(results[0].archive_matches_recorded_hash, true);
  assert.equal(results[0].upstream_commit, null);
  assert.match(results[0].interpretation, /does not authenticate upstream/);
  manifest.projects[0].files = { "../escape.js": hash };
  assert.throws(() => verifySnapshots(manifest, []), /Unsafe snapshot/);
});

test("inventory collection accounts for tracked paths without following symlinks or including untracked files", () => {
  const root = mkdtempSync(path.join(tmpdir(), "audit-collection-"));
  const git = (...args) => execFileSync("git", args, { cwd: root, stdio: "pipe" });
  try {
    git("init", "--quiet");
    writeFileSync(path.join(root, "README.md"), "[Worker](src/extension/background/service-worker.js)\n");
    mkdirSync(path.join(root, "src/extension/background"), { recursive: true });
    writeFileSync(path.join(root, "src/extension/background/service-worker.js"), "// fixture, never executed\n");
    symlinkSync(path.join(root, "absent-secret"), path.join(root, "unsafe-link"));
    git("add", ".");
    git("-c", "user.name=Inventory Test", "-c", "user.email=inventory@example.test", "-c", "core.hooksPath=/dev/null", "commit", "--quiet", "-m", "fixture");
    writeFileSync(path.join(root, "untracked.txt"), "not in inventory");
    const audit = collectRepositoryAudit(root);
    assert.equal(audit.summary.tracked_files, 3);
    assert.equal(audit.summary.unreadable_or_refused_files, 1);
    assert.equal(audit.files.find((file) => file.path === "unsafe-link").sha256, null);
    assert.equal(audit.files.some((file) => file.path === "untracked.txt"), false);
    const worker = audit.files.find((file) => file.path.endsWith("service-worker.js"));
    assert.equal(worker.integrity, "MATCHES_GIT_INDEX");
    assert.deepEqual(worker.referenced_by, ["README.md"]);
    assert.ok(worker.tested_by.includes("tests/unit/service-worker.test.mjs"));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("CSV retains fields present only in later inventory rows and refuses symlink output destinations", () => {
  const root = mkdtempSync(path.join(tmpdir(), "audit-output-"));
  try {
    const audit = { commit: "fixture", files: [{ path: "first" }, { path: "second", snapshot_integrity: "MATCHES_LOCAL_SNAPSHOT" }],
      summary: { tracked_files: 2, active_boundary_files: 1, quarantined_files: 1, tracked_folder_count: 0, unreadable_or_refused_files: 0 },
      duplicates: [], snapshots: [], limitations: [] };
    writeAuditReports(root, audit);
    const csv = readFileSync(path.join(root, "build/audit/FILE_INVENTORY.csv"), "utf8");
    assert.match(csv.split("\n")[0], /snapshot_integrity/);
    assert.match(csv, /MATCHES_LOCAL_SNAPSHOT/);
    rmSync(path.join(root, "build/audit/FILE_INVENTORY.csv"));
    symlinkSync(path.join(root, "missing"), path.join(root, "build/audit/FILE_INVENTORY.csv"));
    assert.throws(() => writeAuditReports(root, audit), /Symlink/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
