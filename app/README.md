# Switchback — web app

Adaptive trail / ultra training plan generator. FastAPI + Claude API
backend, vanilla HTML/JS frontend, .FIT export for Garmin.

## Local dev

```bash
cd app/
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # paste your ANTHROPIC_API_KEY
uvicorn main:app --reload --port 8000
```

Open `http://localhost:8000`.

## Endpoints

| Method | Path                | Body                  | Returns                              |
|--------|---------------------|-----------------------|--------------------------------------|
| GET    | `/`                 | —                     | Frontend (static `index.html`)       |
| GET    | `/healthz`          | —                     | `{"status": "ok"}`                   |
| POST   | `/api/plan`         | `PlanRequest` (JSON)  | `Plan` (JSON)                        |
| POST   | `/api/workout.fit`  | `{workout: Workout}`  | Binary `.FIT` file (workout)         |

Plan generation uses Claude `claude-opus-4-7` with adaptive thinking. Override
with `SWITCHBACK_MODEL=<id>` in `.env`.

## Mobile testing

### Option 1 — Demo mode on GitHub Pages (zero setup, no backend)

The app auto-detects when there's no backend and switches to demo mode,
serving the baked `static/sample-plan.json` so you can see the UI working.

Once this branch is merged to `main`, enable GitHub Pages (Settings →
Pages → `main`, root) and the demo will be live at:
`https://pvhee.github.io/switchback/app/static/index.html`

Or for an unmerged branch, use a [raw CDN](https://raw.githack.com/) —
no auth, instant preview on phone.

### Option 2 — Cloudflare Tunnel from local dev (full backend, no deploy)

```bash
# In one terminal:
uvicorn main:app --port 8000
# In another:
cloudflared tunnel --url http://localhost:8000
```

Cloudflared prints a public `https://*.trycloudflare.com` URL — open it on
your phone. Backend stays on your laptop; tunnel goes through Cloudflare.
Same trick with `ngrok http 8000`.

### Option 3 — Deploy to Render (free tier, persistent URL)

`render.yaml` in this folder is a one-click blueprint. Push branch, connect
the repo on Render, paste your `ANTHROPIC_API_KEY`, deploy. You get a
`*.onrender.com` URL that works on any phone.

## .FIT files on phone

iOS doesn't open `.FIT` natively. Download, then:

- **Garmin Connect Mobile** → Training → Workouts → import
- Or AirDrop / email to a desktop and import via Garmin Connect web

Android handles `.FIT` files through the Garmin Connect app share sheet.

## Layout

```
app/
├── main.py             FastAPI app: routes + static mount
├── planner.py          Claude API plan generation (structured output)
├── fit_export.py       Workout → .FIT bytes (fit-tool)
├── models.py           Pydantic schemas: PlanRequest, Plan, Week, Workout
├── requirements.txt
├── render.yaml         One-click Render deploy
├── .env.example
└── static/
    ├── index.html      Form + plan display
    ├── styles.css      Inherits landing-page palette
    ├── app.js          Live/demo mode controller, .FIT downloader
    └── sample-plan.json  Baked plan for demo mode
```
