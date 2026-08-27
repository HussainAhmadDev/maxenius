import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Form, FieldArray } from "formik";
import CheckBox from "Components/CheckBox";
import MaskingInput from "Components/Form/MaskingInput";
import TextInput from "Components/Form/TextInput";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import { CreateOrganizationFormProps } from "Interfaces/Org";

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

const AddUserInfo: React.FC<CreateOrganizationFormProps> = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue
}) => {
  const classes = useStyles();

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
                checked={values.is_active}
                handleChange={handleChange}
                name="is_active"
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
          <Typography variant="subtitle1">Name</Typography>

          <TextInput
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Employer Identification Number</Typography>

          <TextInput
            type="text"
            name="ein"
            value={values.ein}
            onChange={handleChange}
            error={touched.ein && Boolean(errors.ein)}
            helperText={touched.ein && errors.ein}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Email</Typography>

          <TextInput
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
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
            name="office_phone"
            value={values.office_phone}
            placeholder="+x (xxx) xxx-xxxx"
            onChange={handleNumberChange}
            error={touched.office_phone && Boolean(errors.office_phone)}
            helperText={touched.office_phone && errors.office_phone}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Fax Phone</Typography>

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
            type="text"
            name="url"
            value={values.url}
            onChange={handleChange}
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

      <Form>
        <FieldArray name="domains">
          {({ remove, push }) => (
            <div>
              {values.domains?.length > 0 &&
                values.domains?.map((domain, index) => (
                  <Grid container spacing={1} key={index}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <div className={classes.flexAlign}>
                        <TextInput
                          onChange={handleChange}
                          value={domain}
                          name={`domains.${index}`}
                          type="text"
                          error={
                            errors && errors.domains && errors.domains[index]
                              ? true
                              : false
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
                    onClick={() => {
                      if (values.domains?.length < 2 || values.domains === undefined) {
                        push("");
                      }
                    }}
                    disabled={values.domains?.length >= 2}
                  />
                </Grid>
              </Grid>
            </div>
          )}
        </FieldArray>
      </Form>

      <br />
      <hr />
    </div>
  );
};

export default AddUserInfo;
