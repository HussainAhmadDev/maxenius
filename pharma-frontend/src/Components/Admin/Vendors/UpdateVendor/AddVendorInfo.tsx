import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import CheckBox from "../../../CheckBox";
import TextInput from "../../../Form/TextInput";
import { VendorPropsInterface } from "Interfaces/Vendors";

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
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
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
    flexAlign: {
      display: "flex",
      alignItems: "center"
    }
  })
);

const AddVendorInfo: React.FC<VendorPropsInterface> = ({
  errors,
  handleChange,
  values,
  setFieldValue,
  touched
}) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState<boolean>();
  React.useEffect(() => {
    setFieldValue("is_active", checked ? "False" : "True", true);
    //eslint-disable-next-line
  }, [checked]);
  return (
    <div>
      {/* Header Section */}
      <Grid container alignItems="center">
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <Typography variant="h6">Basic Information</Typography>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <div className={classes.markActiveDiv}>
            <p>
              <CheckBox
                checked={!checked ? (values.is_active ? false : true) : checked}
                handleChange={e => setChecked(e.target.checked)}
              />
            </p>{" "}
            &nbsp;
            <Typography variant="body2">Mark as Not-Active</Typography>
          </div>
        </Grid>
      </Grid>
      {/* Header Section */}
      <Grid container alignItems="center" spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Typography variant="subtitle1">Vendor Name</Typography>

          <TextInput
            onChange={handleChange}
            value={values.name}
            name="name"
            type="text"
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Typography variant="subtitle1">Contact Name</Typography>

          <TextInput
            onChange={handleChange}
            value={values.contact_name}
            name="contact_name"
            type="text"
            error={touched.contact_name && Boolean(errors.contact_name)}
            helperText={touched.contact_name && errors.contact_name}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Address</Typography>

          <TextInput
            onChange={handleChange}
            value={values.address}
            name="address"
            type="text"
            error={touched.address && Boolean(errors.address)}
            helperText={touched.address && errors.address}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Alternative Address</Typography>

          <TextInput
            onChange={handleChange}
            value={values.alternative_address}
            name="alternative_address"
            type="text"
            error={touched.alternative_address && Boolean(errors.alternative_address)}
            helperText={touched.alternative_address && errors.alternative_address}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">City/Town</Typography>
          <TextInput
            onChange={handleChange}
            value={values.city}
            name="city"
            type="text"
            error={touched.city && Boolean(errors.city)}
            helperText={touched.city && errors.city}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Region</Typography>

          <TextInput
            onChange={handleChange}
            value={values.region}
            name="region"
            type="text"
            error={touched.region && Boolean(errors.region)}
            helperText={touched.region && errors.region}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Post code</Typography>

          <TextInput
            onChange={handleChange}
            value={values.post_code}
            name="post_code"
            type="text"
            error={touched.post_code && Boolean(errors.post_code)}
            helperText={touched.post_code && errors.post_code}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Country</Typography>

          <TextInput
            onChange={handleChange}
            value={values.country}
            name="country"
            type="text"
            error={touched.country && Boolean(errors.country)}
            helperText={touched.country && errors.country}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Contact Telephone</Typography>

          <TextInput
            onChange={handleChange}
            value={values.contact_phone}
            name="contact_phone"
            type="text"
            error={touched.contact_phone && Boolean(errors.contact_phone)}
            helperText={touched.contact_phone && errors.contact_phone}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Secondary Telephone</Typography>

          <TextInput
            onChange={handleChange}
            value={values.secondary_phone}
            name="secondary_phone"
            type="text"
            error={touched.secondary_phone && Boolean(errors.secondary_phone)}
            helperText={touched.secondary_phone && errors.secondary_phone}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Fax</Typography>

          <TextInput
            onChange={handleChange}
            value={values.fax}
            name="fax"
            type="text"
            error={touched.fax && Boolean(errors.fax)}
            helperText={touched.fax && errors.fax}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Email</Typography>

          <TextInput
            onChange={handleChange}
            value={values.email}
            name="email"
            type="text"
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Webpage</Typography>

          <TextInput
            onChange={handleChange}
            value={values.webpage}
            name="webpage"
            type="text"
            error={touched.webpage && Boolean(errors.webpage)}
            helperText={touched.webpage && errors.webpage}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Currency</Typography>

          <TextInput
            onChange={handleChange}
            value={values.currency}
            name="currency"
            type="text"
            error={touched.currency && Boolean(errors.currency)}
            helperText={touched.currency && errors.currency}
          />
        </Grid>
      </Grid>
      <br />
      <hr />
    </div>
  );
};

export default AddVendorInfo;
