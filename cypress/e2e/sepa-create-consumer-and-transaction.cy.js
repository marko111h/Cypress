import { faker } from '@faker-js/faker';

describe('SEPA - Kreiraj consumera i transakciju', () => {

  it('kreira consumera sa IBAN-om, dodaje transakciju i sprema Matching ID', () => {

    cy.on('uncaught:exception', () => false);

    // ─── 1. Generiši podatke ───
    const firstName  = faker.person.firstName();
    const lastName   = faker.person.lastName();
    const fullName   = `${firstName} ${lastName}`;
    const iban = 'DE' + Array.from({length: 20}, () => Math.floor(Math.random() * 10)).join('');

    cy.log(`👤 Consumer: ${fullName}`);
    cy.log(`🏦 IBAN: ${iban}`);

    // ─── 2. Login ───
    cy.visit('https://dev-cc.dev.gerniks.net/#/admin/entity/1/dashboard');

    cy.fixture('credentials.json').then((creds) => {
      cy.get('input[placeholder*="Username"]').clear().type(creds.admin.username);
      cy.get('input[placeholder*="Password"]').clear().type(creds.admin.password);
    });

    cy.get('#loginBtn').click();
    cy.wait(10000);
    cy.url().should('include', 'dashboard');

    // ─── 3. Kreiraj consumera ───
    cy.visit('https://dev-cc.dev.gerniks.net/#/entity/40261/consumers/smart-search-box');
    cy.wait(10000);

    cy.get('.mat-focus-indicator').first().click();
    cy.get('#consumer_360_consumer_cockpit-button-addConsumer').click();

    cy.get('#consumer360_create_consumer-radio_buton-typeCd_PERSON-input').check();
    cy.get('#consumer360_create_consumer-input-firstName').type(firstName);
    cy.get('#consumer360_create_consumer-input-lastName').type(lastName);
    cy.get('#consumer360_create_consumer-input-owner').type(fullName);
    cy.get('#consumer360_create_consumer-input-iban').type(iban);

    cy.wait(2000);
    cy.get('#consumer360_create_consumer-button-save')
      .should('not.be.disabled')
      .click();

    cy.contains(`${firstName} ${lastName}`).should('be.visible');
    cy.log(`✅ Consumer kreiran: ${fullName}`);
    cy.screenshot('consumer-created');

    // ─── 4. Dodaj transakciju ───
    cy.get('mat-icon.material-icons').contains('more_vert').click();
    cy.get('#consumer_360_consumer_cockpit-table-action-add-transaction').click();
    cy.wait(2000);

    cy.get('#mcc-fi-ctrlTransactionAmount').type('31.00');
    cy.get('#mcc-fi-ctrlDescription').type('SEPA test transaction');

    cy.get('#mcc-fi-input-ctrlPaymentDueDate').click();
    const todayDay = new Date().getDate().toString();
    cy.get('div[ngbdatepickerdayview]').contains(todayDay).click();

    cy.get('#fi-ctrlCollectTransaction-DIRECT_DEBIT-input').check();
    cy.get('button.btn-primary').contains('Add').click();

    cy.contains('Transaction added').should('be.visible');
    cy.log('✅ Transakcija kreirana');
    cy.screenshot('transaction-created');

    // ─── 5. Idi na Miticon Transactions tabelu i uzmi Matching ID ───
    cy.visit('https://dev-cc.dev.gerniks.net/#/admin/entity/1/dashboard');
    cy.wait(5000);
    cy.visit('https://dev-cc.dev.gerniks.net/#/entity/1/transactions/out');
    cy.wait(5000);

    // Nađi prvi red i uzmi Matching ID iz tačne kolone
    cy.get('tbody tr.mat-mdc-row').first()
      .find('.cdk-column-matchingId')
      .invoke('text')
      .then((matchingId) => {
        const cleanMatchingId = matchingId.trim();
        cy.log(`✅ Matching ID: ${cleanMatchingId}`);

        // ─── 6. Spremi podatke u JSON ───
        cy.writeFile('cypress/fixtures/sepa-test-data.json', {
          iban:       iban,
          matchingId: cleanMatchingId,
          firstName:  firstName,
          lastName:   lastName,
          amount:     '31.00',
          createdAt:  new Date().toISOString(),
        });

        cy.log(`✅ Podaci spremljeni u sepa-test-data.json`);
        cy.screenshot('sepa-test-data-saved');
      });

  });

});