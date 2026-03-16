// Test za CC-2984: Manual SEPA export sa "Group by Consumer ID" opcijom

describe('SEPA Manual Export - Group by Consumer ID (CC-2984)', () => {

  beforeEach(() => {
    cy.login();
  });

  it('Manual SEPA export BEZ "Group by Consumer ID" - standardni flow', () => {
    cy.visit('https://dev-cc.dev.gerniks.net/#/entity/40261/out-factoring/transactions');

    // Filter po statusu Accepted
    cy.contains('span', 'Filters').click();
    cy.get('mat-select[formcontrolname="status"]').click();
    cy.contains('mat-option', 'Accepted').click();
    cy.contains('button', 'Filter').click();
    cy.wait(2000);

    // Selektuj sve i klikni Export SEPA
    cy.get('mat-checkbox').first().click();
    cy.contains('button', 'Action').click();
    cy.contains('span', 'Export SEPA').click();

    // Provjeri da je modal otvoren
    cy.get('mat-dialog-container').should('be.visible');

    // Provjeri da checkbox "Group transaction by consumer ID" postoji ali nije checked
    cy.get('mat-checkbox').contains('Group transaction by consumer ID')
      .should('exist')
      .find('input').should('not.be.checked');

    // Zatvori modal
    cy.contains('button', 'Cancel').click();
  });

  it('Manual SEPA export SA "Group by Consumer ID" - AGG flow (CC-2984)', () => {
    cy.visit('https://dev-cc.dev.gerniks.net/#/entity/40261/out-factoring/transactions');

    // Filter po statusu Accepted
    cy.contains('span', 'Filters').click();
    cy.get('mat-select[formcontrolname="status"]').click();
    cy.contains('mat-option', 'Accepted').click();
    cy.contains('button', 'Filter').click();
    cy.wait(2000);

    // Selektuj transakcije i otvori Export SEPA
    cy.get('mat-checkbox').first().click();
    cy.contains('button', 'Action').click();
    cy.contains('span', 'Export SEPA').click();

    cy.get('mat-dialog-container').should('be.visible');

    // Ukljuci "Group by Consumer ID"
    cy.contains('mat-checkbox', 'Group transaction by consumer ID').click();
    cy.contains('mat-checkbox', 'Group transaction by consumer ID')
      .find('input').should('be.checked');

    // Popuni obavezna polja (datum)
    cy.get('input[formcontrolname="executionDate"]').click();
    const todayDay = new Date().getDate().toString();
    cy.get('.mat-calendar-body-cell-content').contains(todayDay).click();

    // Klikni Export
    cy.contains('button', 'Export').click();

    // Provjeri info poruku / link na XML fajl
    cy.contains('SEPA').should('be.visible');
    cy.screenshot('sepa-manual-export-group-by-consumer');
  });

});