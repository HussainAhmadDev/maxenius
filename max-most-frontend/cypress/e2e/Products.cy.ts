///<reference types="cypress" />

describe("Products", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#cy__loginEmail").type("naveed@maxenius.agency");
    cy.get("#cy__loginPass").type("Maxenius123");
    cy.get("#cy__loginbtn").click();
  });
  it("Visits the Products ", () => {
    cy.contains("Products").should("be.visible").click();
    cy.get("#cy__ProductWebsiteSelect").should("be.visible");
    cy.get("#cy__ProductWebsiteSelect").click();
    cy.wait(100);
    cy.get('ul[role="listbox"] li')
      .eq(0)
      .then(option => {
        option[0].click();
      });
    cy.get("#cy__ProductNumber").type("RPU88K99R");
    cy.get("#cy__ProductName").type("Surbex z");
    cy.get("#cy__ProductBarcode").type("RPU88K99R");
    cy.get("#cell-2-1493").click();
  });
});
