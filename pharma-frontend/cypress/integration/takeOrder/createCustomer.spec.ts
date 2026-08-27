/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-wait-until" />

describe("Take order create customer flow.", () => {
  before(() => {
    // login and go to take order page
    //@ts-expect-error login is available
    cy.login({ username: "test@most.win", password: "20Launch21!" });
    cy.findByRole("button", { name: /take order/i }).click();
    cy.url().should("eq", "http://localhost:3000/take-order");
  });

  beforeEach(() => {
    //only testing for desktop computers
    cy.viewport("macbook-16");
  });

  it("flow using create customer button", () => {
    cy.findByRole("heading", { name: /Customer/i })
      .should("exist")
      .should("be.visible");

    cy.findByRole("button", { name: /create customer/i })
      .should("exist")
      .should("be.visible")
      .click();

    cy.findByRole("dialog").should("be.visible");

    cy.findByText("Create new customer").should("exist").should("be.visible");

    cy.findByRole("button", { name: /proceed/i })
      .should("exist")
      .should("be.visible")
      .click();

    cy.findByRole("dialog").should("not.exist");

    // at this point it must have jumped to create customer page

    cy.url().should(
      "match",
      /(^http:\/\/localhost:3000\/customers\/)((?:[a-z][a-z0-9_]*))/i
    );

    // tests for ui of customers page

    cy.findByRole("button", { name: /cancel/i })
      .should("exist")
      .should("be.visible");

    cy.findByRole("button", { name: /save customer/i })
      .should("exist")
      .should("be.visible");

    cy.findByLabelText(/take order with this customer/i)
      .should("exist")
      .should("be.visible")
      .should("be.disabled");

    cy.findByRole("heading", { name: /Basic Information/i })
      .should("exist")
      .should("be.visible");

    cy.findByLabelText(/Customer Number/i)
      .should("exist")
      .should("be.visible")
      .should("be.disabled");

    cy.findByRole("radio", { name: /company/i }).should("exist");

    cy.findByRole("radio", { name: /individual/i }).should("exist");

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000); // wait for the data to be fetched and component to be rerendered

    cy.findByLabelText(/Customer Name/i)
      .should("exist")
      .should("be.visible")
      .type("test company")
      .should("have.value", "test company");

    cy.findByRole("checkbox").check();

    cy.findByLabelText(/Tax Exemption ID/i)
      .should("exist")
      .should("be.visible")
      .type("358993")
      .should("have.value", "358993");

    cy.findByRole("button", { name: /save customer/i })
      .should("exist")
      .should("be.visible")
      .click();

    cy.findByRole("button", { name: /add popup notes/i })
      .should("exist")
      .should("be.visible")
      .click();

    cy.findByRole("dialog").should("be.visible");

    cy.findByRole("button", { name: /cancel/i })
      .should("exist")
      .should("be.visible")
      .click();

    cy.findByRole("dialog").should("not.exist");

    cy.findByRole("button", { name: /add contact/i })
      .should("exist")
      .should("be.visible")
      .click();

    // at this point it must have jumped to create customer's contact page

    cy.url().should(
      "match",
      /(^http:\/\/localhost:3000\/customers\/)((?:[a-z][a-z0-9_]*))(\/contact)/i
    );

    // tests for ui of contact page

    cy.findByRole("heading", { name: /Basic Information/i })
      .should("exist")
      .should("be.visible");

    cy.findByLabelText(/contact's first name/i)
      .should("exist")
      .should("be.visible")
      .type("First Name")
      .should("have.value", "First Name");

    cy.findByLabelText(/contact's last name/i)
      .should("exist")
      .should("be.visible")
      .type("Last Name")
      .should("have.value", "Last Name");

    cy.findByLabelText(/contact's email/i)
      .should("exist")
      .should("be.visible")
      .type("firstname@test.com")
      .should("have.value", "firstname@test.com");

    cy.findByLabelText(/contact's title/i)
      .should("exist")
      .should("be.visible")
      .type("contact title")
      .should("have.value", "contact title");

    cy.findByLabelText(/contact's company name/i) // it's value must be customer's name
      .should("exist")
      .should("be.visible")
      .should("be.disabled")
      .should("have.value", "test company");

    cy.findByLabelText(/contact's website/i)
      .should("exist")
      .should("be.visible")
      .type("contact website")
      .should("have.value", "contact website");

    cy.findByLabelText(/contact's office phone/i)
      .should("exist")
      .should("be.visible")
      .type("1111111111")
      .should("have.value", "+1 (111) 111-1111");

    cy.findByLabelText(/contact's billing phone/i)
      .should("exist")
      .should("be.visible")
      .type("1111111111")
      .should("have.value", "+1 (111) 111-1111");

    cy.findByLabelText(/contact's fax/i)
      .should("exist")
      .should("be.visible")
      .type("1111111111")
      .should("have.value", "+1 (111) 111-1111");

    cy.findByLabelText(/address first name/i)
      .should("exist")
      .should("be.visible")
      .type("first name")
      .should("have.value", "first name");

    cy.findByLabelText(/address last name/i)
      .should("exist")
      .should("be.visible")
      .type("last name")
      .should("have.value", "last name");

    cy.findByLabelText(/address label/i)
      .should("exist")
      .should("be.visible")
      .type("label")
      .should("have.value", "label");

    cy.findByLabelText(/copy address info/i)
      .should("exist")
      .should("be.visible")
      .click();

    // after clicking copy info, address first and last name must change according to the first and last names of basic information

    cy.findByLabelText(/address first name/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "First Name");

    cy.findByLabelText(/address last name/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "Last Name");

    cy.findByRole("checkbox", { name: /switch authorized to purchase/i })
      .should("exist")
      .uncheck()
      .check();

    // test if copy button in billing phone section works correctly

    cy.findByLabelText(/copy billing phone to billing address/i)
      .should("exist")
      .should("be.visible")
      .click();

    cy.findByLabelText(/billing phones 0/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "+1 (111) 111-1111")
      .clear()
      .type("2222222222")
      .should("have.value", "+1 (222) 222-2222");

    // test if copy button in billing email section works correctly

    cy.findByLabelText(/copy contact email to billing address/i)
      .should("exist")
      .should("be.visible")
      .click();

    cy.findByLabelText(/billing emails 0/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "firstname@test.com")
      .clear()
      .type("lastname@test.com")
      .should("have.value", "lastname@test.com");

    // fill in the data

    cy.findByLabelText(/billing address 1/i)
      .should("exist")
      .should("be.visible")
      .type("Street: 1083 Pooh Bear Lane")
      .should("have.value", "Street: 1083 Pooh Bear Lane");

    cy.findByLabelText(/billing address 2/i)
      .should("exist")
      .should("be.visible")
      .type("Street: 1011 Pooh Bear Lane")
      .should("have.value", "Street: 1011 Pooh Bear Lane");

    // company field must have default value as customer's name

    cy.findByLabelText(/billing company/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "test company")
      .clear()
      .type("company 202 private limited")
      .should("have.value", "company 202 private limited");

    cy.findByLabelText(/billing city/i)
      .should("exist")
      .should("be.visible")
      .type("Jacksonville")
      .should("have.value", "Jacksonville");

    cy.findByLabelText(/billing country/i)
      .should("exist")
      .should("be.visible")
      .type("united states");
    cy.get("#react-select-5-option-0").click();

    cy.findByLabelText(/billing state/i)
      .should("exist")
      .should("be.visible")
      .type("florida");
    cy.get("#react-select-7-option-0").click();

    cy.findByLabelText(/billing zip/i)
      .should("exist")
      .should("be.visible")
      .type("32216")
      .should("have.value", "32216");

    cy.findByLabelText(/Add Phone Number to billing address/i)
      .should("exist")
      .should("be.visible")
      .click();

    cy.findByLabelText(/billing phones 1/i)
      .should("exist")
      .should("be.visible")
      .clear()
      .type("2222222223")
      .should("have.value", "+1 (222) 222-2223");

    cy.findByLabelText(/add billing email address/i)
      .should("exist")
      .should("be.visible")
      .click();

    cy.findByLabelText(/billing emails 1/i)
      .should("exist")
      .should("be.visible")
      .type("email2@email.com")
      .should("have.value", "email2@email.com");

    // check if copy button works correctly

    cy.findByLabelText(/copy billing phone to shipping address/i)
      .should("exist")
      .should("be.visible")
      .click();

    cy.findByLabelText(/shipping phones 0/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "+1 (111) 111-1111");

    cy.findByLabelText(/copy contact email to shipping address/i)
      .should("exist")
      .should("be.visible")
      .click();
    cy.findByLabelText(/shipping emails 0/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "firstname@test.com");

    //tests for copying billing address info to shipping

    cy.findByRole("button", { name: /copy billing/i })
      .should("exist")
      .should("be.visible")
      .click();

    cy.findByLabelText(/shipping phones 0/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "+1 (222) 222-2222");

    cy.findByLabelText(/shipping emails 0/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "lastname@test.com");

    cy.findByLabelText(/shipping address 1/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "Street: 1083 Pooh Bear Lane");

    cy.findByLabelText(/shipping address 2/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "Street: 1011 Pooh Bear Lane");

    cy.findByLabelText(/shipping company/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "company 202 private limited");

    cy.findByLabelText(/shipping city/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "Jacksonville");

    cy.findByLabelText(/shipping country/i)
      .should("exist")
      .should("be.visible");

    cy.findByLabelText(/shipping state/i)
      .should("exist")
      .should("be.visible");

    cy.findByLabelText(/shipping zip/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "32216");

    cy.findByLabelText(/shipping phones 1/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "+1 (222) 222-2223");

    cy.findByLabelText(/shipping emails 1/i)
      .should("exist")
      .should("be.visible")
      .should("have.value", "email2@email.com");

    cy.findByLabelText(/is billing contact/i).check();
    cy.findByLabelText(/is shipping contact/i).check();

    cy.findByLabelText(/save contact/i).click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(15000);

    // at this point it must have jumped to create customer page

    cy.url().should(
      "match",
      /(^http:\/\/localhost:3000\/customers\/)((?:[a-z][a-z0-9_]*)$)/i
    );

    cy.findByLabelText(/take order with this customer/i)
      .should("exist")
      .should("be.visible")
      .should("not.be.disabled")
      .click();

    cy.findByRole("dialog").should("be.visible");

    cy.findByText("Create new Order").should("exist").should("be.visible");

    cy.findByRole("button", { name: /proceed/i })
      .should("exist")
      .should("be.visible")
      .click();

    cy.findByRole("dialog").should("not.exist");

    // at this point it must have created a new order and jumped to its page

    cy.waitUntil(() =>
      cy
        .url()
        .should("match", /(^http:\/\/localhost:3000\/orders\/)((?:[a-z][a-z0-9_]*))/i)
    );
  });
});
