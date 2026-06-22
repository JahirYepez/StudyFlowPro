# Pruebas unitarias

Estas pruebas revisan funciones pequenas del backend de forma aislada. No deben
depender de la base de datos real, del frontend ni de servicios externos.

## Archivos

### test_security.py

Valida funciones relacionadas con seguridad:

- creacion de tokens JWT.
- lectura del usuario dentro del token.
- hash de contrasena.
- verificacion correcta e incorrecta de contrasenas.

### test_validations.py

Valida reglas de entrada usando los esquemas Pydantic:

- contrasena con minimo 8 caracteres.
- contrasena con mayuscula y numero.
- correo valido.
- prioridad valida en tareas.
- enlaces HTTPS para recursos.

### test_study_metrics_sunny.py

Prueba escenarios correctos o esperados de funciones de metricas:

- calcular avance de tareas.
- calcular promedio de progreso de metas.
- aumentar progreso en pasos de 5%.
- sumar minutos de sesiones de estudio.

### test_study_metrics_rainy.py

Prueba escenarios con datos limite o incorrectos:

- progreso mayor a 100%.
- valores negativos.
- listas vacias.
- sesiones con minutos invalidos.

## Ejecutar

Desde la carpeta `backend`:

```bash
python -m pytest tests/unit -q
```
