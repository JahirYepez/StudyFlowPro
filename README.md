# StudyFlowPro

Proyecto final para la materia **Calidad en el Desarrollo de Software**.

StudyFlowPro es una aplicacion web academica para organizar materias, tareas,
sesiones de estudio, metas y recursos de apoyo. El objetivo fue construir una
app funcional y coherente, no solamente varios CRUD aislados, y usarla como base
para aplicar pruebas, logging, seguridad basica, bases de datos relacionales y
no relacionales, y despliegue en la nube.

## Aplicacion en linea

- Frontend: https://study-flow-pro-kappa.vercel.app/
- Backend: https://studyflowpro-api.onrender.com
- Health check: https://studyflowpro-api.onrender.com/health

> El backend esta en Render con plan gratuito, por lo que puede tardar algunos
> segundos si estuvo inactivo.

## Stack general

- Frontend: React + TypeScript + Vite
- Backend: FastAPI
- Base relacional: PostgreSQL en Neon
- Base no relacional: MongoDB Atlas
- Autenticacion: JWT
- Pruebas: pytest, Cypress, JMeter y OWASP ZAP

## Modulos principales

- autenticacion de usuarios
- materias
- tareas
- sesiones de estudio
- metas de estudio
- recursos
- recordatorios
- logs de actividad
- dashboard

## Idea funcional

El usuario puede crear una cuenta, iniciar sesion y administrar su informacion
academica. Las tareas se relacionan con materias, las metas tienen progreso
independiente, los recursos validan enlaces seguros y el dashboard muestra un
resumen del avance general.

## Documentacion

- Backend: [backend/README.md](backend/README.md)
- Frontend: [frontend/README.md](frontend/README.md)
- Documentacion general: [docs/README.md](docs/README.md)
- Entregables: `docs/entregables`

## Autores

Proyecto desarrollado por **Jahir Yepez** y **Fernanda Santamaria**.
