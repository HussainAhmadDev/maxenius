import { Theme, ThemeOptions } from '@mui/material';

export default function Input(theme: Theme): ThemeOptions['components'] {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          '::placeholder': {
            color: theme.palette.text.primary,
          },
          '&.Mui-disabled': {
            '& svg': { color: theme.palette.text.disabled },
          },
        },
        input: {
          '::placeholder': {
            opacity: 1,
            color: theme.palette.text.primary,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500],
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.grey['400'],
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: 'white',
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.grey['400'],
          },
        },
        input: {
          height: '19px',
        },
      },
    },
    MuiTextField: {
      variants: [
        {
          props: {
            variant: 'outlined',
          },
          style: {
            margin: '0.2rem 0px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.grey['400'],
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          margin: '1rem 0px',
          border: theme.palette.grey['400'],
        },
      },
    },
  };
}
