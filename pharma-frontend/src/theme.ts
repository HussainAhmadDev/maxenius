import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    gray: PaletteOptions["gray"];
    green: PaletteOptions["green"];
  }
  interface PaletteOptions {
    gray: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      900: string;
      700: string;
      1000: string;
      1100: string;
      1200: string;
      1300: string;
      1400: string;
      1500: string;
      grayBg: string;
    };
    green: {
      success: string;
      successBg: string;
    };
  }
}

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: "#FF173D",
        dark: "#AC0C3C"
      },
      text: {
        primary: "#1A202E",
        secondary: "#475569"
      },
      background: {
        default: "#FFFFFF"
      },
      gray: {
        100: "#F9FAFB",
        200: "#E2E8F0",
        300: "#CFD8E3",
        400: "#97A6BA",
        500: "#475569",
        600: "#1A202E",
        700: "#E6EBEE",
        900: "#212121",
        1000: "#F1F5F9",
        1100: "#AEBABF",
        1200: "#64748B",
        1300: "#AC0C3C",
        1400: "#ECFFEC",
        1500: "#27C324",
        grayBg: "#f1f5f9"
      },
      green: {
        success: "#27C324",
        successBg: "#ECFFEC"
      }
    },
    typography: {
      fontFamily: "Poppins",
      fontSize: 14,
      fontWeightBold: 500,
      h1: {
        fontSize: 22,
        fontWeight: 500,
        lineHeight: 1.5
      },
      body1: {
        fontSize: 14,
        fontWeight: 400,
        color: "#475569"
      },
      body2: {
        color: "#97A6BA",
        fontSize: 14,
        fontWeight: 400
      },
      subtitle1: {
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "21px"
      },
      button: {
        borderRadius: 6,
        fontSize: 12,
        lineHeight: "18px",
        fontWeight: 400
      }
    },
    overrides: {
      MuiButton: {
        root: {
          borderRadius: 6,
          textTransform: "initial",
          height: "34px",
          "&:disabled": {
            background: "#E6EBEE"
          }
        },

        containedPrimary: {
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "18px",
          padding: "8px 14px"
        }
      },
      MuiIconButton: {
        root: {},
        sizeSmall: {
          height: "37px",
          width: "37px",
          marginTop: "4px"
        }
      },
      MuiTextField: {
        root: {}
      },
      MuiInputBase: {
        root: {}
      }
    },
    props: {
      MuiButton: {
        disableElevation: true,
        color: "primary"
      },
      MuiTextField: {
        variant: "outlined",
        margin: "dense"
      }
    }
  })
);

export default theme;
