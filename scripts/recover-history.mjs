/** Recover historical source bytes without checking out, executing, or overwriting repository files. */
import { execFileSync } from 'node:child_process';
import { closeSync, existsSync, lstatSync, mkdirSync, openSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BUFFER = 192 * 1024 * 1024;
const GIT_MODES = new Set(['100644', '100755']);
const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function safeRelative(value) {
  if (typeof value !== 'string' || !value || value.includes('\\') || value.includes('\0') ||
      value.startsWith('/') || value.split('/').some((part) => !part || part === '.' || part === '..') ||
      value === '.git' || value.startsWith('.git/')) {
    throw new Error('Unsafe repository-relative path: ' + String(value));
  }
  return value;
}

function git(root, args, encoding = 'buffer') {
  return execFileSync('git', args, { cwd: root, encoding: encoding === 'buffer' ? null : encoding, maxBuffer: MAX_BUFFER, stdio: ['ignore', 'pipe', 'pipe'] });
}

export function commitSha(root, ref) {
  if (typeof ref !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(ref) || ref.includes('..') || ref.includes('//') || ref.endsWith('/') || ref.endsWith('.lock')) {
    throw new Error('Invalid source ref');
  }
  const sha = git(root, ['rev-parse', '--verify', '--end-of-options', ref + '^{commit}'], 'utf8').trim();
  if (!/^[0-9a-f]{40,64}$/.test(sha)) throw new Error('Git did not resolve an immutable commit');
  return sha;
}

export function trackedTree(root, ref) {
  const sha = commitSha(root, ref);
  const data = git(root, ['ls-tree', '-rz', '--full-tree', sha]);
  const entries = new Map();
  for (const record of data.toString('utf8').split('\0').filter(Boolean)) {
    const parsed = /^(\d+) (\w+) ([0-9a-f]+)\t([\s\S]+)$/.exec(record);
    if (!parsed) throw new Error('Unrecognized git tree entry');
    const [, mode, type, blobSha, name] = parsed;
    safeRelative(name);
    entries.set(name, { path: name, mode, type, sha: blobSha });
  }
  return { commit: sha, files: entries };
}

export function compareHistoricalTrees(before, after) {
  const nowBySha = new Map();
  for (const item of after.files.values()) {
    if (!GIT_MODES.has(item.mode) || item.type !== 'blob') continue;
    if (!nowBySha.has(item.sha)) nowBySha.set(item.sha, []);
    nowBySha.get(item.sha).push(item.path);
  }
  const currentByBasename = new Map();
  for (const item of after.files.values()) {
    if (!GIT_MODES.has(item.mode) || item.type !== 'blob') continue;
    const name = path.posix.basename(item.path);
    if (!currentByBasename.has(name)) currentByBasename.set(name, []);
    currentByBasename.get(name).push(item.path);
  }
  const differences = [];
  let unchanged = 0;
  for (const old of before.files.values()) {
    if (!GIT_MODES.has(old.mode) || old.type !== 'blob') continue;
    const current = after.files.get(old.path);
    if (current?.sha === old.sha && current?.mode === old.mode) { unchanged++; continue; }
    const identicalElsewhere = (nowBySha.get(old.sha) || []).filter((p) => p !== old.path);
    // Modified files cannot match historical hashes. Suggest, never assert, possible relocations.
    const possibleCurrentPaths = (currentByBasename.get(path.posix.basename(old.path)) || [])
      .filter((p) => p !== old.path && !identicalElsewhere.includes(p))
      .sort((left, right) => {
        const overlap = (candidate) => {
          const a = old.path.split('/').reverse();
          const b = candidate.split('/').reverse();
          let i = 0;
          while (i < Math.min(a.length, b.length) && a[i] === b[i]) i++;
          return i;
        };
        return overlap(right) - overlap(left) || left.localeCompare(right);
      }).slice(0, 5);
    differences.push({
      path: old.path,
      status: current ? 'CHANGED' : (identicalElsewhere.length ? 'MOVED_OR_COPIED' : 'MISSING'),
      from_blob: old.sha,
      current_blob: current?.sha || null,
      identical_current_paths: identicalElsewhere,
      possible_current_paths: possibleCurrentPaths
    });
  }
  return { source_commit: before.commit, current_commit: after.commit, unchanged, differences };
}

function ensureSafeDestination(root, relative) {
  safeRelative(relative);
  const parts = relative.split('/');
  if (lstatSync(root).isSymbolicLink()) throw new Error('Symlink repository root refused');
  let current = root;
  for (const part of parts.slice(0, -1)) {
    current = path.join(current, part);
    if (existsSync(current)) {
      if (lstatSync(current).isSymbolicLink() || !lstatSync(current).isDirectory()) throw new Error('Unsafe recovery output ancestor: ' + current);
    } else {
      mkdirSync(current);
    }
  }
  const output = path.join(current, parts.at(-1));
  if (existsSync(output) || (() => { try { lstatSync(output); return true; } catch (e) { if (e.code === 'ENOENT') return false; throw e; } })()) {
    throw new Error('Recovery destination already exists; refusing overwrite: ' + output);
  }
  return output;
}

export function stageHistoricalFiles(root, ref, requested, { prefix = false } = {}) {
  const tree = trackedTree(root, ref);
  const request = safeRelative(requested);
  const selected = [...tree.files.values()].filter((entry) => prefix ? entry.path.startsWith(request + '/') : entry.path === request);
  if (!selected.length) throw new Error('Historical path not found: ' + requested);
  if (selected.some((entry) => entry.type !== 'blob' || !GIT_MODES.has(entry.mode))) throw new Error('Refusing to stage symlink, submodule, or non-file Git entry');
  const staged = [];
  for (const entry of selected) {
    const destination = 'build/recovery/' + tree.commit.slice(0, 12) + '/' + entry.path;
    const target = ensureSafeDestination(root, destination);
    // The original file is read as a Git object: no checkout, import, install, or execution.
    const bytes = git(root, ['cat-file', 'blob', entry.sha]);
    const fd = openSync(target, 'wx', 0o600);
    try { writeFileSync(fd, bytes); } finally { closeSync(fd); }
    staged.push({ historical_path: entry.path, staged_path: destination, blob_sha: entry.sha, bytes: bytes.length });
  }
  return { source_commit: tree.commit, staged };
}

function usage() {
  return 'Usage:\n  node scripts/recover-history.mjs compare <historical-ref> [path-prefix]\n  node scripts/recover-history.mjs stage <historical-ref> <exact-path>\n  node scripts/recover-history.mjs stage-prefix <historical-ref> <folder>\nAll restored files are written under ignored build/recovery/ without overwriting source.';
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, ref, candidate, ...extra] = process.argv.slice(2);
  try {
    if (!ref || extra.length) throw new Error(usage());
    if (command === 'compare') {
      const original = trackedTree(DEFAULT_ROOT, ref);
      const current = trackedTree(DEFAULT_ROOT, 'HEAD');
      const result = compareHistoricalTrees(original, current);
      const filtered = candidate ? result.differences.filter((item) => item.path === safeRelative(candidate) || item.path.startsWith(candidate + '/')) : result.differences;
      console.log(JSON.stringify({ ...result, differences: filtered }, null, 2));
    } else if (command === 'stage' || command === 'stage-prefix') {
      if (!candidate) throw new Error(usage());
      console.log(JSON.stringify(stageHistoricalFiles(DEFAULT_ROOT, ref, candidate, { prefix: command === 'stage-prefix' }), null, 2));
    } else throw new Error(usage());
  } catch (error) {
    console.error('Recovery refused: ' + error.message);
    process.exitCode = 1;
  }
}
