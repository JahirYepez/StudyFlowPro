from datetime import datetime, timezone

from app.database.mongodb import mongo_db
from app.models.user import User


def create_activity_log(
    current_user: User,
    action: str,
    entity: str,
    message: str,
    entity_id: str | None = None,
) -> None:
    document = {
        "user_id": current_user.id,
        "action": action,
        "entity": entity,
        "entity_id": entity_id,
        "message": message,
        "created_at": datetime.now(timezone.utc),
    }

    mongo_db.activity_logs.insert_one(document)


def serialize_activity_log(document: dict) -> dict:
    return {
        "id": str(document["_id"]),
        "user_id": document["user_id"],
        "action": document["action"],
        "entity": document["entity"],
        "entity_id": document.get("entity_id"),
        "message": document["message"],
        "created_at": document["created_at"],
    }


def list_activity_logs(current_user: User) -> list[dict]:
    documents = (
        mongo_db.activity_logs
        .find({"user_id": current_user.id})
        .sort("created_at", -1)
        .limit(50)
    )

    return [
        serialize_activity_log(document)
        for document in documents
    ]