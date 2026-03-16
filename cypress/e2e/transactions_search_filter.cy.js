describe('Transactions Overview - Search Filter', () => {

  const searches = [
    { label: 'Consumer ime',  value: 'Lambert Grady' },
    { label: 'Opis',          value: 'Music Subscription' },
    { label: 'Transaction ID', value: '387579' },
  ];

  it('pretražuje po imenu, opisu i ID-u – login jednom', () => {

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
    cy.wait(8000);

    // ─── 3. Otvori Filters panel ───
    cy.get('mat-expansion-panel-header').contains('Filters').click();
    cy.wait(4000);

    // ─── 4. Petlja kroz sve search vrijednosti ───
    searches.forEach(({ label, value }) => {

      // Upiši u Search polje
      cy.get('#transactions_overview-filter-search input[type="text"]')
        .clear()
        .type(value);
      cy.wait(1000);

      // Klikni Filter
      cy.get('.mdc-button__label').contains('Filter').click();
      cy.wait(3000);

      // Provjeri da tabela ima rezultate i loguj
      cy.get('tbody tr.mat-mdc-row').should('have.length.greaterThan', 0).then(($rows) => {
        cy.log(`✅ Search "${label}: ${value}" – pronađeno ${$rows.length} transakcija`);
      });

      // Očisti za sljedeći search
      cy.get('.mdc-button__label').contains('Clear all filters').click();
      cy.wait(2000);
    });

  });

});