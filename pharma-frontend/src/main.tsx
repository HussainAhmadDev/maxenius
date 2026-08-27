import * as React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import App from "./Components/App";
// import "@fontsource/poppins";
import "./index.css";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import theme from "./theme";
import { API_URL } from "Hooks/api";

if (API_URL === "https://refineims.maxenius.com/prod/api/v1") {
  Sentry.init({
    dsn: "https://414fc715b5a003612d541342a8dea8b5@o4504637452976128.ingest.sentry.io/4506037717630976",
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    // Performance Monitoring
    tracesSampleRate: 1.0 // Capture 100% of the transactions, reduce in production!
    // Session Replay
  });

  // const AppWithSentry = Sentry.withProfiler(App);
}

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
