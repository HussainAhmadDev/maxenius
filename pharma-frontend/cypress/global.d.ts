/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login({ username, password }?: { username: string; password: string }): void;

    loginByApi({
      username,
      password
    }?: {
      username: string;
      password: string;
    }): Chainable<Response>;
  }
}
