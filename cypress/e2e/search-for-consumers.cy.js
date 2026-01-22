describe('My-Factura: Searching consumer by IBAN', () => {
  it('Login and Searching consumer by IBAN', () => {
    // 1. Login
    cy.visit('https://dev-cc.miticondev.net/#/admin/entity/1/dashboard');

    cy.fixture('credentials.json').then((creds) => {
      cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
      cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
    });
    cy.get('#loginBtn').click();
    cy.wait(10000);
    cy.url().should('include', 'dashboard');
    
    // 2. Consumer 360 Smart Search
    cy.contains('a','Consumer 360').click() 
    cy.contains('a','Consumer Cockpit' ).click();
    cy.contains('span', 'Filters').click();
    cy.fixture('search-data.json').then((data) => {
     data.searches.forEach((search, index) => {
        cy.get('input[formControlName="search"]').clear().type(`${search.value}{enter}`)
        cy.contains('.mdc-button__label', 'Filter').click(); 
        cy.wait(2000);
        // ✅ Screenshot kao dokaz posle svakog search-a
        cy.screenshot(`search-${search.field}-${index + 1}`);
     });
    });


    cy.contains('.mdc-button__label', 'Filter').click();

  
  });
});
