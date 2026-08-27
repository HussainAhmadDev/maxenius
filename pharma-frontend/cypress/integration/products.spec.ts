/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-wait-until" />

describe("Products page flow", () => {
  before(() => {
    //@ts-expect-error login is available
    cy.login({ username: "test@most.win", password: "20Launch21!" });
    cy.findByRole("button", { name: /^Products$/ }).click();
    cy.url().should("eq", "http://localhost:3000/products");
  });

  beforeEach(() => {
    cy.viewport("macbook-16");
  });

  it("it has create product button", () => {
    cy.findByRole("button", { name: /create product/i })
      .should("exist")
      .should("be.visible");
  });

  it("has filter heading", () => {
    cy.findByText("Search").should("exist").should("be.visible");
  });

  it("has product number input", () => {
    cy.findByLabelText(/product number/i)
      .should("exist")
      .should("be.visible")
      .type("56")
      .should("have.value", "56");
  });

  it("has product name input", () => {
    cy.findByLabelText(/product name/i)
      .should("exist")
      .should("be.visible")
      .type("test product")
      .should("have.value", "test product");
  });

  it("has supplier input", () => {
    cy.findByLabelText(/supplier/i)
      .should("exist")
      .should("be.visible");
  });

  it("has long description input", () => {
    cy.findByLabelText(/long description/i)
      .should("exist")
      .should("be.visible");
  });

  it("has tax class input", () => {
    cy.findByLabelText(/tax class/i)
      .should("exist")
      .should("be.visible");
  });

  it("has company name input", () => {
    cy.findByLabelText(/tags/i).should("exist").should("be.visible");
  });

  it("has category input", () => {
    cy.findByLabelText(/category/i)
      .should("exist")
      .should("be.visible")
      .type("most")
      .should("have.value", "most");
  });

  it("has show in stock products only checkbox", () => {
    cy.findByRole("checkbox", { name: /in stock products only/i })
      .should("exist")
      .check();
  });

  it("has show discontinued products checkbox", () => {
    cy.findByRole("checkbox", { name: /show discontinued products/i })
      .should("exist")
      .check();
  });

  it("has show saas products only checkbox", () => {
    cy.findByRole("checkbox", { name: /show saas products only/i })
      .should("exist")
      .check();
  });

  it("has show products sold as subscription checkbox", () => {
    cy.findByRole("checkbox", { name: /products sold as subscription/i })
      .should("exist")
      .check();
  });

  it("has reset button and it works correctly", () => {
    cy.findByRole("button", { name: /reset/i })
      .should("exist")
      .should("be.visible")
      .click();
    cy.findByLabelText(/product number/i).should("have.value", "");
    cy.findByLabelText(/product name/i).should("have.value", "");
    cy.findByLabelText(/supplier/i).should("have.value", "");
    cy.findByLabelText(/long description/i).should("have.value", "");
    cy.findByLabelText(/tax class/i).should("have.value", "");
    cy.findByLabelText(/tags/i).should("have.value", "");
    cy.findByLabelText(/category/i).should("have.value", "");
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
