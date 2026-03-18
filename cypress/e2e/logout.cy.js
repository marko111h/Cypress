describe('Logout', () => {

  it('Uspješan logout - redirect na login stranicu', () => {

    // ─── 1. Login ───
    cy.visit('https://dev-cc.dev.gerniks.net/#/admin/entity/1/dashboard');

    cy.fixture('credentials.json').then((creds) => {
      cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
      cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
    });

    cy.get('#loginBtn').click();
    cy.wait(9000);
    cy.url().should('include', 'dashboard');

    // ─── 2. Klikni logout dugme ───
    cy.get('a#logout').click();
    cy.wait(3000);

    // ─── 3. Provjeri da si na login stranici ───
    cy.url().should('include', 'auth/login');
    cy.get('input[placeholder*="Username"]').should('be.visible');
    cy.screenshot('logout-success');

  });

});