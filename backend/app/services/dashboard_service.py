from datetime import date, datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.database.mongodb import mongo_db
from app.models.subject import Subject
from app.models.task import Task
from app.models.user import User
from app.models.study_goal import StudyGoal
from app.models.reminder import Reminder

def get_dashboard_summary(db: Session, current_user: User) -> dict:
    today = date.today()
    next_seven_days = today + timedelta(days=7)

    total_subjects = (
        db.query(Subject)
        .filter(Subject.user_id == current_user.id)
        .count()
    )

    total_tasks = (
        db.query(Task)
        .filter(Task.user_id == current_user.id)
        .count()
    )

    completed_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.id,
            Task.completed.is_(True),
        )
        .count()
    )

    pending_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.id,
            Task.completed.is_(False),
        )
        .count()
    )

    high_priority_pending_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.id,
            Task.completed.is_(False),
            Task.priority == "high",
        )
        .count()
    )

    upcoming_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.id,
            Task.completed.is_(False),
            Task.due_date >= today,
            Task.due_date <= next_seven_days,
        )
        .count()
    )

    progress_percentage = (
        round((completed_tasks / total_tasks) * 100)
        if total_tasks > 0
        else 0
    )

    study_sessions = list(
        mongo_db.study_sessions.find({"user_id": current_user.id})
    )

    total_study_sessions = len(study_sessions)

    total_study_minutes = sum(
        session["duration_minutes"]
        for session in study_sessions
    )

    study_goals = (
        db.query(StudyGoal)
        .filter(StudyGoal.user_id == current_user.id)
        .all()
    )

    total_study_goals = len(study_goals)

    total_goal_minutes = sum(
        goal.target_minutes
        for goal in study_goals
    )

    goal_progress_percentage = (
        min(round((total_study_minutes / total_goal_minutes) * 100), 100)
        if total_goal_minutes > 0
        else 0
    )

    now = datetime.now(timezone.utc)

    pending_reminders = (
        db.query(Reminder)
        .filter(
            Reminder.user_id == current_user.id,
            Reminder.completed.is_(False),
        )
        .count()
    )

    upcoming_reminders = (
        db.query(Reminder)
        .filter(
            Reminder.user_id == current_user.id,
            Reminder.completed.is_(False),
            Reminder.remind_at >= now,
        )
        .count()
    )

    return {
        "total_subjects": total_subjects,
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "completed_tasks": completed_tasks,
        "high_priority_pending_tasks": high_priority_pending_tasks,
        "upcoming_tasks": upcoming_tasks,
        "progress_percentage": progress_percentage,
        "total_study_sessions": total_study_sessions,
        "total_study_minutes": total_study_minutes,
        "total_study_goals": total_study_goals,
        "total_goal_minutes": total_goal_minutes,
        "goal_progress_percentage": goal_progress_percentage,
        "pending_reminders": pending_reminders,
        "upcoming_reminders": upcoming_reminders,
    }