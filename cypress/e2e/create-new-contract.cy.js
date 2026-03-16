describe('Consumer Cockpit - Create New Contract', () => {
  it('more_vert > Profile > Contracts > Create new contract', () => {

    cy.login();

    // Consumer 360 Smart Search
    cy.visit('https://dev-cc.dev.gerniks.net/#/entity/40261/consumers/smart-search-box');
    cy.wait(10000);

    // Otvori Actions meni
    cy.get('mat-icon.material-icons').contains('more_vert').click();

    // Idi na Profile
    cy.contains('span.action_title', 'Profile').click();
    cy.wait(2000);

    // Idi na Contracts tab
    cy.get('#consumer_360_edit_consumer-list_item-selectedTab3 a').click();
    cy.wait(2000);

    // Klikni Create new contract
    cy.contains('button', 'Create new contract ').click();
    cy.contains('span', 'Contract 360').click();
    cy.contains('span', 'Music Subscription ').click();

    // Otvori datepicker
    cy.get('#mcc-fi-input-ctrlContractStartDate').click({ force: true });
    cy.wait(1000);

    // ✅ FIX: Klikni na .mat-calendar-body-today - uvek oznacava danasnji dan
    cy.get('.mat-calendar-body-today').click({ force: true });

    // Nastavi kroz wizard
    cy.contains('button', 'Next').click();
    cy.contains('label', ' Monthly ').click();
    cy.wait(1000);
    cy.get('button[matsteppernext]:visible').first().click({ force: true });

    // Nacin placanja
    cy.get('.mat-mdc-select-placeholder').click({ force: true });
    cy.get('.mdc-list-item__primary-text').contains('Direct-debit').click();
    cy.get('button[matsteppernext]:visible').first().click({ force: true });

    // Potvrdi kreiranje
    cy.get('button.primary-btn.ml-small').contains('Create').click({ force: true });

    // ✅ Provjeri uspjesno kreiranje
    cy.url().should('include', 'contracts');
    cy.screenshot('contract-created-success');
  });
});