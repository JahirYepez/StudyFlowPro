import pytest
from pydantic import ValidationError

from app.schemas.resource import ResourceCreate
from app.schemas.study_goal import StudyGoalCreate, StudyGoalUpdate
from app.schemas.study_session import StudySessionCreate
from app.schemas.user import UserCreate


def test_user_create_accepts_strong_password():
    user = UserCreate(
        full_name="Usuario Prueba",
        email="usuario.prueba@example.com",
        password="Prueba123",
    )

    assert user.email == "usuario.prueba@example.com"


@pytest.mark.parametrize(
    "password",
    [
        "prueba",
        "prueba123",
        "Pruebaxx",
    ],
)
def test_user_create_rejects_weak_passwords(password):
    with pytest.raises(ValidationError):
        UserCreate(
            full_name="Usuario Prueba",
            email="usuario.prueba@example.com",
            password=password,
        )


def test_resource_create_accepts_https_url():
    resource = ResourceCreate(
        subject_id=1,
        title="Recurso Prueba",
        url="https://www.example.com",
        resource_type="documentation",
    )

    assert str(resource.url).startswith("https://")


def test_resource_create_rejects_http_url():
    with pytest.raises(ValidationError):
        ResourceCreate(
            subject_id=1,
            title="Recurso Prueba",
            url="http://www.example.com",
            resource_type="documentation",
        )


@pytest.mark.parametrize("duration_minutes", [0, -10, 601])
def test_study_session_rejects_invalid_duration(duration_minutes):
    with pytest.raises(ValidationError):
        StudySessionCreate(
            subject_id=1,
            duration_minutes=duration_minutes,
            session_date="2026-06-22",
        )


def test_study_session_accepts_valid_duration():
    session = StudySessionCreate(
        subject_id=1,
        duration_minutes=45,
        session_date="2026-06-22",
        notes="Sesion de prueba",
    )

    assert session.duration_minutes == 45


@pytest.mark.parametrize("progress_percentage", [-1, 101])
def test_study_goal_update_rejects_invalid_progress(progress_percentage):
    with pytest.raises(ValidationError):
        StudyGoalUpdate(progress_percentage=progress_percentage)


def test_study_goal_update_accepts_progress_between_zero_and_one_hundred():
    goal = StudyGoalUpdate(progress_percentage=35)

    assert goal.progress_percentage == 35


def test_study_goal_create_rejects_zero_target_minutes():
    with pytest.raises(ValidationError):
        StudyGoalCreate(
            title="Meta Prueba",
            target_minutes=0,
            subject_id=1,
        )
