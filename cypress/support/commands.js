// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// =============================================
// CUSTOM COMMANDS - koristiti u svim testovima
// =============================================

// cypress/support/e2e.js

// ✅ OBAVEZNO - ucitava custom commands (cy.login, cy.goToConsumer, itd.)

// cypress/support/commands.js

// cypress/support/commands.js

Cypress.Commands.add('login', () => {
  cy.fixture('credentials.json').then((creds) => {
    cy.visit('https://dev-cc.dev.gerniks.net/#/auth/login');
    cy.get('input[placeholder*="Username"]').should('be.visible').clear().type(creds.admin.username);
    cy.get('input[placeholder*="Password"]').should('be.visible').clear().type(creds.admin.password);
    cy.get('#loginBtn').should('not.be.disabled').click();
    cy.url().should('include', 'dashboard');
  });
});

Cypress.Commands.add('goToConsumer', () => {
  cy.visit('https://dev-cc.dev.gerniks.net/#/entity/40261/consumers/smart-search-box');
  cy.get('mat-icon.material-icons').contains('more_vert').should('be.visible');
});