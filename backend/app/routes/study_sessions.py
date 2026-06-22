from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.mongodb import mongo_db
from app.database.postgresql import get_db
from app.models.subject import Subject
from app.models.user import User
from app.schemas.study_session import (
    StudySessionCreate,
    StudySessionResponse,
    StudySessionUpdate,
)
from app.services.activity_log_service import create_activity_log


router = APIRouter(prefix="/study-sessions", tags=["Study Sessions"])


def serialize_study_session(document: dict) -> dict:
    return {
        "id": str(document["_id"]),
        "user_id": document["user_id"],
        "subject_id": document["subject_id"],
        "subject_name": document["subject_name"],
        "duration_minutes": document["duration_minutes"],
        "session_date": document["session_date"],
        "notes": document.get("notes"),
        "created_at": document["created_at"],
    }


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


def get_study_session_or_404(session_id: str, current_user: User) -> dict:
    try:
        object_id = ObjectId(session_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de sesion invalido.",
        )

    session = mongo_db.study_sessions.find_one({
        "_id": object_id,
        "user_id": current_user.id,
    })

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sesion de estudio no encontrada.",
        )

    return session


@router.post("", response_model=StudySessionResponse, status_code=status.HTTP_201_CREATED)
def create_study_session(
    session_in: StudySessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subject = get_user_subject_or_404(
        subject_id=session_in.subject_id,
        db=db,
        current_user=current_user,
    )

    document = {
        "user_id": current_user.id,
        "subject_id": subject.id,
        "subject_name": subject.name,
        "duration_minutes": session_in.duration_minutes,
        "session_date": session_in.session_date.isoformat(),
        "notes": session_in.notes,
        "created_at": datetime.now(timezone.utc),
    }

    result = mongo_db.study_sessions.insert_one(document)
    created = mongo_db.study_sessions.find_one({"_id": result.inserted_id})

    create_activity_log(
        current_user=current_user,
        action="create",
        entity="study_session",
        entity_id=str(result.inserted_id),
        message=f"Sesion de estudio registrada: {subject.name}",
    )

    return serialize_study_session(created)


@router.get("", response_model=list[StudySessionResponse])
def list_study_sessions(
    current_user: User = Depends(get_current_user),
):
    documents = (
        mongo_db.study_sessions
        .find({"user_id": current_user.id})
        .sort("created_at", -1)
    )

    return [
        serialize_study_session(document)
        for document in documents
    ]


@router.patch("/{session_id}", response_model=StudySessionResponse)
def update_study_session(
    session_id: str,
    session_in: StudySessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = get_study_session_or_404(
        session_id=session_id,
        current_user=current_user,
    )

    update_data = {}

    if session_in.subject_id is not None:
        subject = get_user_subject_or_404(
            subject_id=session_in.subject_id,
            db=db,
            current_user=current_user,
        )
        update_data["subject_id"] = subject.id
        update_data["subject_name"] = subject.name

    if session_in.duration_minutes is not None:
        update_data["duration_minutes"] = session_in.duration_minutes

    if session_in.session_date is not None:
        update_data["session_date"] = session_in.session_date.isoformat()

    if "notes" in session_in.model_fields_set:
        update_data["notes"] = session_in.notes

    if update_data:
        mongo_db.study_sessions.update_one(
            {"_id": session["_id"]},
            {"$set": update_data},
        )

    updated = mongo_db.study_sessions.find_one({"_id": session["_id"]})

    create_activity_log(
        current_user=current_user,
        action="update",
        entity="study_session",
        entity_id=session_id,
        message="Sesion de estudio actualizada.",
    )

    return serialize_study_session(updated)


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_study_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
):
    session = get_study_session_or_404(
        session_id=session_id,
        current_user=current_user,
    )

    mongo_db.study_sessions.delete_one({"_id": session["_id"]})

    create_activity_log(
        current_user=current_user,
        action="delete",
        entity="study_session",
        entity_id=session_id,
        message="Sesion de estudio eliminada.",
    )
