describe("Stock Transfer", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#cy__loginEmail").type("naveed@maxenius.agency");
    cy.get("#cy__loginPass").type("Maxenius123");
    cy.get("#cy__loginbtn").click();
  });
  it("Create Order", () => {
    cy.contains("Stock Transfer").should("be.visible").click();
    cy.get("#cy__StockTransferProduct").click();
    cy.contains('ul[role="listbox"] li', "Exovair (RP34653267)").click();
    cy.get("#cy__StockTransferBatch").click();
    cy.get("#cy__StockTransferBatch-option-0").click();
    cy.get("#cy__StockTransferQty").type("1");
    cy.get("#cy__StockTransferWebsite").click();
    cy.contains('ul[role="listbox"] li', "Refine Staging").click();
    cy.get("#cy__StockTransferToBrand").click();
    cy.contains('ul[role="listbox"] li', "Udani").click();
    cy.get("#cy__StockTransferToProduct").click();
    cy.contains('ul[role="listbox"] li', "Udani test").click();
    cy.get("#cy__StockTransferVendor").click();
    cy.contains('ul[role="listbox"] li', "Naveed").click();
    cy.get("#cy__StockTransferWarehouse").click();
    cy.contains('ul[role="listbox"] li', "Udani Main").click();
    cy.get("#cy__TransferBtn").click();
  });
});
