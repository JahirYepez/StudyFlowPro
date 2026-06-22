Cypress.Commands.add('crearCuentaStudyFlow', () => {
  const numero = Date.now().toString().slice(-6)
  const email = `prueba${numero}@correo.com`

  cy.fixture('user').then((user) => {
    cy.visit('/')
    cy.contains('button', 'Crear cuenta').click()
    cy.contains('label', 'Nombre completo').find('input').type(user.fullName)
    cy.contains('label', 'Correo').find('input').type(email)
    cy.contains('label', 'Contrasena').find('input').type(user.password)
    cy.contains('label', 'Confirmar contrasena').find('input').type(user.password)
    cy.contains('button', 'Registrarme').click()
    cy.contains('h1', 'Dashboard').should('be.visible')
  })

  cy.wrap({ email, numero })
})

Cypress.Commands.add('irASeccion', (seccion) => {
  const titulos = {
    Dashboard: 'Dashboard',
    Materias: 'Materias',
    Tareas: 'Tareas',
    Sesiones: 'Sesiones de estudio',
    Metas: 'Metas de estudio',
    Recursos: 'Recursos',
    Actividad: 'Actividad reciente',
  }

  cy.contains('button', seccion).click()
  cy.contains('h1', titulos[seccion] || seccion).should('be.visible')
})

Cypress.Commands.add('crearMateria', (nombre) => {
  cy.irASeccion('Materias')
  cy.get('input[placeholder="Nueva materia"]').clear().type(nombre)
  cy.contains('button', 'Crear materia').click()
  cy.contains(nombre).should('be.visible')
})

Cypress.Commands.add('crearTarea', (titulo, materia) => {
  cy.irASeccion('Tareas')
  cy.get('input[placeholder="Titulo de tarea"]').clear().type(titulo)
  cy.get('.task-meta-selects select').eq(0).select(materia)
  cy.get('.task-meta-selects select').eq(1).select('Alta')
  cy.get('.date-selects select').eq(0).select('15')
  cy.get('.date-selects select').eq(1).select('Agosto')
  cy.get('.date-selects select').eq(2).select('2026')
  cy.get('textarea[placeholder="Descripcion breve"]').clear().type('Actividad de prueba academica')
  cy.contains('button', 'Crear tarea').click()
  cy.contains(titulo).should('be.visible')
})
