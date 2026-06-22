# Pruebas E2E con Cypress

Estas pruebas revisan el flujo del usuario en el frontend desplegado en Vercel.
Se ejecutan sobre la aplicacion real, no sobre localhost.

## Archivos

### ej01-auth-public.cy.js

Valida que se pueda crear una cuenta de prueba y entrar al dashboard.

### ej02-auth-validaciones.cy.js

Valida errores del formulario de registro:

- contrasena demasiado corta.
- contrasenas que no coinciden.

### ej03-navegacion-public.cy.js

Valida la navegacion entre secciones:

- Dashboard.
- Materias.
- Tareas.
- Sesiones.
- Metas.
- Recursos.
- Actividad.

### ej04-materias-public.cy.js

Crea una materia de prueba y confirma que aparezca en pantalla.

### ej05-tareas-public.cy.js

Crea una materia, crea una tarea asociada y la marca como completada.

### ej06-sesiones-public.cy.js

Registra una sesion de estudio para una materia.

### ej07-recursos-public.cy.js

Guarda un recurso con enlace HTTPS y comprueba que se muestre como enlace.

### ej08-metas-dashboard-public.cy.js

Crea una meta de estudio, aumenta su progreso y valida que el dashboard muestre
informacion relacionada.

## Datos de prueba

Los datos son genericos para no usar informacion real:

- `Usuario Prueba`
- `PASSWORD123`
- `prueba123456@correo.com`
- `Materia Prueba 12`
- `Tarea Prueba 12`

Los numeros cambian un poco para evitar conflictos por correos o nombres ya
registrados.

## Ejecutar

Desde la carpeta `frontend`:

```bash
npm run cypress:run
```

Para usar la interfaz:

```bash
npm run cypress:open
```
