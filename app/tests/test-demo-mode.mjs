// Smoke test for the Switchback static frontend in demo mode.
//
// Goal: catch DOM/runtime bugs in app.js before they ship — specifically
// the kind that only surface in the browser (appendChild type errors,
// undefined-on-undefined, etc.).
//
// jsdom 29 doesn't execute ES module scripts or ship `fetch`, so we
// transform app.js to a classic script, stub `fetch` to serve the local
// sample-plan.json, and assert that clicking "Load sample" renders the
// plan without runtime errors.
//
// Run:  cd app/tests && npm install && npm test

import jsdomPkg from "jsdom";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const { JSDOM } = jsdomPkg;

const STATIC_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..", "static");

const html = readFileSync(`${STATIC_DIR}/index.html`, "utf-8").replace(
  /<script\s+type="module"[^>]*><\/script>/,
  "",
);
const appJs = readFileSync(`${STATIC_DIR}/app.js`, "utf-8").replace(
  /import\.meta\.url/g,
  JSON.stringify(`file://${STATIC_DIR}/app.js`),
);
const samplePlan = readFileSync(`${STATIC_DIR}/sample-plan.json`, "utf-8");

const errors = [];

const dom = new JSDOM(html, {
  url: `file://${STATIC_DIR}/`,
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
});

dom.window.addEventListener("error", (e) =>
  errors.push(`window.error: ${e.message}`),
);
dom.window.addEventListener("unhandledrejection", (e) =>
  errors.push(`unhandledrejection: ${e.reason?.message || e.reason}`),
);
const origConsoleError = dom.window.console.error;
dom.window.console.error = (...args) => {
  errors.push(`console.error: ${args.map(String).join(" ")}`);
  origConsoleError.apply(dom.window.console, args);
};

await new Promise((r) => dom.window.addEventListener("load", r));

dom.window.fetch = async (input) => {
  const url = typeof input === "string" ? input : input.url || input.toString();
  if (url.endsWith("sample-plan.json")) {
    return {
      ok: true,
      status: 200,
      text: async () => samplePlan,
      json: async () => JSON.parse(samplePlan),
    };
  }
  return { ok: false, status: 404, text: async () => "", json: async () => ({}) };
};

const script = dom.window.document.createElement("script");
script.textContent = appJs;
dom.window.document.body.appendChild(script);

await new Promise((r) => setTimeout(r, 300));

const { document } = dom.window;
const modePill = document.querySelector("#mode-pill");
if (modePill.hidden) fail("demo mode did not activate (no #mode-pill visible)");

document.querySelector("#demo-btn").click();
await new Promise((r) => setTimeout(r, 500));

const plan = document.querySelector("#plan");
const weeks = plan.querySelectorAll(".week");
const fitButtons = plan.querySelectorAll(".fit-btn");
const formError = document.querySelector("#form-error");

if (errors.length > 0) fail(`runtime errors:\n  ${errors.join("\n  ")}`);
if (!formError.hidden) fail(`form error shown: ${formError.textContent}`);
if (plan.hidden) fail("plan element is still hidden after Load sample");
if (weeks.length === 0) fail("no .week elements rendered");
if (fitButtons.length === 0) fail("no .FIT download buttons rendered");

console.log(
  `OK — demo mode active, ${weeks.length} weeks rendered with ${fitButtons.length} .FIT buttons.`,
);

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}
