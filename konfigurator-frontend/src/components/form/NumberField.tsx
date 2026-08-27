import { TextField, TextFieldProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const NumberField = ({ ...rest }: TextFieldProps) => {
  const theme = useTheme();
  const customTextField = {
    margin: '12px 0px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.grey['700'],
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.grey['400'],
    },
    '& .MuiOutlinedInput-input': {
      height: '19px !important',
    },
  };

  return (
    <TextField
      {...rest}
      fullWidth
      InputProps={{
        inputProps: { min: 1 },
      }}
      type="number"
      sx={{
        ...customTextField,
      }}
    />
  );
};

export default NumberField;
