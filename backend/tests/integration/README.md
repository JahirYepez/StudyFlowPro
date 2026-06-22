# Pruebas de integracion

Estas pruebas revisan el comportamiento de la API desplegada. A diferencia de
las unitarias, aqui si se hacen peticiones reales al backend publico.

## Archivo

### test_public_api.py

Valida flujos principales contra Render:

- `GET /health` responde correctamente.
- los endpoints protegidos rechazan peticiones sin token.
- un usuario registrado puede iniciar sesion.
- el usuario autenticado puede consultar su perfil.
- se puede crear materia, crear tarea, completarla y eliminarla.
- se pueden crear sesiones de estudio y recursos, que usan MongoDB.
- el dashboard refleja informacion despues de registrar datos.

## URL usada

Por defecto se usa:

```text
https://studyflowpro-api.onrender.com
```

Tambien se puede cambiar con la variable:

```text
STUDYFLOW_API_URL
```

## Ejecutar

Desde la carpeta `backend`:

```bash
python -m pytest tests/integration -q
```
