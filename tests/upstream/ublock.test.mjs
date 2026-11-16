import test from "node:test";
import assert from "node:assert/strict";

// Run via test:ublock after build:ublock. No network or external filter lists.
test("ZIP-derived engine blocks ads, honors exceptions, and permits benign requests", async () => {
  const { StaticNetFilteringEngine, pslInit } = await import("../../build/ublock-node/index.js");
  pslInit("example\ncom");
  const engine = await StaticNetFilteringEngine.create({ noPSL: true });
  try {
    await engine.useLists([{ name: "synthetic fixture", raw: "||ads.example^\n@@||ads.example/allowed.js$script" }]);
    const match = (url) => engine.matchRequest({ url, originURL: "https://publisher.example/", type: "script" });
    assert.equal(match("https://ads.example/ad.js"), 1, "Ad request must be blocked");
    assert.equal(match("https://ads.example/allowed.js"), 2, "Explicit exception must be honored");
    assert.equal(match("https://publisher.example/content.js"), 0, "Benign request must be allowed");
  } finally {
    await StaticNetFilteringEngine.release();
  }
});
