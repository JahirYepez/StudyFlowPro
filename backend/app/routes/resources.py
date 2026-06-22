from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.mongodb import mongo_db
from app.database.postgresql import get_db
from app.models.subject import Subject
from app.models.user import User
from app.schemas.resource import ResourceCreate, ResourceResponse, ResourceUpdate
from app.services.activity_log_service import create_activity_log


router = APIRouter(prefix="/resources", tags=["Resources"])


def serialize_resource(document: dict) -> dict:
    return {
        "id": str(document["_id"]),
        "user_id": document["user_id"],
        "subject_id": document["subject_id"],
        "subject_name": document["subject_name"],
        "title": document["title"],
        "url": document["url"],
        "resource_type": document["resource_type"],
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


def get_resource_or_404(resource_id: str, current_user: User) -> dict:
    try:
        object_id = ObjectId(resource_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de material invalido.",
        )

    resource = mongo_db.resources.find_one({
        "_id": object_id,
        "user_id": current_user.id,
    })

    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material de apoyo no encontrado.",
        )

    return resource


@router.post("", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
def create_resource(
    resource_in: ResourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subject = get_user_subject_or_404(
        subject_id=resource_in.subject_id,
        db=db,
        current_user=current_user,
    )

    document = {
        "user_id": current_user.id,
        "subject_id": subject.id,
        "subject_name": subject.name,
        "title": resource_in.title.strip(),
        "url": str(resource_in.url),
        "resource_type": resource_in.resource_type,
        "notes": resource_in.notes,
        "created_at": datetime.now(timezone.utc),
    }

    result = mongo_db.resources.insert_one(document)
    created = mongo_db.resources.find_one({"_id": result.inserted_id})

    create_activity_log(
        current_user=current_user,
        action="create",
        entity="resource",
        entity_id=str(result.inserted_id),
        message=f"Material de apoyo guardado: {resource_in.title}",
    )

    return serialize_resource(created)


@router.get("", response_model=list[ResourceResponse])
def list_resources(
    current_user: User = Depends(get_current_user),
):
    documents = (
        mongo_db.resources
        .find({"user_id": current_user.id})
        .sort("created_at", -1)
    )

    return [
        serialize_resource(document)
        for document in documents
    ]


@router.patch("/{resource_id}", response_model=ResourceResponse)
def update_resource(
    resource_id: str,
    resource_in: ResourceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resource = get_resource_or_404(
        resource_id=resource_id,
        current_user=current_user,
    )

    update_data = {}

    if resource_in.subject_id is not None:
        subject = get_user_subject_or_404(
            subject_id=resource_in.subject_id,
            db=db,
            current_user=current_user,
        )
        update_data["subject_id"] = subject.id
        update_data["subject_name"] = subject.name

    if resource_in.title is not None:
        update_data["title"] = resource_in.title.strip()

    if resource_in.url is not None:
        update_data["url"] = str(resource_in.url)

    if resource_in.resource_type is not None:
        update_data["resource_type"] = resource_in.resource_type

    if "notes" in resource_in.model_fields_set:
        update_data["notes"] = resource_in.notes

    if update_data:
        mongo_db.resources.update_one(
            {"_id": resource["_id"]},
            {"$set": update_data},
        )

    updated = mongo_db.resources.find_one({"_id": resource["_id"]})

    create_activity_log(
        current_user=current_user,
        action="update",
        entity="resource",
        entity_id=resource_id,
        message=f"Material de apoyo actualizado: {updated['title']}",
    )

    return serialize_resource(updated)


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(
    resource_id: str,
    current_user: User = Depends(get_current_user),
):
    resource = get_resource_or_404(
        resource_id=resource_id,
        current_user=current_user,
    )

    mongo_db.resources.delete_one({"_id": resource["_id"]})

    create_activity_log(
        current_user=current_user,
        action="delete",
        entity="resource",
        entity_id=resource_id,
        message=f"Material de apoyo eliminado: {resource['title']}",
    )
