const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // ✅ Uklonjen baseUrl - svaki test koristi pun URL
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {},
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
  },
});