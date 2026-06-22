describe('Ej03 - Navegacion principal', () => {
  it('permite navegar por las secciones principales', () => {
    cy.crearCuentaStudyFlow()

    cy.irASeccion('Materias')
    cy.irASeccion('Tareas')
    cy.irASeccion('Sesiones')
    cy.irASeccion('Metas')
    cy.irASeccion('Recursos')
    cy.irASeccion('Actividad')
    cy.irASeccion('Dashboard')
  })
})
