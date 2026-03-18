describe('Transactions Overview - Date Range Filter', () => {

  it('filtrira transakcije po Payment due date range', () => {

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

    // ─── 4. Klikni na calendar ikonu da otvori date picker ───
    cy.get('#transactions_overview-filter-create-payment-due-date-range button[aria-label="Open calendar"]').click();
    cy.wait(1000);

    // ─── 5. Izaberi start datum – klikni na 1 ───
    cy.get('.mat-calendar-body-cell-content').contains('1').click();
    cy.wait(1000);

    // ─── 6. Izaberi end datum – klikni na današnji dan ───
    const todayDay = new Date().getDate().toString();
    cy.get('.mat-calendar-body-cell-content').contains(todayDay).click();
    cy.wait(1000);

    // ─── 7. Provjeri da je datum range postavljen ───
    cy.get('#transactions_overview-filter-create-payment-due-date-range')
      .should('contain.text', '1');
    cy.screenshot('date-range-selected');

    // ─── 8. Klikni Filter ───
    cy.get('.mdc-button__label').contains('Filter').click({ force: true });
    cy.wait(3000);

    // ─── 9. Provjeri da tabela ima rezultate ───
    cy.get('tbody tr.mat-mdc-row').should('have.length.greaterThan', 0).then(($rows) => {
      cy.log(`✅ Date range filter – pronađeno ${$rows.length} transakcija`);
    });

    cy.screenshot('date-range-filter-results');

  });

});