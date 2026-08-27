import { Theme, ThemeOptions } from '@mui/material';

export default function Menu(theme: Theme): ThemeOptions['components'] {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          background: 'black',
          ':hover': {
            background: 'black',
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
        },
      },
    },
  };
}
