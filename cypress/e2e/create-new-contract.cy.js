describe('Consumer Cockpit - Add Transaction', () => {
  it('more_vert > Transactions > Add', () => {
    cy.visit('https://dev-cc.miticondev.net/#/admin/entity/1/dashboard');

   cy.fixture('credentials.json').then((creds) => {
      cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
      cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
    });
    cy.get('#loginBtn').click();
    cy.wait(10000);
    cy.url().should('include', 'dashboard');

        // 2. Consumer 360 Smart Search
    cy.visit('https://dev-cc.miticondev.net/#/entity/40261/consumers/smart-search-box');

    cy.wait(10000);
    // 1. More_vert ikona (Actions)
    cy.get('mat-icon.material-icons').contains('more_vert').click();

     cy.contains('span.action_title', 'Profile').click();
     cy.wait(2000);
 
    cy.get('#consumer_360_edit_consumer-list_item-selectedTab3 a').click();

    cy.wait(2000);
    cy.contains('button', 'Create new contract ').click()
    cy.contains('span', 'Contract 360').click();
    cy.contains('span', 'Music Subscription ').click();
    cy.get('#mcc-fi-input-ctrlContractStartDate').click({ force: true });

    // Sačekaj calendar
    cy.get('.mat-calendar-body').should('be.visible');

    // Izaberi dan (npr. 27)
    const todayDay = new Date().getDate().toString();
    cy.contains('.mat-calendar-body-cell-content', todayDay).click();
    cy.contains('button', 'Next').click();
    cy.contains('label', ' Monthly ').click();
    cy.wait(1000);
    cy.get('button[matsteppernext]:visible').first().click({ force: true }); 
    cy.get('.mat-mdc-select-placeholder').click({ force: true }); 
    cy.get('.mdc-list-item__primary-text').contains('Direct-debit').click();
    cy.get('button[matsteppernext]:visible').first().click({ force: true });
   // cy.contains('span', 'Confirm').click();

    cy.get('button.primary-btn.ml-small').contains('Create').click({ force: true });  // Tačno po klasi + text [web:65]


  });
});