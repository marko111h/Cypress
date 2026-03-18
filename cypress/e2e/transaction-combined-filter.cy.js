describe('Transactions Overview - Combined Filter', () => {

  it('kombinovani filteri – login jednom', () => {

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


    // ════════════════════════════════════════
    // KOMBINACIJA 1: Status + Search
    // ════════════════════════════════════════

    // Status – Accepted
    cy.get('#transactions_overview-filter-status mat-select').click();
    cy.wait(2000);
    cy.get('.mdc-list-item__primary-text').contains('Accepted').click();
    cy.wait(1000);
    cy.get('.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop').click({ force: true });
    cy.wait(500);

    // Search – Music Subscription
    cy.get('#transactions_overview-filter-search input[type="text"]')
      .clear()
      .type('Music Subscription');
    cy.wait(1000);

    // Filter
    cy.get('.mdc-button__label').contains('Filter').click({ force: true });
    cy.wait(3000);

    cy.get('tbody tr.mat-mdc-row').should('have.length.greaterThan', 0).then(($rows) => {
      cy.log(`✅ Kombinacija 1 (Status: Accepted + Search: Music Subscription) – pronađeno ${$rows.length} transakcija`);
    });
    cy.screenshot('combined-status-search');

    // Clear
    cy.get('.mdc-button__label').contains('Clear all filters').click();
    cy.wait(2000);


    // ════════════════════════════════════════
    // KOMBINACIJA 2: Status + Date range
    // ════════════════════════════════════════

    // Status – New
    cy.get('#transactions_overview-filter-status mat-select').click();
    cy.wait(2000);
    cy.get('.mdc-list-item__primary-text').contains('New').click();
    cy.wait(1000);

    // Zatvori dropdown klikom na backdrop
    cy.get('.cdk-overlay-backdrop').click({ force: true });
    cy.wait(500);

    // Date range – od 1. do danas
    cy.get('#transactions_overview-filter-create-payment-due-date-range button[aria-label="Open calendar"]').click();
    cy.wait(1000);

    cy.get('.mat-calendar-body-cell-content').contains('1').click();
    cy.wait(1000);

    const todayDay = new Date().getDate().toString();
    cy.get('.mat-calendar-body-cell-content').contains(todayDay).click();
    cy.wait(1000);

    // Filter
    cy.get('.mdc-button__label').contains('Filter').click({ force: true });
    cy.wait(3000);

    cy.get('tbody tr.mat-mdc-row').should('have.length.greaterThan', 0).then(($rows) => {
      cy.log(`✅ Kombinacija 2 (Status: New + Date range: 1. do danas) – pronađeno ${$rows.length} transakcija`);
    });
    cy.screenshot('combined-status-date');

    // Clear
    cy.get('.mdc-button__label').contains('Clear all filters').click();
    cy.wait(2000);


    // ════════════════════════════════════════
    // KOMBINACIJA 3: Dunning + Status
    // ════════════════════════════════════════

    // Dunning – In dunning
    cy.get('#transactions_overview-filter-dunning mat-select').click();
    cy.wait(2000);
    cy.get('.mdc-list-item__primary-text').contains('In dunning').click();
    cy.wait(1000);

    // Status – Accepted
    cy.get('#transactions_overview-filter-status mat-select').click();
    cy.wait(2000);
    cy.get('.mdc-list-item__primary-text').contains('Accepted').click();
    cy.wait(1000);

    // Filter
    cy.get('.mdc-button__label').contains('Filter').click({ force: true });
    cy.wait(3000);

    // Provjeri da tabela ima rezultate
    cy.get('tbody tr.mat-mdc-row').should('have.length.greaterThan', 0).then(($rows) => {
      cy.log(`✅ Kombinacija 3 (Dunning: In dunning + Status: Accepted) – pronađeno ${$rows.length} transakcija`);
    });
    cy.screenshot('combined-dunning-status');

    // Zatvori dropdown ako je otvoren pa Clear
    cy.get('.cdk-overlay-backdrop').click({ force: true });
    cy.wait(500);
    cy.get('.mdc-button__label').contains('Clear all filters').click({ force: true });
    cy.wait(2000);

  });

});