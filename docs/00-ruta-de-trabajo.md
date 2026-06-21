# Ruta de trabajo

Este proyecto se construira por etapas. La idea no es hacer un sistema enorme,
sino uno coherente, funcional y defendible para Calidad de Software.

## Objetivo del producto

StudyFlow ayuda a estudiantes a planear y medir su avance academico:

1. Registrar cuenta e iniciar sesion.
2. Crear materias.
3. Crear tareas asociadas a materias y categorias.
4. Definir metas de estudio por materia.
5. Registrar sesiones de estudio.
6. Guardar recursos de apoyo.
7. Crear flashcards.
8. Recibir recordatorios.
9. Ver un dashboard con progreso real.
10. Registrar acciones importantes en logs/auditoria.

## Etapas

### Etapa 1: Base del proyecto

- Crear estructura `frontend/` y `backend/`.
- Configurar React + TypeScript + Vite.
- Configurar FastAPI.
- Agregar Docker Compose con PostgreSQL y MongoDB.
- Crear `.env.example`.
- Confirmar que frontend, backend y bases de datos levantan localmente.

### Etapa 2: Modelo de datos y autenticacion

- Definir tablas y colecciones.
- Implementar usuarios con password hasheado.
- Implementar JWT.
- Proteger endpoints.
- Evitar que el frontend filtre datos de otros usuarios.

### Etapa 3: Flujo academico principal

- Materias.
- Categorias de tarea.
- Tareas por materia.
- Metas de estudio.
- Sesiones de estudio.
- Dashboard con datos reales.

### Etapa 4: Modulos complementarios

- Recursos.
- Flashcards.
- Recordatorios.
- Activity logs.

### Etapa 5: Calidad

- Unit tests.
- Tests API.
- Cypress.
- JMeter.
- OWASP ZAP.
- Reporte de bugs.
- Test Plan en PDF.
- Reporte de logs.

### Etapa 6: Despliegue

- Backend en internet.
- Frontend en internet.
- Variables de entorno productivas.
- CORS restringido.
- Dashboard funcionando en produccion.

## Primer trabajo practico

Antes de implementar pantallas, se debe crear el esqueleto tecnico:

1. Crear frontend con Vite.
2. Crear backend FastAPI.
3. Crear Docker Compose para PostgreSQL y MongoDB.
4. Levantar todo localmente.
5. Documentar comandos de ejecucion.

