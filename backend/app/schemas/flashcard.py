from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


FlashcardDifficulty = Literal["easy", "medium", "hard"]


class FlashcardCreate(BaseModel):
    subject_id: int
    question: str = Field(min_length=3, max_length=300)
    answer: str = Field(min_length=1, max_length=800)
    difficulty: FlashcardDifficulty = "medium"


class FlashcardUpdate(BaseModel):
    subject_id: int | None = None
    question: str | None = Field(default=None, min_length=3, max_length=300)
    answer: str | None = Field(default=None, min_length=1, max_length=800)
    difficulty: FlashcardDifficulty | None = None


class FlashcardResponse(BaseModel):
    id: str
    user_id: int
    subject_id: int
    subject_name: str
    question: str
    answer: str
    difficulty: str
    reviewed: bool
    created_at: datetime
    reviewed_at: datetime | None