describe('Ej01 - Autenticacion publica', () => {
  it('crea una cuenta de prueba y entra al panel', () => {
    cy.crearCuentaStudyFlow()

    cy.contains('Dashboard').should('be.visible')
    cy.contains('Materias').should('be.visible')
    cy.contains('Tareas').should('be.visible')
  })
})
