describe('Consumer Cockpit - Add Transaction', () => {
  it('more_vert > Transactions > Add', () => {
    cy.visit('https://dev-cc.miticondev.net/#/admin/entity/1/dashboard');

   cy.fixture('credentials.json').then((creds) => {
      cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
      cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
    });
    cy.get('#loginBtn').click();
    cy.wait(12000);
    cy.url().should('include', 'dashboard');

        // 2. Consumer 360 Smart Search
    cy.visit('https://dev-cc.miticondev.net/#/entity/40261/consumers/smart-search-box');

    cy.wait(10000);
    // 1. More_vert ikona (Actions)
    cy.get('mat-icon.material-icons').contains('more_vert').click();
    
    // 2. Transactions meni item
    cy.contains('span.action_title', 'Profile').click();

    cy.get('button.mat-mdc-icon-button').click();

    cy.contains('span', 'Add to the Blacklist').click();

    cy.get('input[formcontrolname="reason"]').type('test');

    cy.contains('span', 'Confirm').click()

  });
});