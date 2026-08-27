import * as React from "react";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import BasicInformation from "./BasicInformation";
import AddressComponent from "./Address";
import { NavBar } from "../../../Navbar";
import {
  ContactRequest,
  useAddContactToCompany,
  useCompany,
  useCreateContact
} from "Hooks/useCompanies";
import { ContactFormValidation } from "Interfaces/Company";
import ContactPreferences from "./ContactPreferences";

// import PaymentMethods from "./PaymentMethods";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end"
    },
    customerBackDiv: {
      display: "flex",
      cursor: "pointer"
    },
    link: {
      cursor: "pointer"
    }
  })
);

// creating scehema
const validationSchema = yup.object({
  first_name: yup.string().required("Please Enter First Name"),
  middle_name: yup.string().required("Please Enter Middle Name"),
  last_name: yup.string().required("Please Enter Last Name"),
  email: yup
    .string()
    .email("Should be a Valid Email")
    .required("Please Enter your Email"),
  title: yup.string().min(1, "Minimum 1 Characters").required("Please Enter the title"),
  billing_phone: yup.string().required("Please Enter the Billing Phone"),
  website: yup.string().required("Webiste URL is required"),
  address_first_name: yup
    .string()
    .min(1, "Minimum 1 Character")
    .required("Please Enter the First Name"),
  address_middle_name: yup
    .string()
    .min(1, "Minimum 1 Character")
    .required("Please Enter the Middle Name"),
  address_last_name: yup
    .string()
    .min(1, "Minimum 1 Character")
    .required("Please Enter the Last Name"),
  billing_emails: yup.array().of(yup.string().email("Should be Email")),
  shipping_emails: yup.array().of(yup.string().email("Should be Email"))
});

const initialState: ContactFormValidation = {
  first_name: "",
  last_name: "",
  email: "",
  is_billing: true,
  is_shipping: false,
  title: "",
  website: "",
  companyName: "",
  fax: "",
  label: "",
  office_phone: "",
  billing_phone: "",
  authorize_to_purchase: true,
  address_first_name: "",
  address_last_name: "",
  address_fax: "",
  billing_address_1: "",
  billing_address_2: "",
  billing_is_billing: true,
  billing_is_default: false,
  billing_city: "",
  billing_zip: "",
  billing_state: "",
  billing_emails: [],
  billing_phones: [],
  billing_country: "US",
  billing_residential: false,
  billing_company: "",
  shipping_company: "",
  shipping_residential: false,
  shipping_address_1: "",
  shipping_address_2: "",
  shipping_city: "",
  shipping_zip: "",
  shipping_state: "",
  shipping_country: "US",
  shipping_is_shipping: true,
  shipping_is_default: false,
  shipping_emails: [],
  shipping_phones: [],
  do_not_call: true,
  do_not_email: true,
  do_not_mail: true,
  do_not_text: true
};

const ContactForm: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id: companyId } = useParams<string>();
  const { data: companyData } = useCompany(companyId as string);
  const { mutateAsync } = useCreateContact();
  const addContactToCompany = useAddContactToCompany(companyId as string);
  const [iState, setIState] = React.useState<ContactFormValidation>(initialState);

  React.useEffect(() => {
    if (companyData?.name) {
      setIState(state => {
        return {
          ...state,
          companyName: companyData.name
        };
      });
    }
  }, [companyData]);

  const handleSubmit = async (values: ContactFormValidation, resetForm: () => void) => {
    const data: Partial<ContactRequest> = {
      title: values.title,
      website: values.website,
      office_phone: values.office_phone,
      billing_phone: values.billing_phone,
      is_billing: values.is_billing,
      is_shipping: values.is_shipping,
      user: {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        type: "contact"
      },
      billing_address: {
        is_billing: values?.billing_is_billing,
        is_default: values?.billing_is_default,
        first_name: values.address_first_name,
        label: values.label,
        last_name: values.address_last_name,
        fax: values.address_fax,
        zip: values.billing_zip,
        street1: values.billing_address_1,
        street2: values.billing_address_2,
        city: values.billing_city,
        state: values.billing_state,
        country: "US",
        type: "contact",
        company: values.billing_company,
        email: values.billing_email1,
        email2: values.billing_email2,
        email3: values.billing_email3,
        email4: values.billing_email4,
        phone: values.billing_phone1,
        phone2: values.billing_address_2
      },
      shipping_address: {
        is_shipping: values?.shipping_is_shipping,
        is_default: values?.shipping_is_default,
        first_name: values.address_first_name,
        label: values.label,
        last_name: values.address_last_name,
        fax: values.address_fax,
        zip: values.shipping_zip,
        street1: values.shipping_address_1,
        street2: values.shipping_address_2,
        city: values.shipping_city,
        state: values.shipping_state,
        country: "US",
        type: "contact",
        company: values.shipping_company,
        email: values.shipping_email1,
        email2: values.shipping_email2,
        email3: values.shipping_email3,
        email4: values.shipping_email4,
        phone: values.shipping_phone1,
        phone2: values.shipping_phone2
      },
      do_not_call: values.do_not_call,
      do_not_email: values.do_not_email,
      do_not_mail: values.do_not_mail,
      do_not_text: values.do_not_text
    };
    const addContactResponse = await mutateAsync(data);
    if (addContactResponse?.id) {
      addContactToCompany.mutateAsync({ id: addContactResponse.id }).then(() => {
        navigate(`/customers/${companyId}/add`);
        resetForm();
      });
    }
  };

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={iState}
        validationSchema={validationSchema}
        onSubmit={(values: ContactFormValidation, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
        render={formik => (
          <Form>
            <NavBar pageTitle="Create Contact">
              <div className={classes.headerButtons}>
                <Button onClick={() => navigate(-1)} text="Cancel" type="secondary" />
                &nbsp;
                <Button submit="submit" text="Save Contact" variant="contained" />
              </div>
            </NavBar>
            <div style={{ padding: 30 }}>
              <Grid container justifyContent="space-between">
                {/* Back Icon */}
                <Grid container>
                  <Typography
                    className={classes.link}
                    onClick={() => navigate(-1)}
                    variant="body2"
                  >
                    <div className={classes.customerBackDiv}>
                      <p>
                        <MuiIcon icon="backArrow" fontSize="small" />
                      </p>

                      <p>Customer Details</p>
                    </div>
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} lg={8}>
                  <BasicInformation formik={formik} />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <AddressComponent formik={formik} />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <ContactPreferences formik={formik} />
                </Grid>
              </Grid>
            </div>
          </Form>
        )}
      />
    </div>
  );
};

export default ContactForm;
