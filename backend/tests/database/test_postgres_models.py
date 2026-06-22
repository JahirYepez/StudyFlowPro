import pytest
from datetime import datetime
from sqlalchemy import create_engine, event
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker

from app.database.postgresql import Base
from app.models.reminder import Reminder
from app.models.study_goal import StudyGoal
from app.models.subject import Subject
from app.models.task import Task
from app.models.task_category import TaskCategory
from app.models.user import User


@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:")

    @event.listens_for(engine, "connect")
    def enable_foreign_keys(connection, _):
        connection.execute("PRAGMA foreign_keys=ON")

    Base.metadata.create_all(bind=engine)
    TestingSession = sessionmaker(bind=engine)
    session = TestingSession()

    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


def create_user(db_session, email="usuario.prueba@example.com"):
    user = User(
        full_name="Usuario Prueba",
        email=email,
        hashed_password="hashed",
        role="student",
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def test_user_email_must_be_unique(db_session):
    create_user(db_session, email="duplicado@example.com")

    db_session.add(
        User(
            full_name="Usuario Repetido",
            email="duplicado@example.com",
            hashed_password="hashed",
            role="student",
        )
    )

    with pytest.raises(IntegrityError):
        db_session.commit()


def test_subject_name_is_unique_per_user(db_session):
    user = create_user(db_session)
    db_session.add_all([
        Subject(name="Materia Prueba", color="#9E6899", user_id=user.id),
        Subject(name="Materia Prueba", color="#BA88AE", user_id=user.id),
    ])

    with pytest.raises(IntegrityError):
        db_session.commit()


def test_task_belongs_to_subject_and_user(db_session):
    user = create_user(db_session)
    subject = Subject(name="Calidad", color="#9E6899", user_id=user.id)
    db_session.add(subject)
    db_session.commit()
    db_session.refresh(subject)

    task = Task(
        title="Tarea Prueba",
        description="Descripcion de prueba",
        priority="medium",
        user_id=user.id,
        subject_id=subject.id,
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)

    assert task.user_id == user.id
    assert task.subject_id == subject.id
    assert task.completed is False


def test_task_requires_existing_subject(db_session):
    user = create_user(db_session)
    task = Task(
        title="Tarea sin materia",
        priority="medium",
        user_id=user.id,
        subject_id=999,
    )
    db_session.add(task)

    with pytest.raises(IntegrityError):
        db_session.commit()


def test_study_goals_keep_independent_progress(db_session):
    user = create_user(db_session)
    subject = Subject(name="Metas", color="#9E6899", user_id=user.id)
    db_session.add(subject)
    db_session.commit()
    db_session.refresh(subject)

    goal_one = StudyGoal(
        title="Meta 1",
        target_minutes=600,
        progress_percentage=35,
        user_id=user.id,
        subject_id=subject.id,
    )
    goal_two = StudyGoal(
        title="Meta 2",
        target_minutes=300,
        progress_percentage=0,
        user_id=user.id,
        subject_id=subject.id,
    )
    db_session.add_all([goal_one, goal_two])
    db_session.commit()

    goals = db_session.query(StudyGoal).order_by(StudyGoal.title.asc()).all()

    assert [goal.progress_percentage for goal in goals] == [35, 0]


def test_task_category_name_is_unique_per_user(db_session):
    user = create_user(db_session)
    db_session.add_all([
        TaskCategory(name="Examen", color="#BA88AE", user_id=user.id),
        TaskCategory(name="Examen", color="#D6A8C4", user_id=user.id),
    ])

    with pytest.raises(IntegrityError):
        db_session.commit()


def test_reminder_can_reference_task(db_session):
    user = create_user(db_session)
    subject = Subject(name="Recordatorios", color="#9E6899", user_id=user.id)
    db_session.add(subject)
    db_session.commit()
    db_session.refresh(subject)

    task = Task(title="Tarea con recordatorio", priority="high", user_id=user.id, subject_id=subject.id)
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)

    reminder = Reminder(
        title="Recordar tarea",
        remind_at=datetime(2026, 6, 30, 10, 0, 0),
        user_id=user.id,
        task_id=task.id,
    )
    db_session.add(reminder)
    db_session.commit()
    db_session.refresh(reminder)

    assert reminder.task_id == task.id
    assert reminder.completed is False
