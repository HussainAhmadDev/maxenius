// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')
// This will handle uncaught exceptions globally
Cypress.on("uncaught:exception", err => {
  // Handle the specific error related to product quantity
  if (err.message.includes("Product quantity has been returned/shipped already")) {
    cy.log("Custom Error Handling: ", err.message);
    // Return false to prevent Cypress from failing the test
    return false;
  }
  // Let other errors fail the test
  return true;
});
