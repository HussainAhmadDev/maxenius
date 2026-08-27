import { useMemo } from "react";
import { CssBaseline, Theme } from "@mui/material";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider as MUIThemeProvider
} from "@mui/material";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";
import componentsOverride from "./overrides";
import { palette } from "./palette";
import { typography } from "./typography";
import { ToastContainer } from "react-toastify";

ThemeProvider.propTypes = {
  children: PropTypes.node
};

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeOptions = useMemo(
    () => ({
      palette,
      typography,
      shape: { borderRadius: 5 }
    }),
    []
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme) as unknown as Theme["components"];

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <ToastContainer
          pauseOnHover
          autoClose={1500}
          theme="colored"
          position="top-right"
        />
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
