describe('Ej07 - Recursos', () => {
  it('guarda un recurso con enlace https y lo muestra como enlace', () => {
    const numero = Date.now().toString().slice(-2)
    const materia = `Materia Prueba ${numero}`
    const recurso = `Recurso Prueba ${numero}`

    cy.crearCuentaStudyFlow()
    cy.crearMateria(materia)
    cy.irASeccion('Recursos')

    cy.get('input[placeholder="Titulo del recurso"]').type(recurso)
    cy.get('.resource-meta-selects select').eq(0).select(materia)
    cy.get('.resource-meta-selects select').eq(1).select('Documentacion')
    cy.get('input[placeholder="https://ejemplo.com/recurso"]').type('https://www.example.com')
    cy.get('textarea[placeholder="Nota breve: para que sirve o que tema cubre"]').type('Documento de prueba')
    cy.contains('button', 'Guardar recurso').click()

    cy.contains('a', recurso).should('have.attr', 'href').and('include', 'https://www.example.com')
    cy.contains(materia).should('be.visible')
  })
})
