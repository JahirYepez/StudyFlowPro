from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.core.logging import CorrelationIdMiddleware, configure_logging
from app.database.mongodb import mongo_db
from app.database.postgresql import Base, engine
from app.models.reminder import Reminder
from app.models.study_goal import StudyGoal
from app.models.subject import Subject
from app.models.task import Task
from app.models.task_category import TaskCategory
from app.models.user import User
from app.routes.activity_logs import router as activity_logs_router
from app.routes.auth import router as auth_router
from app.routes.dashboard import router as dashboard_router
from app.routes.flashcards import router as flashcards_router
from app.routes.reminders import router as reminders_router
from app.routes.resources import router as resources_router
from app.routes.study_goals import router as study_goals_router
from app.routes.study_sessions import router as study_sessions_router
from app.routes.subjects import router as subjects_router
from app.routes.task_categories import router as task_categories_router
from app.routes.tasks import router as tasks_router


configure_logging()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="API academica para StudyFlow.",
)

Base.metadata.create_all(bind=engine)

app.add_middleware(CorrelationIdMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(subjects_router)
app.include_router(tasks_router)
app.include_router(dashboard_router)
app.include_router(study_sessions_router)
app.include_router(activity_logs_router)
app.include_router(resources_router)
app.include_router(study_goals_router)
app.include_router(task_categories_router)
app.include_router(reminders_router)
app.include_router(flashcards_router)


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "service": "studyflow-api",
        "environment": settings.environment,
    }


@app.get("/health/postgres", tags=["Health"])
def postgres_health_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1")).scalar()

    return {
        "status": "ok",
        "database": "postgresql",
        "result": result,
    }


@app.get("/health/mongo", tags=["Health"])
def mongo_health_check():
    collections = mongo_db.list_collection_names()

    return {
        "status": "ok",
        "database": settings.mongo_db_name,
        "collections": collections,
    }