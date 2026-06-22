describe('Ej04 - Materias', () => {
  it('crea una materia y la muestra en la lista', () => {
    const numero = Date.now().toString().slice(-2)
    const materia = `Materia Prueba ${numero}`

    cy.crearCuentaStudyFlow()
    cy.crearMateria(materia)

    cy.contains('h2', 'Materias').should('be.visible')
    cy.contains(materia).should('be.visible')
  })
})
