import { Theme, ThemeOptions } from '@mui/material';

export default function Tabs(theme: Theme): ThemeOptions['components'] {
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.common.white,
          color: theme.palette.common.black,

          '.Mui-selected': {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
          },
        },
        flexContainer: {
          gap: '1rem',
          '.MuiButtonBase-root': {
            minWidth: '5rem',
            color: theme.palette.common.black,
            '&.Mui-selected': {
              color: theme.palette.common.white,
            },
          },
        },

        indicator: {
          color: theme.palette.common.white,
          display: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.common.white,
          color: theme.palette.common.black,
          border: '1px solid black',
          borderRadius: '10px',
        },
        selected: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
      },
    },
  };
}
