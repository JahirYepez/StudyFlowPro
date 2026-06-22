from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field


TaskPriority = Literal["low", "medium", "high"]


class TaskCreate(BaseModel):
    title: str = Field(min_length=3, max_length=140)
    description: str | None = Field(default=None, max_length=800)
    due_date: date | None = None
    priority: TaskPriority = "medium"
    subject_id: int
    category_id: int | None = None


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=140)
    description: str | None = Field(default=None, max_length=800)
    due_date: date | None = None
    priority: TaskPriority | None = None
    subject_id: int | None = None
    category_id: int | None = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    due_date: date | None
    priority: str
    completed: bool
    user_id: int
    subject_id: int
    category_id: int | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }