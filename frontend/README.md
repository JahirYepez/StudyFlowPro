# Frontend - StudyFlowPro

Este frontend es la interfaz web de StudyFlowPro. Esta hecho con React,
TypeScript y Vite.

## Estructura

```text
frontend/
  src/
    api/
    assets/
    components/
    config/
    hooks/
    styles/
    types/
    utils/
  cypress/
    e2e/
    fixtures/
    support/
  package.json
  cypress.config.cjs
```

## Carpetas principales

- `src/api`: funciones para comunicarse con el backend.
- `src/assets`: imagenes y recursos visuales.
- `src/components`: pantallas y paneles de la aplicacion.
- `src/config`: valores iniciales y configuracion de vistas.
- `src/hooks`: logica de estado y acciones del frontend.
- `src/styles`: archivos CSS separados por secciones.
- `src/types`: tipos TypeScript usados en la app.
- `src/utils`: utilidades pequenas, como almacenamiento local.
- `cypress/e2e`: pruebas de flujo completo sobre la app desplegada.

## Ejecutar localmente

```bash
npm install
npm run dev
```

URL local:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## Cypress

Ejecutar pruebas en consola:

```bash
npm run cypress:run
```

Abrir interfaz de Cypress:

```bash
npm run cypress:open
```

## Variable principal

El frontend usa:

```env
VITE_API_URL=https://studyflowpro-api.onrender.com
```

En local puede apuntar a:

```env
VITE_API_URL=http://127.0.0.1:8000
```
