def calculate_task_progress(completed_tasks: int, total_tasks: int) -> int:
    if total_tasks <= 0:
        return 0

    safe_completed = min(max(completed_tasks, 0), total_tasks)
    return round((safe_completed / total_tasks) * 100)


def calculate_goal_progress_average(progress_values: list[int]) -> int:
    if not progress_values:
        return 0

    safe_values = [
        min(max(progress, 0), 100)
        for progress in progress_values
    ]

    return round(sum(safe_values) / len(safe_values))


def update_progress_by_step(current_progress: int, step: int = 5) -> int:
    return min(max(current_progress + step, 0), 100)


def sum_study_minutes(sessions: list[dict]) -> int:
    return sum(
        max(int(session.get("duration_minutes", 0)), 0)
        for session in sessions
    )
