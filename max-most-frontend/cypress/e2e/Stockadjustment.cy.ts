import dayjs from "dayjs";

describe("Stock Adjustment", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#cy__loginEmail").type("naveed@maxenius.agency");
    cy.get("#cy__loginPass").type("Maxenius123");
    cy.get("#cy__loginbtn").click();
  });
  it("Increase Stock", () => {
    cy.contains("Stock Adjustment").should("be.visible").click();
    cy.get("#cy__IncreaseStock").click();
    cy.get("#cy__StockLocation").click();
    cy.contains('ul[role="listbox"] li', "Main WH").click();
    cy.get("#cy__StockVendor").click();
    cy.contains('ul[role="listbox"] li', "shan").click();
    cy.get("#cy__StockReason").type("Testing");
    cy.get("#cy__SearchProductForStock").click();
    cy.contains('ul[role="listbox"] li', "Surbex z (RPU88K99R)").click();
    cy.get("#cy__StockAdjustmentQty").type("2");
    cy.get("#cy__StockBatch").type("123");
    const futureDate = dayjs().add(30, "day").format("DD/MM/YYYY");
    cy.get("#cy__StockExpiryDate").click();
    cy.get("#cy__StockExpiryDate").clear().type(futureDate);
    cy.get("#cy__StockExpiryDate").should("have.value", futureDate);
    cy.get("#cy__StockAddItem").click();
    cy.get("#cy__StockSaveBtn").click();
  });
  it("Decrease Stock", () => {
    cy.contains("Stock Adjustment").should("be.visible").click();
    cy.get("#cy__DecreaseStock").click();
    cy.get("#cy__DecreaseWebsiteId").click();
    cy.contains('ul[role="listbox"] li', "Refine Staging").click();
    cy.get("#cy__DecreaseReason").type("Testing");
    cy.get("#cy__DecreaseSearchProduct").click();
    cy.get("#cy__DecreaseSearchProduct-option-0").click();
    cy.get("#cy__DecreaseBatch").click();
    cy.get("#cy__DecreaseBatch-option-0").click();
    cy.get("#cy__DecreaseLessQty").type("1");
    cy.get("#cy__DecreaseAddItem").click();
    cy.get("#cy__DecreaseSavebtn").click();
  });
  it("Stock History", () => {
    cy.contains("Stock Adjustment").should("be.visible").click();
    cy.get("#cy__StockHistory").click();
  });
});
