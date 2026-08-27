import * as React from "react";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import ModalPopup from "../../ModalPopup";
import TextInput from "../../Form/TextInput";
import CheckBox from "../../CheckBox/";
import Select from "../../Form/Select";
import { useCreateBillingShippingAddress } from "Hooks/useAddresses";
import { useFormik } from "formik";
import { Address } from "Interfaces/Company";
import states from "Utils/states";
import MaskingInput from "Components/Form/MaskingInput";
import countries, { countryPhoneCodes } from "Utils/countries";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      color: theme.palette.text.primary,
      marginBottom: "0px",
      fontWeight: "bold"
    },
    selectlabel: {
      color: theme.palette.text.primary,
      marginBottom: "8px",
      fontWeight: "bold"
    }
  })
);

const validationSchema = yup.object({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  street1: yup.string().required("At least one address is required"),
  state: yup.string().required("State is required"),
  zip: yup.string().required("Zip is required"),
  country: yup.string().required("Country is required"),
  city: yup.string().required("City is required"),
  is_residental: yup.boolean(),
  is_default: yup.boolean(),
  email: yup.string().nullable().email()
});

interface Props {
  readonly handleSaveChanges: () => void;
  readonly handleCloseModal: () => void;
  readonly openModal: boolean;
  readonly title?: string;
  readonly noHeader?: boolean;
  readonly saveText?: string;
  readonly checkBox?: {
    readonly text: string;
    readonly value: boolean;
    readonly handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  readonly address: Address;
  readonly type: "billing" | "shipping";
  readonly company: string;
}

const EditBillingShipping: React.FC<Props> = ({
  address,
  title,
  saveText,
  checkBox,
  openModal,
  handleSaveChanges,
  handleCloseModal,
  noHeader,
  type,
  company
}) => {
  const classes = useStyles();
  const { id: orderId } = useParams<"id">();

  const { mutate: editBillingShippingAddress, isLoading } =
    useCreateBillingShippingAddress(orderId as string, type);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialValues: Partial<Address> = {
    state: states[0].options[0].value
  } as Partial<Address>;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: () => {
      // do nothing
      const value = Object.fromEntries(
        Object.entries(formik.values).filter(([_, v]) => v != null)
      );
      value.type = address?.type || "company";
      value.update_original_customer = Boolean(checkBox?.value);
      editBillingShippingAddress(value);
      handleSaveChanges();
      formik.resetForm();
    }
  });

  React.useEffect(() => {
    async function setInitialValues() {
      if (company) formik.setFieldValue("company", company);
      if (address) {
        await formik.setValues(address, false);
        if (address.company) formik.setFieldValue("company", address.company);
      }
    }
    setInitialValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, company, isLoading]);

  const handleConfirmation = () => {
    formik.submitForm();
  };
  const handleCancellation = async () => {
    handleCloseModal();
    if (address) await formik.setValues(address, false);
  };
  const handleNumberChange = async (name: string, value: string) => {
    formik.setFieldValue(name, value, true);
  };

  return (
    <div>
      <ModalPopup
        maxWidth="md"
        modalTitle={title}
        saveBtnText={saveText}
        checkBox={checkBox}
        openModal={openModal}
        handleSaveChanges={handleConfirmation}
        handleCloseModal={handleCancellation}
        noHeader={noHeader}
        saveBtnLoading={isLoading}
      >
        <div>
          <form>
            <Grid container spacing={2}>
              {/* Name Section */}
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <p className={classes.label}>First Name</p>
                <TextInput
                  type="text"
                  value={formik.values.first_name}
                  variant="outlined"
                  name="first_name"
                  margin="dense"
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.first_name)}
                  helperText={formik.errors.first_name}
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <p className={classes.label}>Middle Name</p>
                <TextInput
                  type="text"
                  value={formik.values.middle_name || ""}
                  variant="outlined"
                  name="middle_name"
                  margin="dense"
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.middle_name)}
                  helperText={formik.errors.middle_name}
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <p className={classes.label}>Last Name</p>
                <TextInput
                  type="text"
                  value={formik.values.last_name}
                  variant="outlined"
                  name="last_name"
                  margin="dense"
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.last_name)}
                  helperText={formik.errors.last_name}
                />
              </Grid>
              {/* Name Section */}
              {/* Label */}
              {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                <p className={classes.label}>Label</p>
                <TextInput
                  type="text"
                  value={formik.values.label}
                  variant="outlined"
                  name="label"
                  margin="dense"
                  onChange={formik.handleChange}
                  error={formik.touched.label && Boolean(formik.errors.label)}
                  helperText={formik.touched.label && formik.errors.label}
                />
              </Grid> */}
              {/* Label */}
              {/* Description  */}
              {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                <p className={classes.label}>Description</p>
                <TextInput
                  type="text"
                  value={formik.values.description}
                  variant="outlined"
                  name="description"
                  margin="dense"
                  isMultiline={true}
                  minRows={5}
                  maxRows={5}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid> */}
              {/* Description  */}
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <p className={classes.label}>Company</p>
                <TextInput
                  type="text"
                  value={formik.values.company}
                  variant="outlined"
                  name="company"
                  margin="dense"
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.company)}
                  helperText={formik.errors.company}
                />
              </Grid>
              {/* Address Section */}
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <p className={classes.label}>Address</p>
                <TextInput
                  type="text"
                  value={formik.values.street1}
                  variant="outlined"
                  name="street1"
                  margin="dense"
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.street1)}
                  helperText={formik.errors.street1}
                />

                <TextInput
                  type="text"
                  value={formik.values.street2 || ""}
                  variant="outlined"
                  name="street2"
                  margin="dense"
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.street2)}
                  helperText={formik.errors.street2}
                />
              </Grid>
              {/* Address Section */}

              <Grid item lg={3} md={3} sm={12} xs={12}>
                <p className={classes.selectlabel}>Country</p>
                <Select
                  name="country"
                  defaultValue={countries[0]}
                  options={countries}
                  onChange={values => formik.setFieldValue("country", values.value, true)}
                  value={countries.find(item => item.value === formik.values.country)}
                  loading={isLoading}
                  error={Boolean(formik.errors.country)}
                  helperText={formik.errors.country}
                />
              </Grid>

              <Grid item lg={3} md={3} sm={12} xs={12}>
                <p className={classes.label}>City</p>
                <TextInput
                  type="text"
                  value={formik.values.city}
                  variant="outlined"
                  name="city"
                  margin="dense"
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.city)}
                  helperText={formik.errors.city}
                />
              </Grid>

              <Grid item lg={3} md={3} sm={12} xs={12}>
                <p className={classes.selectlabel}>State</p>
                <Select
                  defaultValue={
                    states.find(country => country.label === formik.values.country)
                      ?.options[0] || states[0].options[0]
                  }
                  name="state"
                  value={states
                    .find(country => country.label === formik.values.country)
                    ?.options.find(item => item.value === formik.values.state)}
                  options={
                    states.find(country => country.label === formik.values.country)
                      ?.options || states[0].options
                  }
                  onChange={values => formik.setFieldValue("state", values.value, true)}
                  loading={isLoading}
                  error={Boolean(formik.errors.state)}
                  helperText={formik.errors.state}
                />
              </Grid>

              <Grid item lg={3} md={3} sm={12} xs={12}>
                <p className={classes.label}>Zip</p>
                <TextInput
                  type="text"
                  value={formik.values.zip}
                  variant="outlined"
                  name="zip"
                  margin="dense"
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.zip)}
                  helperText={formik.errors.zip}
                />
              </Grid>
              {/* Country Section */}
              {/* Phone and Email Section */}
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <p className={classes.label}>Phone Number:</p>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <MaskingInput
                          phoneCode={
                            countryPhoneCodes.find(
                              code => code.label === formik.values.country
                            )?.value
                          }
                          type="text"
                          showMask={true}
                          maskType="phone"
                          name="phone"
                          placeholder="+x (xxx) xxx-xxxx"
                          onChange={handleNumberChange}
                          value={formik.values.phone || ""}
                          error={Boolean(formik.errors.phone)}
                          helperText={formik.errors.phone}
                        />
                      </Grid>
                      {/* <Grid item lg={2} md={2} sm={2} xs={2}>
                        <Button
                          icon={<MuiIcon icon="delete" />}
                          onlyIcon={true}
                          type="secondary"
                          size="small"
                          style={{ width: "50px", height: "40px" }}
                          disabled
                        />
                      </Grid> */}
                      {/* <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Button
                          icon={<MuiIcon icon="add" />}
                          type="secondary"
                          size="small"
                          text="Add Phone Number"
                          disabled
                        />
                      </Grid> */}
                    </Grid>
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <p className={classes.label}>E-mail Addresses :</p>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextInput
                          type="text"
                          value={formik.values.email || ""}
                          variant="outlined"
                          name="email"
                          margin="dense"
                          onChange={formik.handleChange}
                          error={Boolean(formik.errors.email)}
                          helperText={formik.errors.email}
                        />
                      </Grid>
                      {/* <Grid item lg={2} md={2} sm={2} xs={2}>
                        <Button
                          icon={<MuiIcon icon="delete" />}
                          onlyIcon={true}
                          type="secondary"
                          size="small"
                          style={{ width: "50px", height: "40px" }}
                          disabled
                        />
                      </Grid> */}
                      {/* <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Button
                          icon={<MuiIcon icon="add" />}
                          type="secondary"
                          size="small"
                          text="Add E-mail"
                          disabled
                        />
                      </Grid> */}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* Phone and Email Section */}
              {/* Fax & checkboxes */}
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <p className={classes.label}>Fax</p>
                <Grid container spacing={2} alignItems="center">
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <MaskingInput
                      phoneCode={
                        countryPhoneCodes.find(
                          code => code.label === formik.values.country
                        )?.value
                      }
                      type="text"
                      showMask={true}
                      maskType="phone"
                      name="fax"
                      placeholder="+x (xxx) xxx-xxxx"
                      onChange={handleNumberChange}
                      value={formik.values.fax || ""}
                      error={Boolean(formik.errors.fax)}
                      helperText={formik.errors.fax}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item lg={2} md={2} sm={2} xs={1}>
                            <CheckBox
                              checked={formik.values.is_residental || false}
                              name="is_residental"
                              handleChange={formik.handleChange}
                            />{" "}
                          </Grid>
                          <Grid item lg={10} md={10} sm={10} xs={11}>
                            <span>Residential Address</span>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item lg={2} md={2} sm={2} xs={1}>
                            <CheckBox
                              checked={formik.values.is_default || false}
                              name="is_default"
                              handleChange={formik.handleChange}
                            />{" "}
                          </Grid>
                          <Grid item lg={10} md={10} sm={10} xs={11}>
                            <span>Mark as Default</span>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* Fax & checkboxes */}
            </Grid>
          </form>
        </div>
      </ModalPopup>
    </div>
  );
};

export default EditBillingShipping;
