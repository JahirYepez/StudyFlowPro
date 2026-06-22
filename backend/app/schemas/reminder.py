from datetime import datetime

from pydantic import BaseModel, Field, model_validator


class ReminderCreate(BaseModel):
    title: str = Field(min_length=3, max_length=140)
    remind_at: datetime
    task_id: int | None = None
    study_goal_id: int | None = None

    @model_validator(mode="after")
    def validate_target(self):
        if self.task_id is None and self.study_goal_id is None:
            raise ValueError("El recordatorio debe estar asociado a una tarea o meta.")

        if self.task_id is not None and self.study_goal_id is not None:
            raise ValueError("El recordatorio solo puede asociarse a una tarea o a una meta.")

        return self


class ReminderUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=140)
    remind_at: datetime | None = None
    completed: bool | None = None


class ReminderResponse(BaseModel):
    id: int
    title: str
    remind_at: datetime
    completed: bool
    user_id: int
    task_id: int | None
    study_goal_id: int | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }