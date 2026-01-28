describe('Consumer Cockpit - Add Transaction', () => {
  it('more_vert > Transactions > Add', () => {
    cy.visit('https://dev-cc.miticondev.net/#/admin/entity/1/dashboard');

  cy.fixture('credentials.json').then((creds) => {
      cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
      cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
    });
    cy.get('#loginBtn').click();
    cy.wait(9000);
    cy.url().should('include', 'dashboard');

        // 2. Consumer 360 Smart Search
    cy.visit('https://dev-cc.miticondev.net/#/entity/40261/consumers/smart-search-box');

    cy.wait(10000);
    // 1. More_vert ikona (Actions)
    cy.get('mat-icon.material-icons').contains('more_vert').click();
    
    // 2. Transactions meni item
    cy.get('#consumer_360_consumer_cockpit-table-action-add-transaction').click();
    
    // 3. Čekaj 6s formu
    cy.wait(2000);
    
    // 4. Amount
    cy.get('#mcc-fi-ctrlTransactionAmount').type('100.50');
    
    // 5. Description
    cy.get('#mcc-fi-ctrlDescription').type('Test transaction description');
    
    // 6. Due date = današnji
    cy.get('#mcc-fi-input-ctrlPaymentDueDate').click();
    const todayDay = new Date().getDate().toString(); 
    cy.get('div[ngbdatepickerdayview]').contains(todayDay).click();

      // 3. Potvrdi (ako treba)
   // cy.get('.datepicker-close').click();  // ILI auto zatvori
    
    // 7. Collect radio (DIRECT_DEBIT)
    cy.get('#fi-ctrlCollectTransaction-DO_NOT_COLLECT-input').check();
    
    // 8. Save
    cy.get('button.btn-primary').contains('Add').click();
    
    // Success
    cy.contains('Transaction added').should('be.visible');
  });
});