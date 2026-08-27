import { Theme, ThemeOptions } from '@mui/material';

export default function Table(theme: Theme): ThemeOptions['components'] {
  return {
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': {
            backgroundColor: theme.palette.grey[300],
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.light,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${theme.palette.grey[500]}`,
        },
        head: {
          textAlign: 'center',
          color: theme.palette.text.secondary,
          '&:first-of-type': {
            paddingLeft: theme.spacing(3),
            borderTopLeftRadius: theme.shape.borderRadius,
            borderBottomLeftRadius: theme.shape.borderRadius,
            boxShadow: `inset 8px 0 0 ${theme.palette.background.paper}`,
          },
          '&:last-of-type': {
            paddingRight: theme.spacing(3),
            borderTopRightRadius: theme.shape.borderRadius,
            borderBottomRightRadius: theme.shape.borderRadius,
            boxShadow: `inset -8px 0 0 ${theme.palette.background.paper}`,
          },
        },

        stickyHeader: {
          backgroundColor: theme.palette.background.paper,
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          ':hover': {
            color: 'white',
          },
          ':focus': {
            color: 'white',
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: `solid 1px ${theme.palette.divider}`,
        },
        toolbar: {
          height: 64,
        },
        select: {
          '&:focus': {
            borderRadius: theme.shape.borderRadius,
          },
        },

        selectIcon: {
          width: 20,
          height: 20,
          color: theme.palette.common.white,
          marginTop: -4,
        },
      },
    },
  };
}
