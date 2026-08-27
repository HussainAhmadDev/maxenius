/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/cypress/add-commands";
import "cypress-wait-until";

Cypress.Commands.add(
  "login",
  ({ username, password } = { username: "test@most.win", password: "20Launch21!" }) => {
    cy.visit("localhost:3000/login");
    cy.findByLabelText(/email/i).type(username);
    cy.findByLabelText(/password/i).type(password);
    cy.findByRole("button", { name: /sign in/i }).click();
  }
);
