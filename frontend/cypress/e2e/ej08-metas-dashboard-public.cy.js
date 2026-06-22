describe('Ej08 - Metas y dashboard', () => {
  it('crea una meta, aumenta su progreso y refleja informacion en dashboard', () => {
    const numero = Date.now().toString().slice(-2)
    const materia = `Materia Prueba ${numero}`
    const meta = `Meta Prueba ${numero}`

    cy.crearCuentaStudyFlow()
    cy.crearMateria(materia)
    cy.irASeccion('Metas')

    cy.get('input[placeholder="Titulo de la meta"]').type(meta)
    cy.get('.goal-meta-selects select').select(materia)
    cy.get('input[placeholder="Minutos objetivo"]').type('300')
    cy.get('.goal-date-selects select').eq(0).select('20')
    cy.get('.goal-date-selects select').eq(1).select('Noviembre')
    cy.get('.goal-date-selects select').eq(2).select('2026')
    cy.contains('button', 'Crear meta').click()

    cy.contains(meta).should('be.visible')
    cy.contains('0% completado').should('be.visible')
    cy.contains('button', '+5%').click()
    cy.contains('5% completado').should('be.visible')

    cy.irASeccion('Dashboard')
    cy.contains('Progreso metas').should('be.visible')
  })
})
