describe("Patients", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#cy__loginEmail").type("naveed@maxenius.agency");
    cy.get("#cy__loginPass").type("Maxenius123");
    cy.get("#cy__loginbtn").click();
  });
  it("Visits the patient page", () => {
    cy.contains("Patient").click();
    cy.get("#cy__WebsiteSelect").should("be.visible");
    cy.get("#cy__WebsiteSelect").click();
    cy.wait(100);
    cy.get('ul[role="listbox"] li')
      .eq(0)
      .then(option => {
        option[0].click();
      });
  });
});
