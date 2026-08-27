import { defineConfig } from "cypress";
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://localhost:3000",
    viewportWidth: 1440,
    viewportHeight: 900,
    defaultCommandTimeout: 10000, // Command timeout (e.g., cy.get, cy.click)
    pageLoadTimeout: 60000, // Page load timeout
    requestTimeout: 5000, // Request timeout
    responseTimeout: 30000 // Response timeout
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite"
    }
  }
});
