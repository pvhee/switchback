"""Switchback web app — FastAPI backend.

Run from the app/ directory:

    pip install -r requirements.txt
    cp .env.example .env  # add your ANTHROPIC_API_KEY
    uvicorn main:app --reload --port 8000

Then open http://localhost:8000.
"""

from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles

load_dotenv()  # noqa: E402 — env vars must be in scope before importing planner

from fit_export import workout_to_fit  # noqa: E402
from models import FitExportRequest, Plan, PlanRequest  # noqa: E402
from planner import generate_plan  # noqa: E402

APP_DIR = Path(__file__).parent
STATIC_DIR = APP_DIR / "static"

app = FastAPI(title="Switchback", version="0.1.0")


@app.get("/healthz", include_in_schema=False)
async def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/plan", response_model=Plan)
async def create_plan(req: PlanRequest) -> Plan:
    try:
        return await generate_plan(req)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Plan generation failed: {e}")


@app.post("/api/workout.fit")
async def export_workout_fit(req: FitExportRequest) -> Response:
    try:
        fit_bytes = workout_to_fit(req.workout)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f".FIT encoding failed: {e}")

    safe_name = "".join(
        c if c.isalnum() or c in "-_" else "_" for c in req.workout.name
    )[:32] or "workout"
    return Response(
        content=fit_bytes,
        media_type="application/vnd.ant.fit",
        headers={"Content-Disposition": f'attachment; filename="{safe_name}.fit"'},
    )


# Static frontend at root — declared AFTER API routes so /api/* and /healthz
# take precedence. html=True serves index.html for GET /.
app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
