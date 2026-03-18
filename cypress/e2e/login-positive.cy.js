describe('Login - Pozitivni scenariji', () => {

  beforeEach(() => {
    cy.visit('https://dev-cc.dev.gerniks.net/#/auth/login');
    cy.get('input[placeholder*="Username"]').should('be.visible');
  });

  it('Uspješan login - API vraca 200 i redirect na dashboard', () => {
    cy.fixture('credentials.json').then((creds) => {
      cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
      cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
    });

    cy.get('#loginBtn').should('not.be.disabled');

    cy.intercept('POST', '/api/oauth/token').as('loginRequest');
    cy.get('#loginBtn').click();

    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.wait(9000);
    cy.url().should('include', 'dashboard');
    cy.screenshot('login-success-dashboard');
  });

  it('Nakon logina pokusaj otvoriti login stranicu - redirect na dashboard', () => {
    cy.fixture('credentials.json').then((creds) => {
      cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
      cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
    });

    cy.get('#loginBtn').click();
    cy.wait(9000);
    cy.url().should('include', 'dashboard');

    // Pokušaj otvoriti login stranicu ponovo
    cy.visit('https://dev-cc.dev.gerniks.net/#/auth/login');
    cy.wait(3000);

    // Mora biti redirectovan na dashboard jer je već ulogovan
    cy.url().should('include', 'dashboard');
    cy.screenshot('login-already-logged-in-redirect');
  });

});