import { Theme } from "@mui/material";

export default function Button(theme: Theme) {
  return {
    MuiButton: {
      variants: [
        {
          props: {
            variant: "contained",
            color: "primary"
          },
          style: {
            color: theme.palette.common.white
          }
        },
        {
          props: {
            color: "info"
          },
          style: {
            color: theme.palette.common.black,
            boxShadow: "none",
            ":disabled": {
              "& svg": {
                opacity: ".6"
              }
            },
            "& svg": {
              transition: "all .1s ease-in-out",
              color: theme.palette.primary.main
            },
            "&:hover": {
              background: theme.palette.divider
            }
          }
        },
        {
          props: {
            variant: "contained",
            color: "info"
          },
          style: {
            color: theme.palette.common.black,
            background: theme.palette.common.white,
            outline: `1px solid ${theme.palette.divider}`,
            boxShadow: "none",
            "& svg": {
              color: theme.palette.primary.main
            },
            "&:hover": {
              background: theme.palette.divider
            }
          }
        }
      ],
      styleOverrides: {
        root: {
          "&:hover": {
            boxShadow: "none"
          },
          textTransform: "capitalize",
          borderRadius: 5
        },
        textInherit: {
          "&:hover": {
            backgroundColor: theme.palette.action.hover
          }
        }
      }
    }
  };
}
