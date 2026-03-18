describe('SEPA Import & Auto Matching', () => {

  it('upload SEPA XML i provjeri auto matching', () => {

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

    // ─── 2. Čitaj podatke iz sepa-test-data.json ───
    cy.fixture('sepa-test-data.json').then((testData) => {

      const { iban, matchingId, firstName, lastName } = testData;
      cy.log(`📋 Koristim podatke: IBAN=${iban}, MatchingID=${matchingId}, Consumer=${firstName} ${lastName}`);

      // ─── 3. Generiši unique XML ───
      cy.readFile('cypress/fixtures/paid transaction.xml').then((xmlContent) => {

        const timestamp = Date.now();
        const today = new Date().toISOString().split('T')[0];
        const todayDateTime = new Date().toISOString().replace(/\.\d{3}Z/, 'Z');

        // MITICON IBAN ostaje fiksan — mijenjamo samo DbtrAcct IBAN i Ustrd
        let updatedXml = xmlContent
          // Unique IDs
          .replace(/<Id>UNIQUE_STMT_ID<\/Id>/, `<Id>stmt-${timestamp}</Id>`)
          .replace(/<MsgId>.*?<\/MsgId>/, `<MsgId>msg-${timestamp}</MsgId>`)
          .replace(/<AcctSvcrRef>.*?<\/AcctSvcrRef>/g, `<AcctSvcrRef>ref-${timestamp}</AcctSvcrRef>`)
          // Današnji datum
          .replace(/<CreDtTm>.*?<\/CreDtTm>/g, `<CreDtTm>${todayDateTime}</CreDtTm>`)
          .replace(/<BookgDt>\s*<Dt>.*?<\/Dt>\s*<\/BookgDt>/g, `<BookgDt><Dt>${today}</Dt></BookgDt>`)
          // Samo DbtrAcct IBAN (consumer IBAN) — NE mijenjaj Acct/CdtrAcct IBAN (Miticon)
          .replace(/<DbtrAcct>\s*<Id>\s*<IBAN>.*?<\/IBAN>/g, `<DbtrAcct><Id><IBAN>${iban}</IBAN>`)
          // Matching ID — oba Ntry dobijaju isti matchingId
          .replace(/<Ustrd>.*?<\/Ustrd>/g, `<Ustrd>${matchingId}</Ustrd>`)
          // Debtor ime
          .replace(/<Nm>Goran<\/Nm>/g, `<Nm>${firstName} ${lastName}</Nm>`);

        const tempPath = `cypress/fixtures/temp-${timestamp}.xml`;
        cy.writeFile(tempPath, updatedXml);
        cy.log(`✅ Generisan XML – IBAN: ${iban}, MatchingID: ${matchingId}`);

        // ─── 4. Idi na SEPA Statement Report ───
        cy.visit('https://dev-cc.dev.gerniks.net/#/entity/1/bank-module/star-money');
        cy.wait(5000);

        // ─── 5. Otvori Import meni ───
        cy.get('button.no-hover-btn').click({ force: true });
        cy.wait(1000);
        cy.contains('Import SEPA statement file').click();
        cy.wait(2000);

        // ─── 6. Upload XML ───
        cy.get('input#importFile').selectFile(tempPath, { force: true });
        cy.wait(1000);
        cy.get('#sepa_statement_report_import-button-actUpload').click();
        cy.wait(5000);

        cy.log('✅ XML uploadovan');
        cy.screenshot('sepa-upload-done');

        // ─── 7. Idi na Financial Activity & Matching ───
        cy.visit('https://dev-cc.dev.gerniks.net/#/entity/1/bank-module/incoming-payments');
        cy.wait(5000);

        // ─── 8. Provjeri da se pojavio payment sa imenom consumera ───
        cy.get('tbody tr').first().within(() => {
          cy.contains(`${firstName}`).should('exist');
          cy.log(`✅ Payment pronađen u tabeli za: ${firstName} ${lastName}`);
        });

        cy.screenshot('financial-activity-after-import');

        // ─── 9. Provjeri da je automatski matched ───
        cy.get('tbody tr').each(($row) => {
          const description = $row.find('td').eq(3).text();

          if (description.includes(matchingId)) {
            cy.wrap($row).find('td').last().invoke('text').then((status) => {
              cy.log(`✅ Matching status: ${status.trim()}`);
              expect(status.trim()).to.eq('Matched');
            });
            cy.wrap($row).screenshot('matched-payment-row');
          }
        });

        cy.screenshot('sepa-matching-complete');
      });
    });
  });
});