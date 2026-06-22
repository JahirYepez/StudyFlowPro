# Guia de ejecucion y pruebas - StudyFlowPro

Este documento resume como correr el proyecto y las pruebas principales. Esta
pensado como apoyo para la entrega final de Calidad en el Desarrollo de
Software.

## Enlaces desplegados

- Frontend: https://study-flow-pro-kappa.vercel.app/
- Backend: https://studyflowpro-api.onrender.com
- Swagger del backend: https://studyflowpro-api.onrender.com/docs
- Health check: https://studyflowpro-api.onrender.com/health

Nota: Render en plan gratuito puede tardar en responder si el servicio estuvo
inactivo.

## Ejecutar localmente

### Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

URL local:

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

URL local:

```text
http://localhost:5173
```

## Pruebas con pytest

Las pruebas del backend estan separadas por tipo.

### Unitarias

Validan funciones aisladas, seguridad y validaciones.

```bash
cd backend
pytest tests/unit -q
```

### Base de datos

Validan reglas de modelos relacionales y documentos NoSQL simulados para no
depender de una base externa durante unit/integration basica.

```bash
cd backend
pytest tests/database -q
```

### Integracion API publica

Estas pruebas llaman al backend desplegado en Render.

```bash
cd backend
pytest tests/integration -q
```

## Pruebas Cypress

Cypress prueba el frontend desplegado en Vercel.

Ejecutar en modo headless:

```bash
cd frontend
npm run cypress:run
```

Abrir interfaz de Cypress:

```bash
cd frontend
npm run cypress:open
```

Los archivos estan en:

```text
frontend/cypress/e2e
```

## Pruebas JMeter

Archivo del plan:

```text
qa/jmeter/studyflowpro-api-test-plan.jmx
```

Pasos:

1. Abrir `ApacheJMeter.bat`.
2. Ir a `File > Open`.
3. Seleccionar `qa/jmeter/studyflowpro-api-test-plan.jmx`.
4. Revisar variables del Test Plan:
   - `HOST=studyflowpro-api.onrender.com`
   - `USERS=10`
   - `RAMP_UP=10`
   - `LOOPS=1`
5. Ejecutar la prueba con el boton Start.
6. Revisar `Summary Report` y `View Results Tree`.
7. Guardar el resultado como evidencia si el profesor lo pide.

La carga esta configurada de forma moderada porque el backend esta en un plan
gratuito.

## OWASP ZAP

Para esta practica no es obligatorio instalar certificado si solo se hace un
escaneo basico con la opcion `Automated Scan` sobre una URL publica. El
certificado se vuelve importante cuando se quiere interceptar trafico del
navegador usando ZAP como proxy, especialmente con sitios HTTPS.

Escaneo basico recomendado:

1. Abrir OWASP ZAP.
2. Entrar a `Quick Start`.
3. Elegir `Automated Scan`.
4. Probar primero el frontend:

```text
https://study-flow-pro-kappa.vercel.app/
```

5. Probar tambien el backend o su documentacion:

```text
https://studyflowpro-api.onrender.com/docs
https://studyflowpro-api.onrender.com/openapi.json
```

6. Al finalizar, ir a `Report > Generate Report`.
7. Guardar el reporte en HTML o PDF dentro de una carpeta de evidencias.

## Recomendacion de entrega

Para la entrega se puede incluir:

- Link del repositorio.
- Link del frontend.
- Link del backend o Swagger.
- PDF del test plan.
- Excel de casos de prueba.
- Excel de reporte de bugs.
- Evidencia de pytest.
- Evidencia de Cypress.
- Archivo `.jmx` de JMeter.
- Reporte generado por OWASP ZAP.
