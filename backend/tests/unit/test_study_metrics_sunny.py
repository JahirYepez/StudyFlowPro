from app.services.study_metrics import (
    calculate_goal_progress_average,
    calculate_task_progress,
    sum_study_minutes,
    update_progress_by_step,
)


def test_calculate_task_progress_with_completed_tasks():
    assert calculate_task_progress(completed_tasks=3, total_tasks=4) == 75


def test_calculate_task_progress_with_no_tasks():
    assert calculate_task_progress(completed_tasks=0, total_tasks=0) == 0


def test_calculate_goal_progress_average_with_multiple_goals():
    assert calculate_goal_progress_average([0, 50, 100]) == 50


def test_update_progress_by_default_step():
    assert update_progress_by_step(30) == 35


def test_sum_study_minutes_with_valid_sessions():
    sessions = [
        {"duration_minutes": 25},
        {"duration_minutes": 35},
        {"duration_minutes": 40},
    ]

    assert sum_study_minutes(sessions) == 100
