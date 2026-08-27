import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import MaskingInput from "Components/Form/MaskingInput";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import CheckBox from "../../../CheckBox";
import TextInput from "../../../Form/TextInput";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import { BrandsPropsInterface } from "Interfaces/Brands";
import { FieldArray } from "formik";

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

const AddUserInfo: React.FC<BrandsPropsInterface> = ({
  errors,
  handleChange,
  values,
  setFieldValue,
  touched
}) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const handleNumberChange = (name: string, value: string) => {
    setFieldValue(name, value, true);
  };

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
          <Typography variant="subtitle1">Brand Name</Typography>

          <TextInput
            onChange={handleChange}
            value={values.brandName}
            name="brandName"
            type="text"
            error={touched.brandName && Boolean(errors.brandName)}
            helperText={touched.brandName && errors.brandName}
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
          <Typography variant="subtitle1">Office Phone Number</Typography>

          <MaskingInput
            type="text"
            showMask={true}
            maskType="phone"
            name="officeNumber"
            value={values.officeNumber}
            placeholder="+x (xxx) xxx-xxxx"
            onChange={handleNumberChange}
            error={touched.officeNumber && Boolean(errors.officeNumber)}
            helperText={touched.officeNumber && errors.officeNumber}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Fax</Typography>
          <MaskingInput
            type="text"
            showMask={true}
            maskType="phone"
            name="fax"
            value={values.fax}
            placeholder="+x (xxx) xxx-xxxx"
            onChange={handleNumberChange}
            error={touched.fax && Boolean(errors.fax)}
            helperText={touched.fax && errors.fax}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">URL</Typography>

          <TextInput
            onChange={handleChange}
            value={values.url}
            name="url"
            type="text"
            error={touched.url && Boolean(errors.url)}
            helperText={touched.url && errors.url}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <br />
          <Typography variant="subtitle1">Domains</Typography>
        </Grid>
      </Grid>
      <FieldArray name="domains">
        {({ remove, push }) => (
          <div>
            {values.domains.length > 0 &&
              values.domains.map((domain, index) => (
                <Grid container spacing={1} key={index}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <div className={classes.flexAlign}>
                      <TextInput
                        onChange={handleChange}
                        value={domain}
                        name={`domains.${index}`}
                        type="text"
                        error={
                          errors && errors.domains && errors.domains[index] ? true : false
                        }
                        helperText={errors && errors.domains && errors.domains[index]}
                      />{" "}
                      &nbsp;&nbsp;
                      <Button
                        icon={<MuiIcon icon="delete" />}
                        type="secondary"
                        onlyIcon={true}
                        onClick={() => remove(index)}
                        size="small"
                      />
                    </div>
                  </Grid>
                </Grid>
              ))}
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Button
                  icon={<MuiIcon icon="add" />}
                  type="secondary"
                  text="Add Domain"
                  onClick={() => push("")}
                />
              </Grid>
            </Grid>
          </div>
        )}
      </FieldArray>
      <br />
      <hr />
    </div>
  );
};

export default AddUserInfo;
