import { Theme, ThemeOptions } from '@mui/material';

export default function Stepper(theme: Theme): ThemeOptions['components'] {
  return {
    MuiStepConnector: {
      styleOverrides: {
        line: {
          border: 'none',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.common.white,
        },
        completed: {
          color: theme.palette.common.white,
        },
        labelContainer: {
          color: theme.palette?.grey['400'],
        },
        label: {
          color: theme.palette.common.white,
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          //   color: theme.palette.primary.main,
          color: theme.palette?.grey['400'],
        },
        active: {
          color: theme.palette.primary.main,
        },
        text: {
          fill: theme.palette?.grey['600'],
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          //   color: theme.palette?.grey['400'],
        },
      },
    },
  };
}
