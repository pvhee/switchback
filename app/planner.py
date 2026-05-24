"""Plan generation — provider-agnostic via LiteLLM.

The model is chosen by the SWITCHBACK_MODEL env var. Defaults to
`claude-opus-4-7`. LiteLLM also accepts model strings like:

    openai/gpt-4o-mini
    deepseek/deepseek-chat
    gemini/gemini-2.0-flash-exp
    openrouter/anthropic/claude-3.5-sonnet
    groq/llama-3.3-70b-versatile

Each provider reads its own API key from the matching env var
(ANTHROPIC_API_KEY, OPENAI_API_KEY, DEEPSEEK_API_KEY, GEMINI_API_KEY, ...).
"""

import os

from litellm import acompletion

from models import Plan, PlanRequest

SYSTEM_PROMPT = """You are an experienced trail and ultra running coach writing
adaptive training plans for a service called Switchback.

The metaphor is literal: a switchback is a trail-design trick that lets you
climb steep terrain by zigzagging back and forth, never exceeding the safe
gradient. The same idea applies to training — weekly load caps, recovery weeks,
plan that reshapes around what the runner actually does.

Write plans that follow these principles:

- Periodise: base → build → peak → taper. Cap weekly mileage growth at ~10%
  with a recovery week every 3rd or 4th week (~30% drop).
- Long runs progress gradually; never bigger than ~30% of weekly volume.
- Each week has 1–2 quality sessions (tempo, intervals, hill repeats),
  plenty of easy aerobic miles, and at least one rest day.
- For trail/ultra plans, include vertical / strength / back-to-back long
  weekend efforts where appropriate.
- Be specific: give distance OR duration, terrain, pacing/effort cues, and
  one-line "why this matters" rationale per workout.
- Use the runner's current fitness as the baseline. Don't prescribe runs
  beyond their current longest.
- Keep the plan honest. If the timeline is too short for the goal, say so
  in the notes.

Always produce a complete plan from week 1 through race week. Workout types
must use these enum values: easy_run, long_run, tempo, intervals,
hill_repeats, recovery, rest, race, cross_train. Phase values: base, build,
peak, taper, race_week, recovery. Intensity values: rest, easy, moderate,
hard, maximum.

Days use 3-letter lowercase abbreviations: mon, tue, wed, thu, fri, sat, sun.
"""

DEFAULT_MODEL = "claude-opus-4-7"


def _build_user_prompt(req: PlanRequest) -> str:
    lines = [f"Runner's goal: {req.goal_description}"]
    if req.race_date:
        lines.append(f"Target race date: {req.race_date}")
    if req.weeks_until_race:
        lines.append(f"Weeks until race: {req.weeks_until_race}")
    if req.weekly_km is not None:
        lines.append(f"Current weekly volume: {req.weekly_km} km")
    if req.longest_run_km is not None:
        lines.append(f"Current longest run: {req.longest_run_km} km")
    lines.append("")
    lines.append(
        "Generate a week-by-week plan. Include every week from now through "
        "race week. Each week needs 7 workouts (one per day — rest days "
        "included). Respond with JSON matching the Plan schema."
    )
    return "\n".join(lines)


def _provider_key_var(model: str) -> str:
    """Best-effort: which env var the chosen provider needs."""
    head = model.split("/", 1)[0].lower()
    return {
        "openai": "OPENAI_API_KEY",
        "anthropic": "ANTHROPIC_API_KEY",
        "claude-opus-4-7": "ANTHROPIC_API_KEY",
        "claude-opus-4-6": "ANTHROPIC_API_KEY",
        "claude-sonnet-4-6": "ANTHROPIC_API_KEY",
        "claude-haiku-4-5": "ANTHROPIC_API_KEY",
        "deepseek": "DEEPSEEK_API_KEY",
        "gemini": "GEMINI_API_KEY",
        "groq": "GROQ_API_KEY",
        "openrouter": "OPENROUTER_API_KEY",
        "together_ai": "TOGETHERAI_API_KEY",
    }.get(head, "ANTHROPIC_API_KEY" if head.startswith("claude") else "")


async def generate_plan(req: PlanRequest) -> Plan:
    model = os.environ.get("SWITCHBACK_MODEL", DEFAULT_MODEL)
    key_var = _provider_key_var(model)
    if key_var and not os.environ.get(key_var):
        raise RuntimeError(
            f"{key_var} is not set for model '{model}'. "
            f"Copy app/.env.example to app/.env and add the key, then "
            f"restart the server."
        )

    response = await acompletion(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_prompt(req)},
        ],
        response_format=Plan,
        max_tokens=16000,
    )
    content = response.choices[0].message.content
    if not content:
        raise RuntimeError(
            f"{model} returned an empty response. "
            f"finish_reason={response.choices[0].finish_reason}"
        )
    try:
        return Plan.model_validate_json(content)
    except Exception as e:
        raise RuntimeError(
            f"{model} returned a response that didn't match the Plan schema: {e}"
        ) from e
