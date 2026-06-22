import json
import os
import time
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import pytest


API_URL = os.getenv("STUDYFLOW_API_URL", "https://studyflowpro-api.onrender.com").rstrip("/")


def api_request(method: str, path: str, data: dict | None = None, token: str | None = None):
    body = json.dumps(data).encode("utf-8") if data is not None else None
    headers = {"Content-Type": "application/json"}

    if token:
        headers["Authorization"] = f"Bearer {token}"

    request = Request(
        f"{API_URL}{path}",
        data=body,
        headers=headers,
        method=method,
    )

    try:
        with urlopen(request, timeout=70) as response:
            raw_body = response.read().decode("utf-8")
            return response.status, json.loads(raw_body) if raw_body else None
    except HTTPError as error:
        raw_body = error.read().decode("utf-8")
        try:
            parsed_body = json.loads(raw_body) if raw_body else None
        except json.JSONDecodeError:
            parsed_body = raw_body

        return error.code, parsed_body


@pytest.fixture(scope="module")
def test_user():
    timestamp = int(time.time())
    email = f"qa.studyflow.{timestamp}@example.com"
    password = "Prueba123"

    register_status, user = api_request(
        "POST",
        "/auth/register",
        {
            "full_name": "Usuario Prueba QA",
            "email": email,
            "password": password,
        },
    )

    assert register_status == 201
    assert user["email"] == email

    login_status, session = api_request(
        "POST",
        "/auth/login",
        {
            "email": email,
            "password": password,
        },
    )

    assert login_status == 200
    assert session["token_type"] == "bearer"

    return {
        "email": email,
        "password": password,
        "token": session["access_token"],
    }


def test_public_health_endpoint_returns_ok():
    status, body = api_request("GET", "/health")

    assert status == 200
    assert body["status"] == "ok"
    assert body["service"] == "studyflow-api"


def test_protected_endpoint_requires_token():
    status, body = api_request("GET", "/auth/me")

    assert status in (401, 403)
    assert body is not None


def test_authenticated_user_can_read_profile(test_user):
    status, body = api_request("GET", "/auth/me", token=test_user["token"])

    assert status == 200
    assert body["email"] == test_user["email"]


def test_subject_and_task_flow_against_public_api(test_user):
    token = test_user["token"]
    subject_id = None
    task_id = None

    try:
        subject_status, subject = api_request(
            "POST",
            "/subjects",
            {
                "name": f"Materia QA {int(time.time())}",
                "color": "#9E6899",
            },
            token=token,
        )

        assert subject_status == 201
        assert subject["id"] > 0
        subject_id = subject["id"]

        task_status, task = api_request(
            "POST",
            "/tasks",
            {
                "title": "Tarea QA Integracion",
                "description": "Tarea creada por prueba de integracion",
                "due_date": "2026-06-30",
                "priority": "medium",
                "subject_id": subject_id,
            },
            token=token,
        )

        assert task_status == 201
        assert task["subject_id"] == subject_id
        assert task["completed"] is False
        task_id = task["id"]

        update_status, updated_task = api_request(
            "PATCH",
            f"/tasks/{task_id}",
            {"completed": True},
            token=token,
        )

        assert update_status == 200
        assert updated_task["completed"] is True

        delete_task_status, _ = api_request("DELETE", f"/tasks/{task_id}", token=token)
        assert delete_task_status == 204
        task_id = None

        delete_subject_status, _ = api_request("DELETE", f"/subjects/{subject_id}", token=token)
        assert delete_subject_status == 204
        subject_id = None
    finally:
        if task_id is not None:
            api_request("DELETE", f"/tasks/{task_id}", token=token)

        if subject_id is not None:
            api_request("DELETE", f"/subjects/{subject_id}", token=token)


def test_mongo_backed_resources_and_sessions_against_public_api(test_user):
    token = test_user["token"]
    subject_id = None
    session_id = None
    resource_id = None

    try:
        subject_status, subject = api_request(
            "POST",
            "/subjects",
            {
                "name": f"Materia Mongo QA {int(time.time())}",
                "color": "#BA88AE",
            },
            token=token,
        )

        assert subject_status == 201
        subject_id = subject["id"]

        session_status, study_session = api_request(
            "POST",
            "/study-sessions",
            {
                "subject_id": subject_id,
                "duration_minutes": 45,
                "session_date": "2026-06-22",
                "notes": "Sesion de integracion",
            },
            token=token,
        )

        assert session_status == 201
        assert study_session["duration_minutes"] == 45
        assert study_session["subject_id"] == subject_id
        session_id = study_session["id"]

        resource_status, resource = api_request(
            "POST",
            "/resources",
            {
                "subject_id": subject_id,
                "title": "Recurso QA Integracion",
                "url": "https://www.example.com",
                "resource_type": "documentation",
                "notes": "Recurso creado en prueba de integracion",
            },
            token=token,
        )

        assert resource_status == 201
        assert resource["url"].startswith("https://")
        resource_id = resource["id"]

        dashboard_status, dashboard = api_request("GET", "/dashboard/summary", token=token)

        assert dashboard_status == 200
        assert dashboard["total_study_minutes"] >= 45

        delete_resource_status, _ = api_request(
            "DELETE",
            f"/resources/{resource_id}",
            token=token,
        )
        assert delete_resource_status == 204
        resource_id = None

        delete_session_status, _ = api_request(
            "DELETE",
            f"/study-sessions/{session_id}",
            token=token,
        )
        assert delete_session_status == 204
        session_id = None

        delete_subject_status, _ = api_request("DELETE", f"/subjects/{subject_id}", token=token)
        assert delete_subject_status == 204
        subject_id = None
    finally:
        if resource_id is not None:
            api_request("DELETE", f"/resources/{resource_id}", token=token)

        if session_id is not None:
            api_request("DELETE", f"/study-sessions/{session_id}", token=token)

        if subject_id is not None:
            api_request("DELETE", f"/subjects/{subject_id}", token=token)
