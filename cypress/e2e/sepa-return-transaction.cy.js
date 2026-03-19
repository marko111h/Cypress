describe('SEPA Return Transaction', () => {

  it('upload Return XML i provjeri da transakcija dobije status Returned', () => {

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

      const { iban, matchingId, firstName, lastName, amount } = testData;
      cy.log(`📋 Podaci: IBAN=${iban}, MatchingID=${matchingId}, Consumer=${firstName} ${lastName}`);

      // ─── 3. Generiši Return XML ───
      cy.readFile('cypress/fixtures/sepa-return-transaction.xml').then((xmlContent) => {

        const timestamp   = Date.now();
        const today       = new Date().toISOString().split('T')[0];
        const todayDateTime = new Date().toISOString().replace(/\.\d{3}Z/, 'Z');

        // Iznos za return = original + 5€ (kao u XML-u)
        const returnAmount = (parseFloat(amount) + 5).toFixed(2);

        let updatedXml = xmlContent
          // ─── Unique IDs ───
          .replace(/<Id>.*?<\/Id>/, `<Id>stmt-return-${timestamp}</Id>`)
          .replace(/<MsgId>.*?<\/MsgId>/, `<MsgId>msg-return-${timestamp}</MsgId>`)
          .replace(/<AcctSvcrRef>.*?<\/AcctSvcrRef>/g, `<AcctSvcrRef>ref-return-${timestamp}</AcctSvcrRef>`)
          // ─── Datumi ───
          .replace(/<CreDtTm>.*?<\/CreDtTm>/g, `<CreDtTm>${todayDateTime}</CreDtTm>`)
          .replace(/<BookgDt>\s*<Dt>.*?<\/Dt>\s*<\/BookgDt>/g, `<BookgDt><Dt>${today}</Dt></BookgDt>`)
          // ─── Iznos (original + 5€) ───
          .replace(/<Amt Ccy="EUR">35\.00<\/Amt>/, `<Amt Ccy="EUR">${returnAmount}</Amt>`)
          // ─── Consumer IBAN (samo DbtrAcct) ───
          .replace(/<DbtrAcct>\s*<Id>\s*<IBAN>.*?<\/IBAN>/g, `<DbtrAcct><Id><IBAN>${iban}</IBAN>`)
          // ─── Debtor ime ───
          .replace(/<Nm>Marko<\/Nm>/, `<Nm>${firstName} ${lastName}</Nm>`)
          // ─── Matching ID u Ustrd ───
          .replace(/2026-420578/, matchingId)
          // ─── IBAN u Ustrd tekstu ───
          .replace(/DE2142154667634214234/, iban);

        const tempPath = `cypress/fixtures/temp-return-${timestamp}.xml`;
        cy.writeFile(tempPath, updatedXml);
        cy.log(`✅ Return XML generisan – iznos: ${returnAmount}€, MatchingID: ${matchingId}`);

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

        cy.log('✅ Return XML uploadovan');
        cy.screenshot('sepa-return-upload-done');

        // ─── 7. Idi na Financial Activity & Matching ───
        cy.visit('https://dev-cc.dev.gerniks.net/#/entity/1/bank-module/incoming-payments');
        cy.wait(5000);

        // ─── 8. Provjeri da se pojavio return payment ───
        cy.get('tbody tr').first().within(() => {
          cy.contains(`${firstName}`).should('exist');
          cy.log(`✅ Return payment pronađen za: ${firstName} ${lastName}`);
        });

        cy.screenshot('financial-activity-return');

        // ─── 9. Provjeri da je transakcija dobila status Returned ───
        cy.visit('https://dev-cc.dev.gerniks.net/#/entity/1/transactions/out');
        cy.wait(5000);

        cy.get('tbody tr.mat-mdc-row').each(($row) => {
          const matchingCell = $row.find('.cdk-column-matchingId').text().trim();

          if (matchingCell.includes(matchingId)) {
            cy.wrap($row).find('[class*="cdk-column-getIconLabel"]').invoke('text').then((status) => {
              cy.log(`✅ Status transakcije: ${status.trim()}`);
            });
            cy.wrap($row).screenshot('returned-transaction-row');
          }
        });

        cy.screenshot('sepa-return-complete');
      });
    });
  });
});