from datetime import datetime

from pydantic import BaseModel, Field


class SubjectCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    color: str = Field(default="#9E6899", min_length=4, max_length=20)


class SubjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    color: str | None = Field(default=None, min_length=4, max_length=20)


class SubjectResponse(BaseModel):
    id: int
    name: str
    color: str
    user_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }