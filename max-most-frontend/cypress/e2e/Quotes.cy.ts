describe("Quotes", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#cy__loginEmail").type("naveed@maxenius.agency");
    cy.get("#cy__loginPass").type("Maxenius123");
    cy.get("#cy__loginbtn").click();
  });
  it("Quotes", () => {
    cy.contains("Quotes").should("be.visible").click();
    cy.get("#status-pending").click();
    cy.contains("Pending").click();
    cy.wait(5000);
    cy.contains("Approved").click();
    cy.wait(5000);
    cy.contains("Rejected").click();
    cy.wait(5000);
    cy.get("#cy__CreateQuoteBtn").click();
    cy.get("#cy__QuoteVendorField").click();
    cy.contains('ul[role="listbox"] li', "shan").click();
    cy.get("#cy__QuoteSearchProduct").click();
    cy.contains('ul[role="listbox"] li', "Surbex z").click();
    cy.get("#cy__QuoteQuantity").type("2");
    cy.get("#cy__QuoteAddItemBtn").click();
    cy.get("#cy__QuoteSaveBtn").click();
    cy.get("#cy__VendorName").click();
    cy.wait(2000);
    cy.get("#cy__TrashBtn").click();
    cy.get("#cy__QuoteProcessBtn").click();
  });
});
