import React, { ChangeEvent } from 'react';
import { PatternFormat } from 'react-number-format';
import {
  Box,
  // Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { languageData } from '@/constants';

interface CustomerDataFormProps {
  formData: {
    name: string;
    company: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    country: string;
    zipCode: string;
    email: string;
    phone: string;
  };
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const One: React.FC<CustomerDataFormProps> = ({ formData, handleChange }) => {
  const theme = useTheme();

  const customTextField = {
    margin: '12px 0px',
    '& .MuiTextField-root': {
      border: '1px solid blue',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.grey['400'],
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.grey['400'],
    },
    '& .MuiOutlinedInput-input': {
      height: '19px !important',
    },
  };

  const { labels } = languageData.form.customerData;
  return (
    <>
      <TextField
        label={labels.name}
        fullWidth
        value={formData.name}
        name="name"
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
        required
        sx={{
          ...customTextField,
          mt: '5%',
        }}
      />
      <TextField
        label={labels.company}
        fullWidth
        value={formData.company}
        name="company"
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
        required
        sx={{
          ...customTextField,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: { md: 'space-between', sm: 'center', xs: 'center' },
          flexDirection: { md: 'row', sm: 'column', xs: 'column' },
        }}
      >
        <TextField
          label={labels.firstName}
          value={formData.firstName}
          name="firstName"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
          required
          sx={{
            ...customTextField,
            width: { md: '49%', sm: '100%', xs: '100%' },
          }}
        />
        <TextField
          label={labels.lastName}
          value={formData.lastName}
          name="lastName"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
          required
          sx={{
            ...customTextField,
            width: { md: '49%', sm: '100%', xs: '100%' },
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: { md: 'space-between', sm: 'center', xs: 'center' },
          flexDirection: { md: 'row', sm: 'column', xs: 'column' },
        }}
      >
        <TextField
          label={labels.address1}
          value={formData.address1}
          name="address1"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
          required
          sx={{
            ...customTextField,
            width: { md: '49%', sm: '100%', xs: '100%' },
          }}
        />
        <TextField
          label={labels.address2}
          value={formData.address2}
          name="address2"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
          required
          sx={{
            ...customTextField,
            width: { md: '49%', sm: '100%', xs: '100%' },
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: { md: 'space-between', sm: 'center', xs: 'center' },
          flexDirection: { md: 'row', sm: 'column', xs: 'column' },
        }}
      >
        <FormControl
          sx={{
            width: { md: '49%', sm: '100%', xs: '100%' },
            ...customTextField,
          }}
        >
          <InputLabel id="demo-simple-select-label">{labels.country}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={formData.country}
            label={labels.country}
            name="country"
            onChange={(e: SelectChangeEvent<string>) =>
              handleChange({
                target: { name: e.target.name, value: e.target.value },
              } as ChangeEvent<HTMLInputElement>)
            }
            sx={{
              '& .MuiSelect-icon': {
                color: theme.palette.text.primary,
              },
            }}
          >
            <MenuItem value="Germany">Germany</MenuItem>
            <MenuItem value="USA">USA</MenuItem>
            <MenuItem value="France">France</MenuItem>
            <MenuItem value="Italy">Italy</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label={labels.zipCode}
          value={formData.zipCode}
          name="zipCode"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
          required
          inputProps={{ maxLength: 5 }}
          sx={{
            ...customTextField,
            width: { md: '49%', sm: '100%', xs: '100%' },
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: { md: 'space-between', sm: 'center', xs: 'center' },
          flexDirection: { md: 'row', sm: 'column', xs: 'column' },
        }}
      >
        <TextField
          label={labels.email}
          type="email"
          value={formData.email}
          name="email"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
          required
          sx={{
            ...customTextField,
            width: { md: '49%', sm: '100%', xs: '100%' },
          }}
        />

        <PatternFormat
          format="(###) ### ####"
          allowEmptyFormatting
          mask="_"
          label={labels.phone}
          value={formData.phone}
          name="phone"
          fullWidth
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
          prefix=""
          // thousandSeparator
          customInput={TextField}
          sx={{
            ...customTextField,
            width: { md: '49%', sm: '100%', xs: '100%' },
          }}
        />
      </Box>
    </>
  );
};

export default One;
