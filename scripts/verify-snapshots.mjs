import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../projects");
const inventory = JSON.parse(readFileSync(path.join(root, "snapshots.json"), "utf8"));
for (const project of inventory.projects) {
  const directory = path.join(root, project.directory);
  for (const [relative, expected] of Object.entries(project.files)) {
    const file = path.resolve(directory, relative);
    assert.ok(file.startsWith(directory + path.sep), "Invalid snapshot path: " + relative);
    const actual = createHash("sha256").update(readFileSync(file)).digest("hex");
    assert.equal(actual, expected, "Snapshot differs from ZIP: " + project.directory + "/" + relative);
  }
  console.log(`${project.directory}: ${Object.keys(project.files).length} ZIP files verified.`);
}
