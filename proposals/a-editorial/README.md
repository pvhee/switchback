# web/ — Switchback landing page

Single-page static landing site for `switchback.run`. No build step.
Just HTML / CSS / JS / SVG. Drop into any static host.

## Local preview

Open `web/index.html` directly in a browser — it works file://.

For a more accurate preview with proper paths:

```
cd web
python3 -m http.server 8080
# open http://localhost:8080
```

## File map

| File | Purpose |
|---|---|
| `index.html` | The page. |
| `styles.css` | All styles. Custom CSS — no framework. |
| `scripts.js` | Nav shadow on scroll + waitlist form handler (stub). |
| `assets/favicon.svg` | Browser-tab icon — zigzag glyph on dark square. |
| `assets/logo.svg` | Wordmark + glyph (unused in page, kept for press / Garmin attachments). |
| `assets/topo.svg` | Hero illustration: switchback trail climbing to a summit, with workout markers. |
| `assets/og-image.svg` | Social share card (1200x630). |

## Wire up the waitlist form

`scripts.js` contains a stub. Replace `submitEmail` with a real
provider call:

- **Buttondown** — simplest for an email-only waitlist. ~5 lines.
- **Resend** + a tiny serverless function — best if you'll send
  transactional email later anyway.
- **Formspree** / **Tally** — no-code, fine for waitlist only.

Until then, the form pretends to succeed and logs to the console.

## Deploy

The site is plain static files. Any of these work in <10 minutes:

| Host | How |
|---|---|
| **Vercel** | `vercel --prod` from `web/`. Auto-detect static site. Add `switchback.run` domain in dashboard. |
| **Cloudflare Pages** | Connect this repo, set build dir = `web`, no build command. |
| **Netlify** | Drag-drop `web/` into Netlify dashboard, or connect repo with publish dir `web`. |
| **GitHub Pages** | Push to a `gh-pages` branch with these files at root; map domain. |

### DNS for `switchback.run`

Once the domain is bought (Namecheap / Porkbun / Cloudflare):

| Record | Host | Target |
|---|---|---|
| `A` / `CNAME` | `@` | per host provider (Vercel: `76.76.21.21`; Cloudflare Pages: CNAME to pages.dev address) |
| `CNAME` | `www` | `switchback.run` |

Add `MX` and TXT records for email per `../product/email-setup.md`.

## /privacy and /terms

Currently 404. The footer links to them anyway because the Garmin
application will reference these URLs.

To publish: render `../product/privacy-policy.md` and
`../product/terms-of-service.md` into `web/privacy.html` and
`web/terms.html` using the same site styling — but **only after a
lawyer has reviewed them** and the "⚠ DRAFT" banner is removed. The
draft drafts in `product/` are not safe to publish as-is.

## Brand notes

- **Wordmark:** all lowercase `switchback`, set in Fraunces 500 with
  a slight negative letter-spacing. The zigzag glyph in alpine clay
  (`#C25A2A`) sits to the left.
- **Tone:** declarative, plainspoken, slightly editorial. Not
  corporate fitness-brand. Closer to iRunFar / Trail Runner Mag than
  Strava marketing.
- **Metaphor:** the switchback is a trail-design trick — zigzagging
  to climb steep terrain without exceeding the safe gradient. The
  product applies the same idea to training: weekly load caps,
  recovery weeks, plan reshapes around your actual data. Use this
  metaphor consistently in copy.

## Open todos before launch

- [ ] Verify `switchback.run` (and `.com` / `.app` / `.io` fallbacks)
      on Namecheap
- [ ] Wire `submitEmail` in `scripts.js` to real provider
- [ ] Rasterize `og-image.svg` to PNG for max compatibility with
      LinkedIn / Twitter (some platforms still don't render SVG OG)
- [ ] Add `/privacy` and `/terms` pages (post lawyer review)
- [ ] Add a real founder photo to the founder section
- [ ] Set up `peter@switchback.run` per `../product/email-setup.md`
