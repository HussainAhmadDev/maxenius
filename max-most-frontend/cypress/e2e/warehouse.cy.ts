describe("Warehouse", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#cy__loginEmail").type("naveed@maxenius.agency");
    cy.get("#cy__loginPass").type("Maxenius123");
    cy.get("#cy__loginbtn").click();
  });
  it("Warehouse Search", () => {
    cy.contains("Warehouse").should("be.visible").click();
    cy.get("#cy__WarehouseName").type("Main WH");
    cy.get("#cy__WarehouseCity").type("Faisalabad");
    cy.get("#cy__WarehouseRegion").type("Punjab");
    cy.get("#cy__WarehousePostcode").type("38000");
    cy.get("#cy__WarehouseCountry").type("Pakistan");
    cy.wait(2000);
    cy.get("#cy__WarehouseTbName").click();
    cy.get("#cy__EditWarehouseBtn").click();
    cy.get("#cy__WarehouseDiscription")
      .clear()
      .type(
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry"
      );
    cy.get("#cy__WarehouseSaveBtn").click();
  });
});
