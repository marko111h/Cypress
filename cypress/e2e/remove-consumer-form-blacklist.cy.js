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

    
    cy.visit('https://dev-cc.miticondev.net/#/entity/40261/out-factoring/blacklist');
    cy.wait(5000);

    cy.get('table .icon-text-table-cell').first().click();
    
    cy.get('input[formcontrolname="reason"]').type('test');

    cy.contains('button', 'Confirm').click();

   ooo

  });
});