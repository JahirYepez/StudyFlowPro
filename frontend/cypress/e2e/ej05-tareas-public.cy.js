describe('Ej05 - Tareas', () => {
  it('crea una tarea asociada a una materia y permite completarla', () => {
    const numero = Date.now().toString().slice(-2)
    const materia = `Materia Prueba ${numero}`
    const tarea = `Tarea Prueba ${numero}`

    cy.crearCuentaStudyFlow()
    cy.crearMateria(materia)
    cy.crearTarea(tarea, materia)

    cy.contains(tarea).should('be.visible')
    cy.contains(materia).should('be.visible')
    cy.get(`button[aria-label="Completar ${tarea}"]`).click()
    cy.contains('button', 'Completadas').click()
    cy.contains(tarea).parents('article').contains('Completada').should('be.visible')
  })
})
