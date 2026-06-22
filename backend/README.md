# Backend - StudyFlowPro

Este backend expone la API REST de StudyFlowPro. Esta hecho con FastAPI y se
conecta a PostgreSQL y MongoDB.

## Estructura

```text
backend/
  app/
    core/
    database/
    models/
    routes/
    schemas/
    services/
    main.py
  tests/
    unit/
    database/
    integration/
  requirements.txt
  pytest.ini
```

## Carpetas principales

- `app/core`: configuracion general, seguridad JWT y logging.
- `app/database`: conexiones a PostgreSQL y MongoDB.
- `app/models`: tablas relacionales con SQLAlchemy.
- `app/routes`: endpoints de la API.
- `app/schemas`: validaciones de entrada y salida con Pydantic.
- `app/services`: logica de apoyo y funciones reutilizables.
- `tests/unit`: pruebas unitarias.
- `tests/database`: pruebas de reglas de base de datos.
- `tests/integration`: pruebas contra la API desplegada.

## Ejecutar localmente

```bash
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

URL local:

```text
http://127.0.0.1:8000
```

## Pruebas

```bash
python -m pytest tests/unit -q
python -m pytest tests/database -q
python -m pytest tests/integration -q
```

## Variables principales

El backend usa variables como:

- `DATABASE_URL`
- `MONGO_URL`
- `MONGO_DB_NAME`
- `SECRET_KEY`
- `FRONTEND_URLS`
- `ACCESS_TOKEN_EXPIRE_MINUTES`

No se deben subir valores reales de `.env` al repositorio.
