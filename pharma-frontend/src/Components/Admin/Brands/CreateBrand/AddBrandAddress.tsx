import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import TextInput from "../../../Form/TextInput";
import MaskingInput from "Components/Form/MaskingInput";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import { BrandsPropsInterface } from "Interfaces/Brands";
import { FieldArray, Form } from "formik";

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

  const handleNumberChange = (name: string, value: string) => {
    setFieldValue(name, value, true);
  };
  return (
    <div>
      {/* Header Section */}
      <Grid container alignItems="center">
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <br />
          <Typography variant="h6">Address</Typography>
        </Grid>
      </Grid>
      {/* Header Section */}
      <Grid container alignItems="center" spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <br />
          <Typography variant="subtitle1">Address</Typography>

          <TextInput
            onChange={handleChange}
            value={values.addressOne}
            name="addressOne"
            type="text"
            placeholder="Address 1"
            error={touched.addressOne && Boolean(errors.addressOne)}
            helperText={touched.addressOne && errors.addressOne}
          />
          <TextInput
            onChange={handleChange}
            value={values.addressTwo}
            name="addressTwo"
            type="text"
            placeholder="Address 2"
            error={touched.addressTwo && Boolean(errors.addressTwo)}
            helperText={touched.addressTwo && errors.addressTwo}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Country</Typography>
          <br />
          <TextInput
            type="text"
            name="country"
            value={values.country}
            onChange={handleChange}
            error={touched.country && Boolean(errors.country)}
            helperText={touched.country && errors.country}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">State</Typography>

          <TextInput
            onChange={handleChange}
            value={values.state}
            name="state"
            type="text"
            error={touched.state && Boolean(errors.state)}
            helperText={touched.state && errors.state}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">City</Typography>

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
          <Typography variant="subtitle1">Zip</Typography>
          <MaskingInput
            type="text"
            name="zip"
            maskType="number"
            value={values.zip}
            onChange={handleNumberChange}
            error={touched.zip && Boolean(errors.zip)}
            helperText={touched.zip && errors.zip}
          />{" "}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <br />
          <Typography variant="subtitle1">Phone Numbers</Typography>
          <Grid container>
            <Form>
              <FieldArray name="phones">
                {({ remove, push }) => (
                  <div>
                    {values.phones.length > 0 &&
                      values.phones.map((phone, index) => (
                        <Grid item key={index} lg={12} md={12} sm={12} xs={12}>
                          <div className={classes.flexAlign}>
                            <MaskingInput
                              type="text"
                              showMask={true}
                              maskType="phone"
                              name={`phones.${index}`}
                              value={phone}
                              placeholder="+x (xxx) xxx-xxxx"
                              onChange={handleNumberChange}
                              error={
                                errors && errors.phones && errors.phones[index]
                                  ? true
                                  : false
                              }
                              helperText={errors && errors.phones && errors.phones[index]}
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
                      ))}
                    <Grid container spacing={2}>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Button
                          icon={<MuiIcon icon="add" />}
                          type="secondary"
                          text="Add Phone Number"
                          onClick={() => push("")}
                        />
                      </Grid>
                    </Grid>
                  </div>
                )}
              </FieldArray>
            </Form>
          </Grid>
        </Grid>

        <Grid item lg={6} md={6} sm={12} xs={12}>
          <br />
          <Typography variant="subtitle1">Emails</Typography>
          <FieldArray name="emails">
            {({ remove, push }) => (
              <div>
                {values.emails.length > 0 &&
                  values.emails.map((email, index) => (
                    <Grid container key={index}>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div className={classes.flexAlign}>
                          <TextInput
                            onChange={handleChange}
                            value={email}
                            name={`emails.${index}`}
                            type="text"
                            error={
                              errors && errors.emails && errors.emails[index]
                                ? true
                                : false
                            }
                            helperText={errors && errors.emails && errors.emails[index]}
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
                      text="Add Email"
                      onClick={() => push("")}
                    />
                  </Grid>
                </Grid>
              </div>
            )}
          </FieldArray>
        </Grid>
      </Grid>
      <br />
      <hr />
    </div>
  );
};

export default AddUserInfo;
