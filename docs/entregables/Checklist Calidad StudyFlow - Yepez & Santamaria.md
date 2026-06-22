# Checklist de Calidad Completado - StudyFlowPro

Proyecto final de Calidad en el Desarrollo de Software.

Estados usados: Cumple, Parcial, No aplica, No configurado.

## 1.1 Test Plan

| Item | Estado | Evidencia / Parte del proyecto |
|---|---|---|
| Test Plan creado y aprobado por el equipo | Cumple | docs/entregables/TestPlan StudyFlow - Yepez & Santamaria.pdf |
| Incluye frontend, API, BD relacional y BD NoSQL | Cumple | Test Plan + arquitectura del proyecto |
| Criterios de entrada y salida medibles | Cumple | Test Plan, seccion criterios |
| Entornos local, staging/produccion documentados | Cumple | docs/proyecto/guia-ejecucion-y-pruebas.md |
| Test Plan versionado en repositorio | Cumple | docs/entregables y repositorio GitHub |

## 1.2 Casos de prueba

| Item | Estado | Evidencia / Parte del proyecto |
|---|---|---|
| ID unico por caso | Cumple | Excel de casos de prueba, IDs CPA/CPM/CPT/etc. |
| Titulo descriptivo por modulo y resultado esperado | Cumple | docs/entregables, Excel de casos |
| Precondiciones documentadas | Cumple | Excel de casos de prueba |
| Datos de entrada especificos | Cumple | Datos genericos como Usuario Prueba y PASSWORD123 |
| Pasos numerados y reproducibles | Cumple | Excel de casos de prueba |
| Resultado esperado verificable | Cumple | Excel de casos de prueba |
| Resultado real completado | Cumple | Excel de casos de prueba |
| Estado Pass/Fail/Blocked/Not Executed | Cumple | Excel de casos de prueba |
| Severidad y prioridad | Cumple | Excel de casos de prueba |
| Referencia a requerimiento | Cumple | Hoja de requerimientos funcionales |

## 1.3 Registro de defectos

| Item | Estado | Evidencia / Parte del proyecto |
|---|---|---|
| ID unico del defecto | Cumple | Reporte Bugs StudyFlow - Santamaria & Yepez.xlsx |
| Titulo, descripcion y condicion | Cumple | Reporte de bugs |
| Pasos exactos para reproducir | Cumple | Reporte de bugs |
| Evidencia registrada | Cumple | Reporte de bugs PDF/XLSX |
| Severidad y prioridad | Cumple | Reporte de bugs |
| Entorno, version, asignado y estado | Cumple | Reporte de bugs |

## 2.2 Configuracion TypeScript

| Item | Estado | Evidencia / Parte del proyecto |
|---|---|---|
| tsconfig revisado en frontend | Parcial | frontend/tsconfig.app.json; proyecto usa TS en frontend y Python en backend |
| noUnusedLocals y noUnusedParameters activos | Cumple | frontend/tsconfig.app.json |
| ESLint recomendado configurado | Cumple | frontend/eslint.config.js |
| Prettier integrado con ESLint | No configurado | No se agrego para no sobrecargar el proyecto |
| Reglas estrictas completas de TypeScript | Parcial | Frontend tipado; no se activo strict completo |

## 3 Pruebas unitarias

| Item | Estado | Evidencia / Parte del proyecto |
|---|---|---|
| Funciones puras de negocio probadas | Cumple | backend/tests/unit/test_study_metrics_sunny.py |
| Validaciones probadas | Cumple | backend/tests/unit/test_validations.py |
| Seguridad y JWT probados | Cumple | backend/tests/unit/test_security.py |
| Sunny day y rainy day considerados | Cumple | test_study_metrics_sunny.py y test_study_metrics_rainy.py |
| Pruebas aisladas sin BD externa | Cumple | pytest unitario |

## 4.1 Integracion API REST

| Item | Estado | Evidencia / Parte del proyecto |
|---|---|---|
| Happy path 200/201/204 | Cumple | backend/tests/integration/test_public_api.py |
| Schema/campos esperados | Cumple | Asserts sobre respuestas JSON |
| Validacion de token requerido | Cumple | GET /auth/me sin token |
| Recursos inexistentes/conflictos | Parcial | Cubierto en backend y pruebas de modelos; no todos en integracion publica |
| Flujo materia-tarea-dashboard | Cumple | Prueba publica contra Render |
| Flujo MongoDB: sesiones y recursos | Cumple | test_mongo_backed_resources_and_sessions_against_public_api |

## 4.2 Base de datos relacional

| Item | Estado | Evidencia / Parte del proyecto |
|---|---|---|
| Restricciones UNIQUE probadas | Cumple | test_postgres_models.py: usuario, materia, categoria |
| Foreign keys probadas | Cumple | tarea con materia inexistente |
| Relaciones usuario-materia-tarea | Cumple | test_task_belongs_to_subject_and_user |
| Metas independientes por materia | Cumple | test_study_goals_keep_independent_progress |
| Rollback/truncate entre tests | Cumple | SQLite en memoria por fixture |
| Testcontainers con PostgreSQL real | No aplica | Se uso SQLite en memoria por simplicidad academica |

## 4.3 Base de datos NoSQL

| Item | Estado | Evidencia / Parte del proyecto |
|---|---|---|
| Documentos de sesiones probados | Cumple | backend/tests/database/test_mongo_documents.py |
| Documentos de recursos HTTPS probados | Cumple | test_mongo_resource_document_keeps_https_url |
| Colecciones limpias entre pruebas | Cumple | delete_many simulado |
| MongoDB Atlas en integracion real | Cumple | Prueba publica de sesiones y recursos |
| Indices/explain/TTL | No aplica | No se implementaron por alcance del proyecto |

## 5 Cypress E2E

| Item | Estado | Evidencia / Parte del proyecto |
|---|---|---|
| Registro de usuario nuevo | Cumple | ej01-auth-public.cy.js |
| Validaciones de formulario | Cumple | ej02-auth-validaciones.cy.js |
| Navegacion principal | Cumple | ej03-navegacion-public.cy.js |
| Flujo principal materias-tareas | Cumple | ej04 y ej05 |
| Sesiones, recursos, metas y dashboard | Cumple | ej06, ej07, ej08 |
| Fixtures y comandos custom | Cumple | fixtures/user.json y support/commands.js |
| data-cy en todos los selectores | Parcial | Se usan textos/labels y algunos selectores CSS simples |
| Pago, roles, recuperacion de contrasena | No aplica | No son modulos de StudyFlowPro |

## 6 Rendimiento / JMeter

| Item | Estado | Evidencia / Parte del proyecto |
|---|---|---|
| Plan de JMeter creado | Cumple | docs/entregables/studyflowpro-api-test-plan.jmx |
| Carga moderada con usuarios concurrentes | Cumple | Thread Group con USERS/RAMP_UP/LOOPS |
| Endpoints principales de API incluidos | Cumple | health, auth, subjects, tasks, dashboard |
| Stress/Spike/Soak completos | Parcial | No se ejecutaron cargas agresivas por plan gratuito de Render |
| Resumen de resultados disponible | Cumple | Summary Report en JMeter |

## 7 Seguridad / OWASP

| Item | Estado | Evidencia / Parte del proyecto |
|---|---|---|
| Escaneo OWASP ZAP del frontend | Cumple | ZAP-Report-study-flow-pro-kappa.vercel.app.html |
| Broken Access Control basico | Cumple | Endpoints protegidos por JWT y filtrado por usuario |
| Passwords hasheados | Cumple | backend/app/core/security.py con bcrypt/passlib |
| Sin datos sensibles en logs | Cumple | Logging no registra passwords/tokens |
| SQL Injection mitigado | Cumple | SQLAlchemy ORM |
| NoSQL Injection basico | Parcial | Uso controlado de filtros por usuario; sin pruebas exhaustivas |
| XSS mitigado por React | Cumple | Renderizado React sin HTML inseguro |
| Cabeceras de seguridad | Parcial | ZAP detecto faltantes como CSP/clickjacking |
| CORS restrictivo | Cumple | FRONTEND_URLS configurado para dominios permitidos |
| JWT con expiracion | Cumple | ACCESS_TOKEN_EXPIRE_MINUTES |
| Refresh tokens/rate limiting | No aplica | Fuera del alcance academico del proyecto |
| Logging de operaciones criticas | Cumple | activity_logs y logs estructurados |

## 8 Accesibilidad y compatibilidad

| Item | Estado | Evidencia / Parte del proyecto |
|---|---|---|
| Formularios con labels | Cumple | Auth y formularios principales |
| Focus visible y navegacion basica | Parcial | Estilos e inputs estandar; no se hizo auditoria completa WCAG |
| Viewports desktop/movil considerados | Parcial | CSS responsive; no hay matriz formal de navegadores |
| Cypress multiples viewports | Parcial | Cypress usa viewport principal configurado |
| JavaScript desactivado | No aplica | SPA React requiere JavaScript |

## 11 Observabilidad: logs y metricas

| Item | Estado | Evidencia / Parte del proyecto |
|---|---|---|
| Logging estructurado JSON | Cumple | backend/app/core/logging.py con structlog |
| Niveles de log correctos | Cumple | info/error y request_completed |
| Correlation ID por request | Cumple | Middleware FastAPI |
| Sin datos sensibles en logs | Cumple | No se registran passwords ni tokens |
| Reporte/evidencia de logs | Cumple | Logs en Render + seccion Actividad |
| Retencion de logs formal | Parcial | Depende de Render/servicio gratuito |
| Metricas de negocio | Cumple | Dashboard: tareas, progreso, minutos y metas |
| Dashboard funcionando | Cumple | Frontend desplegado + GET /dashboard/summary |
| Grafana/Datadog en tiempo real | No aplica | Fuera del alcance academico |
