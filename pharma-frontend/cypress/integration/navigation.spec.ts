/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-wait-until" />

describe("Application Header", () => {
  before(() => {
    // @ts-expect-error login is defined.
    cy.login({ username: "test@most.win", password: "20Launch21!" });
  });

  beforeEach(() => {
    // The three useless buttons should exist.
    cy.findByLabelText(/history/i).should("exist");
    cy.findByLabelText(/help/i).should("exist");
    cy.findByLabelText(/notifications/i).should("exist");
  });

  afterEach(() => {
    // check if the page goes back to dashboard correctly.
    cy.findByLabelText(/advocacy logo/i)
      .should("exist")
      .should("be.visible")
      .click();
    cy.url().should("eq", "http://localhost:3000/");

    cy.waitUntil(() =>
      cy
        .findByLabelText(/page title/)
        .should("exist")
        .contains(/dashboard/i)
    );
  });

  it("Dashboard page should have correct url and page title", () => {
    cy.url().should("eq", "http://localhost:3000/");
    cy.waitUntil(() =>
      cy
        .findByLabelText(/page title/)
        .should("exist")
        .contains(/dashboard/i)
    );
  });

  it("take order button is visible, correct url and page title should appear on clicking the button", () => {
    cy.findByRole("button", { name: /take order/i })
      .should("be.visible")
      .click();
    cy.url().should("eq", "http://localhost:3000/take-order");
    cy.waitUntil(() =>
      cy
        .findByLabelText(/page title/)
        .should("exist")
        .contains(/take order/i)
    );
  });

  it("orders button is visible, correct url and page title should appear on clicking the button", () => {
    cy.findByRole("button", { name: /orders/i })
      .should("be.visible")
      .click();
    cy.url().should("eq", "http://localhost:3000/orders");
    cy.waitUntil(() =>
      cy
        .findByLabelText(/page title/)
        .should("exist")
        .contains(/orders/i)
    );
  });

  it("customers button is visible, correct url and page title should appear on clicking the button", () => {
    cy.findByRole("button", { name: /customers/i })
      .should("be.visible")
      .click();
    cy.url().should("eq", "http://localhost:3000/customers");
    cy.waitUntil(() =>
      cy
        .findByLabelText(/page title/)
        .should("exist")
        .contains(/customers/i)
    );
  });

  it("products button is visible, correct url and page title should appear on clicking the button", () => {
    cy.findByRole("button", { name: /products/i })
      .should("be.visible")
      .click();
    cy.url().should("eq", "http://localhost:3000/products");
    cy.waitUntil(() =>
      cy
        .findByLabelText(/page title/)
        .should("exist")
        .contains(/products/i)
    );
  });

  it("reports button is visible, correct url and page title should appear on clicking the button", () => {
    cy.findByRole("button", { name: /reports/i })
      .should("be.visible")
      .click();
    cy.url().should("eq", "http://localhost:3000/reports");
    cy.waitUntil(() =>
      cy
        .findByLabelText(/page title/)
        .should("exist")
        .contains(/reports/i)
    );
  });

  it("organizations button is visible, correct url and page title should appear on clicking the button", () => {
    cy.findByRole("button", { name: /organizations/i })
      .should("be.visible")
      .click();
    cy.url().should("eq", "http://localhost:3000/admin/organizations");
    cy.waitUntil(() =>
      cy
        .findByLabelText(/page title/)
        .should("exist")
        .contains(/organizations/i)
    );
  });

  it("brands button is visible, correct url and page title should appear on clicking the button", () => {
    cy.findByRole("button", { name: /brands/i })
      .should("be.visible")
      .click();
    cy.url().should("eq", "http://localhost:3000/admin/brands");
    cy.waitUntil(() =>
      cy
        .findByLabelText(/page title/)
        .should("exist")
        .contains(/brands/i)
    );
  });

  it("users button is visible, correct url and page title should appear on clicking the button", () => {
    cy.findByRole("button", { name: /users/i }).should("be.visible").click();
    cy.url().should("eq", "http://localhost:3000/admin/users");
    cy.waitUntil(() =>
      cy
        .findByLabelText(/page title/)
        .should("exist")
        .contains(/users/i)
    );
  });

  it("brands popover should be visibe and have three child components, on clicking popover must appear and on clicking again it should disappear", () => {
    cy.findByLabelText("brand selector")
      .should("exist")
      .should("be.visible")
      .children()
      .should("have.length", 3);
    cy.findByLabelText(/brand avatar/i)
      .should("exist")
      .should("be.visible")
      .should("have.attr", "alt", "brand avatar")
      .and("have.attr", "src");
    cy.findByLabelText(/brand name/i)
      .should("exist")
      .should("be.visible");
    // since the description is optional we won't test its visiblity and existance
    cy.findByLabelText(/arrow down/i)
      .should("exist")
      .should("be.visible");
    cy.findByLabelText("arrow down").click();
    cy.findByLabelText(/brand popover/i)
      .should("exist")
      .should("be.visible");
    cy.findByLabelText(/brand popover/i).click();
  });

  it("sidebar drawer must have an avatar, username and email", () => {
    cy.findByLabelText(/sidebar drawer/i)
      .should("exist")
      .should("be.visible");
    cy.findByLabelText(/user avatar/i)
      .should("exist")
      .should("be.visible")
      .should("have.attr", "alt", "user avatar")
      .and("have.attr", "src");
    cy.findByLabelText(/username/i)
      .should("exist")
      .should("be.visible");
    cy.findByLabelText(/user email/i)
      .should("exist")
      .should("be.visible");
  });

  it("Sidebar drawer popover must have profile, help & support, switiching organizatin and enviroments and a logout button. Logout should work properly", () => {
    cy.findByLabelText(/more/i).should("exist").should("be.visible").click();

    cy.findAllByLabelText(/drawer popover/i)
      .should("exist")
      .should("be.visible");

    cy.findAllByText(/profile/i)
      .should("exist")
      .should("be.visible");

    cy.findAllByText(/help & support/i)
      .should("exist")
      .should("be.visible");

    cy.findAllByText(/Switch organization/i)
      .should("exist")
      .should("be.visible");

    cy.findAllByText(/Switch Environment/i)
      .should("exist")
      .should("be.visible");

    cy.findAllByText(/logout/i)
      .should("exist")
      .should("be.visible")
      .click();

    cy.url().should("eq", "http://localhost:3000/login");

    // @ts-expect-error login is defined.
    cy.login({ username: "test@most.win", password: "20Launch21!" });
  });
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
