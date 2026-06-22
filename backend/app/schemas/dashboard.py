from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_subjects: int
    total_tasks: int
    pending_tasks: int
    completed_tasks: int
    high_priority_pending_tasks: int
    upcoming_tasks: int
    progress_percentage: int
    total_study_sessions: int
    total_study_minutes: int
    total_study_goals: int
    total_goal_minutes: int
    goal_progress_percentage: int
    pending_reminders: int
    upcoming_reminders: int