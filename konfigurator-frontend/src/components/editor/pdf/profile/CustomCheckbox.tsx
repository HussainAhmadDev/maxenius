import { Checkbox } from '@mui/material';

function CustomCheckbox() {
  return (
    <>
      <Checkbox
        sx={{
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
        }}
      />
    </>
  );
}

export default CustomCheckbox;
