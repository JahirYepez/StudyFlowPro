from datetime import date, datetime

from pydantic import BaseModel, Field


class StudyGoalCreate(BaseModel):
    title: str = Field(min_length=3, max_length=140)
    target_minutes: int = Field(gt=0, le=60000)
    deadline: date | None = None
    subject_id: int


class StudyGoalUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=140)
    target_minutes: int | None = Field(default=None, gt=0, le=60000)
    deadline: date | None = None
    subject_id: int | None = None


class StudyGoalResponse(BaseModel):
    id: int
    title: str
    target_minutes: int
    deadline: date | None
    user_id: int
    subject_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }