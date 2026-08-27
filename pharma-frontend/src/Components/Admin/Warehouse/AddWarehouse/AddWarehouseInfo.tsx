import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import CheckBox from "../../../CheckBox";
import TextInput from "../../../Form/TextInput";
import { WarehousePropsInterface } from "Interfaces/Warehouse";

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

const AddWarehouseInfo: React.FC<WarehousePropsInterface> = ({
  errors,
  handleChange,
  values,
  setFieldValue,
  touched
}) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);

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
                checked={checked}
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
          <Typography variant="subtitle1">Warehouse Name</Typography>

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
          <Typography variant="subtitle1">Description</Typography>

          <TextInput
            onChange={handleChange}
            value={values.description}
            name="description"
            type="text"
            isMultiline={true}
            minRows={5}
            maxRows={5}
            error={touched.description && Boolean(errors.description)}
            helperText={touched.description && errors.description}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Address Line 1</Typography>

          <TextInput
            onChange={handleChange}
            value={values.address_line_1}
            name="address_line_1"
            type="text"
            error={touched.address_line_1 && Boolean(errors.address_line_1)}
            helperText={touched.address_line_1 && errors.address_line_1}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Address Line 2</Typography>

          <TextInput
            onChange={handleChange}
            value={values.address_line_2}
            name="address_line_2"
            type="text"
            error={touched.address_line_2 && Boolean(errors.address_line_2)}
            helperText={touched.address_line_2 && errors.address_line_2}
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
      </Grid>
      <br />
      <hr />
    </div>
  );
};

export default AddWarehouseInfo;
