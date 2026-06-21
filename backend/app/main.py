from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.database.mongodb import mongo_db
from app.database.postgresql import Base, engine
from app.models.user import User
from app.routes.auth import router as auth_router


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="API academica para StudyFlow.",
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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