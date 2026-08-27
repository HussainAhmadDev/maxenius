import React, { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';

import 'react-international-phone/style.css';
import './styles.css';
const PhoneNoApp: React.FC = () => {
  const [phone, setPhone] = useState<string>('');

  return (
    <div style={{ backgroundColor: 'transparent' }}>
      <NumericFormat value={12323} prefix="$" thousandSeparator customInput={TextField} />
      <TextField
        label="Telefonnummer"
        variant="outlined"
        fullWidth
        value={phone}
        onChange={(event) => setPhone(event?.target?.value)}
        InputProps={{
          inputComponent: CustomPhoneInput as any,
        }}
      />
    </div>
  );
};

const CustomPhoneInput = (props: any) => (
  <div style={{}}>
    <PhoneInput {...props} />
  </div>
);

export default PhoneNoApp;
