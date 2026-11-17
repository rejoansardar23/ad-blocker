import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "projects/ublock-origin");
const destination = path.join(root, "build/ublock-node");
mkdirSync(destination, { recursive: true });
execFileSync("bash", ["tools/make-nodejs.sh", destination], { cwd: source, stdio: "inherit" });
// The supplied ZIP's Node packaging script omits this dependency of uri-utils.js.
// Repair the generated package using the source already present in that ZIP.
copyFileSync(path.join(source, "src/js/publicsuffix.js"), path.join(destination, "js/publicsuffix.js"));
writeFileSync(path.join(destination, "package.json"), JSON.stringify({ private: true, type: "module" }) + "\n");
console.log("ZIP-derived uBlock Node engine built in build/ublock-node (GPL-3.0-or-later).");
