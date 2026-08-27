///<reference types="cypress" />

describe("Dashboard", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#cy__loginEmail").type("naveed@maxenius.agency");
    cy.get("#cy__loginPass").type("Maxenius123");
    cy.get("#cy__loginbtn").click();
  });
  it("Visits the orders from Dashboard ", () => {
    cy.get("#cy__Orders").click();
  });

  it("Visits the Products from Dashboard", () => {
    cy.get("#cy__Products").click();
  });
  it("Check Top Selling Products Load More", () => {
    cy.get("#cy__LoadMorebtn").click();
  });
});
