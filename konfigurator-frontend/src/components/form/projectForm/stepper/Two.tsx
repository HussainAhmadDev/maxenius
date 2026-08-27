import React, { ChangeEvent } from 'react';
import { PatternFormat } from 'react-number-format';
import {
  Box,
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
  formDataTwo: {
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
  handleChangeTwo: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitTwo: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Two: React.FC<CustomerDataFormProps> = ({ formDataTwo, handleChangeTwo }) => {
  const theme = useTheme();

  const { labels } = languageData.form.assemblerData;
  return (
    <>
      <TextField
        label={labels.company}
        fullWidth
        value={formDataTwo.company}
        name="company"
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTwo(e)}
        sx={{
          my: '1rem',
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
          value={formDataTwo.firstName}
          name="firstName"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTwo(e)}
          sx={{
            width: { md: '49%', sm: '100%', xs: '100%' },
          }}
        />
        <TextField
          label={labels.lastName}
          value={formDataTwo.lastName}
          name="lastName"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTwo(e)}
          sx={{
            width: { md: '49%', sm: '100%', xs: '100%' },
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          my: '1rem',
          justifyContent: { md: 'space-between', sm: 'center', xs: 'center' },
          flexDirection: { md: 'row', sm: 'column', xs: 'column' },
        }}
      >
        <TextField
          label={labels.address1}
          value={formDataTwo.address1}
          name="address1"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTwo(e)}
          sx={{
            width: { md: '49%', sm: '100%', xs: '100%' },
          }}
        />
        <TextField
          label={labels.address2}
          value={formDataTwo.address2}
          name="address2"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTwo(e)}
          sx={{
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
            mb: '14px',
          }}
        >
          <InputLabel id="demo-simple-select-label">{labels.country}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={formDataTwo.country}
            label={labels.country}
            name="country"
            onChange={(e: SelectChangeEvent<string>) =>
              handleChangeTwo({
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
          value={formDataTwo.zipCode}
          name="zipCode"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTwo(e)}
          inputProps={{ maxLength: 5 }}
          sx={{
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
          value={formDataTwo.email}
          name="email"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTwo(e)}
          sx={{
            width: { md: '49%', sm: '100%', xs: '100%' },
          }}
        />

        <PatternFormat
          format="(###) ### ####"
          allowEmptyFormatting
          mask="_"
          label={labels.phone}
          value={formDataTwo.phone}
          name="phone"
          fullWidth
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTwo(e)}
          prefix=""
          customInput={TextField}
          sx={{
            width: { md: '49%', sm: '100%', xs: '100%' },
          }}
        />
      </Box>
    </>
  );
};

export default Two;
