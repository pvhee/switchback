"""Encode a Workout to a Garmin .FIT structured workout file.

This is intentionally simple for the MVP: warmup + main + cooldown for active
workouts, single rest step for rest days. Refines later once Garmin Training
API approval lands.
"""

from datetime import datetime, timezone

from fit_tool.fit_file_builder import FitFileBuilder
from fit_tool.profile.messages.file_id_message import FileIdMessage
from fit_tool.profile.messages.workout_message import WorkoutMessage
from fit_tool.profile.messages.workout_step_message import WorkoutStepMessage
from fit_tool.profile.profile_type import (
    FileType,
    Intensity as FitIntensity,
    Manufacturer,
    Sport,
    WorkoutStepDuration,
    WorkoutStepTarget,
)

from models import Workout


def _file_id() -> FileIdMessage:
    msg = FileIdMessage()
    msg.type = FileType.WORKOUT
    msg.manufacturer = Manufacturer.DEVELOPMENT.value
    msg.product = 0
    msg.time_created = round(datetime.now(timezone.utc).timestamp() * 1000)
    msg.serial_number = 0x53574200  # 'SWB\0'
    return msg


def _step(
    index: int,
    name: str,
    intensity: FitIntensity,
    duration_min: int,
) -> WorkoutStepMessage:
    msg = WorkoutStepMessage()
    msg.message_index = index
    msg.workout_step_name = name[:15]
    msg.intensity = intensity
    msg.duration_type = WorkoutStepDuration.TIME
    msg.duration_time = max(duration_min, 1) * 60.0
    msg.target_type = WorkoutStepTarget.OPEN
    return msg


def workout_to_fit(workout: Workout) -> bytes:
    builder = FitFileBuilder(auto_define=True, min_string_size=50)
    builder.add(_file_id())

    steps: list[WorkoutStepMessage] = []
    if workout.type == "rest" or workout.duration_min <= 0:
        steps.append(_step(0, "Rest", FitIntensity.REST, 1))
    elif workout.duration_min <= 20:
        steps.append(_step(0, workout.name, FitIntensity.ACTIVE, workout.duration_min))
    else:
        # Warmup + main + cooldown
        warmup_min = 10 if workout.duration_min >= 45 else 5
        cooldown_min = 5
        main_min = max(workout.duration_min - warmup_min - cooldown_min, 5)
        steps.append(_step(0, "Warmup", FitIntensity.WARMUP, warmup_min))
        steps.append(_step(1, workout.name, FitIntensity.ACTIVE, main_min))
        steps.append(_step(2, "Cooldown", FitIntensity.COOLDOWN, cooldown_min))

    workout_msg = WorkoutMessage()
    workout_msg.workout_name = workout.name[:15]
    workout_msg.sport = Sport.RUNNING
    workout_msg.num_valid_steps = len(steps)
    builder.add(workout_msg)
    for step in steps:
        builder.add(step)

    fit_file = builder.build()
    return bytes(fit_file.to_bytes())
