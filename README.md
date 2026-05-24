# Switchback

**Adaptive training plans for trail and ultra runners.**
[switchback.run](https://switchback.run) · [waitlist](https://switchback.run/#waitlist)

Switchback writes a trail or ultra running plan from a plain-language description of your goal race, pushes the workouts to your Garmin, and rewrites next week from what you actually ran.

The metaphor is literal: a switchback is a trail-design trick that lets you climb steep terrain by zigzagging back and forth, never exceeding the safe gradient. Same idea applied to training — weekly load caps, recovery weeks, plan reshapes around your data.

> No one runs straight up a mountain.

---

## Repo layout

| Path | What |
|---|---|
| `index.html`, `styles.css`, `scripts.js`, `assets/` | Landing site. Static, no build step. Deployed to GitHub Pages at the repo root. |
| `docs/` | Planning artifacts: product brief, Garmin API application copy, privacy policy and terms drafts, email setup notes, pre-launch checklist. |
| `proposals/` | Alternate landing-page design directions explored before picking the current one. Open `proposals/index.html` to compare. |
| `app/` *(future)* | Web product app. Not started yet. |

## Run the landing page locally

No build step. Serve the directory:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploying the landing site

GitHub Pages serves from `main` branch, `/ (root)` folder. Enable at: **Settings → Pages → Source: Deploy from a branch → Branch: `main`, `/ (root)` → Save.**

Live URL becomes `https://pvhee.github.io/switchback/` until the custom domain (`switchback.run`) is configured.

## Status

Pre-launch. Building toward:
- Garmin Training API approval (application drafts in `docs/`)
- Landing page + waitlist live at `switchback.run`
- Closed alpha on `.FIT` export delivery while Garmin API is pending
- Web app build starts after the first 50 waitlist signups

## Company

A product of [Cloudwired](https://cloudwired.dev), Estonia.
Founder: Peter Van Hee · `peter@switchback.run`
