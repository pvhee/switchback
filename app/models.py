from typing import Literal

from pydantic import BaseModel, Field

Day = Literal["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
WorkoutType = Literal[
    "easy_run",
    "long_run",
    "tempo",
    "intervals",
    "hill_repeats",
    "recovery",
    "rest",
    "race",
    "cross_train",
]
Phase = Literal["base", "build", "peak", "taper", "race_week", "recovery"]
Intensity = Literal["rest", "easy", "moderate", "hard", "maximum"]


class Workout(BaseModel):
    day: Day
    name: str = Field(description="Short workout name, e.g. 'Long run', '6x800m'.")
    type: WorkoutType
    duration_min: int = Field(description="Total duration in minutes. 0 for rest.")
    distance_km: float | None = Field(
        default=None,
        description="Target distance in km. Null if duration-based.",
    )
    description: str = Field(
        description="Coaching notes — what to do, terrain, pacing, why."
    )
    intensity: Intensity


class Week(BaseModel):
    week_num: int = Field(description="1-indexed week number.")
    phase: Phase
    focus: str = Field(description="One-line focus for the week.")
    total_km: float
    workouts: list[Workout]


class Plan(BaseModel):
    goal: str = Field(description="Restated goal in one sentence.")
    race_date: str | None = Field(
        default=None, description="ISO date (YYYY-MM-DD) if known."
    )
    total_weeks: int
    weeks: list[Week]
    notes: str = Field(description="Coach's notes: caveats, adjustments, rationale.")


class PlanRequest(BaseModel):
    goal_description: str = Field(
        description="Plain-language goal, e.g. 'UTMB CCC in Aug 2027, currently running 40km/week, longest run 25km'."
    )
    race_date: str | None = None
    weekly_km: float | None = None
    longest_run_km: float | None = None
    weeks_until_race: int | None = None


class FitExportRequest(BaseModel):
    workout: Workout
