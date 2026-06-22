# Estructura del proyecto - StudyFlowPro

StudyFlowPro esta organizado como un proyecto full-stack dentro de un mismo
repositorio. La idea es que el codigo de aplicacion, pruebas y documentos de
calidad queden juntos para que la entrega sea facil de revisar.

## Raiz del proyecto

```text
ProyectoFinalCalidad/
```

Contiene configuracion general, documentacion, backend, frontend y archivos de
pruebas externas.

## backend

```text
backend/
```

Contiene la API desarrollada con FastAPI.

Carpetas principales:

- `app/core`: configuracion, seguridad JWT y logging.
- `app/database`: conexion a PostgreSQL y MongoDB.
- `app/models`: modelos relacionales de SQLAlchemy.
- `app/routes`: endpoints REST de la API.
- `app/schemas`: esquemas Pydantic para entrada y salida de datos.
- `app/services`: funciones de apoyo y logica de negocio sencilla.
- `tests/unit`: pruebas unitarias de funciones y validaciones.
- `tests/database`: pruebas de reglas de datos relacionales y documentos NoSQL.
- `tests/integration`: pruebas contra la API desplegada.

El backend trabaja con PostgreSQL para datos relacionales y MongoDB para datos
mas flexibles como sesiones, recursos y logs de actividad.

### Capas principales del backend

El backend no esta hecho como un solo archivo. Se separa en capas sencillas:

- `routes`: recibe peticiones HTTP y define endpoints.
- `services`: contiene logica de negocio y calculos de apoyo.
- `models`: define tablas relacionales.
- `schemas`: valida entradas y salidas de datos.
- `database`: concentra conexiones a PostgreSQL y MongoDB.
- `core`: guarda configuracion, seguridad, JWT y logging.

### Base relacional

PostgreSQL se usa para datos con relaciones claras:

1. `users`
2. `subjects`
3. `task_categories`
4. `tasks`
5. `study_goals`
6. `reminders`

### Base no relacional

MongoDB se usa para datos mas flexibles:

7. `study_sessions`
8. `flashcards`
9. `resources`
10. `activity_logs`

### Relaciones principales

- Un usuario tiene muchas materias.
- Una materia tiene muchas tareas, metas, recursos y sesiones.
- Una tarea pertenece a una materia y puede tener categoria.
- Una meta pertenece a una materia y mantiene progreso independiente.
- Un recordatorio puede relacionarse con una tarea o una meta.
- Los logs registran acciones relevantes del usuario.

### Criterios de calidad aplicados

- Las contrasenas se guardan con hash.
- El backend filtra datos por usuario autenticado.
- Las materias no se eliminan si tienen informacion asociada.
- Las respuestas usan codigos HTTP adecuados.
- Los recursos validan enlaces `https://`.
- Las acciones importantes generan logs de actividad.

## frontend

```text
frontend/
```

Contiene la aplicacion React con TypeScript y Vite.

Carpetas principales:

- `src/api`: cliente HTTP para consumir el backend.
- `src/components`: paneles visuales de la aplicacion.
- `src/config`: valores iniciales y titulos de vistas.
- `src/hooks`: manejo de estado y acciones por modulo.
- `src/styles`: estilos separados por tema o seccion.
- `src/types`: tipos TypeScript usados por el frontend.
- `src/utils`: utilidades pequenas, como almacenamiento local.
- `cypress`: pruebas E2E sobre el frontend desplegado.

El frontend maneja autenticacion, dashboard, materias, tareas, sesiones, metas,
recursos y actividad reciente.

## docs

```text
docs/
```

Contiene documentos de calidad y apoyo. Se divide en:

- `entregables`: documentos finales para entregar.
- `proyecto`: documentos para entender y ejecutar el proyecto.
- `borradores`: archivos anteriores o versiones de apoyo.

## qa

```text
qa/
```

Contiene archivos usados para herramientas externas de calidad.

- `qa/jmeter`: plan de performance para Apache JMeter.
- `qa/owasp`: espacio sugerido para guardar reportes generados por OWASP ZAP.

## docker-compose.yml

Permite levantar bases de datos locales para desarrollo cuando no se usan las
bases desplegadas.

## Resumen

La estructura busca mantenerse clara sin ser demasiado compleja. El proyecto
esta separado por responsabilidades, pero sin llegar a una arquitectura
empresarial. Esto lo hace adecuado para un proyecto universitario funcional y
presentable.
