describe('Blog app', function() {
    beforeEach(function() {
        cy.visit('localhost:3000')
    })
})

describe('Blog ', function() {
    it('front page opens', function () {
        cy.visit('localhost:3000')
        cy.contains('Blogs')
    })
})

it('user can login', function () {
    cy.get('[data-cy=username]')
      .type('Topi')
    cy.get('[data-cy=password]')
      .type('Topi')
    cy.contains('login')
      .click()
    cy.contains('Logged in as Topi')
  })  