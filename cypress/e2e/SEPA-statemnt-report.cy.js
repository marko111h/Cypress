describe('SEPA Import Tests', () => {
  it('SEPA import', () => {
    // 1. Login
    cy.visit('https://dev-cc.dev.gerniks.net/#/admin/entity/1/dashboard');
    cy.fixture('credentials.json').then((creds) => {
      cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
      cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
    });
    cy.get('#loginBtn').click();
    cy.wait(10000);
    cy.url().should('include', 'dashboard');

    // 2. Navigacija
    cy.contains('a',' Data ').click();
    cy.contains('a',' Data Import ').click();
    cy.contains('a',' SEPA Statement Report ').click();
    cy.get('button.mat-mdc-menu-trigger .mat-focus-indicator').click();
    cy.contains('span', 'Import SEPA statement file').click();

    // 3. Unique XML iz postojećeg fajla
    cy.readFile('cypress/fixtures/paid transaction.xml').then((xmlContent) => {
      const uniqueId = `stmt-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      const updatedXml = xmlContent.replace(/<Id>.*?<\/Id>/s, `<Id>${uniqueId}</Id>`);
      const tempPath = `cypress/fixtures/temp-${Date.now()}.xml`;
      cy.writeFile(tempPath, updatedXml);
      
      // 4. Upload
      cy.get('input#importFile').selectFile(tempPath, { force: true });
      cy.contains('button', 'Upload').click();
    });
  });
});
