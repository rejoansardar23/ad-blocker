/**
 * Headless end-to-end Chrome Manifest V3 smoke tests.
 * Uses Playwright's bundled Chromium, NOT the Chrome/Edge stable channels,
 * because those no longer accept side-loaded extension command-line flags.
 *
 * The HTTP server serves both publisher.test and ads.adblocker.test via
 * Chromium's host-resolver mapping: no public ad servers or user data.
 */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const extensionPath = path.join(repo, "dist", "chrome");
const profile = mkdtempSync(path.join(tmpdir(), "ad-blocker-e2e-"));
const counts = { ad: 0, benign: 0 };
const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO1PkrQAAAAASUVORK5CYII=", "base64");
const server = createServer((request, response) => {
  if (request.url?.startsWith("/ad-pixel")) counts.ad++;
  if (request.url?.startsWith("/benign-pixel")) counts.benign++;
  response.setHeader("Cache-Control", "no-store, max-age=0");
  if (request.url?.includes("pixel")) {
    response.setHeader("Content-Type", "image/png");
    response.end(pixel);
    return;
  }
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end('<!doctype html><html><body>'+
    '<div id="ad-box" data-ad-blocker-test="ad">Advertising element</div>'+
    '<div id="real-content">Legitimate website content</div>'+
    '<div id="ad-blocker-cosmetic">Page-owned element with a coincidental ID</div>'+
    '<img id="ad-pixel" alt="ad fixture"><img id="benign-pixel" alt="control fixture">'+
    '<script>'+
    'for (const [id, uri] of [['+
    '"ad-pixel", "http://ads.adblocker.test:'+port+'/ad-pixel"],'+
    '["benign-pixel", "http://publisher.test:'+port+'/benign-pixel"]]) {'+
    'const img = document.getElementById(id);'+
    'img.onload=()=>img.dataset.result="loaded";'+
    'img.onerror=()=>img.dataset.result="error";'+
    'img.src=uri+"?run="+Math.random();'+
    '}'+
    '</script></body></html>');
});
let port = 0;
let context;
let liveViewCheckpoints = 0;
let concurrentMutationCheckpoints = 0;

const launch = () => chromium.launchPersistentContext(profile, {
  channel: "chromium",
  headless: true,
  viewport: { width: 1100, height: 850 },
  args: [
    "--disable-extensions-except=" + extensionPath,
    "--load-extension=" + extensionPath,
    "--host-resolver-rules=MAP publisher.test 127.0.0.1, MAP *.publisher.test 127.0.0.1, MAP notpublisher.test 127.0.0.1, MAP ads.adblocker.test 127.0.0.1",
    "--no-proxy-server"
  ]
});

async function checkPage(page, { adLoaded, cosmeticHidden, host = "publisher.test" }) {
  const before = { ...counts };
  const failures = [];
  const recordFailure = (request) => {
    if (new URL(request.url()).hostname === "ads.adblocker.test") failures.push(request.failure()?.errorText);
  };
  page.on("requestfailed", recordFailure);
  try {
    await page.goto("http://" + host + ":" + port + "/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() =>
      !!document.querySelector("#ad-pixel")?.dataset.result &&
      !!document.querySelector("#benign-pixel")?.dataset.result
    , null, { timeout: 15000 });
    await page.waitForFunction((hidden) =>
      (getComputedStyle(document.querySelector("#ad-box")).display === "none") === hidden
    , cosmeticHidden, { timeout: 15000 });
    const actual = await page.evaluate(() => ({
      ad: document.querySelector("#ad-pixel").dataset.result,
      benign: document.querySelector("#benign-pixel").dataset.result,
      cosmeticHidden: getComputedStyle(document.querySelector("#ad-box")).display === "none",
      realContentVisible: getComputedStyle(document.querySelector("#real-content")).display !== "none",
      pageOwnedElementPresent: !!document.getElementById("ad-blocker-cosmetic")
    }));
    assert.equal(actual.benign, "loaded", "Control image must reach publisher.test: " + JSON.stringify(actual));
    assert.equal(actual.ad, adLoaded ? "loaded" : "error", "Unexpected DNR result: " + JSON.stringify(actual));
    assert.equal(actual.cosmeticHidden, cosmeticHidden, "Cosmetic CSS unexpectedly changed: " + JSON.stringify(actual));
    assert.equal(actual.realContentVisible, true, "Legitimate page content must remain visible");
    assert.equal(actual.pageOwnedElementPresent, true, "Cosmetic toggles must preserve page-owned nodes");
    assert.equal(counts.ad - before.ad, adLoaded ? 1 : 0, "Check server receipt for every case");
    assert.equal(counts.benign - before.benign, 1, "The control must always reach the server");
    if (!adLoaded) assert.ok(failures.includes("net::ERR_BLOCKED_BY_CLIENT"), "Only an explicit blocking failure counts as DNR evidence");
    console.log("Browser case passed:", JSON.stringify({ host, adLoaded, cosmeticHidden, actual }));
  } finally {
    page.off("requestfailed", recordFailure);
  }
}

async function setEnabled(options, enabled) {
  const input = options.locator("#enabled");
  if ((await input.isChecked()) !== enabled) {
    if (enabled) await input.check();
    else await input.uncheck();
    await options.locator("#status").filter({ hasText: "Saved." }).waitFor();
  }
}

async function setTrusted(options, site, trusted) {
  const list = options.locator("#sites li");
  const exists = async () => await list.filter({ hasText: site }).count() > 0;
  if ((await exists()) === trusted) return;
  if (trusted) {
    await options.locator("#site").fill(site);
    await options.getByRole("button", { name: "Add website" }).click();
    await list.filter({ hasText: site }).waitFor();
  } else {
    await list.filter({ hasText: site }).getByRole("button", { name: "Remove" }).click();
    await list.filter({ hasText: site }).waitFor({ state: "detached" });
  }
}

async function openMirrorViews(extensionId) {
  const mirror = await context.newPage();
  await mirror.goto("chrome-extension://" + extensionId + "/options/options.html");
  await mirror.locator("#status").filter({ hasText: "Settings loaded." }).waitFor();
  const popupView = await context.newPage();
  await popupView.goto("chrome-extension://" + extensionId + "/popup/popup.html");
  await popupView.locator("#badge").filter({ hasText: /Protected|Paused/ }).waitFor();
  return { mirror, popupView };
}

async function checkLiveViews(views, name, enabled, sites) {
  await views.mirror.waitForFunction((expected) => document.querySelector("#enabled")?.checked === expected, enabled);
  await views.popupView.locator("#badge").filter({ hasText: enabled ? "Protected" : "Paused" }).waitFor();
  await views.mirror.waitForFunction((expected) =>
    JSON.stringify([...document.querySelectorAll("#sites li span")].map((item) => item.textContent)) === JSON.stringify(expected)
  , sites);
  liveViewCheckpoints++;
  console.log("Live-view checkpoint passed:", name);
}

try {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  port = server.address().port;
  context = await launch();
  console.log("Browser environment:", JSON.stringify({ node: process.version, chromium: context.browser().version() }));
  const worker = context.serviceWorkers()[0] || await context.waitForEvent("serviceworker", { timeout: 20000 });
  const extensionId = new URL(worker.url()).host;
  assert.ok(extensionId, "Extension service worker must start");

  const options = await context.newPage();
  await options.goto("chrome-extension://" + extensionId + "/options/options.html");
  await options.locator("#enabled").waitFor({ state: "visible" });
  await options.locator("#status").filter({ hasText: "Settings loaded." }).waitFor();
  assert.equal(await options.locator("#enabled").isChecked(), true, "New installs must start enabled");

  const concurrent = await options.evaluate(async () => {
    const responses = await Promise.all([
      chrome.runtime.sendMessage({ type: "SET_SITE_ALLOWED", site: "one.example", allowed: true }),
      chrome.runtime.sendMessage({ type: "SET_SITE_ALLOWED", site: "two.example", allowed: true })
    ]);
    const stored = await chrome.storage.local.get({ enabled: true, allowlistedSites: [] });
    const rules = await chrome.declarativeNetRequest.getDynamicRules();
    return { responses, stored, domains: rules
      .filter((rule) => rule.id >= 100000 && rule.id < 100100)
      .flatMap((rule) => rule.condition.requestDomains).sort() };
  });
  assert.ok(concurrent.responses.every((response) => response.ok), "Concurrent settings commands must both succeed");
  assert.deepEqual(concurrent.stored.allowlistedSites, ["one.example", "two.example"], "Concurrent additions must retain both saved exceptions");
  assert.deepEqual(concurrent.domains, ["one.example", "two.example"], "DNR must retain both concurrent exceptions");
  assert.deepEqual(concurrent.responses.map((response) => response.state.allowlistedSites.length).sort(), [1, 2], "Each response must describe its completed operation in worker order");
  concurrentMutationCheckpoints++;
  console.log("Concurrent-mutation checkpoint passed: both additions persist in storage and DNR");
  const resetAfterConcurrency = await options.evaluate(() => chrome.runtime.sendMessage({ type: "RESET_SETTINGS" }));
  assert.equal(resetAfterConcurrency.ok, true);
  await options.waitForFunction(() => document.querySelectorAll("#sites li").length === 0);

  const website = await context.newPage();
  await checkPage(website, { adLoaded: false, cosmeticHidden: true });
  assert.equal(counts.ad, 0, "Blocked ad fixture should never hit local server");

  // PR #20's two-view regression goal, adapted to the current package layout.
  // popup.html in a tab exercises view logic; actual toolbar presentation is manual QA.
  const views = await openMirrorViews(extensionId);

  await setEnabled(options, false);
  await checkLiveViews(views, "external pause", false, []);
  await website.waitForFunction(() => getComputedStyle(document.querySelector("#ad-box")).display !== "none");
  assert.equal(await website.locator("#ad-blocker-cosmetic").count(), 1, "Pause must not remove page-owned content before navigation");
  await checkPage(website, { adLoaded: true, cosmeticHidden: false });
  assert.ok(counts.ad > 0, "Paused extension should allow the fake ad fixture");

  await setEnabled(options, true);
  await checkLiveViews(views, "external resume", true, []);
  await setTrusted(options, "publisher.test", true);
  await checkLiveViews(views, "external site trust", true, ["publisher.test"]);
  await checkPage(website, { adLoaded: true, cosmeticHidden: false });
  await checkPage(website, { host: "news.publisher.test", adLoaded: true, cosmeticHidden: false });
  await checkPage(website, { host: "notpublisher.test", adLoaded: false, cosmeticHidden: true });
  await setTrusted(options, "publisher.test", false);
  await checkLiveViews(views, "external trust removal", true, []);
  await checkPage(website, { adLoaded: false, cosmeticHidden: true });

  // Persistence after closing Chromium and launching the same user-data-dir.
  await setTrusted(options, "publisher.test", true);
  await context.close();
  context = await launch();
  const resumedWorker = context.serviceWorkers()[0] ||
    await context.waitForEvent("serviceworker", { timeout: 20000 });
  const restored = await context.newPage();
  await restored.goto("chrome-extension://" + new URL(resumedWorker.url()).host + "/options/options.html");
  await restored.locator("#status").filter({ hasText: "Settings loaded." }).waitFor();
  assert.equal(await restored.locator("#enabled").isChecked(), true);
  assert.equal(await restored.locator("#sites li").filter({ hasText: "publisher.test" }).count(), 1);
  const afterRestart = await context.newPage();
  await checkPage(afterRestart, { adLoaded: true, cosmeticHidden: false });
  await setTrusted(restored, "publisher.test", false);
  await checkPage(afterRestart, { adLoaded: false, cosmeticHidden: true });
  await setEnabled(restored, false);
  await context.close();
  context = await launch();
  const pausedWorker = context.serviceWorkers()[0] || await context.waitForEvent("serviceworker", { timeout: 20000 });
  const pausedOptions = await context.newPage();
  await pausedOptions.goto("chrome-extension://" + new URL(pausedWorker.url()).host + "/options/options.html");
  await pausedOptions.locator("#status").filter({ hasText: "Settings loaded." }).waitFor();
  assert.equal(await pausedOptions.locator("#enabled").isChecked(), false, "Global pause must survive restart");
  const recoveryViews = await openMirrorViews(new URL(pausedWorker.url()).host);
  const pausedWebsite = await context.newPage();
  await checkPage(pausedWebsite, { adLoaded: true, cosmeticHidden: false });
  await setTrusted(pausedOptions, "publisher.test", true);
  pausedOptions.once("dialog", (dialog) => dialog.accept());
  await pausedOptions.getByRole("button", { name: "Restore default settings" }).click();
  await pausedOptions.locator("#status").filter({ hasText: "Default settings restored." }).waitFor();
  assert.equal(await pausedOptions.locator("#enabled").isChecked(), true, "Recovery must re-enable protection");
  assert.equal(await pausedOptions.locator("#sites li").count(), 0, "Recovery must remove trusted sites");
  await checkLiveViews(recoveryViews, "external reset recovery", true, []);
  await checkPage(pausedWebsite, { adLoaded: false, cosmeticHidden: true });
  assert.equal(liveViewCheckpoints, 5, "Run every live-view synchronization checkpoint");
  assert.equal(concurrentMutationCheckpoints, 1, "Run the concurrent-mutation browser checkpoint");
  console.log("Live-view synchronization checkpoints:", liveViewCheckpoints);
  console.log("Concurrent-mutation checkpoints:", concurrentMutationCheckpoints);
  console.log("All Chromium MV3 smoke tests passed; ad/control request counts:", counts);
} finally {
  if (context) await context.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
  rmSync(profile, { recursive: true, force: true });
}
