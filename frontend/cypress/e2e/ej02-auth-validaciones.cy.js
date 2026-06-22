describe('Ej02 - Validaciones de autenticacion', () => {
  it('muestra error cuando la contrasena no cumple la longitud minima', () => {
    const numero = Date.now().toString().slice(-6)

    cy.visit('/')
    cy.contains('button', 'Crear cuenta').click()

    cy.contains('label', 'Nombre completo').find('input').type('Usuario Prueba')
    cy.contains('label', 'Correo').find('input').type(`prueba${numero}@correo.com`)
    cy.contains('label', 'Contrasena').find('input').type('Abc1')
    cy.contains('label', 'Confirmar contrasena').find('input').type('Abc1')
    cy.contains('button', 'Registrarme').click()

    cy.contains('La contrasena debe tener al menos 8 caracteres.').should('be.visible')
  })

  it('muestra error cuando las contrasenas no coinciden', () => {
    const numero = Date.now().toString().slice(-6)

    cy.visit('/')
    cy.contains('button', 'Crear cuenta').click()

    cy.contains('label', 'Nombre completo').find('input').type('Usuario Prueba')
    cy.contains('label', 'Correo').find('input').type(`prueba${numero}@correo.com`)
    cy.contains('label', 'Contrasena').find('input').type('PASSWORD123')
    cy.contains('label', 'Confirmar contrasena').find('input').type('PASSWORD124')
    cy.contains('button', 'Registrarme').click()

    cy.contains('Las contrasenas no coinciden.').should('be.visible')
  })
})
