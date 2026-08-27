///<reference types="cypress" />

describe("Product Transaction", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#cy__loginEmail").type("naveed@maxenius.agency");
    cy.get("#cy__loginPass").type("Maxenius123");
    cy.get("#cy__loginbtn").click();
  });
  it("Product Transaction", () => {
    cy.contains("Product Transactions").click();
    cy.get("#cy__SelectProduct").type("Surbex Z");
    cy.get('ul[role="listbox"]').should("exist");
    cy.get('ul[role="listbox"] li')
      .should("have.length.greaterThan", 0)
      .first()
      .should("be.visible")
      .click();
    cy.get("#cy__SelectProduct").should("have.value", "Surbex z (RPU88K99R)");
  });
});
