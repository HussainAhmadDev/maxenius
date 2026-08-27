describe("Vendors", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#cy__loginEmail").type("naveed@maxenius.agency");
    cy.get("#cy__loginPass").type("Maxenius123");
    cy.get("#cy__loginbtn").click();
  });
  it("Vendors Search Fields", () => {
    cy.contains("Vendors").should("be.visible").click();
    cy.get("#cy__NameField").type("shan");
    cy.get("#cy__CityTown").type("Fsd");
    cy.get("#cy__CountryField").type("pakistan");
    cy.get("#cy__PostCode").type("38000");
    cy.get("#cy__VendorTableName").click();
    cy.get("#cy__EditVendor").click();
    cy.get("#cy__UpadateVendorCity").clear().type("Faisalabad");
    cy.get("#cy__Webpage").clear().type("https://max-most-frontend");
    cy.get("#cy__SaveBtn").click();
  });
});
