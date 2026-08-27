import { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Divider,
  Button,
  Card,
  CardContent
} from "@mui/material";
import AddressForm from "./shippingAndBillingAddress";
import { ContactRequest, useCreateContact, useSaveContact } from "../../Hooks/useContact";
import { useUser } from "../../Contexts/userContext";
import { getBrandDetails } from "../../Hooks/api";
import { Address } from "@interfaces/companyType";
import { useNavigate, useParams } from "react-router-dom";

const CreateContact = () => {
  const [formData, setFormData] = useState({
    title: "",
    is_billing: true,
    is_shipping: true,
    website: "",
    office_phone: "",
    billing_phone: "",
    user: {
      first_name: "",
      last_name: "",
      email: "",
      type: "contact",
      company: ""
    },
    billing_address: {
      first_name: "",
      last_name: "",
      fax: "",
      zip: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      country: "",
      phone: ""
    },
    shipping_address: {
      first_name: "",
      last_name: "",
      fax: "",
      zip: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      country: "",
      phone: ""
    },
    do_not_call: false,
    do_not_email: false,
    do_not_mail: false,
    do_not_text: false,
    organization_id: "7koPZM"
  });

  //eslint-disable-next-line
  //@ts-ignore
  const handleChange = e => {
    const { name, value, checked, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  const { user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate, data } = useCreateContact();
  const { mutate: saveContactID } = useSaveContact(id ?? null);
  const activeBrand = getBrandDetails();
  const organization_id = activeBrand?.organization_id;
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      shipping_address: {
        street1: shippingAddress?.street1 || "N/A",
        street2: shippingAddress?.street2 || "",
        company: shippingAddress?.company || "",
        city: shippingAddress?.city || "",
        country: shippingAddress.country,
        state: shippingAddress?.state || "",
        zip: shippingAddress?.zip || "",
        phone: shippingAddress?.phone || "",
        first_name: shippingAddress?.first_name || "N/A",
        last_name: shippingAddress?.last_name || "N/A",
        type: "contact"
      },
      billing_address: {
        street1: billingAddress?.street1 || "N/A",
        street2: billingAddress?.street2 || "",
        company: billingAddress?.company || "",
        city: billingAddress?.city || "",
        country: shippingAddress.country,
        state: billingAddress?.state || "",
        zip: billingAddress?.zip || "",
        phone: billingAddress?.phone || "",
        first_name: billingAddress?.first_name || "N/A",
        last_name: billingAddress?.last_name || "N/A",
        type: "contact"
      },
      user: {
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        type: "contact"
      },
      organization_id: organization_id,
      do_not_call: formData.do_not_call || false,
      do_not_email: formData.do_not_email || true,
      do_not_mail: formData.do_not_mail || true,
      do_not_text: formData.do_not_text || false
    };

    mutate(updatedFormData as ContactRequest); // Send the corrected data to the API
  };

  useEffect(() => {
    if (data) {
      saveContactID({
        brand_id: activeBrand?.id ?? "",
        contact_id: data?.id,
        organization_id: activeBrand?.organization_id ?? ""
      });
    }
  }, [activeBrand?.id, activeBrand?.organization_id, data, saveContactID]);

  const [billingAddress, setBillingAddress] = useState<Address>({
    id: "",
    first_name: "",
    last_name: "",
    street1: "",
    address1: "",
    address2: "",
    company: "",
    city: "",
    country: "",
    state: "",
    zip: "",
    phoneNumbers: [],
    emails: []
  });

  const [shippingAddress, setShippingAddress] = useState<Address>({
    id: "",
    first_name: "",
    last_name: "",
    street1: "",
    address1: "",
    address2: "",
    company: "",
    city: "",
    country: "",
    state: "",
    zip: "",
    phoneNumbers: [],
    emails: []
  });

  const copyBillingToShipping = () => {
    setShippingAddress(billingAddress);
  };

  const copyShippingToBilling = () => {
    setBillingAddress(shippingAddress);
  };

  const handleNestedChange = (name: string, value: string) => {
    setFormData(prevData => {
      const keys = name.split(".");
      const tempData = { ...prevData };
      let nested = tempData; // Use 'any' here to allow dynamic key access

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          //eslint-disable-next-line
          //@ts-ignore
          nested[key] = value;
        } else {
          //eslint-disable-next-line
          //@ts-ignore
          if (!nested[key]) nested[key] = {}; // Ensure the object exists
          //eslint-disable-next-line
          //@ts-ignore
          nested = nested[key];
        }
      });

      return tempData;
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create Contact
        </Typography>

        {/* Basic Information */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="First Name *"
                  name="user.first_name"
                  value={formData.user.first_name}
                  onChange={e => handleNestedChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Last Name *"
                  name="user.last_name"
                  value={formData.user.last_name}
                  onChange={e => handleNestedChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email *"
                  name="user.email"
                  value={formData.user.email}
                  onChange={e => handleNestedChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Company Name"
                  name="user.company"
                  value={formData.user.company}
                  onChange={e => handleNestedChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={e => handleNestedChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Office Phone"
                  name="office_phone"
                  value={formData.office_phone}
                  onChange={e => handleNestedChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <AddressForm
                  title="Billing Address"
                  address={billingAddress}
                  onAddressChange={setBillingAddress}
                  onCopy={copyShippingToBilling}
                />
              </Grid>
              <Grid item xs={6}>
                <AddressForm
                  title="Shipping Address"
                  address={shippingAddress}
                  onAddressChange={setShippingAddress}
                  onCopy={copyBillingToShipping}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Contact Preferences */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact Preferences
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.do_not_call}
                      onChange={handleChange}
                      name="do_not_call"
                    />
                  }
                  label="Do Not Call"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.do_not_email}
                      onChange={handleChange}
                      name="do_not_email"
                    />
                  }
                  label="Do Not Email"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.do_not_mail}
                      onChange={handleChange}
                      name="do_not_mail"
                    />
                  }
                  label="Do Not Mail"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.do_not_text}
                      onChange={handleChange}
                      name="do_not_text"
                    />
                  }
                  label="Do Not Text"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: "right" }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mr: 2 }}
          >
            Save Contact
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/edit-customer/${id}`)}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default CreateContact;
