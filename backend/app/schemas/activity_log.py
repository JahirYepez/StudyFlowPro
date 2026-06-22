from datetime import datetime

from pydantic import BaseModel


class ActivityLogResponse(BaseModel):
    id: str
    user_id: int
    action: str
    entity: str
    entity_id: str | None
    message: str
    created_at: datetime