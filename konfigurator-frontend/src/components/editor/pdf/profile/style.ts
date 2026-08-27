import { CheckBox } from '@mui/icons-material';
import { styled } from '@mui/material';

export const StyledCheckbox = styled(CheckBox)(() => ({
  '& .MuiSvgIcon-root': {
    width: '20px',
    height: '20px',
    color: 'black',
  },
  '& .Mui-checked': {
    color: 'blue',
  },
  '& .MuiCheckbox-indeterminate': {
    color: 'green',
  },
  marginBottom: '0px',
}));
