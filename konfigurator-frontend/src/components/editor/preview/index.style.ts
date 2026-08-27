import { Box, styled, TextField, Typography } from '@mui/material';

export const FlexItems = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const MeasurementField = styled(TextField)(({ theme }) => ({
  width: '100px',
  padding: '0px',
  '& .MuiOutlinedInput-input': {
    color: theme.palette.background.default,
    fontSize: '1rem',
    padding: '5px !important',
    '&:hover': {
      borderRadius: '8px',
      borderColor: '#848484',
    },
  },

  '& .MuiOutlinedInput-notchedOutline:hover': {
    borderColor: '#848484',
  },
}));

export const TypographyText = styled(Typography)(() => ({
  fontWeight: '500',
  color: 'black',
  letterSpacing: '0.4px',
  lineHeight: '24px',
  fontSize: '14px',
}));
