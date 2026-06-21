# Arquitectura propuesta

## Decision de backend

Se usara FastAPI. No es una tecnologia demasiado simple; lo importante sera no
usar una estructura plana. El backend se organizara por capas.

## Capas del backend

```txt
backend/
  app/
    core/
      config.py
      security.py
      logging.py
    database/
      postgresql.py
      mongodb.py
    models/
    schemas/
    repositories/
    services/
    routes/
    main.py
```

## Responsabilidad de cada capa

- `routes`: recibe HTTP, valida dependencias y llama servicios.
- `services`: contiene reglas de negocio.
- `repositories`: accede a PostgreSQL o MongoDB.
- `models`: define tablas SQLAlchemy.
- `schemas`: define entradas y salidas Pydantic.
- `core`: configuracion, seguridad, JWT y logging.

## Sobre NestJS, Pino y Prisma

NestJS + Pino + Prisma es una gran opcion si el backend fuera TypeScript. En
este proyecto se mantendra FastAPI para reducir riesgo y tiempo, pero se tomara
la idea importante de la clase:

- logging estructurado JSON
- niveles correctos
- correlation ID por request
- no registrar datos sensibles
- logs utiles para auditoria y errores

Equivalentes en Python:

- Pino/Winston -> `structlog` o `python-json-logger`
- Middleware NestJS -> Middleware FastAPI
- Prisma -> SQLAlchemy

## Tablas PostgreSQL

1. `users`
2. `subjects`
3. `task_categories`
4. `tasks`
5. `study_goals`
6. `reminders`

## Colecciones MongoDB

7. `study_sessions`
8. `flashcards`
9. `resources`
10. `activity_logs`

## Relaciones principales

- Un usuario tiene muchas materias.
- Una materia tiene muchas tareas.
- Una tarea pertenece a una categoria.
- Una meta pertenece a una materia.
- Un recordatorio puede apuntar a una tarea o meta.
- Una sesion de estudio se registra contra una materia.
- Una flashcard pertenece a una materia.
- Un recurso pertenece a una materia.
- Un activity log registra acciones criticas del usuario.

## Criterios de calidad del diseno

- Nada de passwords en texto plano.
- Nada de `allow_origins=["*"]` en produccion.
- El backend filtra por usuario autenticado.
- Los endpoints devuelven errores HTTP correctos.
- Las respuestas de listas incluyen filtros o paginacion cuando aplique.
- Las acciones criticas generan logs.

