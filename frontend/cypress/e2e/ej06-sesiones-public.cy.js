describe('Ej06 - Sesiones de estudio', () => {
  it('registra una sesion de estudio para una materia', () => {
    const numero = Date.now().toString().slice(-2)
    const materia = `Materia Prueba ${numero}`

    cy.crearCuentaStudyFlow()
    cy.crearMateria(materia)
    cy.irASeccion('Sesiones')

    cy.get('select').first().select(materia)
    cy.get('input[placeholder="Minutos"]').type('45')
    cy.get('.session-date-selects select').eq(0).select('10')
    cy.get('.session-date-selects select').eq(1).select('Junio')
    cy.get('.session-date-selects select').eq(2).select('2026')
    cy.get('textarea[placeholder="Nota breve: tema repasado, avance o dificultad"]').type('Repaso de prueba')
    cy.contains('button', 'Registrar sesion').click()

    cy.contains('45 minutos').should('be.visible')
    cy.contains(materia).should('be.visible')
  })
})
