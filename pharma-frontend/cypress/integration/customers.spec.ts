/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-wait-until" />

describe("Customers page flow", () => {
  before(() => {
    //@ts-expect-error login is available
    cy.login({ username: "test@most.win", password: "20Launch21!" });
    cy.findByRole("button", { name: /^Customers$/ }).click();
    cy.url().should("eq", "http://localhost:3000/customers");
  });

  beforeEach(() => {
    cy.viewport("macbook-16");
  });

  it("has filter heading", () => {
    cy.findByText("Search").should("exist").should("be.visible");
  });

  it("has customer number input", () => {
    cy.findByLabelText(/customer number/i)
      .should("exist")
      .should("be.visible")
      .type("56")
      .should("have.value", "56");
  });

  it("has last order from input", () => {
    cy.findByLabelText(/last order from/i)
      .should("exist")
      .should("be.visible");
  });

  it("has last order to input", () => {
    cy.findByLabelText(/last order to/i)
      .should("exist")
      .should("be.visible");
  });

  it("has contact first name input", () => {
    cy.findByLabelText(/contact first name/i)
      .should("exist")
      .should("be.visible")
      .type("most")
      .should("have.value", "most");
  });

  it("has contact last name input", () => {
    cy.findByLabelText(/contact last name/i)
      .should("exist")
      .should("be.visible")
      .type("most")
      .should("have.value", "most");
  });

  it("has company name input", () => {
    cy.findByLabelText(/company name/i)
      .should("exist")
      .should("be.visible")
      .type("most")
      .should("have.value", "most");
  });

  it("has email field", () => {
    cy.findByLabelText(/contact email/i)
      .should("exist")
      .should("be.visible")
      .type("most")
      .should("have.value", "most");
  });

  it("has phone field", () => {
    cy.findByLabelText(/contact phone/i)
      .should("exist")
      .should("be.visible")
      .type("1111111111")
      .should("have.value", "+1 (111) 111-1111");
  });

  it("has address1 field", () => {
    cy.findByLabelText(/address 1/i)
      .should("exist")
      .should("be.visible")
      .type("52 street")
      .should("have.value", "52 street");
  });

  it("has address2 field", () => {
    cy.findByLabelText(/address 2/i)
      .should("exist")
      .should("be.visible")
      .type("52 street")
      .should("have.value", "52 street");
  });

  it("has city field", () => {
    cy.findByLabelText(/city/i)
      .should("exist")
      .should("be.visible")
      .type("islamabad")
      .should("have.value", "islamabad");
  });

  it("has state field", () => {
    cy.findByLabelText(/state/i).should("exist").should("be.visible");
  });

  it("has zip code field", () => {
    cy.findByLabelText(/zip code/i)
      .should("exist")
      .should("be.visible")
      .type("75300")
      .should("have.value", "75300");
  });

  it("has a search field", () => {
    cy.findByRole("textbox", { name: /search/i })
      .should("exist")
      .should("be.visible")
      .type("most")
      .should("have.value", "most");
  });

  it("has bill to and ship to checkboxes and they work correctly", () => {
    cy.findByRole("checkbox", { name: /search by bill to/i })
      .should("exist")
      .check();
    cy.findByRole("checkbox", { name: /search by ship to/i })
      .should("exist")
      .check();
    cy.findByLabelText(/contact email/i).should("be.enabled");
    cy.findByRole("checkbox", { name: /search by bill to/i })
      .should("exist")
      .uncheck();
    cy.findByRole("checkbox", { name: /search by ship to/i })
      .should("exist")
      .check();
    cy.findByLabelText(/contact email/i).should("be.enabled");
    cy.findByRole("checkbox", { name: /search by bill to/i })
      .should("exist")
      .check();
    cy.findByRole("checkbox", { name: /search by ship to/i })
      .should("exist")
      .uncheck();
    cy.findByLabelText(/contact email/i).should("be.enabled");
    cy.findByRole("checkbox", { name: /search by bill to/i })
      .should("exist")
      .uncheck();
    cy.findByRole("checkbox", { name: /search by ship to/i })
      .should("exist")
      .uncheck();
    cy.findByLabelText(/contact email/i).should("be.disabled");
  });

  it("has reset button and it works correctly", () => {
    cy.findByRole("button", { name: /reset/i })
      .should("exist")
      .should("be.visible")
      .click();
    cy.findByLabelText(/customer number/i).should("have.value", "");
    cy.findByLabelText(/contact first name/i).should("have.value", "");
    cy.findByLabelText(/contact last name/i).should("have.value", "");
    cy.findByLabelText(/contact email/i).should("have.value", "");
    cy.findByLabelText(/address 1/i).should("have.value", "");
    cy.findByLabelText(/address 2/i).should("have.value", "");
    cy.findByLabelText(/city/i).should("have.value", "");
    cy.findByLabelText(/zip code/i).should("have.value", "");
    cy.findByLabelText(/company name/i).should("have.value", "");
    cy.findByRole("textbox", { name: /search/i }).should("have.value", "");
  });

  it("has hide button and it works correctly", () => {
    cy.findByLabelText(/filters container/i)
      .should("exist")
      .should("be.visible");
    cy.findByRole("button", { name: /hide/i })
      .should("exist")
      .should("be.visible")
      .click();
    cy.findByLabelText(/filters container/i).should("not.exist");
    cy.findByRole("button", { name: /reset/i }).should("be.disabled");
    cy.findByRole("button", { name: /hide/i }).should("not.exist");
    cy.findByRole("button", { name: /show/i })
      .should("exist")
      .should("be.visible")
      .click();
    cy.findByLabelText(/filters container/i)
      .should("exist")
      .should("be.visible");
  });
});
