from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.mongodb import mongo_db


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="API academica para StudyFlow.",
)

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


@app.get("/health/mongo", tags=["Health"])
def mongo_health_check():
    collections = mongo_db.list_collection_names()

    return {
        "status": "ok",
        "database": settings.mongo_db_name,
        "collections": collections,
    }