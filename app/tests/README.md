# app/tests

Two layers of frontend tests for `app/static/`.

| File | What | Runtime | When it runs |
|---|---|---|---|
| `test-demo-mode.mjs` | jsdom smoke test: loads index.html, stubs `fetch`, clicks Load sample, asserts plan renders without runtime errors | Pure node + jsdom | Fast (~1s) — catches JS bugs |
| `test-browser.mjs` | Headless Chromium e2e: same flow + asserts no `[hidden]` element is visible + writes screenshots at desktop and mobile widths | Real Chromium via puppeteer-core | Slow (~5s) — catches CSS bugs jsdom can't see |

## Run

```bash
cd app/tests
npm install        # one-time
npm test           # both
npm run test:jsdom
npm run test:browser
```

Browser test screenshots land in `app/tests/shots/` (gitignored).

## Chromium

`test-browser.mjs` looks for Chrome in this order:

1. `$CHROME_PATH` env var
2. System `google-chrome` / `chromium` / `chromium-browser` on `$PATH`
3. Cached download at `~/.cache/switchback-chromium/chrome-linux/chrome`
4. Downloads a Chromium snapshot from `storage.googleapis.com` (Linux only, ~220MB, cached so it's a one-time cost)

If you're on macOS without Chrome installed:

```bash
brew install --cask google-chrome
# or
export CHROME_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
```

## Why both layers

jsdom is fast and good at catching JS runtime errors (it caught the
`appendChild` crash from passing a number where a Node was expected). But
it doesn't compute styles, so the CSS regression where `.empty-state`
overrode `[hidden]` slipped through. Only the browser test caught that.

Add new assertions to whichever layer fits — but if a change touches CSS,
run the browser test.
