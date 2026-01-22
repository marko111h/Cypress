const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
     experimentalRunAllSpecs: true,  // ✅ Omogućava Run All Specs dugme
    baseUrl: 'https://dev-cc.miticondev.net',  // Skraćuje cy.visit('#/path')
    defaultCommandTimeout: 15000,    // Za  wait(12000)
    video: true,                     // Snima video grešaka
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      
    },
  },
});
