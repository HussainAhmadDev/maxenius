///<reference types="cypress" />

describe("Purchase Order", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#cy__loginEmail").type("naveed@maxenius.agency");
    cy.get("#cy__loginPass").type("Maxenius123");
    cy.get("#cy__loginbtn").click();
  });
  it("Visits the Purchase Order ", () => {
    cy.contains("Purchase Orders").should("be.visible").click();
    cy.get("#cy__Statuspending").click();
    cy.get("#cy__Statusapproved").click();
    cy.get("#cy__Statusaccepted").click();
    cy.get("#cy__Statuspartially_received").click();
    cy.get("#cy__Statusdelivered").click();
  });
  it("Write the Purchase Order number into field ", () => {
    cy.contains("Purchase Orders").should("be.visible").click();
    cy.get("#cy__POId")
      .invoke("text")
      .then(po => {
        cy.log("Prurchase ID: ", po);
        cy.get("#cy__PurchaseNoid").type(po);
        cy.get("#cy__POId").click();
      });
  });

  it("Click on Accepted field and select 1st row", () => {
    cy.contains("Purchase Orders").should("be.visible").click();
    cy.get("#cy__Statuspartially_received").click({ force: true });
    cy.intercept("GET", "**/api/v1/purchase_order/**").as("getAcceptedOrders");
    cy.wait("@getAcceptedOrders");

    cy.get("#cy__POId")
      .invoke("text")
      .then(poId => {
        cy.log("Purchase ID: ", poId);
        cy.get("#cy__PurchaseNoid").type(poId);
        cy.get("#cy__POId").click();
        cy.get("#cy__EditPurchaseOrderBtn").click({ force: true });
        cy.get("#cy__AddReceivingbtn").click({ force: true });
        const invoiceNumber = generateInvoiceNumber();
        cy.get("#cy__InvoiceNumber").type(invoiceNumber);
        const batchNumber = generateBatchNumber();
        cy.get("#cy__RecevivngBatch").type(batchNumber);
        // Get the current date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const formattedToday = `${month}/${day}/${year}`;
        cy.get("#cy__DatePicker ").clear().type(formattedToday);
        cy.get("#cy__DatePicker ").should("have.value", formattedToday);
        cy.get("#cy__ReceivingBarcode")
          .invoke("text")
          .then(barcode => {
            const getBarcode = barcode.trim();
            cy.log("Barcode:", getBarcode);
            cy.get("#cy__EditPurchaseBarcode")
              .should("be.visible")
              .type(`${getBarcode}{enter}`);
          });

        cy.get("#cy__ReceiveButton")
          .should("be.visible")
          .should("not.be.disabled")
          .as("receiveButton");
        cy.get("@receiveButton").click({ force: true });
      });
    cy.get("#cy__AddPublicNote").click({ force: true });
    cy.get("#cy__PurchaseOrderNote").type(
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
    );
    cy.get("#cy__PurchaseSaveBtn").click({ force: true });
    cy.get("#cy__OrderPrivateNotes").click({ force: true });
    cy.get("#cy__AddPrivateNote").click({ force: true });
    cy.get("#cy__PurchaseOrderNote").type(
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
    );
    cy.get("#cy__PurchaseSaveBtn").click({ force: true });
  });
  it("Create Purchase Order", () => {
    cy.contains("Purchase Orders").should("be.visible").click();
    cy.get("#cy__CreatePurchaseOrderBtn").click({ force: true });
    cy.wait(2000);
    cy.get("#cy__CreatePurchaseOrderLocation").click({ force: true });
    cy.contains("Main WH").click();
    cy.get("#cy__CreatePurchaseOrderVendor").click({ force: true });
    cy.contains("shan").click();

    cy.intercept("GET", "/api/v1/products_by_sku*").as("getProducts");
    cy.get("#cy__SearchProduct").should("be.visible").type("surbex z");
    cy.wait(2000);
    cy.get('ul[role="listbox"] li').first().click();
    cy.get("#cy__AddQuantity").type("10");
    cy.get("#cy__AddItemBtn").click({ force: true });
    cy.get("#cy__CreateSaveBtn").click({ force: true });
  });
});
function generateInvoiceNumber() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${randomNum}`;
}
function generateBatchNumber() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `BATCH-${timestamp}-${randomNum}`;
}
