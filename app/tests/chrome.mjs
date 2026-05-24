// Find a Chrome/Chromium binary the test can drive. Resolution order:
//   1. $CHROME_PATH (explicit override)
//   2. System Chrome/Chromium (any `command -v` hit)
//   3. Locally cached download in ~/.cache/switchback-chromium/
//   4. Download a Chromium snapshot from Google Storage (Linux only)
//
// Cached download is intentionally outside the repo so it isn't accidentally
// committed and survives `rm -rf node_modules`.

import { existsSync, mkdirSync, createWriteStream } from "node:fs";
import { execSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { join } from "node:path";

const CACHE_DIR = join(
  process.env.XDG_CACHE_HOME || `${process.env.HOME}/.cache`,
  "switchback-chromium",
);
const CACHED_BIN = join(CACHE_DIR, "chrome-linux", "chrome");

const SYSTEM_BINS = [
  "google-chrome",
  "google-chrome-stable",
  "chromium",
  "chromium-browser",
];

export async function findOrDownloadChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  for (const cmd of SYSTEM_BINS) {
    try {
      const path = execSync(`command -v ${cmd}`, { encoding: "utf-8" }).trim();
      if (path) return path;
    } catch {
      // not on PATH, try next
    }
  }
  if (existsSync(CACHED_BIN)) return CACHED_BIN;

  if (process.platform !== "linux") {
    throw new Error(
      "No system Chrome found. Install Chrome/Chromium, or set CHROME_PATH " +
        "to your browser binary. Auto-download is Linux-only.",
    );
  }

  return await downloadChromium();
}

async function downloadChromium() {
  console.log(`Downloading Chromium snapshot to ${CACHE_DIR}…`);
  mkdirSync(CACHE_DIR, { recursive: true });

  const rev = (
    await fetch("https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/LAST_CHANGE")
  ).then ? await (await fetch(
    "https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/LAST_CHANGE",
  )).text() : null;
  if (!rev) throw new Error("Couldn't read LAST_CHANGE from Google Storage.");
  const revTrim = rev.trim();

  const url = `https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/${revTrim}/chrome-linux.zip`;
  console.log(`  fetching r${revTrim}…`);
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Download failed: ${resp.status}`);

  const zipPath = join(tmpdir(), `chromium-${revTrim}.zip`);
  await pipeline(Readable.fromWeb(resp.body), createWriteStream(zipPath));

  console.log("  extracting…");
  const r = spawnSync("unzip", ["-q", zipPath, "-d", CACHE_DIR], { stdio: "inherit" });
  if (r.status !== 0) throw new Error("unzip failed");

  if (!existsSync(CACHED_BIN)) {
    throw new Error(`Expected binary at ${CACHED_BIN} but it isn't there.`);
  }
  console.log(`  ready: ${CACHED_BIN}`);
  return CACHED_BIN;
}
