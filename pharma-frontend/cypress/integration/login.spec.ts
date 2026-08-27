/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("localhost:3000/login");
  });

  it("Has the correct UI", () => {
    cy.findByText(/sign in to your account/i).should("exist");

    cy.findByLabelText(/email/i).should("not.be.null");

    cy.findByLabelText(/password/i).should("not.be.null");

    cy.findByRole("link", { name: /forgot password/i }).should("not.be.null");

    cy.findByRole("switch", { name: /stay signed in/i }).should("not.be.null");

    cy.findByRole("button", { name: /sign in/i })
      .should("exist")
      .should("be.visible");

    cy.findByRole("button", { name: /sign up/i })
      .should("exist")
      .should("be.visible");
  });

  it("Email and Password is required", () => {
    cy.findByRole("button", { name: /sign in/i }).click();

    cy.findByText(/email is required/i).should("not.be.null");

    cy.findByText(/password is required/i).should("not.be.null");

    cy.findByLabelText(/email/i)
      .should("exist")
      .should("be.empty")
      .type("test@most.win")
      .should("have.value", "test@most.win");

    cy.findByText(/email is required/i).should("not.exist");

    cy.findByLabelText(/password/i)
      .should("exist")
      .should("be.empty")
      .type("20Launch21!")
      .should("have.value", "20Launch21!");

    cy.findByText(/password is required/i).should("not.exist");
  });

  it("Login with correct credentials works", () => {
    cy.findByLabelText(/email/i)
      .should("exist")
      .should("be.empty")
      .type("test@most.win")
      .should("have.value", "test@most.win");

    cy.findByLabelText(/password/i)
      .should("exist")
      .should("be.empty")
      .type("20Launch21!")
      .should("have.value", "20Launch21!");

    cy.findByRole("button", { name: /sign in/i }).click();

    cy.url().should("not.contain", "/login").should("eq", "http://localhost:3000/");
  });
});
// eslint-disable-next-line import/no-anonymous-default-export
export default {};
