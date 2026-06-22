from app.services.study_metrics import (
    calculate_goal_progress_average,
    calculate_task_progress,
    sum_study_minutes,
    update_progress_by_step,
)


def test_calculate_task_progress_does_not_exceed_one_hundred():
    assert calculate_task_progress(completed_tasks=10, total_tasks=4) == 100


def test_calculate_task_progress_ignores_negative_completed_values():
    assert calculate_task_progress(completed_tasks=-2, total_tasks=4) == 0


def test_calculate_goal_progress_average_limits_invalid_values():
    assert calculate_goal_progress_average([-20, 50, 130]) == 50


def test_update_progress_by_step_does_not_pass_limits():
    assert update_progress_by_step(98, 5) == 100
    assert update_progress_by_step(2, -5) == 0


def test_sum_study_minutes_ignores_negative_values():
    sessions = [
        {"duration_minutes": 30},
        {"duration_minutes": -15},
        {},
    ]

    assert sum_study_minutes(sessions) == 30
