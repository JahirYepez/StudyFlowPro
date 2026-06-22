from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.postgresql import get_db
from app.models.reminder import Reminder
from app.models.study_goal import StudyGoal
from app.models.subject import Subject
from app.models.user import User
from app.schemas.study_goal import StudyGoalCreate, StudyGoalResponse, StudyGoalUpdate
from app.services.activity_log_service import create_activity_log


router = APIRouter(prefix="/study-goals", tags=["Study Goals"])


def get_user_subject_or_404(
    subject_id: int,
    db: Session,
    current_user: User,
) -> Subject:
    subject = (
        db.query(Subject)
        .filter(
            Subject.id == subject_id,
            Subject.user_id == current_user.id,
        )
        .first()
    )

    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Materia no encontrada.",
        )

    return subject


def get_user_study_goal_or_404(
    goal_id: int,
    db: Session,
    current_user: User,
) -> StudyGoal:
    goal = (
        db.query(StudyGoal)
        .filter(
            StudyGoal.id == goal_id,
            StudyGoal.user_id == current_user.id,
        )
        .first()
    )

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta de estudio no encontrada.",
        )

    return goal


@router.post("", response_model=StudyGoalResponse, status_code=status.HTTP_201_CREATED)
def create_study_goal(
    goal_in: StudyGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subject = get_user_subject_or_404(
        subject_id=goal_in.subject_id,
        db=db,
        current_user=current_user,
    )

    goal = StudyGoal(
        title=goal_in.title.strip(),
        target_minutes=goal_in.target_minutes,
        deadline=goal_in.deadline,
        subject_id=subject.id,
        user_id=current_user.id,
    )

    db.add(goal)
    db.commit()
    db.refresh(goal)

    create_activity_log(
        current_user=current_user,
        action="create",
        entity="study_goal",
        entity_id=str(goal.id),
        message=f"Meta de estudio creada: {goal.title}",
    )

    return goal


@router.get("", response_model=list[StudyGoalResponse])
def list_study_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(StudyGoal)
        .filter(StudyGoal.user_id == current_user.id)
        .order_by(StudyGoal.created_at.desc())
        .all()
    )


@router.patch("/{goal_id}", response_model=StudyGoalResponse)
def update_study_goal(
    goal_id: int,
    goal_in: StudyGoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = get_user_study_goal_or_404(
        goal_id=goal_id,
        db=db,
        current_user=current_user,
    )

    if goal_in.subject_id is not None:
        subject = get_user_subject_or_404(
            subject_id=goal_in.subject_id,
            db=db,
            current_user=current_user,
        )
        goal.subject_id = subject.id

    if goal_in.title is not None:
        goal.title = goal_in.title.strip()

    if goal_in.target_minutes is not None:
        goal.target_minutes = goal_in.target_minutes

    if goal_in.progress_percentage is not None:
        goal.progress_percentage = goal_in.progress_percentage

    if "deadline" in goal_in.model_fields_set:
        goal.deadline = goal_in.deadline

    db.commit()
    db.refresh(goal)

    create_activity_log(
        current_user=current_user,
        action="update",
        entity="study_goal",
        entity_id=str(goal.id),
        message=f"Meta de estudio actualizada: {goal.title}",
    )

    return goal


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_study_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = get_user_study_goal_or_404(
        goal_id=goal_id,
        db=db,
        current_user=current_user,
    )

    has_reminders = (
        db.query(Reminder)
        .filter(
            Reminder.study_goal_id == goal.id,
            Reminder.user_id == current_user.id,
        )
        .count()
        > 0
    )

    if has_reminders:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se puede eliminar la meta porque tiene recordatorios asociados.",
        )

    goal_title = goal.title

    db.delete(goal)
    db.commit()

    create_activity_log(
        current_user=current_user,
        action="delete",
        entity="study_goal",
        entity_id=str(goal_id),
        message=f"Meta de estudio eliminada: {goal_title}",
    )
