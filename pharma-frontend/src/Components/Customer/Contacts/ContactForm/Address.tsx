import * as React from "react";
import { Typography } from "@material-ui/core";
import { FormikProps } from "formik";
import Grid from "@mui/material/Grid";
import TextInput from "../../../Form/TextInput";
import ShippingAddressInfo from "./ShippingAddressInfo";
import BillingAddressInfo from "./BillingAddressInfo";
import { ContactFormValidation } from "Interfaces/Company";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";

interface Props {
  formik: FormikProps<ContactFormValidation>;
}

const Address: React.FC<Props> = ({ formik }) => {
  const copyInfo = async () => {
    await formik.setFieldValue("address_first_name", formik.values.first_name, true);

    await formik.setFieldValue("address_last_name", formik.values.last_name, true);
  };

  return (
    <div>
      <div>
        <Typography variant="h6">Address</Typography>
      </div>
      <br />
      <Grid container>
        <Grid item xs={8} lg={8}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Grid container alignItems="center">
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Typography variant="subtitle1">First Name *</Typography>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextInput
                    inputProps={{ "aria-label": "address first name" }}
                    value={formik.values.address_first_name}
                    name="address_first_name"
                    type="text"
                    onChange={formik.handleChange}
                    error={
                      formik.touched.address_first_name &&
                      Boolean(formik.errors.address_first_name)
                    }
                    helperText={
                      formik.touched.address_first_name &&
                      formik.errors.address_first_name
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Grid container alignItems="center">
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Typography variant="subtitle1">Last Name *</Typography>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextInput
                    inputProps={{ "aria-label": "address last name" }}
                    value={formik.values.address_last_name}
                    name="address_last_name"
                    type="text"
                    onChange={formik.handleChange}
                    error={
                      formik.touched.address_last_name &&
                      Boolean(formik.errors.address_last_name)
                    }
                    helperText={
                      formik.touched.address_last_name && formik.errors.address_last_name
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Button
                ariaLabel="copy address info"
                type="secondary"
                size="small"
                icon={<MuiIcon icon="copy" />}
                text="Copy Info"
                onClick={copyInfo}
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12} mb={3} mt={1}>
              <Grid container alignItems="center">
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Typography variant="subtitle1">Label</Typography>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextInput
                    inputProps={{ "aria-label": "address label" }}
                    value={formik.values.label}
                    name="label"
                    type="text"
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <hr />
      <br />
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <BillingAddressInfo formik={formik} />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <ShippingAddressInfo formik={formik} />
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <Grid container alignItems="center">
            <Grid item xs={12} lg={12}>
              <br />
              <br />
              <hr />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Address;
