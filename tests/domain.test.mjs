import test from "node:test";
import assert from "node:assert/strict";

await import("../shared/domain.js");
const { normalizeSite, isAllowlisted } = globalThis.AdBlockerDomain;

test("normalizes website hostnames and URLs", () => {
  assert.equal(normalizeSite("Example.COM"), "example.com");
  assert.equal(normalizeSite("https://News.Example.COM/path?x=1"), "news.example.com");
  assert.equal(normalizeSite("  www.example.org  "), "www.example.org");
  assert.equal(normalizeSite("https://user:secret@example.com"), null);
  assert.equal(normalizeSite("chrome://extensions"), null);
  assert.equal(normalizeSite("file:///tmp/file"), null);
  assert.equal(normalizeSite("bad domain.org"), null);
  assert.equal(normalizeSite("*.example.org"), null);
  assert.equal(normalizeSite("http://127.0.0.1"), null);
  assert.equal(normalizeSite(""), null);
});

test("matches only exact domain and subdomains for exceptions", () => {
  assert.equal(isAllowlisted("example.com", ["example.com"]), true);
  assert.equal(isAllowlisted("www.example.com", ["example.com"]), true);
  assert.equal(isAllowlisted("notexample.com", ["example.com"]), false);
  assert.equal(isAllowlisted("fake-example.com", ["example.com"]), false);
  assert.equal(isAllowlisted("example.com.evil.test", ["example.com"]), false);
  assert.equal(isAllowlisted("other.net", ["example.com"]), false);
  assert.equal(isAllowlisted("example.com", null), false);
});
