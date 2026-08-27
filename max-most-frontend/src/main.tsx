import { createRoot } from "react-dom/client";
import ThemeProvider from "./MuiTheme";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";
import { UserProvider } from "./Contexts/userContext";
import { BrandProvider } from "./Contexts/brandContext";
import Router from "./router";

const queryClient = new QueryClient();
const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <UserProvider>
        <BrandProvider>
          <Router />
        </BrandProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
