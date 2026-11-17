/** Static boundary/link checks; does not execute or import audited source. */
import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const QUARANTINE = "AnalyseFuture/";
const GENERATED = /^(?:node_modules|dist|build|coverage|playwright-report|test-results|\.cache|\.tmp)\//;
const SECRET = /(?:^|\/)(?:\.env(?:\.[^/]+)?|id_rsa|id_ed25519)$|\.(?:pem|key|p12|pfx)$/i;
const INSTALL_HOOKS = ["preinstall", "install", "postinstall", "prepare", "prepublish", "prepublishOnly"];

function fail(message) { throw new Error(message); }

// Refuse traversal through any symlink, including a symlinked parent directory.
export function checkedPath(root, relative) {
  if (!relative || relative.includes("\\") || relative.includes("\0") || path.isAbsolute(relative)) fail("Unsafe repository path: " + relative);
  const absolute = path.resolve(root, relative);
  if (absolute !== root && !absolute.startsWith(root + path.sep)) fail("Path escapes repository: " + relative);
  let current = root;
  if (lstatSync(current).isSymbolicLink()) fail("Symlinked repository root refused");
  for (const component of path.relative(root, absolute).split(path.sep).filter(Boolean)) {
    current = path.join(current, component);
    if (lstatSync(current).isSymbolicLink()) fail("Symlink refused: " + relative);
  }
  return absolute;
}

export function verifyPackageBoundary(root, trackedFiles) {
  if (!trackedFiles) trackedFiles = new Set(execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" }).split("\0").filter(Boolean));
  else if (!(trackedFiles instanceof Set)) trackedFiles = new Set(trackedFiles);
  const extension = path.join(root, "src", "extension");
  const sources = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) fail("Extension source symlink refused: " + path.relative(root, absolute));
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile()) {
        const relative = path.relative(extension, absolute).split(path.sep).join("/");
        if (!trackedFiles.has("src/extension/" + relative)) fail("Untracked extension resource refused: " + relative);
        sources.push(relative);
      }
      else fail("Non-regular extension resource refused");
    }
  };
  checkedPath(root, "src/extension");
  visit(extension);
  const resource = (from, value) => {
    if (typeof value !== "string" || !value || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value) || value.includes("\\")) fail("Unsafe extension resource in " + from);
    let decoded;
    try { decoded = decodeURIComponent(value.split(/[?#]/)[0]); } catch { fail("Malformed extension resource in " + from); }
    const resolved = path.posix.normalize(path.posix.join(value.startsWith("/") ? "." : path.posix.dirname(from), decoded.replace(/^\//, "")));
    if (resolved === ".." || resolved.startsWith("../") || resolved.startsWith(QUARANTINE)) fail("Extension resource escapes package: " + value);
    const absolute = checkedPath(root, "src/extension/" + resolved);
    if (!lstatSync(absolute).isFile()) fail("Extension resource is not a file: " + value);
  };
  const read = (file) => readFileSync(path.join(extension, file), "utf8");
  const manifest = JSON.parse(read("manifest.json"));
  const iconPaths = (value) => typeof value === "string" ? [value] : Object.values(value || {});
  const references = [manifest.background?.service_worker, ...(manifest.background?.scripts || []),
    manifest.action?.default_popup, manifest.options_page, manifest.options_ui?.page,
    ...iconPaths(manifest.icons), ...iconPaths(manifest.action?.default_icon),
    ...(manifest.content_scripts || []).flatMap((entry) => [...(entry.js || []), ...(entry.css || [])]),
    ...(manifest.declarative_net_request?.rule_resources || []).map((entry) => entry.path)];
  for (const reference of references.filter((value) => value !== undefined)) resource("manifest.json", reference);
  for (const entry of manifest.web_accessible_resources || []) {
    for (const pattern of typeof entry === "string" ? [entry] : entry.resources || []) {
      if (!pattern.includes("*")) { resource("manifest.json", pattern); continue; }
      if (pattern.includes("\\") || pattern.startsWith("/") || pattern.split("/").includes("..") || /^[a-z][a-z0-9+.-]*:/i.test(pattern)) fail("Unsafe web-accessible resource pattern");
      const matcher = new RegExp("^" + pattern.split("*").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$");
      if (!sources.some((file) => matcher.test(file))) fail("Web-accessible resource pattern matches no packaged file: " + pattern);
    }
  }
  for (const file of sources) {
    if (/\.(?:[cm]?js|html)$/i.test(file)) {
      const text = read(file);
      if (/\.(?:[cm]?js)$/i.test(file)) {
        for (const match of text.matchAll(/\b(?:import|export)\s+(?:[^;\n]*?\s+from\s*)?["']([^"']+)["']/g)) resource(file, match[1]);
        for (const match of text.matchAll(/\b(?:importScripts|import)\s*\(([^)]*)\)/g)) {
          for (const value of match[1].matchAll(/["']([^"']+)["']/g)) resource(file, value[1]);
        }
      } else {
        for (const tag of text.matchAll(/<(script|link|img|iframe|a)\b[^>]*>/gi)) {
          const reference = tag[0].match(/\b(?:src|href)\s*=\s*["']([^"']+)["']/i)?.[1];
          if (!reference || reference.startsWith("#")) continue;
          if (tag[1].toLowerCase() === "a" && /^(?:https?:|mailto:)/i.test(reference)) continue;
          resource(file, reference);
        }
      }
    }
  }
  return sources.length;
}

export function verifyDocumentationLinks(root, files) {
  let checked = 0;
  for (const file of files.filter((name) => !name.startsWith(QUARANTINE) && /\.md$/i.test(name))) {
    // Ignore fenced examples; only literal inline Markdown file links are checked.
    const text = readFileSync(checkedPath(root, file), "utf8").replace(/^\s*(```|~~~)[\s\S]*?^\s*\1.*$/gm, "");
    for (const match of text.matchAll(/\[[^\]]*\]\((<[^>]+>|[^\s)]+)(?:\s+["'][^)]*["'])?\)/g)) {
      const value = match[1].replace(/^<|>$/g, "");
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) continue;
      const raw = value.split(/[?#]/)[0];
      if (!raw) continue;
      let decoded;
      try { decoded = decodeURIComponent(raw); } catch { fail("Malformed documentation link in " + file); }
      const resolved = path.posix.normalize(path.posix.join(decoded.startsWith("/") ? "." : path.posix.dirname(file), decoded.replace(/^\//, "")));
      try { checkedPath(root, resolved); } catch (error) { fail("Broken documentation link in " + file + ": " + value + " (" + error.message + ")"); }
      checked++;
    }
  }
  return checked;
}

export function verifyRepository(root, files) {
  root = path.resolve(root);
  if (!files) files = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" }).split("\0").filter(Boolean);
  for (const file of files.filter((name) => !name.startsWith(QUARANTINE))) {
    if (GENERATED.test(file)) fail("Generated output is tracked: " + file);
    if (SECRET.test(file) && !/\.env\.(?:example|sample|template)$/.test(file)) fail("Credential-format file is tracked: " + file);
    checkedPath(root, file);
  }
  const pkg = JSON.parse(readFileSync(checkedPath(root, "package.json"), "utf8"));
  for (const hook of INSTALL_HOOKS) if (pkg.scripts?.[hook]) fail("Unreviewed package lifecycle hook: " + hook);
  if (Object.keys(pkg.dependencies || {}).length || Object.keys(pkg.optionalDependencies || {}).length) fail("Production dependencies require an explicit packaging review");
  for (const [name, command] of Object.entries(pkg.scripts || {})) {
    if (/AnalyseFuture|verify:archives|build:ublock|test:ublock/.test(command)) fail("Active command invokes quarantined tooling: " + name);
  }
  for (const file of files.filter((name) => /^\.github\/workflows\/[^/]+\.ya?ml$/.test(name))) {
    if (/AnalyseFuture|verify:archives|build:ublock|test:ublock/.test(readFileSync(checkedPath(root, file), "utf8"))) fail("Root workflow references quarantined tooling: " + file);
  }
  const sourceFiles = verifyPackageBoundary(root, new Set(files));
  const documentationLinks = verifyDocumentationLinks(root, files);
  return { sourceFiles, documentationLinks };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = verifyRepository(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."));
  console.log(`Repository boundaries verified: ${result.sourceFiles} extension files; ${result.documentationLinks} documentation links.`);
}
