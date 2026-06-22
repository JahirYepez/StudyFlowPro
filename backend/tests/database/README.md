# Pruebas de base de datos

Estas pruebas revisan reglas importantes de persistencia. La idea es comprobar
que los modelos y documentos respeten la coherencia basica del sistema.

## Archivos

### test_postgres_models.py

Valida reglas de la base relacional:

- el correo del usuario debe ser unico.
- una materia no se puede repetir para el mismo usuario.
- una tarea pertenece a un usuario y a una materia.
- una tarea no puede apuntar a una materia inexistente.
- las metas de una misma materia mantienen progreso independiente.
- las categorias de tarea no se repiten para el mismo usuario.
- un recordatorio puede relacionarse con una tarea.

Estas pruebas usan una base SQLite en memoria para no depender de Neon durante
la ejecucion local.

### test_mongo_documents.py

Valida documentos tipo MongoDB de forma simulada:

- insertar y buscar sesiones de estudio.
- guardar recursos con enlaces HTTPS.
- limpiar colecciones entre pruebas.

No usa Atlas directamente; se simula una coleccion para mantener la prueba
rapida y controlada.

## Ejecutar

Desde la carpeta `backend`:

```bash
python -m pytest tests/database -q
```
