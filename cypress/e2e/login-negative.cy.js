describe('Login - Negativni scenariji', () => {

  beforeEach(() => {
    cy.visit('https://dev-cc.dev.gerniks.net/#/auth/login');
    cy.get('input[placeholder*="Username"]').should('be.visible');
  });

  it('Prazno korisnicko ime - Log in dugme treba biti disabled', () => {
    cy.get('input[placeholder*="Username"]').clear();
    cy.get('input[placeholder*="Password"]').clear().type('NoviAdmin!2020');

    // Dugme mora biti disabled dok username nije popunjen
    cy.get('#loginBtn').should('be.disabled');
    cy.screenshot('login-empty-username-btn-disabled');
  });

  it('Prazna lozinka - Log in dugme treba biti disabled', () => {
    cy.get('input[placeholder*="Username"]').clear().type('admin');
    cy.get('input[placeholder*="Password"]').clear();

    // Dugme mora biti disabled dok password nije popunjen
    cy.get('#loginBtn').should('be.disabled');
    cy.screenshot('login-empty-password-btn-disabled');
  });

  it('Oba polja prazna - Log in dugme treba biti disabled', () => {
    cy.get('input[placeholder*="Username"]').clear();
    cy.get('input[placeholder*="Password"]').clear();

    cy.get('#loginBtn').should('be.disabled');
    cy.screenshot('login-both-empty-btn-disabled');
  });

  it('Pogresna lozinka - Log in dugme je enabled, ali login ne prolazi', () => {
    cy.get('input[placeholder*="Username"]').clear().type('admin');
    cy.get('input[placeholder*="Password"]').clear().type('WrongPassword123!');

    // Intercept API poziv da proverimo da je vratio 401/400
    cy.intercept('POST', '/api/oauth/token').as('loginRequest');

    cy.get('#loginBtn').should('not.be.disabled').click();

    // Sacekaj API odgovor
    cy.wait('@loginRequest').then((interception) => {
      // API mora da vrati gresku (401 Unauthorized ili 400 Bad Request)
      expect(interception.response.statusCode).to.be.oneOf([400, 401]);
    });

    // Mora ostati na login stranici
    cy.url().should('include', 'auth/login');
    cy.screenshot('login-wrong-password-error');
  });

  it('Nepostojeci korisnik - API vraca gresku', () => {
    cy.intercept('POST', '/api/oauth/token').as('loginRequest');

    cy.get('input[placeholder*="Username"]').clear().type('nonexistentuser999');
    cy.get('input[placeholder*="Password"]').clear().type('SomePassword123!');

    cy.get('#loginBtn').should('not.be.disabled').click();

    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([400, 401]);
    });

    cy.url().should('include', 'auth/login');
    cy.screenshot('login-nonexistent-user-error');
  });

});