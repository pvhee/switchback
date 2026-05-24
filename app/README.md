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

## Models / providers

Plan generation goes through [LiteLLM](https://docs.litellm.ai/), so it's
provider-agnostic. Set `SWITCHBACK_MODEL` to any LiteLLM model string and the
matching API key. Default is `claude-opus-4-7`.

```bash
SWITCHBACK_MODEL=claude-opus-4-7              # default — highest quality, ANTHROPIC_API_KEY
SWITCHBACK_MODEL=claude-sonnet-4-6            # cheaper Claude
SWITCHBACK_MODEL=openai/gpt-4o-mini           # cheap, OPENAI_API_KEY
SWITCHBACK_MODEL=deepseek/deepseek-chat       # very cheap, DEEPSEEK_API_KEY
SWITCHBACK_MODEL=gemini/gemini-2.0-flash-exp  # cheap, GEMINI_API_KEY
SWITCHBACK_MODEL=groq/llama-3.3-70b-versatile # fast + cheap, GROQ_API_KEY
SWITCHBACK_MODEL=openrouter/anthropic/claude-3.5-sonnet  # OPENROUTER_API_KEY
```

The Plan schema is a Pydantic model passed to `litellm.acompletion` as
`response_format=Plan`. LiteLLM handles each provider's structured-output
dialect (Anthropic tool use, OpenAI JSON schema, Gemini JSON mode, etc.).
Quality varies — Claude and GPT-4o are reliably good; cheaper models will
sometimes return invalid JSON and trigger a 500.

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
