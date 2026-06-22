from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.mongodb import mongo_db
from app.database.postgresql import get_db
from app.models.study_goal import StudyGoal
from app.models.subject import Subject
from app.models.task import Task
from app.models.user import User
from app.schemas.subject import SubjectCreate, SubjectResponse, SubjectUpdate
from app.services.activity_log_service import create_activity_log


router = APIRouter(prefix="/subjects", tags=["Subjects"])


def get_user_subject_or_404(
    db: Session,
    subject_id: int,
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


@router.post("", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
def create_subject(
    subject_in: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subject = Subject(
        name=subject_in.name.strip(),
        color=subject_in.color,
        user_id=current_user.id,
    )

    try:
        db.add(subject)
        db.commit()
        db.refresh(subject)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una materia con ese nombre.",
        )

    create_activity_log(
        current_user=current_user,
        action="create",
        entity="subject",
        entity_id=str(subject.id),
        message=f"Materia creada: {subject.name}",
    )

    return subject


@router.get("", response_model=list[SubjectResponse])
def list_subjects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Subject)
        .filter(Subject.user_id == current_user.id)
        .order_by(Subject.created_at.desc())
        .all()
    )


@router.patch("/{subject_id}", response_model=SubjectResponse)
def update_subject(
    subject_id: int,
    subject_in: SubjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subject = get_user_subject_or_404(
        db=db,
        subject_id=subject_id,
        current_user=current_user,
    )

    if subject_in.name is not None:
        subject.name = subject_in.name.strip()

    if subject_in.color is not None:
        subject.color = subject_in.color

    try:
        db.commit()
        db.refresh(subject)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una materia con ese nombre.",
        )

    create_activity_log(
        current_user=current_user,
        action="update",
        entity="subject",
        entity_id=str(subject.id),
        message=f"Materia actualizada: {subject.name}",
    )

    return subject


@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subject = get_user_subject_or_404(
        db=db,
        subject_id=subject_id,
        current_user=current_user,
    )

    has_tasks = (
        db.query(Task)
        .filter(
            Task.subject_id == subject.id,
            Task.user_id == current_user.id,
        )
        .count()
        > 0
    )

    has_goals = (
        db.query(StudyGoal)
        .filter(
            StudyGoal.subject_id == subject.id,
            StudyGoal.user_id == current_user.id,
        )
        .count()
        > 0
    )

    has_study_sessions = mongo_db.study_sessions.count_documents({
        "subject_id": subject.id,
        "user_id": current_user.id,
    }) > 0

    has_resources = mongo_db.resources.count_documents({
        "subject_id": subject.id,
        "user_id": current_user.id,
    }) > 0

    has_flashcards = mongo_db.flashcards.count_documents({
        "subject_id": subject.id,
        "user_id": current_user.id,
    }) > 0

    if has_tasks or has_goals or has_study_sessions or has_resources or has_flashcards:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se puede eliminar la materia porque tiene informacion asociada.",
        )

    subject_name = subject.name

    db.delete(subject)
    db.commit()

    create_activity_log(
        current_user=current_user,
        action="delete",
        entity="subject",
        entity_id=str(subject_id),
        message=f"Materia eliminada: {subject_name}",
    )