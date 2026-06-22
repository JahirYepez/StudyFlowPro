from datetime import datetime

from pydantic import BaseModel, Field


class TaskCategoryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    color: str = Field(default="#BA88AE", min_length=4, max_length=20)


class TaskCategoryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=80)
    color: str | None = Field(default=None, min_length=4, max_length=20)


class TaskCategoryResponse(BaseModel):
    id: int
    name: str
    color: str
    user_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }