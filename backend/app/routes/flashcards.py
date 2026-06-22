from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.mongodb import mongo_db
from app.database.postgresql import get_db
from app.models.subject import Subject
from app.models.user import User
from app.schemas.flashcard import FlashcardCreate, FlashcardResponse, FlashcardUpdate
from app.services.activity_log_service import create_activity_log


router = APIRouter(prefix="/flashcards", tags=["Flashcards"])


def serialize_flashcard(document: dict) -> dict:
    return {
        "id": str(document["_id"]),
        "user_id": document["user_id"],
        "subject_id": document["subject_id"],
        "subject_name": document["subject_name"],
        "question": document["question"],
        "answer": document["answer"],
        "difficulty": document["difficulty"],
        "reviewed": document["reviewed"],
        "created_at": document["created_at"],
        "reviewed_at": document.get("reviewed_at"),
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


def get_flashcard_or_404(flashcard_id: str, current_user: User) -> dict:
    try:
        object_id = ObjectId(flashcard_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de flashcard invalido.",
        )

    flashcard = mongo_db.flashcards.find_one({
        "_id": object_id,
        "user_id": current_user.id,
    })

    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard no encontrada.",
        )

    return flashcard


@router.post("", response_model=FlashcardResponse, status_code=status.HTTP_201_CREATED)
def create_flashcard(
    flashcard_in: FlashcardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subject = get_user_subject_or_404(
        subject_id=flashcard_in.subject_id,
        db=db,
        current_user=current_user,
    )

    document = {
        "user_id": current_user.id,
        "subject_id": subject.id,
        "subject_name": subject.name,
        "question": flashcard_in.question.strip(),
        "answer": flashcard_in.answer.strip(),
        "difficulty": flashcard_in.difficulty,
        "reviewed": False,
        "created_at": datetime.now(timezone.utc),
        "reviewed_at": None,
    }

    result = mongo_db.flashcards.insert_one(document)
    created = mongo_db.flashcards.find_one({"_id": result.inserted_id})

    create_activity_log(
        current_user=current_user,
        action="create",
        entity="flashcard",
        entity_id=str(result.inserted_id),
        message=f"Flashcard creada para: {subject.name}",
    )

    return serialize_flashcard(created)


@router.get("", response_model=list[FlashcardResponse])
def list_flashcards(
    current_user: User = Depends(get_current_user),
):
    documents = (
        mongo_db.flashcards
        .find({"user_id": current_user.id})
        .sort("created_at", -1)
    )

    return [
        serialize_flashcard(document)
        for document in documents
    ]


@router.patch("/{flashcard_id}", response_model=FlashcardResponse)
def update_flashcard(
    flashcard_id: str,
    flashcard_in: FlashcardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    flashcard = get_flashcard_or_404(
        flashcard_id=flashcard_id,
        current_user=current_user,
    )

    update_data = {}

    if flashcard_in.subject_id is not None:
        subject = get_user_subject_or_404(
            subject_id=flashcard_in.subject_id,
            db=db,
            current_user=current_user,
        )
        update_data["subject_id"] = subject.id
        update_data["subject_name"] = subject.name

    if flashcard_in.question is not None:
        update_data["question"] = flashcard_in.question.strip()

    if flashcard_in.answer is not None:
        update_data["answer"] = flashcard_in.answer.strip()

    if flashcard_in.difficulty is not None:
        update_data["difficulty"] = flashcard_in.difficulty

    if update_data:
        mongo_db.flashcards.update_one(
            {"_id": flashcard["_id"]},
            {"$set": update_data},
        )

    updated = mongo_db.flashcards.find_one({"_id": flashcard["_id"]})

    create_activity_log(
        current_user=current_user,
        action="update",
        entity="flashcard",
        entity_id=flashcard_id,
        message="Flashcard actualizada.",
    )

    return serialize_flashcard(updated)


@router.patch("/{flashcard_id}/review", response_model=FlashcardResponse)
def review_flashcard(
    flashcard_id: str,
    current_user: User = Depends(get_current_user),
):
    flashcard = get_flashcard_or_404(
        flashcard_id=flashcard_id,
        current_user=current_user,
    )

    mongo_db.flashcards.update_one(
        {"_id": flashcard["_id"]},
        {
            "$set": {
                "reviewed": True,
                "reviewed_at": datetime.now(timezone.utc),
            }
        },
    )

    updated = mongo_db.flashcards.find_one({"_id": flashcard["_id"]})

    create_activity_log(
        current_user=current_user,
        action="review",
        entity="flashcard",
        entity_id=flashcard_id,
        message="Flashcard marcada como revisada.",
    )

    return serialize_flashcard(updated)


@router.delete("/{flashcard_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flashcard(
    flashcard_id: str,
    current_user: User = Depends(get_current_user),
):
    flashcard = get_flashcard_or_404(
        flashcard_id=flashcard_id,
        current_user=current_user,
    )

    mongo_db.flashcards.delete_one({"_id": flashcard["_id"]})

    create_activity_log(
        current_user=current_user,
        action="delete",
        entity="flashcard",
        entity_id=flashcard_id,
        message=f"Flashcard eliminada: {flashcard['question']}",
    )