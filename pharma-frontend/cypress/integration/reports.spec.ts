/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-wait-until" />

describe("Reports page flow", () => {
  before(() => {
    //@ts-expect-error login is available
    cy.login({ username: "test@most.win", password: "20Launch21!" });
    cy.findByRole("button", { name: /^Reports$/ }).click();
    cy.url().should("eq", "http://localhost:3000/reports");
  });

  beforeEach(() => {
    cy.viewport("macbook-16");
  });

  it("it has all reports tab button", () => {
    cy.findAllByLabelText(/all/i).should("exist").should("be.visible");
  });

  it("has Reports sub heading and create custom report button", () => {
    cy.findByRole("paragraph", { name: /Reports/i })
      .should("exist")
      .should("be.visible");

    cy.findByRole("button", { name: /create custom report/i })
      .should("exist")
      .should("be.visible")
      .click();
  });
});
