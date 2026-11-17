import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, renameSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { commitSha, trackedTree, compareHistoricalTrees, stageHistoricalFiles, safeRelative } from '../../scripts/recover-history.mjs';

function fixture(run) {
  const root = mkdtempSync(path.join(tmpdir(), 'adblock-recovery-'));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  const add = (p, data) => { mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); writeFileSync(path.join(root, p), data); };
  const commit = (message) => { git('add', '-A'); git('-c', 'user.name=Recovery Fixture', '-c', 'user.email=test@example.invalid', '-c', 'core.hooksPath=/dev/null', 'commit', '-qm', message); return git('rev-parse', 'HEAD'); };
  try { git('init', '-q'); return run({ root, git, add, commit }); }
  finally { rmSync(root, { recursive: true, force: true }); }
}

test('historical comparison distinguishes deleted, changed and renamed implementation files', () => fixture(({ root, add, commit }) => {
  add('src/engine.js', 'engine version one');
  add('src/removed.js', 'lost implementation');
  add('src/unchanged.js', 'unchanged');
  add('background/service-worker.js', 'older code');
  add('src/renamed.js', 'renamable');
  const baseline = commit('before disruption');
  add('src/engine.js', 'engine version two');
  rmSync(path.join(root, 'src/removed.js'));
  renameSync(path.join(root, 'src/renamed.js'), path.join(root, 'src/relocated.js'));
  add('src/extension/background/service-worker.js', 'newer code');
  rmSync(path.join(root, 'background/service-worker.js'));
  commit('after disruption');
  assert.equal(commitSha(root, baseline), baseline);
  const result = compareHistoricalTrees(trackedTree(root, baseline), trackedTree(root, 'HEAD'));
  assert.equal(result.unchanged, 1);
  assert.equal(result.differences.find((f) => f.path === 'src/removed.js').status, 'MISSING');
  assert.equal(result.differences.find((f) => f.path === 'src/engine.js').status, 'CHANGED');
  assert.deepEqual(result.differences.find((f) => f.path === 'src/renamed.js').identical_current_paths, ['src/relocated.js']);
  assert.deepEqual(result.differences.find((f) => f.path === 'background/service-worker.js').possible_current_paths, ['src/extension/background/service-worker.js']);
  assert.equal(result.differences.find((f) => f.path === 'src/renamed.js').status, 'MOVED_OR_COPIED');
}));

test('staging restores exact historical bytes, including binary, without changing active files', () => fixture(({ root, add, commit }) => {
  const original = Buffer.from([0, 1, 2, 255, 10]);
  add('assets/file.bin', original);
  add('src/engine.js', 'original behavior');
  const baseline = commit('original');
  add('src/engine.js', 'current behavior');
  commit('later');
  const result = stageHistoricalFiles(root, baseline, 'assets', { prefix: true });
  assert.equal(result.staged.length, 1);
  assert.deepEqual(readFileSync(path.join(root, result.staged[0].staged_path)), original);
  assert.equal(readFileSync(path.join(root, 'src/engine.js'), 'utf8'), 'current behavior');
  const previous = stageHistoricalFiles(root, baseline, 'src/engine.js');
  assert.equal(readFileSync(path.join(root, previous.staged[0].staged_path), 'utf8'), 'original behavior');
  assert.throws(() => stageHistoricalFiles(root, baseline, 'src/engine.js'), /refusing overwrite/);
}));

test('unsafe paths, malicious references, and historical symlinks are rejected', () => fixture(({ root, add, commit }) => {
  for (const p of ['', '../escape', '/absolute', 'a/../b', '.git/config', 'a//b', 'a\\b']) {
    assert.throws(() => safeRelative(p), /Unsafe/);
  }
  assert.throws(() => commitSha(root, '-HEAD'), /Invalid source ref/);
  assert.throws(() => commitSha(root, 'HEAD..x'), /Invalid source ref/);
  symlinkSync('secret-value', path.join(root, 'link'));
  add('safe.txt', 'hello');
  const baseline = commit('add symlink');
  assert.throws(() => stageHistoricalFiles(root, baseline, 'link'), /Refusing to stage symlink/);
  assert.throws(() => stageHistoricalFiles(root, baseline, '../safe.txt'), /Unsafe/);
  assert.throws(() => stageHistoricalFiles(root, baseline, 'does-not-exist'), /not found/);
}));

test('staging refuses to follow an existing symlink in its output directory', () => fixture(({ root, add, commit }) => {
  add('src/feature.js', 'precious code');
  const baseline = commit('historical source');
  mkdirSync(path.join(root, 'build'), { recursive: true });
  symlinkSync('/tmp', path.join(root, 'build/recovery'));
  assert.throws(() => stageHistoricalFiles(root, baseline, 'src/feature.js'), /Unsafe recovery output ancestor/);
}));
