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

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
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

const launch = () => chromium.launchPersistentContext(profile, {
  channel: "chromium",
  headless: true,
  viewport: { width: 1100, height: 850 },
  args: [
    "--disable-extensions-except=" + extensionPath,
    "--load-extension=" + extensionPath,
    "--host-resolver-rules=MAP publisher.test 127.0.0.1, MAP ads.adblocker.test 127.0.0.1",
    "--no-proxy-server"
  ]
});

async function checkPage(page, { adLoaded, cosmeticHidden }) {
  await page.goto("http://publisher.test:" + port + "/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() =>
    !!document.querySelector("#ad-pixel")?.dataset.result &&
    !!document.querySelector("#benign-pixel")?.dataset.result
  , null, { timeout: 15000 });
  const actual = await page.evaluate(() => ({
    ad: document.querySelector("#ad-pixel").dataset.result,
    benign: document.querySelector("#benign-pixel").dataset.result,
    cosmeticHidden: getComputedStyle(document.querySelector("#ad-box")).display === "none",
    realContentVisible: getComputedStyle(document.querySelector("#real-content")).display !== "none"
  }));
  assert.equal(actual.benign, "loaded", "Control image must reach publisher.test: " + JSON.stringify(actual));
  assert.equal(actual.ad, adLoaded ? "loaded" : "error", "Unexpected DNR result: " + JSON.stringify(actual));
  assert.equal(actual.cosmeticHidden, cosmeticHidden, "Cosmetic CSS unexpectedly changed: " + JSON.stringify(actual));
  assert.equal(actual.realContentVisible, true, "Legitimate page content must remain visible");
  console.log("Browser case passed:", JSON.stringify({ adLoaded, cosmeticHidden, actual }));
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

try {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "0.0.0.0", resolve);
  });
  port = server.address().port;
  context = await launch();
  const worker = context.serviceWorkers()[0] || await context.waitForEvent("serviceworker", { timeout: 20000 });
  const extensionId = new URL(worker.url()).host;
  assert.ok(extensionId, "Extension service worker must start");

  const options = await context.newPage();
  await options.goto("chrome-extension://" + extensionId + "/options/options.html");
  await options.locator("#enabled").waitFor({ state: "visible" });
  await options.locator("#status").filter({ hasText: "Settings loaded." }).waitFor();
  assert.equal(await options.locator("#enabled").isChecked(), true, "New installs must start enabled");

  const website = await context.newPage();
  await checkPage(website, { adLoaded: false, cosmeticHidden: true });
  assert.equal(counts.ad, 0, "Blocked ad fixture should never hit local server");

  await setEnabled(options, false);
  await checkPage(website, { adLoaded: true, cosmeticHidden: false });
  assert.ok(counts.ad > 0, "Paused extension should allow the fake ad fixture");

  await setEnabled(options, true);
  await setTrusted(options, "publisher.test", true);
  await checkPage(website, { adLoaded: true, cosmeticHidden: false });
  await setTrusted(options, "publisher.test", false);
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
  console.log("All Chromium MV3 smoke tests passed; ad/control request counts:", counts);
} finally {
  if (context) await context.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
  rmSync(profile, { recursive: true, force: true });
}
