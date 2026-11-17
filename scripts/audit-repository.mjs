/** Static inventory only: never imports, installs, or executes audited files. */
import { createHash, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { lstatSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const QUARANTINE = "AnalyseFuture/";
const SNAPSHOT = "AnalyseFuture/ImportedUpstream/projects/snapshots.json";
const SOURCE_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".ts", ".cts", ".mts", ".py", ".sh", ".wasm", ".wat"]);
const TEXT_EXTENSIONS = new Set([...SOURCE_EXTENSIONS, ".json", ".html", ".css", ".md", ".txt", ".yml", ".yaml", ".xml", ".toml", ".ini", ".patch"]);
const ROOT_PURPOSES = {
  "README.md": "Repository homepage and onboarding",
  "AGENTS.md": "Coding-agent operating instructions",
  "HANDOFF.md": "Current operations, status, tasks and review handoff",
  "PROJECT_STRUCTURE.md": "Functional directory and preservation map",
  "PROJECT_IDEA.txt": "Long-term product and research charter",
  "CONTRIBUTING.md": "Contribution workflow and quality requirements",
  "SECURITY.md": "Private vulnerability reporting policy",
  "package.json": "Active commands and development dependency declaration",
  "package-lock.json": "Locked development dependency graph",
  ".gitignore": "Generated-output and local-secret exclusions"
};

export const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

export function safePath(root, relative) {
  if (typeof relative !== "string" || !relative || relative.includes("\\") || relative.includes("\0") ||
      path.posix.isAbsolute(relative) || relative.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new Error("Unsafe repository-relative path");
  }
  const absolute = path.resolve(root, relative);
  if (!absolute.startsWith(path.resolve(root) + path.sep)) throw new Error("Path escapes repository");
  // Check every component, not just the leaf: a regular leaf below a symlink is unsafe.
  let current = path.resolve(root);
  if (lstatSync(current).isSymbolicLink()) throw new Error("Repository root is a symlink");
  for (const part of relative.split("/")) {
    current = path.join(current, part);
    let stat;
    try { stat = lstatSync(current); }
    catch (error) {
      if (error.code === "ENOENT") break;
      throw error;
    }
    // lstat detects dangling links too; existsSync would hide them.
    if (stat.isSymbolicLink()) throw new Error("Symlink traversal refused");
  }
  return absolute;
}

export function classifyFile(file, text = "") {
  const name = path.posix.basename(file);
  const quarantined = file.startsWith(QUARANTINE);
  const upstream = file.match(/^AnalyseFuture\/ImportedUpstream\/projects\/(ghostery-adblocker|ublock-origin)\//)?.[1];
  let classification = "UNKNOWN";
  let purpose = ROOT_PURPOSES[file] || "Purpose requires human review";
  if (quarantined) {
    classification = upstream ? "UNVERIFIED_IMPORT" : "ARCHIVED";
    purpose = upstream ? `Preserved ${upstream} ${upstreamRole(file)}` :
      file.includes("OriginalUploads/") ? "Exact supplied archive input; historical evidence" :
      file.includes("root-integration/") ? "Frozen disrupted-state integration evidence" :
      file.includes("/scripts/") ? "Inactive imported archive/build utility" :
      file.includes("/tests/") ? "Inactive imported upstream-adapter test" :
      file.includes("/docs/") ? "Preserved imported plan; not active product requirements" :
      file === "AnalyseFuture/README.txt" ? "Quarantine provenance, restrictions and promotion gate" :
      file === SNAPSHOT ? "Local imported-file hash and archive provenance manifest" : "Preserved material requiring provenance review";
  } else if (/^(?:node_modules|dist|build|coverage|playwright-report|test-results|\.cache|\.tmp)\//.test(file)) {
    classification = "GENERATED";
    purpose = "Generated output unexpectedly tracked; review before removal";
  } else if (file.startsWith("src/extension/")) {
    classification = "ACTIVE_PRODUCT";
    const component = file.split("/")[2];
    purpose = ({ "manifest.json": "MV3 permissions, entry points and bundled rule references", background: "Local settings validation, recovery and browser DNR coordination", shared: "Shared hostname validation and exception matching", content: "Page-side reversible cosmetic filtering", rules: "Packaged static declarative network rules", popup: "Toolbar control interface", options: "Settings, trusted-site and recovery interface" })[component] || "Active extension component; inspect module responsibility";
  } else if (file.startsWith("tests/")) {
    classification = "ACTIVE_TEST";
    purpose = file.startsWith("tests/browser/") ? "Controlled real-browser extension regression fixtures" : "Isolated Node behavior/security/tooling regressions";
  } else if (file.startsWith("scripts/")) {
    classification = "BUILD_TOOL";
    purpose = file === "scripts/build.mjs" ? "Verified active-extension packaging" : file === "scripts/verify.mjs" ? "Active layout, manifest and JavaScript verification" : file === "scripts/audit-repository.mjs" ? "Static tracked-file inventory, hashes, duplicates and relationships" : "First-party automation; inspect called commands";
  } else if (file.startsWith(".github/workflows/")) {
    classification = "AUTOMATION";
    purpose = "Active root GitHub Actions validation workflow";
  } else if (file.startsWith(".github/")) {
    classification = "DOCUMENTATION";
    purpose = "Issue/PR intake or coding-agent review guidance";
  } else if (file.startsWith("docs/research/")) {
    classification = "RESEARCH";
    purpose = "Source/license research, comparisons or unresolved questions";
  } else if (file.startsWith("docs/")) {
    classification = file.startsWith("docs/history/") ? "ARCHIVED" : "DOCUMENTATION";
    purpose = `${file.startsWith("docs/history/") ? "Dated historical" : file.split("/")[1]} documentation`;
  } else if (ROOT_PURPOSES[file]) {
    classification = ["package.json", "package-lock.json", ".gitignore"].includes(file) ? "BUILD_TOOL" : "DOCUMENTATION";
  }
  const executableCode = SOURCE_EXTENSIONS.has(path.posix.extname(file)) || /^#!/.test(text) ||
    /<script\b/i.test(text) || /(?:^|\n)\s*(?:run:|scripts\s*:)/.test(text) || name === "Makefile" ||
    name === "package.json" && /"(?:preinstall|install|postinstall|scripts)"\s*:/.test(text);
  return {
    classification, purpose, classification_basis: "Functional path and limited content heuristics; not a manual semantic audit",
    origin: upstream ? `ZIP-derived ${upstream}; upstream commit unverified` : quarantined ? "Preserved input/integration evidence; see quarantine provenance" : "First-party repository work; contributor provenance requires Git review",
    active_use: !quarantined && !["ARCHIVED", "UNKNOWN", "GENERATED"].includes(classification),
    extension_runtime: !quarantined && file.startsWith("src/extension/"),
    build_test_process: !quarantined && ["ACTIVE_TEST", "BUILD_TOOL", "AUTOMATION"].includes(classification),
    contains_executable_code: executableCode,
    security_review_required: quarantined && executableCode || classification === "UNKNOWN" || classification === "GENERATED",
    license: upstream === "ghostery-adblocker" ? "Root declares MPL-2.0; file/dependency/data rights require review" : upstream === "ublock-origin" ? "Root declares GPL-3.0-or-later; file/dependency/data rights require review" : quarantined ? "Unapproved; provenance and file/data licenses require review" : "No approved project-wide distribution license; owner decision required",
    action: quarantined ? "PRESERVE_ISOLATED; exclude from active builds; review before reuse" : classification === "GENERATED" || classification === "UNKNOWN" ? "REVIEW; do not delete automatically" : "REMAIN; preserve functional boundary"
  };
}

function upstreamRole(file) {
  if (/(?:^|\/)(?:LICENSE[^/]*|COPYING[^/]*|NOTICE[^/]*)$/i.test(file)) return "license/notice evidence";
  if (file.includes("/.github/")) return "inactive workflow/repository automation";
  if (/(?:^|\/)(?:test|tests|bench)(?:\/|$)/.test(file)) return "test/benchmark fixture or tooling";
  if (/\/(?:tools|scripts)\//.test(file)) return "build/release utility";
  if (/\/(?:assets|lists|_locales)\//.test(file)) return "filter/asset/translation data";
  if (/\/(?:docs|talks)\//.test(file) || /\.(?:md|txt)$/i.test(file)) return "documentation or data; inspect file-specific meaning";
  const packageName = file.match(/\/ghostery-adblocker\/packages\/([^/]+)/)?.[1];
  if (packageName) return `${packageName} package module/configuration`;
  if (file.includes("/src/lib/")) return "vendored library; separate file-level licence review required";
  if (file.includes("/src/js/resources/") || file.includes("/src/web_accessible_resources/")) return "page-facing scriptlet, redirect resource or compatibility asset";
  if (file.includes("/platform/mv3/")) return "Manifest V3 ruleset generation/runtime reference";
  if (file.includes("/src/js/")) return "filtering engine or browser runtime module";
  if (/\/(?:src|platform|packages)\//.test(file)) return "module/configuration within intact upstream topology";
  return "configuration or source; inspect file-specific meaning";
}

function testRelationships(file) {
  const tests = {
    "shared/domain.js": ["tests/unit/domain.test.mjs", "tests/browser/chromium-smoke.mjs"],
    "background/service-worker.js": ["tests/unit/service-worker.test.mjs", "tests/browser/chromium-smoke.mjs"],
    "content/cosmetic.js": ["tests/unit/cosmetic.test.mjs", "tests/browser/chromium-smoke.mjs"],
    "manifest.json": ["scripts/verify.mjs", "tests/browser/chromium-smoke.mjs"],
    "rules/starter.json": ["scripts/verify.mjs", "tests/browser/chromium-smoke.mjs"]
  };
  if (!file.startsWith("src/extension/")) return { coverage_assessment: "NOT_ASSESSED; inventory is not test coverage", tested_by: [] };
  const relative = file.slice("src/extension/".length);
  const testedBy = [...new Set(["scripts/verify.mjs", ...(tests[relative] ||
    (relative === "popup/popup.js" ? ["tests/unit/settings-ui.test.mjs"] :
      relative === "options/options.js" ? ["tests/unit/settings-ui.test.mjs", "tests/browser/chromium-smoke.mjs"] :
        relative === "options/options.html" ? ["tests/browser/chromium-smoke.mjs"] : []))])];
  return { coverage_assessment: "Known validating files only; not a claim of complete coverage or an executed test result", tested_by: testedBy };
}

// CSV is intended for spreadsheets too. Quoting alone does not stop formula execution.
export function csvCell(value) {
  let text = value === null || value === undefined ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  if (/^[\s\u0000-\u001f]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}

export function duplicateGroups(files) {
  const groups = new Map();
  for (const file of files) {
    if (!file.sha256) continue;
    const group = groups.get(file.sha256) || [];
    group.push(file.path);
    groups.set(file.sha256, group);
  }
  return [...groups.entries()].filter(([, paths]) => paths.length > 1)
    .map(([hash, paths]) => ({ sha256: hash, paths: paths.sort(), decision: "DUPLICATE_CANDIDATE; identical bytes do not justify deletion" }))
    .sort((a, b) => a.sha256.localeCompare(b.sha256));
}

function discoverReferences(file, text, tracked) {
  const references = [];
  const patterns = [
    ["module", /(?:importScripts\s*\(|\bfrom\s*|\bimport\s*\(?|\brequire\s*\()\s*["']([^"']+)["']/g],
    ["html-resource", /(?:src|href)\s*=\s*["']([^"']+)["']/g],
    ["documentation", /\[[^\]]*\]\(([^)]+)\)/g]
  ];
  for (const [kind, pattern] of patterns) {
    for (const match of text.matchAll(pattern)) {
      const raw = match[1].replace(/^<|>$/g, "").split(/[?#]/)[0];
      if (!raw || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) continue;
      if (kind === "module" && !raw.startsWith(".")) continue;
      let decoded;
      try { decoded = decodeURIComponent(raw); } catch { continue; }
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), decoded));
      if (tracked.has(resolved)) references.push({ from: file, to: resolved, kind, confidence: "literal-path heuristic" });
    }
  }
  if (file === "src/extension/manifest.json") {
    try {
      const manifest = JSON.parse(text);
      const values = [manifest.background?.service_worker, manifest.action?.default_popup, manifest.options_page,
        ...(manifest.content_scripts || []).flatMap((script) => [...(script.js || []), ...(script.css || [])]),
        ...(manifest.declarative_net_request?.rule_resources || []).map((rule) => rule.path)];
      for (const value of values) {
        if (typeof value === "string") references.push({ from: file, to: path.posix.join("src/extension", value), kind: "manifest", confidence: "explicit manifest resource" });
      }
    } catch { /* Parse errors remain visible to the structural verifier. */ }
  }
  if (file === "package.json") {
    try {
      for (const command of Object.values(JSON.parse(text).scripts || {})) {
        if (typeof command !== "string") continue;
        for (const match of command.matchAll(/\bnode\s+(?:--test\s+)?([\w./*-]+\.(?:mjs|js|cjs))/g)) {
          const source = match[1];
          const pattern = new RegExp("^" + source.split("*").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("[^/]*") + "$");
          for (const target of tracked) if (pattern.test(target)) references.push({ from: file, to: target, kind: "package-command", confidence: "literal node command/glob; never executed" });
        }
      }
    } catch { /* Invalid metadata is handled by the package/structural checks. */ }
  }
  if (file === "scripts/build.mjs") {
    for (const target of tracked) if (target.startsWith("src/extension/")) references.push({ from: file, to: target, kind: "build-input", confidence: "known active package boundary; verify build implementation separately" });
  }
  return references;
}

export function verifySnapshots(manifest, files) {
  if (!Array.isArray(manifest.projects)) throw new Error("Snapshot projects must be an array");
  const byPath = new Map(files.map((file) => [file.path, file]));
  const directories = new Set();
  return manifest.projects.map((project) => {
    if (!["ghostery-adblocker", "ublock-origin"].includes(project.directory)) throw new Error("Unknown snapshot project directory");
    if (directories.has(project.directory)) throw new Error("Duplicate snapshot project directory");
    directories.add(project.directory);
    if (typeof project.archive !== "string" || !/^[^/\\]+\.zip$/.test(project.archive) ||
        !/^[a-f0-9]{64}$/.test(project.archiveSha256)) throw new Error("Invalid snapshot archive metadata");
    const base = `AnalyseFuture/ImportedUpstream/projects/${project.directory}/`;
    const expected = new Set();
    const mismatches = [];
    for (const [relative, hash] of Object.entries(project.files || {})) {
      if (relative.startsWith("/") || relative.includes("\\") || relative.split("/").some((part) => !part || part === "." || part === "..")) throw new Error("Unsafe snapshot file path");
      if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error("Invalid snapshot file hash");
      const file = base + relative;
      expected.add(file);
      if (!byPath.has(file)) mismatches.push({ path: file, status: "MISSING" });
      else if (byPath.get(file).sha256 !== hash) mismatches.push({ path: file, status: "HASH_MISMATCH" });
    }
    const extra = files.filter((file) => file.path.startsWith(base) && !expected.has(file.path)).map((file) => file.path);
    const archivePath = `AnalyseFuture/OriginalUploads/${project.archive}`;
    const archive = byPath.get(archivePath);
    const archiveMatches = !!archive && archive.sha256 === project.archiveSha256;
    return { project: project.directory, expected_files: expected.size, matched_files: expected.size - mismatches.length,
      mismatches, extra_files: extra, archive_path: archivePath, archive_matches_recorded_hash: archiveMatches,
      upstream_commit: project.upstreamCommit ?? null,
      interpretation: "Equality verifies preservation against the local recorded manifest only; it does not authenticate upstream or approve reuse" };
  });
}

export function collectRepositoryAudit(root) {
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  const commit = git("rev-parse", "HEAD").trim();
  const format = git("rev-parse", "--show-object-format").trim();
  const stages = git("ls-files", "--stage", "-z").split("\0").filter(Boolean).map((entry) => {
    const match = entry.match(/^(\d+) ([a-f0-9]+) (\d)\t([\s\S]+)$/);
    if (!match || match[3] !== "0") throw new Error("Unmerged or unsupported Git index entry");
    return { mode: match[1], oid: match[2], path: match[4] };
  });
  const tracked = new Set(stages.map((entry) => entry.path));
  const files = [];
  const relationships = [];
  let snapshotManifest = null;
  for (const entry of stages) {
    let bytes = null;
    let readError = null;
    try {
      const absolute = safePath(root, entry.path);
      if (!lstatSync(absolute).isFile()) throw new Error("Non-regular tracked file refused");
      bytes = readFileSync(absolute);
    } catch (error) { readError = error.code || error.message; }
    const extension = path.posix.extname(entry.path).toLowerCase();
    const isText = !!bytes && !bytes.includes(0) && (TEXT_EXTENSIONS.has(extension) || /(?:LICENSE|COPYING|NOTICE|Makefile|\.gitignore|\.gitmodules)$/.test(entry.path));
    // Large text is hashed completely but not scanned for path references.
    const text = isText && bytes.length <= 1024 * 1024 ? bytes.toString("utf8") : "";
    const classification = classifyFile(entry.path, text);
    const hash = bytes ? sha256(bytes) : null;
    const objectHash = bytes ? createHash(format).update(`blob ${bytes.length}\0`).update(bytes).digest("hex") : null;
    const row = { path: entry.path, name: path.posix.basename(entry.path), file_type: isText ? `text:${extension || "extensionless"}` : extension || "unknown/binary", size_bytes: bytes?.length ?? null,
      tracking_status: "TRACKED", git_mode: entry.mode, git_index_blob: entry.oid, ...classification, sha256: hash,
      ...testRelationships(entry.path),
      integrity: readError ? "READ_REFUSED_OR_FAILED" : objectHash === entry.oid ? "MATCHES_GIT_INDEX" : "MODIFIED_FROM_GIT_INDEX",
      upstream_authenticity: entry.path.startsWith(QUARANTINE) ? "NOT_VERIFIED" : "NOT_ASSESSED_BY_INVENTORY",
      read_error: readError, references_scanned: !!text, referenced_by: [], references: [] };
    if (readError) row.security_review_required = true;
    files.push(row);
    if (text) relationships.push(...discoverReferences(entry.path, text, tracked));
    if (entry.path === SNAPSHOT && text) snapshotManifest = JSON.parse(text);
  }
  const byPath = new Map(files.map((file) => [file.path, file]));
  for (const file of files) {
    for (const validator of file.tested_by) {
      if (tracked.has(validator)) relationships.push({ from: validator, to: file.path, kind: "validation", confidence: "maintained validating-file map; not test coverage" });
    }
  }
  for (const relation of relationships) {
    byPath.get(relation.from)?.references.push(relation.to);
    byPath.get(relation.to)?.referenced_by.push(relation.from);
  }
  for (const file of files) {
    file.references = [...new Set(file.references)].sort();
    file.referenced_by = [...new Set(file.referenced_by)].sort();
    file.referenced_by_another_file = file.referenced_by.length > 0;
  }
  const snapshots = snapshotManifest ? verifySnapshots(snapshotManifest, files) : [];
  for (const snapshot of snapshots) {
    const invalid = new Set(snapshot.mismatches.map((item) => item.path));
    for (const file of files.filter((item) => item.path.startsWith(`AnalyseFuture/ImportedUpstream/projects/${snapshot.project}/`))) {
      file.snapshot_integrity = invalid.has(file.path) ? "MISMATCH" : snapshot.extra_files.includes(file.path) ? "UNRECORDED" : "MATCHES_LOCAL_SNAPSHOT";
    }
  }
  const counts = {};
  for (const file of files) counts[file.classification] = (counts[file.classification] || 0) + 1;
  const folders = new Set();
  for (const file of files) {
    let directory = path.posix.dirname(file.path);
    while (directory !== ".") { folders.add(directory); directory = path.posix.dirname(directory); }
  }
  return { schema_version: 1, commit, index_scope: "Every Git-tracked path in the current index; untracked and ignored output excluded", generated_at: new Date().toISOString(),
    limitations: ["Classification and references are static heuristics, not a complete semantic/call graph or manual source review", "No audited file is executed; archives are hashed, not extracted", "Git/snapshot equality is preservation evidence, not upstream authentication or security/license clearance", "No file contents or credential values are emitted"],
    summary: { tracked_files: files.length, active_boundary_files: files.filter((file) => !file.path.startsWith(QUARANTINE)).length, quarantined_files: files.filter((file) => file.path.startsWith(QUARANTINE)).length,
      tracked_folder_count: folders.size, classifications: counts, unreadable_or_refused_files: files.filter((file) => file.read_error).length },
    files, relationships, duplicates: duplicateGroups(files), snapshots };
}

export function writeAuditReports(root, audit) {
  const directory = safePath(root, "build/audit");
  mkdirSync(directory, { recursive: true });
  // Verify again after creation, and never overwrite through an existing symlink.
  safePath(root, "build/audit");
  const fields = [...new Set(audit.files.flatMap((file) => Object.keys(file)))];
  const outputs = {
    "FILE_INVENTORY.json": JSON.stringify(audit, null, 2) + "\n",
    "FILE_INVENTORY.csv": [fields.map(csvCell).join(","), ...audit.files.map((file) => fields.map((field) => csvCell(file[field])).join(","))].join("\n") + "\n",
    "DUPLICATES.json": JSON.stringify({ commit: audit.commit, groups: audit.duplicates }, null, 2) + "\n",
    "DEPENDENCIES.json": JSON.stringify({ commit: audit.commit, limitations: audit.limitations, relationships: audit.relationships || [] }, null, 2) + "\n",
    "SUMMARY.md": `# Static repository inventory\n\nCommit: ${audit.commit}\n\n` +
      `Tracked files: ${audit.summary.tracked_files}; active boundary: ${audit.summary.active_boundary_files}; quarantined: ${audit.summary.quarantined_files}; tracked folders: ${audit.summary.tracked_folder_count}.\n\n` +
      `Exact duplicate groups: ${audit.duplicates.length}. Unreadable/refused files: ${audit.summary.unreadable_or_refused_files}.\n\n` +
      audit.snapshots.map((snapshot) => `- ${snapshot.project}: ${snapshot.matched_files}/${snapshot.expected_files} local snapshot hashes match; ${snapshot.extra_files.length} extra paths; archive hash match: ${snapshot.archive_matches_recorded_hash}.`).join("\n") +
      "\n\n" + audit.limitations.map((value) => `- ${value}`).join("\n") + "\n"
  };
  for (const [name, data] of Object.entries(outputs)) {
    const destination = safePath(root, "build/audit/" + name);
    const temporary = path.join(directory, ".audit-" + randomUUID());
    writeFileSync(temporary, data, { flag: "wx", mode: 0o600 });
    renameSync(temporary, destination);
  }
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const audit = collectRepositoryAudit(root);
  writeAuditReports(root, audit);
  console.log(JSON.stringify({ ...audit.summary, exact_duplicate_groups: audit.duplicates.length, snapshot_matches: audit.snapshots.map((snapshot) => ({ project: snapshot.project, matched: snapshot.matched_files, expected: snapshot.expected_files, extra: snapshot.extra_files.length, archive_match: snapshot.archive_matches_recorded_hash })), output: "build/audit/: FILE_INVENTORY.{json,csv}, DUPLICATES.json, DEPENDENCIES.json, SUMMARY.md" }, null, 2));
  if (audit.summary.unreadable_or_refused_files || audit.snapshots.some((snapshot) => snapshot.mismatches.length || snapshot.extra_files.length || !snapshot.archive_matches_recorded_hash)) process.exitCode = 1;
}
