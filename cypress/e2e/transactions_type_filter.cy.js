

// ─────────────────────────────────────────────
// transactions_type_filter.cy.js
// ─────────────────────────────────────────────
describe('Transactions Overview - Type Filter', () => {

  const typeOptions = [
    'Factored',
    'Non-factored',
    'Serviced',
    'Serviced over limit',
  ];

  it('filtrira sve Type opcije – login jednom', () => {

    cy.visit('https://dev-cc.dev.gerniks.net/#/admin/entity/1/dashboard');

    cy.fixture('credentials.json').then((creds) => {
      cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
      cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
    });

    cy.get('#loginBtn').click();
    cy.wait(9000);
    cy.url().should('include', 'dashboard');

    cy.visit('https://dev-cc.dev.gerniks.net/#/entity/40261/transactions/in');
    cy.wait(5000);

    cy.get('mat-expansion-panel-header').contains('Filters').click();
    cy.wait(4000);

    typeOptions.forEach((option) => {

      cy.get('#transactions_overview-filter-type mat-select').click();
      cy.wait(2000);

      cy.get('.mdc-list-item__primary-text').contains(option).click();
      cy.wait(1000);

      cy.get('.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop').click({ force: true });
      cy.wait(500);

      cy.get('.mdc-button__label').contains('Filter').click({ force: true });
      cy.wait(3000);

      cy.get('tbody tr.mat-mdc-row').should('have.length.greaterThan', 0).then(($rows) => {
        cy.log(`✅ Type "${option}" – pronađeno ${$rows.length} transakcija`);
      });

      cy.get('.mdc-button__label').contains('Clear all filters').click();
      cy.wait(2000);
    });

  });

});