import { cpSync, copyFileSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dest = path.join(root, "dist", "chrome");

execFileSync(process.execPath, [path.join(root, "scripts", "verify.mjs")], {
  cwd: root,
  stdio: "inherit"
});
rmSync(path.join(root, "dist"), { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
copyFileSync(path.join(root, "manifest.json"), path.join(dest, "manifest.json"));
for (const folder of ["background", "content", "shared", "rules", "popup", "options"]) {
  cpSync(path.join(root, folder), path.join(dest, folder), { recursive: true });
}
console.log("Installable unpacked extension created in dist/chrome.");
