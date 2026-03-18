describe('Language Switch', () => {

  const languages = [
    { name: 'Deutsch',  code: 'de' },
    { name: 'Español',  code: 'es' },
    { name: 'Czech',    code: 'cs' },
    { name: 'French',   code: 'fr' },
    { name: 'Italian',  code: 'it' },
    { name: 'Dutch',    code: 'nl' },
    { name: 'Polish',   code: 'pl' },
    { name: 'Slovak',   code: 'sk' },
    { name: 'Swedish',  code: 'sv' },
    { name: 'English',  code: 'en' },
  ];

  it('mijenja jezik kroz sve opcije – login jednom', () => {

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

    // ─── 2. Petlja kroz sve jezike ───
    languages.forEach(({ name, code }) => {

      // Otvori language dropdown
      cy.get('#languageDropdown').click();
      cy.wait(1000);

      // Izaberi jezik
      cy.get('a.language-link').contains(name).click({ force: true });
      cy.wait(4000);

      // Provjeri da je jezik promijenjen – dugme pokazuje novi kod
      cy.get('#languageDropdown')
        .invoke('text')
        .then((text) => {
          expect(text.trim().toLowerCase()).to.include(code);
        });

      cy.log(`✅ Jezik promijenjen na: ${name} (${code})`);
      cy.screenshot(`language-${code}`);
    });

  });

});