describe("Users", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#cy__loginEmail").type("naveed@maxenius.agency");
    cy.get("#cy__loginPass").type("Maxenius123");
    cy.get("#cy__loginbtn").click();
  });
  it("Users", () => {
    cy.contains("Users").should("be.visible").click();
    cy.get("#cy__fname").type("John");
    cy.get("#cy__lname").type("Doe");
    cy.get("#cy__Email").type("john@maxenius.agency");
    cy.get("#cy__MobileNumber").type("090078601");
    cy.wait(2000);
    cy.get("#cy__FullName").click();
    cy.get("#cy__EditUser").click();
    cy.get("#cy__MobilePhoneNumber").clear().type("090078601");
    cy.get("#cy__SaveUser").click();
  });
});
