///<reference types="cypress" />

describe("Product Expiry", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#cy__loginEmail").type("naveed@maxenius.agency");
    cy.get("#cy__loginPass").type("Maxenius123");
    cy.get("#cy__loginbtn").click();
  });
  it("Product Transaction Today and Before", () => {
    cy.contains("Product Expiry").click();
    cy.wait(2000);
    cy.get("#cy__DateRange").click();
    cy.contains('ul[role="listbox"] li', "Today and Before").click();
    cy.get('[data-cy="cy__ExpiryBtn"]').click();
    cy.get("#cy__ProductName").should("be.visible");
  });
  it("Product Transaction Week to Date", () => {
    cy.contains("Product Expiry").click();
    cy.wait(2000);
    cy.get("#cy__DateRange").click();
    cy.contains('ul[role="listbox"] li', "Week to Date").click();
    cy.get('[data-cy="cy__ExpiryBtn"]').click();
    // cy.get("#cy__ProductName").should("be.visible");
  });
  it("Product Transaction Month to Date", () => {
    cy.contains("Product Expiry").click();
    cy.wait(2000);
    cy.get("#cy__DateRange").click();
    cy.contains('ul[role="listbox"] li', "Month to Date").click();
    cy.get('[data-cy="cy__ExpiryBtn"]').click();
    cy.get("#cy__ProductName").should("be.visible");
  });
  it("Product Transaction Year to Date", () => {
    cy.contains("Product Expiry").click();
    cy.wait(2000);
    cy.get("#cy__DateRange").click();
    cy.contains('ul[role="listbox"] li', "Year to Date").click();
    cy.get('[data-cy="cy__ExpiryBtn"]').click();
    cy.get("#cy__ProductName").should("be.visible");
  });
  it("Product Transaction Year to Date", () => {
    cy.contains("Product Expiry").click();
    cy.get("#cy__DateRange").click().click();
    cy.contains('ul[role="listbox"] li', "Chose Date Range").click();

    cy.get("#cy__CustomeDatePicker").clear().type("01-01-2024 02-06-2024");
    cy.get("body").click(0, 0);
    cy.get('[data-cy="cy__ExpiryBtn"]').click();
  });
});
