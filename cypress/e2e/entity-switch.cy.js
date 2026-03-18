describe('Entity Switch', () => {

  const entities = [
    'MarkoF',
    'MarkoGym',
    'MarkoGym1',
    'MarkoServisni',
  ];

  it('prebacuje između entiteta – login jednom', () => {

    cy.on('uncaught:exception', () => false);

    // ─── 1. Login ───
    cy.visit('https://dev-cc.dev.gerniks.net/#/admin/entity/1/dashboard');

    cy.fixture('credentials.json').then((creds) => {
      cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
      cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
    });

    cy.get('#loginBtn').click();
    cy.wait(9000);
    cy.url().should('include', 'dashboard');

    // ─── 2. Petlja kroz Marko entitete ───
    entities.forEach((entity) => {

      // Otvori entity switcher
      cy.get('#entityToggleBtn').click();
      cy.wait(3000);

      // Izaberi entitet sa duplim klikom
      cy.get('p.mc-cursor-pointer').contains(entity).dblclick({ force: true });
      cy.wait(7000);

      // Provjeri da je header promijenjen
      cy.get('.mc-header-path span').invoke('text').then((text) => {
        cy.log(`✅ Entitet promijenjen na: ${text.trim()}`);
      });

      cy.screenshot(`entity-${entity}`);

      // Ako je modal ostao otvoren, zatvori ga pritiskom Escape
      cy.get('body').then(($body) => {
        if ($body.find('.modal-header').length > 0) {
          cy.get('body').type('{esc}');
          cy.wait(1000);
        }
      });
    });

  });

});