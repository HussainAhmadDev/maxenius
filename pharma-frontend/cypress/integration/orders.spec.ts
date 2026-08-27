/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-wait-until" />

describe("Orders page flow", () => {
  before(() => {
    //@ts-expect-error login is available
    cy.login({ username: "test@most.win", password: "20Launch21!" });
    cy.findByRole("button", { name: /^Orders$/ }).click();
    cy.url().should("eq", "http://localhost:3000/orders");
  });

  beforeEach(() => {
    cy.viewport("macbook-16");
  });

  it("has filter heading", () => {
    cy.findByText("Search").should("exist").should("be.visible");
  });

  it("has orders from input", () => {
    cy.findByLabelText(/orders from/i)
      .should("exist")
      .should("be.visible");
  });

  it("has orders to input", () => {
    cy.findByLabelText(/orders to/i)
      .should("exist")
      .should("be.visible");
  });

  it("has email field", () => {
    cy.findByLabelText(/customer email/i)
      .should("exist")
      .should("be.visible")
      .type("most")
      .should("have.value", "most");
  });

  it("has customer number input", () => {
    cy.findByLabelText(/customer number/i)
      .should("exist")
      .should("be.visible")
      .type("56")
      .should("have.value", "56");
  });

  it("has company name input", () => {
    cy.findByLabelText(/company name/i)
      .should("exist")
      .should("be.visible")
      .type("most")
      .should("have.value", "most");
  });

  it("has product number input", () => {
    cy.findByLabelText(/product number/i)
      .should("exist")
      .should("be.visible")
      .type("56")
      .should("have.value", "56");
  });

  it("has order number input", () => {
    cy.findByLabelText(/order number/i)
      .should("exist")
      .should("be.visible")
      .type("56")
      .should("have.value", "56");
  });

  it("has payment status input", () => {
    cy.findByLabelText(/payment status/i)
      .should("exist")
      .should("be.visible");
  });

  it("has shipment status input", () => {
    cy.findByLabelText(/shipment status/i)
      .should("exist")
      .should("be.visible");
  });

  it("has address1 input", () => {
    cy.findByLabelText(/address1/i)
      .should("exist")
      .should("be.visible")
      .type("56 street")
      .should("have.value", "56 street");
  });

  it("has city input", () => {
    cy.findByLabelText(/city/i)
      .should("exist")
      .should("be.visible")
      .type("test city")
      .should("have.value", "test city");
  });

  it("has state input", () => {
    cy.findByLabelText(/state/i).should("exist").should("be.visible");
  });

  it("has zipcode input", () => {
    cy.findByLabelText(/zipcode/i)
      .should("exist")
      .should("be.visible")
      .type("73500")
      .should("have.value", "73500");
  });

  it("has bill to and ship to checkboxes and they work correctly", () => {
    cy.findByRole("checkbox", { name: /search by bill to/i })
      .should("exist")
      .check();
    cy.findByRole("checkbox", { name: /search by ship to/i })
      .should("exist")
      .check();
    cy.findByLabelText(/email/i).should("be.enabled");
    cy.findByRole("checkbox", { name: /search by bill to/i })
      .should("exist")
      .uncheck();
    cy.findByRole("checkbox", { name: /search by ship to/i })
      .should("exist")
      .check();
    cy.findByLabelText(/email/i).should("be.enabled");
    cy.findByRole("checkbox", { name: /search by bill to/i })
      .should("exist")
      .check();
    cy.findByRole("checkbox", { name: /search by ship to/i })
      .should("exist")
      .uncheck();
    cy.findByLabelText(/email/i).should("be.enabled");
    cy.findByRole("checkbox", { name: /search by bill to/i })
      .should("exist")
      .uncheck();
    cy.findByRole("checkbox", { name: /search by ship to/i })
      .should("exist")
      .uncheck();
    cy.findByLabelText(/email/i).should("be.disabled");
  });

  it("has reset button and it works correctly", () => {
    cy.findByRole("button", { name: /reset/i })
      .should("exist")
      .should("be.visible")
      .click();
    cy.findByLabelText(/email/i).should("have.value", "");
    cy.findByLabelText(/customer number/i).should("have.value", "");
    cy.findByLabelText(/company name/i).should("have.value", "");
    cy.findByLabelText(/product number/i).should("have.value", "");
    cy.findByLabelText(/order number/i).should("have.value", "");
    cy.findByLabelText(/address1/i).should("have.value", "");
    cy.findByLabelText(/city/i).should("have.value", "");
    cy.findByLabelText(/zipcode/i).should("have.value", "");
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

  it("has send invoices button", () => {
    cy.findByRole("button", { name: /send invoices/i })
      .should("exist")
      .should("be.visible");
  });

  it("has send invoices button", () => {
    cy.findByRole("button", { name: /download invoices/i })
      .should("exist")
      .should("be.visible");
  });

  it("has send invoices button", () => {
    cy.findByRole("button", { name: /trash/i }).should("exist").should("be.visible");
  });
});
