import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import TextInput from "Components/Form/TextInput";
import MaskingInput from "Components/Form/MaskingInput";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import { CreateOrganizationFormProps } from "Interfaces/Org";
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

const AddUserInfo: React.FC<CreateOrganizationFormProps> = ({
  errors,
  handleChange,
  values,
  touched,
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
            type="text"
            name="address_street1"
            value={values.address_street1}
            onChange={handleChange}
            placeholder="Address 1"
            error={touched.address_street1 && Boolean(errors.address_street1)}
            helperText={touched.address_street1 && errors.address_street1}
          />
          <TextInput
            type="text"
            name="address_street2"
            value={values.address_street2}
            onChange={handleChange}
            placeholder="Address 2"
            error={touched.address_street2 && Boolean(errors.address_street2)}
            helperText={touched.address_street2 && errors.address_street2}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Country</Typography>
          <br />

          <TextInput
            type="text"
            name="address_country"
            value={values.address_country}
            onChange={handleChange}
            error={touched.address_country && Boolean(errors.address_country)}
            helperText={touched.address_country && errors.address_country}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">State</Typography>

          <TextInput
            type="text"
            name="address_state"
            value={values.address_state}
            onChange={handleChange}
            error={touched.address_state && Boolean(errors.address_state)}
            helperText={touched.address_state && errors.address_state}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">City</Typography>

          <TextInput
            type="text"
            name="address_city"
            value={values.address_city}
            onChange={handleChange}
            error={touched.address_city && Boolean(errors.address_city)}
            helperText={touched.address_city && errors.address_city}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Typography variant="subtitle1">Zip</Typography>

          <TextInput
            onChange={handleChange}
            value={values.address_zip}
            name="address_zip"
            type="text"
            error={touched.address_zip && Boolean(errors.address_zip)}
            helperText={touched.address_zip && errors.address_zip}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <br />
          <Typography variant="subtitle1">Phone Numbers</Typography>
          <Grid container>
            <Form>
              <FieldArray name="address_phones">
                {({ remove, push }) => (
                  <div>
                    {values.address_phones?.length > 0 &&
                      values.address_phones?.map((phone, index) => (
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <div className={classes.flexAlign}>
                            <MaskingInput
                              type="text"
                              showMask={true}
                              maskType="phone"
                              name={`address_phones.${index}`}
                              value={phone}
                              placeholder="+x (xxx) xxx-xxxx"
                              onChange={handleNumberChange}
                              error={
                                errors &&
                                errors.address_phones &&
                                errors.address_phones[index]
                                  ? true
                                  : false
                              }
                              helperText={
                                errors &&
                                errors.address_phones &&
                                errors.address_phones[index]
                              }
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
                          text="Add Phone"
                          onClick={() => {
                            if (
                              values.address_phones?.length < 2 ||
                              values.address_phones === undefined
                            ) {
                              push("");
                            }
                          }}
                          disabled={values.address_phones?.length >= 2}
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
          <Form>
            <FieldArray name="address_emails">
              {({ remove, push }) => (
                <div>
                  {values.address_emails?.length > 0 &&
                    values.address_emails?.map((email, index) => (
                      <Grid container key={index}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <div className={classes.flexAlign}>
                            <TextInput
                              onChange={handleChange}
                              value={email}
                              name={`address_emails.${index}`}
                              type="text"
                              error={
                                errors &&
                                errors.address_emails &&
                                errors.address_emails[index]
                                  ? true
                                  : false
                              }
                              helperText={
                                errors &&
                                errors.address_emails &&
                                errors.address_emails[index]
                              }
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
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Button
                        icon={<MuiIcon icon="add" />}
                        type="secondary"
                        text="Add Email"
                        onClick={() => {
                          if (
                            values.address_emails?.length < 4 ||
                            values.address_emails === undefined
                          ) {
                            push("");
                          }
                        }}
                        disabled={values.address_emails?.length >= 4}
                      />
                    </Grid>
                  </Grid>
                </div>
              )}
            </FieldArray>
          </Form>
        </Grid>
      </Grid>
      <br />
      <hr />
    </div>
  );
};

export default AddUserInfo;
