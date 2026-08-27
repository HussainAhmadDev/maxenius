import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { FormikProps } from "formik";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import MaskingInput from "Components/Form/MaskingInput";
import CheckBox from "Components/CheckBox";
import TextInput from "Components/Form/TextInput";
import Switch from "Components/Switch";
import { Contact, ContactFormValidation } from "Interfaces/Company";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end"
    },
    customerBackDiv: {
      display: "flex"
    },
    markActiveDiv: {
      alignItems: "center",
      justifyContent: "flex-end",
      display: "flex",
      cursor: "pointer"
    },
    iconLabel: {
      display: "flex",
      alignItems: "center"
    },
    TypeSection: {
      display: "flex",
      alignItems: "center",
      marginLeft: theme.spacing(6),
      [theme.breakpoints.down("md")]: {
        marginLeft: 0
      }
    },
    checkedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.primary.main}`,
      marginRight: "5px"
    },
    unCheckedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.gray[300]}`,
      marginRight: "5px",
      color: theme.palette.gray[400]
    },

    infoIcon: {
      margin: "8px",
      color: theme.palette.gray[400]
    },
    desc: {
      color: theme.palette.text.secondary
    }
  })
);
interface Props {
  formData?: Contact;
  formik: FormikProps<ContactFormValidation>;
  checked?: string;
  setChecked?: React.Dispatch<React.SetStateAction<string>>;
}

const AddCustomerInfo: React.FC<Props> = ({ formik, checked, setChecked }) => {
  const classes = useStyles();

  const handleChangeBilling = () => {
    formik.setFieldValue("is_billing", !formik.values.is_billing, true);
  };

  const handleChangeShipping = () => {
    formik.setFieldValue("is_shipping", !formik.values.is_shipping, true);
  };

  const handleNumberChange = async (name: string, value: string) => {
    formik.setFieldValue(name, value, true);
  };

  return (
    <div>
      {/* Header Section */}
      <Grid container alignItems="center">
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="h6">Basic Information</Typography>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div className={classes.markActiveDiv} onClick={handleChangeBilling}>
              <p>
                <CheckBox
                  ariaLabel="is billing contact"
                  checked={formik.values.is_billing}
                  handleChange={handleChangeBilling}
                />
              </p>{" "}
              &nbsp;
              <Typography variant={formik.values.is_billing ? "body1" : "body2"}>
                Billing Contact
              </Typography>
            </div>
            <div className={classes.markActiveDiv} onClick={handleChangeShipping}>
              <p>
                <CheckBox
                  ariaLabel="is shipping contact"
                  checked={formik.values.is_shipping}
                  handleChange={handleChangeShipping}
                />
              </p>{" "}
              &nbsp;
              <Typography variant={formik.values.is_shipping ? "body1" : "body2"}>
                Shipping Contact
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
      {/* Header Section */}
      <Grid container alignItems="center" spacing={1}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Grid container alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">First Name *</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextInput
                inputProps={{ "aria-label": "contact's first name" }}
                value={formik.values.first_name}
                name="first_name"
                type="text"
                onChange={formik.handleChange}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
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
                inputProps={{ "aria-label": "contact's last name" }}
                onChange={formik.handleChange}
                value={formik.values.last_name}
                name="last_name"
                type="text"
                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <br />
      <Grid container alignItems="center">
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Typography variant="subtitle1">Email *</Typography>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextInput
            inputProps={{ "aria-label": "contact's email name" }}
            onChange={formik.handleChange}
            value={formik.values.email}
            name="email"
            type="text"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
      </Grid>
      <br />

      <Grid container spacing={1}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Grid container alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Title</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextInput
                inputProps={{ "aria-label": "contact's title'" }}
                value={formik.values.title}
                name="title"
                type="text"
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Grid container alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Company Name</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextInput
                inputProps={{ "aria-label": "contact's company name" }}
                value={formik.values.companyName}
                disabled
                name="companyName"
                type="text"
                onChange={formik.handleChange}
                error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                helperText={formik.touched.companyName && formik.errors.companyName}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={1}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Grid container alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Website</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextInput
                inputProps={{ "aria-label": "contact's website'" }}
                name="website"
                type="text"
                value={formik.values.website}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Grid container alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Office Phone</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <MaskingInput
                ariaLabel="contact's office phone"
                type="text"
                showMask={true}
                maskType="phone"
                name="office_phone"
                placeholder="+x (xxx) xxx-xxxx"
                onChange={handleNumberChange}
                value={formik.values.office_phone}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={1}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Grid container alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Billing Phone *</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <MaskingInput
                ariaLabel="contact's billing phone"
                type="text"
                showMask={true}
                maskType="phone"
                name="billing_phone"
                placeholder="+x (xxx) xxx-xxxx"
                onChange={handleNumberChange}
                value={formik.values.billing_phone}
                error={
                  formik.touched.billing_phone && Boolean(formik.errors.billing_phone)
                }
                helperText={formik.touched.billing_phone && formik.errors.billing_phone}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Grid container alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Fax</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <MaskingInput
                ariaLabel="contact's fax"
                name="fax"
                type="text"
                showMask={true}
                maskType="phone"
                placeholder="+x (xxx) xxx-xxxx"
                onChange={handleNumberChange}
                value={formik.values.fax}
                error={formik.touched.fax && Boolean(formik.errors.fax)}
                helperText={formik.touched.fax && formik.errors.fax}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <br />
      <Grid container justifyContent="space-between">
        <Grid item lg={4} md={3} sm={12} xs={12}>
          <Grid container alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Authorized to purchase</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1} lg={1}>
          <Switch
            inputProps={{ "aria-label": "switch authorized to purchase" }}
            checked={formik.values?.authorize_to_purchase}
            onChange={e =>
              formik.setFieldValue("authorize_to_purchase", e.target.checked, true)
            }
          />
        </Grid>
      </Grid>
      <br />
      <br />
      <hr />
    </div>
  );
};

export default AddCustomerInfo;
