describe('Transactions Overview - Status Filter', () => {

  const statuses = [
    'Accepted',
    'Rejected',
    'New',
    'Exported',
    'Paid',
    'Returned',
    'Settled',
    'For dunning',
    'Sending to inkasso',
    'Sent to Inkasso',
    'Should go to Inkasso',
  ];

  it('filtrira sve statuse – login jednom', () => {

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

    // ─── 4. Petlja kroz sve statuse ───
    statuses.forEach((status) => {

      // Klikni Status dropdown
      cy.get('#transactions_overview-filter-status mat-select').click();
      cy.wait(2000);

      // Izaberi status
      cy.get('.mdc-list-item__primary-text').contains(status).click();
      cy.wait(1000);

      // Zatvori dropdown
      cy.get('.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop').click({ force: true });
      cy.wait(500);

      // Klikni Filter
      cy.get('.mdc-button__label').contains('Filter').click();
      cy.wait(3000);

      // Provjeri da tabela ima rezultate i loguj
      cy.get('tbody tr.mat-mdc-row').should('have.length.greaterThan', 0).then(($rows) => {
        cy.log(`✅ Status "${status}" – pronađeno ${$rows.length} transakcija`);
      });

      // Ocisti filter za sledeci status
      cy.get('.mdc-button__label').contains('Clear all filters').click();
      cy.wait(2000);
    });

  });

});