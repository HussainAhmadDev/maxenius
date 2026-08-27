import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { FormikProps, FieldArray } from "formik";
import Grid from "@mui/material/Grid";
import TextInput from "Components/Form/TextInput";
import MaskingInput from "Components/Form/MaskingInput";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import CheckBox from "Components/CheckBox";
import Select from "Components/Form/Select";
import states from "Utils/states";
import countries, { countryPhoneCodes } from "Utils/countries";
import { ContactFormValidation } from "Interfaces/Company";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      width: "100%",
      border: `0.5px solid ${theme.palette.gray[300]}`,
      borderRadius: "6px",
      padding: "17px"
    },
    markActiveDiv: {
      display: "flex",
      alignItems: "center"
    },
    infoHeader: {
      display: "flex",
      justifyContent: "space-between"
    },
    phoneNumbersContainer: {
      maxHeight: "160px",
      minHeight: "px",
      overflowY: "auto",
      overflowX: "hidden",
      paddingRight: "15px !important"
    },
    emailsContainer: {
      maxHeight: "160px",
      minHeight: "px",
      overflowY: "auto",
      overflowX: "hidden",
      paddingRight: "10px !important"
    },
    emptyText: {
      border: `0.5px solid ${theme.palette.gray[300]}`,
      borderRadius: "6px",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      padding: "10px",
      maxWidth: "95%"
    }
  })
);

interface Props {
  formik: FormikProps<ContactFormValidation>;
}

const AddressInfo: React.FC<Props> = ({ formik }) => {
  const classes = useStyles();
  const onAddPhone = () => {
    const arr = formik.values.billing_phones || [];
    formik.setFieldValue("billing_phones", [...arr, ""]);
  };

  const onAddEmail = () => {
    const arr = formik.values.billing_emails || [];
    formik.setFieldValue("billing_emails", [...arr, ""]);
  };

  const copyFromShipping = () => {
    formik.setFieldValue("billing_address_1", formik.values.shipping_address_1);
    formik.setFieldValue("billing_address_2", formik.values.shipping_address_2);
    formik.setFieldValue("billing_country", formik.values.shipping_country);
    formik.setFieldValue("billing_city", formik.values.shipping_city);
    formik.setFieldValue("billing_state", formik.values.shipping_state);
    formik.setFieldValue("billing_zip", formik.values.shipping_zip);
    formik.setFieldValue("billing_emails", formik.values.shipping_emails);
    formik.setFieldValue("billing_phones", formik.values.shipping_phones);
    formik.setFieldValue("billing_residential", formik.values.shipping_residential);
    formik.setFieldValue("billing_is_default", formik.values.shipping_is_default);
    formik.setFieldValue("billing_company", formik.values.shipping_company);
  };
  const copyPhone = () => {
    const arr = formik.values.billing_phones || [];
    formik.setFieldValue("billing_phones", [...arr, formik.values.billing_phone]);
  };
  const copyEmail = () => {
    const arr = formik.values.billing_emails || [];
    formik.setFieldValue("billing_emails", [...arr, formik.values.email]);
  };

  return (
    <div className={classes.body}>
      <div className={classes.infoHeader}>
        <div className={classes.markActiveDiv}>
          <CheckBox
            checked={formik.values.billing_is_billing}
            name="default"
            handleChange={() =>
              formik.setFieldValue(
                "billing_is_billing",
                !formik.values.billing_is_billing,
                true
              )
            }
          />
          &nbsp;
          <Typography variant={formik.values.billing_is_billing ? "body1" : "body2"}>
            Billing information
          </Typography>
        </div>
        <div className={classes.markActiveDiv}>
          <CheckBox
            checked={formik.values.billing_is_default}
            name="default"
            handleChange={() =>
              formik.setFieldValue(
                "billing_is_default",
                !formik.values.billing_is_default,
                true
              )
            }
          />
          &nbsp;
          <Typography variant={formik.values.billing_is_default ? "body1" : "body2"}>
            Mark as Default
          </Typography>
        </div>
      </div>
      <br />
      <Grid container>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Address *</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextInput
                inputProps={{ "aria-label": "billing address 1" }}
                value={formik.values.billing_address_1}
                name="billing_address_1"
                placeholder="Address 1"
                type="text"
                onChange={formik.handleChange}
                error={
                  formik.touched.billing_address_1 &&
                  Boolean(formik.errors.billing_address_1)
                }
                helperText={
                  formik.touched.billing_address_1 && formik.errors.billing_address_1
                }
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextInput
                inputProps={{ "aria-label": "billing address 2" }}
                placeholder="Address 2"
                value={formik.values.billing_address_2}
                name="billing_address_2"
                type="text"
                onChange={formik.handleChange}
                error={
                  formik.touched.billing_address_2 &&
                  Boolean(formik.errors.billing_address_2)
                }
                helperText={
                  formik.touched.billing_address_2 && formik.errors.billing_address_2
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      <Grid container>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Company</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextInput
                inputProps={{ "aria-label": "billing company" }}
                value={formik.values.billing_company}
                name="billing_company"
                placeholder="Billing Company"
                type="text"
                onChange={formik.handleChange}
                error={
                  formik.touched.billing_company && Boolean(formik.errors.billing_company)
                }
                helperText={
                  formik.touched.billing_company && formik.errors.billing_company
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={1}>
        <Grid item xs={6} lg={6}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="subtitle1">City *</Typography>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TextInput
              inputProps={{ "aria-label": "billing city" }}
              value={formik.values.billing_city}
              name="billing_city"
              placeholder="City"
              type="text"
              onChange={formik.handleChange}
              error={formik.touched.billing_city && Boolean(formik.errors.billing_city)}
              helperText={formik.touched.billing_city && formik.errors.billing_city}
            />
          </Grid>
        </Grid>
        <Grid item xs={6} lg={6}>
          <Grid container alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Country *</Typography>
            </Grid>
            <Grid mt={1} item lg={12} md={12} sm={12} xs={12}>
              <Select
                name="billing_country"
                ariaLabel="billing country"
                onChange={values =>
                  formik.setFieldValue("billing_country", values.value, true)
                }
                value={countries.find(
                  item => item.value === formik.values.billing_country
                )}
                options={countries}
                error={
                  formik.touched.billing_country && Boolean(formik.errors.billing_country)
                }
                helperText={
                  formik.touched.billing_country && formik.errors.billing_country
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={1}>
        <Grid item xs={6} lg={6}>
          <Grid container alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">State *</Typography>
            </Grid>
            <Grid mt={1} item lg={12} md={12} sm={12} xs={12}>
              <Select
                name="billing_state"
                ariaLabel="billing state"
                disabled={!formik.values.billing_country}
                options={
                  states.find(country => country.label === formik.values.billing_country)
                    ?.options || states[0].options
                }
                helperText={formik.touched.billing_state && formik.errors.billing_state}
                onChange={values =>
                  formik.setFieldValue("billing_state", values.value, true)
                }
                value={states
                  .find(country => country.label === formik.values.billing_country)
                  ?.options.find(item => item.value === formik.values.billing_state)}
                error={
                  formik.touched.billing_state && Boolean(formik.errors.billing_state)
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} lg={6}>
          <Grid container alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">ZIP *</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextInput
                inputProps={{ "aria-label": "billing zip" }}
                value={formik.values.billing_zip}
                name="billing_zip"
                placeholder="Zip"
                type="text"
                onChange={formik.handleChange}
                error={formik.touched.billing_zip && Boolean(formik.errors.billing_zip)}
                helperText={formik.touched.billing_zip && formik.errors.billing_zip}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      <Grid spacing={1} container>
        <Grid item xs={6} lg={6}>
          <Grid container spacing={1} alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">
                Phone Number{" "}
                {formik?.values &&
                formik?.values?.billing_phones &&
                formik?.values?.billing_phones?.length > 0
                  ? `(${formik?.values?.billing_phones?.length})`
                  : null}
              </Typography>
            </Grid>
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className={classes.phoneNumbersContainer}
            >
              <FieldArray
                name="billing_phones"
                render={arrayHelpers => (
                  <div>
                    {formik?.values &&
                    formik?.values?.billing_phones &&
                    formik?.values?.billing_phones?.length > 0 ? (
                      formik.values.billing_phones.map((item, index) => (
                        <Grid key={index} container alignItems="center" spacing={1}>
                          <Grid item lg={10} md={10} sm={12} xs={12}>
                            <MaskingInput
                              phoneCode={
                                countryPhoneCodes.find(
                                  code => code.label === formik.values.billing_country
                                )?.value
                              }
                              onChange={(name, value) =>
                                formik.setFieldValue(name, value)
                              }
                              value={item}
                              ariaLabel={`billing phones ${index}`}
                              name={`billing_phones.${index}`}
                              placeholder="+x (xxx) xxx-xxxx"
                              type="tel"
                              maskType="phone"
                            />
                          </Grid>
                          <Grid item xs={2} lg={2}>
                            <Button
                              type="secondary"
                              size="small"
                              onlyIcon={true}
                              icon={<MuiIcon icon="delete" />}
                              onClick={() => arrayHelpers.remove(index)}
                            />
                          </Grid>
                        </Grid>
                      ))
                    ) : (
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item xs={10} lg={10}>
                          <div className={classes.emptyText}>
                            <Typography>No Phone Numbers Added</Typography>
                          </div>
                        </Grid>
                        <Grid item xs={2} lg={2}>
                          <Button
                            ariaLabel="copy billing phone to billing address"
                            type="secondary"
                            size="small"
                            onlyIcon={true}
                            onClick={copyPhone}
                            icon={<MuiIcon icon="copy" />}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </div>
                )}
              />
            </Grid>
            <Grid item xs={9} lg={9}>
              <Button
                ariaLabel="Add Phone Number to billing address"
                text="Add Phone Number"
                type="secondary"
                disabled={
                  formik.values.billing_phones &&
                  formik.values.billing_phones.length === 2
                    ? true
                    : false
                }
                icon={<MuiIcon icon="add" />}
                style={{ width: "100%" }}
                onClick={() => onAddPhone()}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} lg={6}>
          <Grid container spacing={1} alignItems="center">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">
                E-mail Address{" "}
                {formik?.values &&
                formik?.values?.billing_emails &&
                formik?.values?.billing_emails?.length > 0
                  ? `(${formik?.values?.billing_emails?.length})`
                  : null}
              </Typography>
            </Grid>
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className={classes.emailsContainer}
            >
              <FieldArray
                name="billing_emails"
                render={arrayHelpers => (
                  <div>
                    {formik?.values &&
                    formik?.values?.billing_emails &&
                    formik?.values?.billing_emails?.length > 0 ? (
                      formik.values.billing_emails.map((item, index) => (
                        <Grid key={index} container alignItems="center" spacing={1}>
                          <Grid item lg={10} md={10} sm={12} xs={12}>
                            <TextInput
                              onChange={formik.handleChange}
                              value={item}
                              inputProps={{ "aria-label": `billing emails ${index}` }}
                              name={`billing_emails.${index}`}
                              placeholder="Email Address"
                              type="text"
                              error={
                                formik.errors &&
                                formik.errors.billing_emails &&
                                formik.errors.billing_emails[index]
                                  ? true
                                  : false
                              }
                              helperText={
                                formik.errors &&
                                formik.errors.billing_emails &&
                                formik.errors.billing_emails[index]
                              }
                            />
                          </Grid>
                          <Grid item xs={2} lg={2}>
                            <Button
                              type="secondary"
                              size="small"
                              onlyIcon={true}
                              icon={<MuiIcon icon="delete" />}
                              onClick={() => arrayHelpers.remove(index)}
                            />
                          </Grid>
                        </Grid>
                      ))
                    ) : (
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item xs={10} lg={10}>
                          <div className={classes.emptyText}>
                            <Typography>No Email Address Added</Typography>
                          </div>
                        </Grid>
                        <Grid item xs={2} lg={2}>
                          <Button
                            ariaLabel="copy contact email to billing address"
                            type="secondary"
                            size="small"
                            onlyIcon={true}
                            onClick={copyEmail}
                            icon={<MuiIcon icon="copy" />}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </div>
                )}
              />
            </Grid>
            <Grid item xs={9} lg={9}>
              <Button
                ariaLabel="add billing email address"
                text="Add Email Address"
                type="secondary"
                disabled={
                  formik.values.billing_emails &&
                  formik.values.billing_emails.length === 4
                    ? true
                    : false
                }
                icon={<MuiIcon icon="add" />}
                style={{ width: "100%" }}
                onClick={onAddEmail}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      <br />
      <Grid alignItems="center" container>
        <Grid item xs={4} lg={4}>
          <Button
            ariaLabel="copy shipping"
            type="secondary"
            text="Copy Shipping"
            disabled={
              formik.values.shipping_address_1.length &&
              formik.values.shipping_city.length
                ? false
                : true
            }
            onClick={copyFromShipping}
            icon={<MuiIcon icon="copy" />}
          />
        </Grid>
        <Grid item xs={6} lg={6}>
          <div className={classes.markActiveDiv}>
            <CheckBox
              checked={Boolean(formik.values?.billing_residential)}
              name="billing_residential"
              handleChange={() =>
                formik.setFieldValue(
                  "billing_residential",
                  !formik.values.billing_residential,
                  true
                )
              }
            />
            &nbsp;
            <Typography variant={formik.values?.billing_residential ? "body1" : "body2"}>
              Also Residential Address
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddressInfo;
