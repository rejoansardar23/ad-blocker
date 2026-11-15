import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const shared = readFileSync(path.join(root, "shared/domain.js"), "utf8");
const cosmetic = readFileSync(path.join(root, "content/cosmetic.js"), "utf8");

function setup() {
  let saved = { enabled: true, allowlistedSites: [] };
  let onChange;
  let removedPageElement = false;
  const nodes = [];
  const pageOwned = {
    id: "ad-blocker-cosmetic",
    isConnected: true,
    remove() { removedPageElement = true; }
  };
  const document = {
    documentElement: {
      appendChild(node) { node.isConnected = true; nodes.push(node); }
    },
    createElement(tag) {
      assert.equal(tag, "style");
      return {
        textContent: "",
        isConnected: false,
        remove() {
          this.isConnected = false;
          const index = nodes.indexOf(this);
          if (index >= 0) nodes.splice(index, 1);
        }
      };
    },
    // Simulates a real webpage having the same ID that the old content
    // script used to look up and accidentally remove.
    getElementById(id) { return id === pageOwned.id ? pageOwned : null; },
    addEventListener() {}
  };
  const chrome = {
    storage: {
      local: { async get(defaults) { return { ...defaults, ...saved }; } },
      onChanged: { addListener(callback) { onChange = callback; } }
    }
  };
  const sandbox = { document, chrome, URL, location: { hostname: "publisher.test" } };
  vm.createContext(sandbox);
  vm.runInContext(shared, sandbox);
  vm.runInContext(cosmetic, sandbox);
  return {
    snapshot() { return { styles: [...nodes], removedPageElement }; },
    async update(changes) {
      saved = { ...saved, ...changes };
      onChange({ enabled: { newValue: saved.enabled }, allowlistedSites: { newValue: saved.allowlistedSites } }, "local");
      // Allow async chrome.storage.local.get() mock to complete.
      await new Promise((resolve) => setImmediate(resolve));
    }
  };
}

test("cosmetic filtering never removes a webpage-owned element", async () => {
  const app = setup();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(app.snapshot().styles.length, 1, "Must inject our own cosmetic style");
  assert.match(app.snapshot().styles[0].textContent, /adsbygoogle/);

  await app.update({ enabled: false });
  assert.equal(app.snapshot().styles.length, 0, "Disable must remove injected stylesheet");
  assert.equal(app.snapshot().removedPageElement, false, "Never remove page-owned content");

  await app.update({ enabled: true, allowlistedSites: ["publisher.test"] });
  assert.equal(app.snapshot().styles.length, 0, "Trusted pages must not receive cosmetic style");

  await app.update({ enabled: true, allowlistedSites: [] });
  assert.equal(app.snapshot().styles.length, 1, "Re-enabling restores only our stylesheet");
  assert.equal(app.snapshot().removedPageElement, false);
});
