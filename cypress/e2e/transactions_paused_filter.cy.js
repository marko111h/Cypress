// transactions_paused_filter.cy.js
// ─────────────────────────────────────────────
describe('Transactions Overview - Paused Filter', () => {

  // ⚠️ Otvori Paused dropdown i kopiraj opcije pa zamijeni ovdje
  const pausedOptions = [
    'Yes',
    'No',
  ];

  it('filtrira sve Paused opcije – login jednom', () => {

    // ─── 1. Login ───
    cy.visit('https://dev-cc.dev.gerniks.net/#/admin/entity/1/dashboard');

    cy.fixture('credentials.json').then((creds) => {
      cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
      cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
    });

    cy.get('#loginBtn').click();
    cy.wait(9000);
    cy.url().should('include', 'dashboard');

    // ─── 2. Idi na Transactions ───
    cy.visit('https://dev-cc.dev.gerniks.net/#/entity/40261/transactions/in');
    cy.wait(5000);

    // ─── 3. Otvori Filters panel ───
    cy.get('mat-expansion-panel-header').contains('Filters').click();
    cy.wait(4000);

    // ─── 4. Petlja kroz sve Paused opcije ───
    pausedOptions.forEach((option) => {

      cy.get('#pausedFilterOptionCd mat-select').click();
      cy.wait(2000);

      cy.get('.mdc-list-item__primary-text').contains(option).click();
      cy.wait(1000);

      cy.get('.mdc-button__label').contains('Filter').click({ force: true });
      cy.wait(3000);

      cy.get('tbody tr.mat-mdc-row').should('have.length.greaterThan', 0).then(($rows) => {
        cy.log(`✅ Paused "${option}" – pronađeno ${$rows.length} transakcija`);
      });

      cy.get('.mdc-button__label').contains('Clear all filters').click();
      cy.wait(2000);
    });

  });

});