import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "manifest.json",
  "rules/starter.json",
  "background/service-worker.js",
  "shared/domain.js",
  "content/cosmetic.js",
  "popup/popup.html",
  "popup/popup.css",
  "popup/popup.js",
  "options/options.html",
  "options/options.css",
  "options/options.js"
];
const read = (file) => readFileSync(path.join(root, file), "utf8");

for (const file of required) {
  assert.ok(existsSync(path.join(root, file)), "Missing extension file: " + file);
}
const manifest = JSON.parse(read("manifest.json"));
assert.equal(manifest.manifest_version, 3);
assert.ok(manifest.permissions.includes("declarativeNetRequest"));
assert.ok(manifest.permissions.includes("storage"));
assert.ok(manifest.action.default_popup);
assert.ok(manifest.background.service_worker);
assert.ok(manifest.options_page);

const ruleResources = manifest.declarative_net_request.rule_resources;
assert.equal(ruleResources.length, 1);
const rules = JSON.parse(read(ruleResources[0].path));
assert.ok(Array.isArray(rules) && rules.length > 0);
const ids = new Set();
for (const rule of rules) {
  assert.ok(Number.isInteger(rule.id) && rule.id > 0);
  assert.ok(!ids.has(rule.id), "Duplicate rule ID " + rule.id);
  ids.add(rule.id);
  assert.equal(rule.action.type, "block");
  assert.ok(Array.isArray(rule.condition.requestDomains));
  assert.ok(rule.condition.requestDomains.length > 0);
  assert.ok(Array.isArray(rule.condition.resourceTypes));
}
for (const script of manifest.content_scripts) {
  for (const source of script.js) assert.ok(existsSync(path.join(root, source)));
}
for (const page of [manifest.action.default_popup, manifest.options_page]) {
  assert.ok(existsSync(path.join(root, page)));
}

for (const source of [
  "background/service-worker.js",
  "shared/domain.js",
  "content/cosmetic.js",
  "popup/popup.js",
  "options/options.js"
]) {
  execFileSync(process.execPath, ["--check", path.join(root, source)], { stdio: "pipe" });
}
for (const html of ["popup/popup.html", "options/options.html"]) {
  const text = read(html);
  assert.ok(!/src=["']https?:\/\//i.test(text), "No remote executable scripts: " + html);
}
console.log("Extension layout, manifest, starter DNR rules and JavaScript syntax verified.");
