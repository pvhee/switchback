// End-to-end test for the Switchback static frontend in a real headless
// Chromium. Catches the class of bugs that jsdom misses: CSS / [hidden]
// interactions, layout breaks at narrow widths, console errors at runtime.
//
// What it does:
//   1. Serves app/static/ on a local port
//   2. Launches Chromium at desktop + mobile viewports
//   3. Clicks "Load sample", asserts the plan renders cleanly
//   4. Asserts no element with the [hidden] attribute is actually visible
//      (display: grid/flex defeats the browser default — this is the
//      class of regression that motivated this harness)
//   5. Writes screenshots to ./shots/ for visual review
//
// Run:  cd app/tests && npm install && npm run test:browser

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

import { findOrDownloadChrome } from "./chrome.mjs";

const STATIC_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..", "static");
const SHOTS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "shots");
const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

// --- Local static server ---------------------------------------------------

const server = createServer(async (req, res) => {
  let path = req.url.split("?")[0];
  if (path === "/") path = "/index.html";
  try {
    const buf = await readFile(resolve(STATIC_DIR, "." + path));
    res.writeHead(200, { "content-type": MIME[extname(path)] || "application/octet-stream" });
    res.end(buf);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const URL = `http://127.0.0.1:${port}/`;

// --- Browser ---------------------------------------------------------------

mkdirSync(SHOTS_DIR, { recursive: true });
const chromePath = await findOrDownloadChrome();

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

const errors = [];

// Chromium logs "Failed to load resource: …" for any sub-resource that 404s
// or fails TLS — Google Fonts in a network-restricted sandbox, favicon, etc.
// These are not application bugs, so filter them out. Real app bugs surface
// as pageerror events or our own console.error calls.
const NOISE = [
  /^Failed to load resource:/,
  /fonts\.(googleapis|gstatic)\.com/,
  /favicon/,
];
function isNoise(s) {
  return NOISE.some((re) => re.test(s));
}

async function visit(viewport, slug) {
  const page = await browser.newPage();
  await page.setViewport(viewport);

  page.on("pageerror", (e) => errors.push(`[${slug}] pageerror: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (isNoise(text)) return;
    errors.push(`[${slug}] console.error: ${text}`);
  });

  await page.goto(URL, { waitUntil: "networkidle0" });
  await page.waitForSelector("#mode-pill:not([hidden])", { timeout: 5000 });

  await page.screenshot({ path: `${SHOTS_DIR}/${slug}-empty.png` });

  await page.click("#demo-btn");
  await page.waitForSelector("#plan:not([hidden]) .week", { timeout: 5000 });
  await new Promise((r) => setTimeout(r, 300));

  await page.screenshot({ path: `${SHOTS_DIR}/${slug}-plan-fold.png` });
  await page.screenshot({ path: `${SHOTS_DIR}/${slug}-plan-full.png`, fullPage: true });

  const weeks = await page.$$eval(".week", (els) => els.length);
  const fitBtns = await page.$$eval(".fit-btn", (els) => els.length);

  const stillVisible = await page.evaluate(() =>
    [...document.querySelectorAll("[hidden]")]
      .filter((el) => getComputedStyle(el).display !== "none")
      .map((el) => `#${el.id || el.className}`),
  );
  if (stillVisible.length) {
    errors.push(`[${slug}] [hidden] elements still visible: ${stillVisible.join(", ")}`);
  }

  console.log(`  [${slug}] weeks=${weeks} .FIT=${fitBtns} stuck-hidden=${stillVisible.length}`);
  await page.close();
}

try {
  console.log(`serving ${STATIC_DIR} at ${URL}`);
  console.log(`chrome:  ${chromePath}`);
  console.log("--- desktop 1280×800 ---");
  await visit({ width: 1280, height: 800, deviceScaleFactor: 1 }, "desktop");
  console.log("--- mobile 390×844 ---");
  await visit(
    { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    "mobile",
  );
} finally {
  await browser.close();
  server.close();
}

if (errors.length > 0) {
  console.error("\nFAIL:");
  for (const e of errors) console.error("  -", e);
  process.exit(1);
}
console.log(`\nOK — screenshots in ${SHOTS_DIR}/`);
