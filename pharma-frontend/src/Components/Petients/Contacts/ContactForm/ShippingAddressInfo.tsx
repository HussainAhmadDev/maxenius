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

interface CheckboxState {
  readonly info: boolean;
  readonly default: boolean;
  readonly resedential: boolean;
}
interface Props {
  formik: FormikProps<ContactFormValidation>;
}

const AddressInfo: React.FC<Props> = ({ formik }) => {
  const classes = useStyles();
  const [checkboxStates] = React.useState<CheckboxState>({
    info: true,
    default: false,
    resedential: false
  });

  const onAddPhone = () => {
    const arr = formik.values.shipping_phones || [];
    formik.setFieldValue("shipping_phones", [...arr, ""]);
  };

  const onAddEmail = () => {
    const arr = formik.values.shipping_emails || [];
    formik.setFieldValue("shipping_emails", [...arr, ""]);
  };
  const copyFromBilling = async () => {
    await formik.setFieldValue("shipping_address_1", formik.values.billing_address_1);
    await formik.setFieldValue("shipping_address_2", formik.values.billing_address_2);
    await formik.setFieldValue("shipping_country", formik.values.billing_country);
    await formik.setFieldValue("shipping_city", formik.values.billing_city);
    await formik.setFieldValue("shipping_state", formik.values.billing_state);
    await formik.setFieldValue("shipping_zip", formik.values.billing_zip);
    await formik.setFieldValue("shipping_emails", formik.values.billing_emails);
    await formik.setFieldValue("shipping_phones", formik.values.billing_phones);
    await formik.setFieldValue("shipping_residential", formik.values.billing_residential);
    await formik.setFieldValue("shipping_is_default", formik.values.billing_is_default);
    await formik.setFieldValue("shipping_company", formik.values.billing_company);
  };
  const copyPhone = () => {
    const arr = formik.values.shipping_phones || [];
    formik.setFieldValue("shipping_phones", [...arr, formik.values.billing_phone]);
  };
  const copyEmail = () => {
    const arr = formik.values.shipping_emails || [];
    formik.setFieldValue("shipping_emails", [...arr, formik.values.email]);
  };

  return (
    <div className={classes.body}>
      <div className={classes.infoHeader}>
        <div className={classes.markActiveDiv}>
          <CheckBox
            checked={formik.values.shipping_is_shipping}
            name="default"
            handleChange={() =>
              formik.setFieldValue(
                "shipping_is_shipping",
                !formik.values.shipping_is_shipping,
                true
              )
            }
          />
          &nbsp;
          <Typography variant={checkboxStates?.info ? "body1" : "body2"}>
            Shipping information
          </Typography>
        </div>
        <div className={classes.markActiveDiv}>
          <CheckBox
            checked={formik.values.shipping_is_default}
            name="default"
            handleChange={() =>
              formik.setFieldValue(
                "shipping_is_default",
                !formik.values.shipping_is_default,
                true
              )
            }
          />
          &nbsp;
          <Typography variant={formik.values.shipping_is_default ? "body1" : "body2"}>
            Mark as Default
          </Typography>
        </div>
      </div>
      <br />
      <Grid container>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container alignItems="center">
            <Grid lg={12} md={12} sm={12} xs={12}>
              <Typography variant="subtitle1">Address *</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextInput
                inputProps={{ "aria-label": "shipping address 1" }}
                value={formik.values.shipping_address_1}
                name="shipping_address_1"
                placeholder="Address 1"
                type="text"
                onChange={formik.handleChange}
                error={
                  formik.touched.shipping_address_1 &&
                  Boolean(formik.errors.shipping_address_1)
                }
                helperText={
                  formik.touched.shipping_address_1 && formik.errors.shipping_address_1
                }
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextInput
                inputProps={{ "aria-label": "shipping address 2" }}
                placeholder="Address 2"
                value={formik.values.shipping_address_2}
                name="shipping_address_2"
                type="text"
                onChange={formik.handleChange}
                error={
                  formik.touched.shipping_address_2 &&
                  Boolean(formik.errors.shipping_address_2)
                }
                helperText={
                  formik.touched.shipping_address_2 && formik.errors.shipping_address_2
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
                inputProps={{ "aria-label": "shipping company" }}
                value={formik.values.shipping_company}
                name="shipping_company"
                placeholder="Shipping Company"
                type="text"
                onChange={formik.handleChange}
                error={
                  formik.touched.shipping_company &&
                  Boolean(formik.errors.shipping_company)
                }
                helperText={
                  formik.touched.shipping_company && formik.errors.shipping_company
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
              inputProps={{ "aria-label": "shipping city" }}
              value={formik.values.shipping_city}
              name="shipping_city"
              placeholder="City"
              type="text"
              onChange={formik.handleChange}
              error={formik.touched.shipping_city && Boolean(formik.errors.shipping_city)}
              helperText={formik.touched.shipping_city && formik.errors.shipping_city}
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
                name="shipping_country"
                ariaLabel="shipping country"
                onChange={values =>
                  formik.setFieldValue("shipping_country", values.value, true)
                }
                value={countries.find(
                  item => item.value === formik.values.shipping_country
                )}
                options={countries}
                error={
                  formik.touched.shipping_country &&
                  Boolean(formik.errors.shipping_country)
                }
                helperText={
                  formik.touched.shipping_country && formik.errors.shipping_country
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
                name="shipping_state"
                disabled={!formik.values.shipping_country}
                ariaLabel="shipping state"
                options={
                  states.find(country => country.label === formik.values.shipping_country)
                    ?.options || states[0].options
                }
                helperText={formik.touched.shipping_state && formik.errors.shipping_state}
                onChange={values =>
                  formik.setFieldValue("shipping_state", values.value, true)
                }
                value={states
                  .find(country => country.label === formik.values.shipping_country)
                  ?.options.find(item => item.value === formik.values.shipping_state)}
                error={
                  formik.touched.shipping_state && Boolean(formik.errors.shipping_state)
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
                inputProps={{ "aria-label": "shipping zip" }}
                value={formik.values.shipping_zip}
                name="shipping_zip"
                placeholder="Zip"
                type="text"
                onChange={formik.handleChange}
                error={formik.touched.shipping_zip && Boolean(formik.errors.shipping_zip)}
                helperText={formik.touched.shipping_zip && formik.errors.shipping_zip}
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
                formik?.values?.shipping_phones &&
                formik?.values?.shipping_phones?.length > 0
                  ? `(${formik?.values?.shipping_phones?.length})`
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
                name="shipping_phones"
                render={arrayHelpers => (
                  <div>
                    {formik?.values &&
                    formik?.values?.shipping_phones &&
                    formik?.values?.shipping_phones?.length > 0 ? (
                      formik.values.shipping_phones.map((item, index) => (
                        <Grid key={index} container alignItems="center" spacing={1}>
                          <Grid item lg={10} md={10} sm={12} xs={12}>
                            <MaskingInput
                              phoneCode={
                                countryPhoneCodes.find(
                                  code => code.label === formik.values.shipping_country
                                )?.value
                              }
                              onChange={(name, value) =>
                                formik.setFieldValue(name, value)
                              }
                              value={item}
                              ariaLabel={`shipping phones ${index}`}
                              name={`shipping_phones.${index}`}
                              placeholder="Phone Number"
                              type="text"
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
                            <Typography>No Phone Address Added</Typography>
                          </div>
                        </Grid>
                        <Grid item lg={2} xs={2}>
                          <Button
                            ariaLabel="copy billing phone to shipping address"
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
                ariaLabel="Add Phone Number to shipping address"
                text="Add Phone Number"
                type="secondary"
                disabled={
                  formik.values.shipping_phones &&
                  formik.values.shipping_phones.length === 2
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
                formik?.values?.shipping_emails &&
                formik?.values?.shipping_emails?.length > 0
                  ? `(${formik?.values?.shipping_emails?.length})`
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
                name="shipping_emails"
                render={arrayHelpers => (
                  <div>
                    {formik?.values &&
                    formik?.values?.shipping_emails &&
                    formik?.values?.shipping_emails?.length > 0 ? (
                      formik.values.shipping_emails.map((item, index) => (
                        <Grid key={index} container alignItems="center" spacing={1}>
                          <Grid item lg={10} md={10} sm={12} xs={12}>
                            <TextInput
                              onChange={formik.handleChange}
                              value={item}
                              inputProps={{ "aria-label": `shipping emails ${index}` }}
                              name={`shipping_emails.${index}`}
                              placeholder="Email Address"
                              type="text"
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
                            ariaLabel="copy contact email to shipping address"
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
                ariaLabel="add shipping email address"
                text="Add Email Address"
                type="secondary"
                disabled={
                  formik.values.shipping_emails &&
                  formik.values.shipping_emails.length === 4
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
            ariaLabel="copy billing"
            type="secondary"
            text="Copy Billing"
            disabled={
              formik.values.billing_address_1.length && formik.values.billing_city.length
                ? false
                : true
            }
            onClick={copyFromBilling}
            icon={<MuiIcon icon="copy" />}
          />
        </Grid>
        <Grid item xs={6} lg={6}>
          <div className={classes.markActiveDiv}>
            <CheckBox
              checked={Boolean(formik.values?.shipping_residential)}
              name="shipping_residential"
              handleChange={() =>
                formik.setFieldValue(
                  "shipping_residential",
                  !formik.values.shipping_residential,
                  true
                )
              }
            />
            &nbsp;
            <Typography variant={checkboxStates?.resedential ? "body1" : "body2"}>
              Also Residential Address
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddressInfo;
