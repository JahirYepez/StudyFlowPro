from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, HttpUrl


ResourceType = Literal[
    "article",
    "video",
    "documentation",
    "repository",
    "other",
]


class ResourceCreate(BaseModel):
    subject_id: int
    title: str = Field(min_length=3, max_length=140)
    url: HttpUrl
    resource_type: ResourceType = "other"
    notes: str | None = Field(default=None, max_length=500)


class ResourceUpdate(BaseModel):
    subject_id: int | None = None
    title: str | None = Field(default=None, min_length=3, max_length=140)
    url: HttpUrl | None = None
    resource_type: ResourceType | None = None
    notes: str | None = Field(default=None, max_length=500)


class ResourceResponse(BaseModel):
    id: str
    user_id: int
    subject_id: int
    subject_name: str
    title: str
    url: str
    resource_type: str
    notes: str | None
    created_at: datetime