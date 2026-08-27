import { Theme, ThemeOptions } from '@mui/material';

export default function Dialog(theme: Theme): ThemeOptions['components'] {
  return {
    MuiDialog: {
      styleOverrides: {
        root: {
          padding: theme.spacing(2),
          backdropFilter: 'blur(8px)',
        },
        paper: {
          backgroundColor: theme.palette.grey[200],
          maxWidth: '100%',

          [theme.breakpoints.up('md')]: {
            width: '65%',
          },
          [theme.breakpoints.up('sm')]: {
            width: '80%',
          },
          [theme.breakpoints.up('md')]: {
            width: '90%',
          },
        },
      },
    },
  };
}
