from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings


engine = create_engine(settings.database_url, pool_pre_ping=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def apply_schema_updates():
    inspector = inspect(engine)

    if "study_goals" not in inspector.get_table_names():
        return

    study_goal_columns = {
        column["name"]
        for column in inspector.get_columns("study_goals")
    }

    if "progress_percentage" not in study_goal_columns:
        with engine.begin() as connection:
            connection.execute(text(
                "ALTER TABLE study_goals "
                "ADD COLUMN progress_percentage INTEGER NOT NULL DEFAULT 0"
            ))


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
