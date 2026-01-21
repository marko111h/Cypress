describe('My-Factura: Login > Consumer Create', () => {
  it('Login i create Person consumera', () => {
    // 1. Login
    cy.visit('https://dev-cc.miticondev.net/#/admin/entity/1/dashboard');

    const firstName = 'Aaaa';
    const lastName = 'Dj';
    const companyName = 'Fit+ M';
    const fullName = `${firstName} ${lastName}`;
    const iban = 'DE' + Math.floor(Math.random() * 10000000000);  // DE + 10 cifara

    cy.fixture('credentials.json').then((creds) => {
      cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
      cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
    });
    cy.get('#loginBtn').click();
    cy.wait(12000);
    cy.url().should('include', 'dashboard');
    
    // 2. Consumer 360 Smart Search
    cy.visit('https://dev-cc.miticondev.net/#/entity/40261/consumers/smart-search-box');

    cy.wait(12000);
    
    cy.get('.mat-focus-indicator').first().click();  // Otvori meni (1 element)
    cy.get('#consumer_360_consumer_cockpit-button-addConsumer').click();  // Tačno dugme
           
       // 1. Person radio
    cy.get('#consumer360_create_consumer-radio_buton-typeCd_COMPANY-input').check();

       // 2. Ime + Prezime i CompanyName
    cy.get('#consumer360_create_consumer-input-companyName').type(companyName);
    cy.get('#consumer360_create_consumer-input-firstName').type(firstName);
    cy.get('#consumer360_create_consumer-input-lastName').type(lastName);


     // 3. Account Owner = ime + prezime
    cy.get('#consumer360_create_consumer-input-owner').type(fullName);
    // 4. Nemački IBAN
    cy.get('#consumer360_create_consumer-input-iban').type(iban);

      // 5. Sačekaj 5s + Create (čekaj enabled)
    cy.wait(2000);
    cy.get('#consumer360_create_consumer-button-save')
      .should('not.be.disabled', { timeout: 10000 })
      .click();
    
    // Success
    cy.contains(`${firstName} ${lastName}`).should('be.visible');

  });
});
