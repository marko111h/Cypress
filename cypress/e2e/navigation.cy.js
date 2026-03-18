describe('Navigation - provjera svih meni stavki', () => {

  beforeEach(() => {
    cy.on('uncaught:exception', () => false);

    cy.fixture('credentials.json').then((creds) => {
      cy.session(creds.admin.username, () => {
        cy.visit('https://dev-cc.dev.gerniks.net/#/admin/entity/1/dashboard');
        cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
        cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
        cy.get('#loginBtn').click();
        cy.wait(9000);
        cy.url().should('include', 'dashboard');
      });
    });

    cy.visit('https://dev-cc.dev.gerniks.net/#/admin/entity/1/dashboard');
    cy.wait(3000);
  });

  // ─────────────────────────────────────────────
  // CONSUMER 360
  // ─────────────────────────────────────────────
  it('Consumer 360 > Consumer Cockpit', () => {
    cy.contains('a', 'Consumer 360').click();
    cy.wait(500);
    cy.contains('a', 'Consumer Cockpit').click();
    cy.wait(2000);
    cy.url().should('include', 'consumers');
    cy.screenshot('nav-consumer-cockpit');
  });

  it('Consumer 360 > Contracts 360', () => {
    cy.contains('a', 'Consumer 360').click();
    cy.wait(500);
    cy.contains('a', 'Contracts 360').click();
    cy.wait(2000);
    cy.url().should('include', 'contracts');
    cy.screenshot('nav-contracts-360');
  });

  it('Consumer 360 > Blacklist', () => {
    cy.contains('a', 'Consumer 360').click();
    cy.wait(500);
    cy.contains('a', 'Blacklist').click();
    cy.wait(2000);
    cy.url().should('include', 'blacklist');
    cy.screenshot('nav-blacklist');
  });

  // ─────────────────────────────────────────────
  // DATA > DATA IMPORT
  // ─────────────────────────────────────────────
  it('Data > SEPA Statement Report', () => {
    cy.contains('a', 'Data').click();
    cy.wait(500);
    cy.contains('a', 'Data Import').click();
    cy.wait(500);
    cy.contains('a', 'SEPA Statement Report').click();
    cy.wait(2000);
    cy.url().should('include', 'star-money');
    cy.screenshot('nav-sepa-statement-report');
  });

  it('Data > Financial Activity & Matching', () => {
    cy.contains('a', 'Data').click();
    cy.wait(500);
    cy.contains('a', 'Data Import').click();
    cy.wait(500);
    cy.contains('a', 'Financial Activity & Matching').click();
    cy.wait(2000);
    cy.screenshot('nav-financial-activity');
  });

  it('Data > Import Data', () => {
    cy.contains('a', 'Data').click();
    cy.wait(500);
    cy.contains('a', 'Data Import').click();
    cy.wait(500);
    cy.contains('a', 'Import Data').click();
    cy.wait(2000);
    cy.screenshot('nav-import-data');
  });

  it('Data > Import Mapping', () => {
    cy.contains('a', 'Data').click();
    cy.wait(500);
    cy.contains('a', 'Data Import').click();
    cy.wait(500);
    cy.contains('a', 'Import Mapping').click();
    cy.wait(2000);
    cy.screenshot('nav-import-mapping');
  });

  it('Data > Transactions Import (SEPA)', () => {
    cy.contains('a', 'Data').click();
    cy.wait(500);
    cy.contains('a', 'Data Import').click();
    cy.wait(500);
    cy.contains('a', 'Transactions Import (SEPA)').click();
    cy.wait(2000);
    cy.screenshot('nav-transactions-import-sepa');
  });

  // ─────────────────────────────────────────────
  // DATA > DATA EXPORT
  // ─────────────────────────────────────────────
  it('Data > SEPA Direct Debit', () => {
    cy.contains('a', 'Data').click();
    cy.wait(500);
    cy.contains('a', 'Data Export').click();
    cy.wait(500);
    cy.contains('a', 'SEPA Direct Debit').click();
    cy.wait(2000);
    cy.screenshot('nav-sepa-direct-debit');
  });

  it('Data > Payout', () => {
    cy.contains('a', 'Data').click();
    cy.wait(500);
    cy.contains('a', 'Data Export').click();
    cy.wait(500);
    cy.contains('a', 'Payout').click();
    cy.wait(2000);
    cy.screenshot('nav-payout');
  });

  it('Data > Inkasso Export', () => {
    cy.contains('a', 'Data').click();
    cy.wait(500);
    cy.contains('a', 'Data Export').click();
    cy.wait(500);
    cy.contains('a', 'Inkasso Export').click();
    cy.wait(2000);
    cy.screenshot('nav-inkasso-export');
  });

  it('Data > Export Data', () => {
    cy.contains('a', 'Data').click();
    cy.wait(500);
    cy.contains('a', 'Data Export').click();
    cy.wait(500);
    cy.contains('a', 'Export Data').click();
    cy.wait(2000);
    cy.screenshot('nav-export-data');
  });

  // ─────────────────────────────────────────────
  // TRANSACTIONS
  // ─────────────────────────────────────────────
  it('Transactions > Overview', () => {
    cy.visit('https://dev-cc.dev.gerniks.net/#/entity/1/transactions/in');
    cy.wait(2000);
    cy.url().should('include', 'transactions');
    cy.screenshot('nav-transactions-overview');
  });

  it('Transactions > Statements', () => {
    cy.visit('https://dev-cc.dev.gerniks.net/#/entity/1/transactions/statements');
    cy.wait(2000);
    cy.url().should('include', 'statements');
    cy.screenshot('nav-statements');
  });

  // ─────────────────────────────────────────────
  // ARTICLES
  // ─────────────────────────────────────────────
  it('Articles', () => {
    cy.contains('a', 'Articles').click();
    cy.wait(2000);
    cy.url().should('include', 'products');
    cy.screenshot('nav-articles');
  });

  // ─────────────────────────────────────────────
  // ORDER MANAGEMENT
  // ─────────────────────────────────────────────
  it('Order Management > Invoices', () => {
    cy.contains('a', 'Order Management').click();
    cy.wait(500);
    cy.contains('a', 'Invoices').click();
    cy.wait(2000);
    cy.url().should('include', 'invoices');
    cy.screenshot('nav-invoices');
  });

  // ─────────────────────────────────────────────
  // PROCESSES
  // ─────────────────────────────────────────────
  it('Processes > Processes Overview', () => {
    cy.contains('a', 'Processes').click();
    cy.wait(500);
    cy.contains('a', 'Processes Overview').click();
    cy.wait(2000);
    cy.screenshot('nav-processes-overview');
  });

  it('Processes > PDF Templates', () => {
    cy.contains('a', 'Processes').click();
    cy.wait(500);
    cy.contains('a', 'PDF Templates').click();
    cy.wait(2000);
    cy.screenshot('nav-pdf-templates');
  });

  it('Processes > Email Templates', () => {
    cy.contains('a', 'Processes').click();
    cy.wait(500);
    cy.contains('a', 'Email Templates').click();
    cy.wait(2000);
    cy.screenshot('nav-email-templates');
  });

  // ─────────────────────────────────────────────
  // BOOKKEEPING
  // ─────────────────────────────────────────────
  it('Bookkeeping > Reports & Downloads', () => {
    cy.contains('a', 'Bookkeeping').click();
    cy.wait(500);
    cy.contains('a', 'Reports & Downloads').click();
    cy.wait(2000);
    cy.screenshot('nav-reports-downloads');
  });

  // ─────────────────────────────────────────────
  // SETTINGS
  // ─────────────────────────────────────────────
  it('Settings > Price Lists', () => {
    cy.contains('a', 'Settings').click();
    cy.wait(500);
    cy.contains('a', 'Price Lists').click();
    cy.wait(500);
    cy.contains('a', 'Price Lists').last().click();
    cy.wait(2000);
    cy.screenshot('nav-price-lists');
  });

  it('Settings > Pricelist Templates', () => {
    cy.contains('a', 'Settings').click();
    cy.wait(500);
    cy.contains('a', 'Price Lists').click();
    cy.wait(500);
    cy.contains('a', 'Pricelist Templates').click();
    cy.wait(2000);
    cy.screenshot('nav-pricelist-templates');
  });

  it('Settings > Entity Workspace', () => {
    cy.contains('a', 'Settings').click();
    cy.wait(500);
    cy.contains('a', 'Entity').click();
    cy.wait(500);
    cy.contains('a', 'Entity Workspace').click();
    cy.wait(2000);
    cy.screenshot('nav-entity-workspace');
  });

  it('Settings > Entity Contract', () => {
    cy.contains('a', 'Settings').click();
    cy.wait(500);
    cy.contains('a', 'Entity').click();
    cy.wait(500);
    cy.contains('a', 'Entity Contract').click();
    cy.wait(2000);
    cy.screenshot('nav-entity-contract');
  });

  it('Settings > Entity Profile', () => {
    cy.contains('a', 'Settings').click();
    cy.wait(500);
    cy.contains('a', 'Entity').click();
    cy.wait(500);
    cy.contains('a', 'Entity Profile').click();
    cy.wait(2000);
    cy.screenshot('nav-entity-profile');
  });

  it('Settings > Country Setup', () => {
    cy.contains('a', 'Settings').click();
    cy.wait(500);
    cy.contains('a', 'Country Setup').click();
    cy.wait(2000);
    cy.screenshot('nav-country-setup');
  });

  it('Settings > System Users', () => {
    cy.contains('a', 'Settings').click();
    cy.wait(500);
    cy.contains('a', 'User And Roles').click();
    cy.wait(500);
    cy.contains('a', 'System Users').click();
    cy.wait(2000);
    cy.on('uncaught:exception', () => false);
    cy.screenshot('nav-system-users');
  });

  it('Settings > Roles', () => {
    cy.contains('a', 'Settings').click();
    cy.wait(500);
    cy.contains('a', 'User And Roles').click();
    cy.wait(500);
    cy.contains('a', 'Roles').click();
    cy.wait(2000);
    cy.screenshot('nav-roles');
  });

  it('Settings > Automatic Jobs', () => {
    cy.contains('a', 'Settings').click();
    cy.wait(500);
    cy.contains('a', 'Automatic Jobs').click();
    cy.wait(2000);
    cy.screenshot('nav-automatic-jobs');
  });

  it('Settings > Payment services > EBICS', () => {
    cy.contains('a', 'Settings').click();
    cy.wait(500);
    cy.contains('a', 'Payment services').click();
    cy.wait(500);
    cy.contains('a', 'EBICS').click();
    cy.wait(2000);
    cy.screenshot('nav-ebics');
  });

});