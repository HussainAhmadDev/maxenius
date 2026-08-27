import React from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import { CopyAll, Add } from "@mui/icons-material";
import { Address } from "@interfaces/companyType";
import { countries, countryStateMap } from "../../Utils/countries";

interface AddressFormProps {
  title: string;
  address: Address;
  onAddressChange: (newAddress: Address) => void;
  onCopy: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  title,
  address,
  onAddressChange,
  onCopy
}) => {
  const handleChange = (field: keyof Address, value: string) => {
    onAddressChange({ ...address, [field]: value });
  };

  const handleAddPhoneNumber = () => {
    onAddressChange({ ...address, phoneNumbers: [...address.phoneNumbers, ""] });
  };

  const handleAddEmail = () => {
    onAddressChange({ ...address, emails: [...address.emails, ""] });
  };

  const handlePhoneChange = (index: number, value: string) => {
    onAddressChange({
      ...address,
      phoneNumbers: address?.phoneNumbers.map((phone, i) => (i === index ? value : phone))
    });
  };

  // Filter states based on the selected country
  const states = countryStateMap[address.country] || [];

  return (
    <Box>
      <Typography variant="h6">
        <Checkbox defaultChecked={true} /> {title}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="First Name"
            fullWidth
            value={address.first_name}
            onChange={e => handleChange("first_name", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Last Name"
            fullWidth
            value={address.last_name}
            onChange={e => handleChange("last_name", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address 1"
            fullWidth
            value={address.address1}
            onChange={e => handleChange("address1", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address 2"
            fullWidth
            value={address.address2}
            onChange={e => handleChange("address2", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Company"
            fullWidth
            value={address.company}
            onChange={e => handleChange("company", e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="City"
            fullWidth
            value={address.city}
            onChange={e => handleChange("city", e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Country</InputLabel>
            <Select
              value={address.country}
              onChange={e => handleChange("country", e.target.value)}
              label="Country"
            >
              {countries.map(item => (
                <MenuItem key={item.id} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select
              value={address.state}
              onChange={e => handleChange("state", e.target.value)}
              label="State"
            >
              {states.length > 0 ? (
                states.map(state => (
                  <MenuItem key={state.id} value={state.value}>
                    {state.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No States Available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="ZIP"
            fullWidth
            value={address.zip}
            onChange={e => handleChange("zip", e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" startIcon={<CopyAll />} onClick={onCopy}>
            Copy Address
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Phone Numbers</Typography>
          {address.phoneNumbers.map((phone, index) => (
            <TextField
              key={index}
              value={phone}
              fullWidth
              placeholder="No Phone Numbers Added"
              onChange={e => handlePhoneChange(index, e.target.value)}
            />
          ))}
          <Button variant="outlined" startIcon={<Add />} onClick={handleAddPhoneNumber}>
            Add Phone Number
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Email Addresses</Typography>
          {address.emails.map((email, index) => (
            <TextField
              key={index}
              value={email}
              fullWidth
              placeholder="No Email Addresses Added"
              onChange={e =>
                handleChange(
                  "emails",
                  address.emails.map((em, i) =>
                    i === index ? e.target.value : em
                  ) as unknown as string
                )
              }
            />
          ))}
          <Button variant="outlined" startIcon={<Add />} onClick={handleAddEmail}>
            Add Email
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressForm;
