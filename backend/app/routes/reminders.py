from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.postgresql import get_db
from app.models.reminder import Reminder
from app.models.study_goal import StudyGoal
from app.models.task import Task
from app.models.user import User
from app.schemas.reminder import ReminderCreate, ReminderResponse, ReminderUpdate
from app.services.activity_log_service import create_activity_log


router = APIRouter(prefix="/reminders", tags=["Reminders"])


def get_user_reminder_or_404(
    reminder_id: int,
    db: Session,
    current_user: User,
) -> Reminder:
    reminder = (
        db.query(Reminder)
        .filter(
            Reminder.id == reminder_id,
            Reminder.user_id == current_user.id,
        )
        .first()
    )

    if not reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recordatorio no encontrado.",
        )

    return reminder


@router.post("", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
def create_reminder(
    reminder_in: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if reminder_in.task_id is not None:
        task = (
            db.query(Task)
            .filter(
                Task.id == reminder_in.task_id,
                Task.user_id == current_user.id,
            )
            .first()
        )

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarea no encontrada.",
            )

    if reminder_in.study_goal_id is not None:
        goal = (
            db.query(StudyGoal)
            .filter(
                StudyGoal.id == reminder_in.study_goal_id,
                StudyGoal.user_id == current_user.id,
            )
            .first()
        )

        if not goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meta de estudio no encontrada.",
            )

    reminder = Reminder(
        title=reminder_in.title.strip(),
        remind_at=reminder_in.remind_at,
        task_id=reminder_in.task_id,
        study_goal_id=reminder_in.study_goal_id,
        user_id=current_user.id,
    )

    db.add(reminder)
    db.commit()
    db.refresh(reminder)

    create_activity_log(
        current_user=current_user,
        action="create",
        entity="reminder",
        entity_id=str(reminder.id),
        message=f"Recordatorio creado: {reminder.title}",
    )

    return reminder


@router.get("", response_model=list[ReminderResponse])
def list_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Reminder)
        .filter(Reminder.user_id == current_user.id)
        .order_by(Reminder.completed.asc(), Reminder.remind_at.asc())
        .all()
    )


@router.get("/upcoming", response_model=list[ReminderResponse])
def list_upcoming_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.now(timezone.utc)

    return (
        db.query(Reminder)
        .filter(
            Reminder.user_id == current_user.id,
            Reminder.completed.is_(False),
            Reminder.remind_at >= now,
        )
        .order_by(Reminder.remind_at.asc())
        .limit(5)
        .all()
    )


@router.patch("/{reminder_id}", response_model=ReminderResponse)
def update_reminder(
    reminder_id: int,
    reminder_in: ReminderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = get_user_reminder_or_404(
        reminder_id=reminder_id,
        db=db,
        current_user=current_user,
    )

    if reminder_in.title is not None:
        reminder.title = reminder_in.title.strip()

    if reminder_in.remind_at is not None:
        reminder.remind_at = reminder_in.remind_at

    if reminder_in.completed is not None:
        reminder.completed = reminder_in.completed

    db.commit()
    db.refresh(reminder)

    create_activity_log(
        current_user=current_user,
        action="update",
        entity="reminder",
        entity_id=str(reminder.id),
        message=f"Recordatorio actualizado: {reminder.title}",
    )

    return reminder


@router.patch("/{reminder_id}/complete", response_model=ReminderResponse)
def complete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = get_user_reminder_or_404(
        reminder_id=reminder_id,
        db=db,
        current_user=current_user,
    )

    reminder.completed = True

    db.commit()
    db.refresh(reminder)

    create_activity_log(
        current_user=current_user,
        action="complete",
        entity="reminder",
        entity_id=str(reminder.id),
        message=f"Recordatorio completado: {reminder.title}",
    )

    return reminder


@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = get_user_reminder_or_404(
        reminder_id=reminder_id,
        db=db,
        current_user=current_user,
    )

    reminder_title = reminder.title

    db.delete(reminder)
    db.commit()

    create_activity_log(
        current_user=current_user,
        action="delete",
        entity="reminder",
        entity_id=str(reminder_id),
        message=f"Recordatorio eliminado: {reminder_title}",
    )