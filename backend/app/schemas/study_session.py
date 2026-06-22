from datetime import date, datetime

from pydantic import BaseModel, Field


class StudySessionCreate(BaseModel):
    subject_id: int
    duration_minutes: int = Field(gt=0, le=600)
    session_date: date
    notes: str | None = Field(default=None, max_length=500)


class StudySessionUpdate(BaseModel):
    subject_id: int | None = None
    duration_minutes: int | None = Field(default=None, gt=0, le=600)
    session_date: date | None = None
    notes: str | None = Field(default=None, max_length=500)


class StudySessionResponse(BaseModel):
    id: str
    user_id: int
    subject_id: int
    subject_name: str
    duration_minutes: int
    session_date: date
    notes: str | None
    created_at: datetime