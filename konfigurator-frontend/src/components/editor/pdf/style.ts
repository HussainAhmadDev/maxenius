import {
  FormControlLabel,
  Select,
  styled,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

export const StyledSelect = styled(Select)(({ theme }) => ({
  color: theme.palette.common.black,
  width: '100%',
  '& .MuiSelect-icon': {
    color: theme.palette.common.black,
  },
  '&.MuiSelect-nativeInput::placeholder': {
    color: theme.palette.common.black,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    '&:hover': {
      borderColor: '#848484',
    },
  },
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.black,
  width: '100%',
}));

export const StyledTableRow = styled(TableRow)(() => ({
  '.MuiTableCell-root': {
    ':first-of-type, :last-of-type': {
      boxShadow: 'none',
    },
  },
}));

export const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  '.MuiCheckbox-root': {
    color: theme.palette.secondary.dark,
  },
  ' .MuiFormControlLabel-label': {
    color: theme.palette.common.black,
  },
}));

export const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-input': {
    color: theme.palette.common.black,
    ':hover': {
      color: theme.palette.common.black,
      borderColor: '#848484',
    },
    '::placeholder': {
      color: '#848484',
    },
  },

  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#848484',
  },
}));
export const StyledTableInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-input': {
    color: theme.palette.common.black,
    ':hover': {
      color: theme.palette.common.black,
      borderColor: '#848484',
    },
    '::placeholder': {
      color: '#848484',
    },
  },
  '.MuiOutlinedInput': {
    paddingY: 0,
  },
  '.MuiOutlinedInput-notchedOutline': {
    borderWidth: 0,
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#848484',
  },
}));

export const StyledTableCell = styled(TableCell)(() => ({
  border: '1px solid black',
  color: 'black',
  // padding: 0,
  // margin: 0,
  // ':first-of-type': {
  //   boxShadow: 'none',
  //   padding: 0,
  // },
  // ':last-of-type': {
  //   boxShadow: 'none',
  //   border: '1px solid black',
  //   borderTop: 0,
  //   color: 'black',
  // },
}));
