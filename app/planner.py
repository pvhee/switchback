import os

from anthropic import AsyncAnthropic

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
        "included)."
    )
    return "\n".join(lines)


async def generate_plan(req: PlanRequest) -> Plan:
    if not os.environ.get("ANTHROPIC_API_KEY"):
        raise RuntimeError(
            "ANTHROPIC_API_KEY is not set. Copy app/.env.example to app/.env "
            "and add your key, then restart the server."
        )

    model = os.environ.get("SWITCHBACK_MODEL", "claude-opus-4-7")
    client = AsyncAnthropic()
    response = await client.messages.parse(
        model=model,
        max_tokens=16000,
        thinking={"type": "adaptive"},
        output_config={"effort": "high"},
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": _build_user_prompt(req)}],
        output_format=Plan,
    )
    if response.parsed_output is None:
        raise RuntimeError(
            "Plan generator returned an unparseable response. "
            f"stop_reason={response.stop_reason}"
        )
    return response.parsed_output
