import * as React from "react";
import * as yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import get from "lodash/get";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import BasicInformation from "./BasicInformation";
import AddressComponent from "./Address";
import { NavBar } from "../../../Navbar";
import {
  useAddContactToCompany,
  useCompany,
  useCreateContact,
  useEditContact,
  useContact,
  ContactRequest
} from "Hooks/useCompanies";
import { ContactFormValidation, Contact } from "Interfaces/Company";
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
  last_name: yup.string().required("Please Enter Last Name"),
  email: yup
    .string()
    .email("Should be a Valid Email")
    .required("Please Enter your Email"),
  billing_phone: yup.string().required("Please Enter the Billing Phone"),
  address_first_name: yup.string().required("Please Enter the First Name"),
  address_last_name: yup.string().required("Please Enter the Last Name"),
  billing_emails: yup.array().of(yup.string().email("Should be Email")),
  shipping_emails: yup.array().of(yup.string().email("Should be Email")),
  billing_address_1: yup
    .string()
    .min(5, "Minimum 5 Characters")
    .required("Please Enter the Address 1"),
  billing_city: yup.string().required("Please Enter the City"),
  billing_zip: yup.string().required("Please Enter the Zip Code"),
  billing_state: yup.string().required("Please Select a State"),
  shipping_state: yup.string().required("Please Select a State"),

  shipping_address_1: yup
    .string()
    .min(5, "Minimum 5 Characters")
    .required("Please Enter the Address 1"),
  shipping_city: yup.string().required("Please Enter the City"),
  shipping_zip: yup.string().required("Please Enter the Zip Code")
});

const initialState: ContactFormValidation = {
  first_name: "",
  last_name: "",
  email: "",
  is_billing: false,
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
  do_not_text: true,
  billing_company: "",
  shipping_company: ""
};

interface State {
  customerDetails: boolean;
}
const ContactForm = () => {
  const classes = useStyles();
  const location = useLocation();
  const locationstate = location.state as State;
  const navigate = useNavigate();
  const { id: customerId, contactId } = useParams<"id" | "contactId">();
  const { data: companyData } = useCompany(customerId as string);
  const { data: companyContact } = useContact(customerId as string, contactId as string);
  const contact = get(companyContact, "contact") as unknown as Contact;
  const { mutateAsync } = useCreateContact();
  const addContactToCompany = useAddContactToCompany(customerId as string);
  const [iState, setIState] = React.useState<ContactFormValidation>(initialState);
  const [checked, setChecked] = React.useState("");
  const { mutateAsync: editContact } = useEditContact();
  const edit = Boolean(contactId);

  const updateCompanyName = React.useCallback(() => {
    if (companyData?.name && !iState.companyName.length)
      setIState({ ...iState, companyName: companyData?.name });
  }, [companyData?.name, iState]);

  React.useEffect(() => {
    updateCompanyName();
  }, [updateCompanyName]);

  // filter contact
  React.useEffect(() => {
    setIState(state => {
      return {
        ...state,
        billing_company: companyData?.name || "",
        shipping_company: companyData?.name || ""
      };
    });

    if (contact && edit) {
      const billing_emails: string[] = [];
      const billing_phones: string[] = [];
      const shipping_emails: string[] = [];
      const shipping_phones: string[] = [];
      if (contact?.billing_address.email)
        billing_emails.push(contact?.billing_address.email);
      if (contact?.billing_address.email2)
        billing_emails.push(contact?.billing_address.email2);
      if (contact?.billing_address.email3)
        billing_emails.push(contact?.billing_address.email3);
      if (contact?.billing_address.email4)
        billing_emails.push(contact?.billing_address.email4);

      if (contact?.billing_address.phone)
        billing_phones.push(contact?.billing_address.phone);
      if (contact?.billing_address.phone2)
        billing_phones.push(contact?.billing_address.phone2);

      if (contact?.shipping_address.email)
        shipping_emails.push(contact?.shipping_address.email);
      if (contact?.shipping_address.email2)
        shipping_emails.push(contact?.shipping_address.email2);
      if (contact?.shipping_address.email3)
        shipping_emails.push(contact?.shipping_address.email3);
      if (contact?.shipping_address.email4)
        shipping_emails.push(contact?.shipping_address.email4);

      if (contact?.shipping_address.phone)
        shipping_phones.push(contact?.shipping_address.phone);
      if (contact?.shipping_address.phone2)
        shipping_phones.push(contact?.shipping_address.phone2);

      setIState(state => {
        return {
          ...state,
          first_name: contact?.user?.first_name || "",
          last_name: contact.user?.last_name || "",
          email: contact.user?.email || "",
          is_billing: contact.is_billing || false,
          is_shipping: contact.is_shipping || false,
          title: contact.title || "",
          website: contact.website || "",
          companyName: "",
          fax: contact.billing_address.fax || "",
          label: contact.billing_address.label || "",
          office_phone: contact.office_phone || "",
          billing_phone: contact.billing_phone || "",
          authorize_to_purchase: contact.authorize_to_purchase || true,
          address_first_name: contact.billing_address.first_name || "",
          address_middle_name: contact.billing_address.middle_name || "",
          address_last_name: contact.billing_address.last_name || "",
          address_fax: contact.billing_address.fax || "",
          billing_address_1: contact.billing_address.street1 || "",
          billing_address_2: contact.billing_address.street2 || "",
          billing_is_billing: contact.billing_address.is_billing || true,
          billing_is_default: contact.billing_address.is_default || false,
          billing_city: contact.billing_address.city || "",
          billing_zip: contact.billing_address.zip || "",
          billing_state: contact.billing_address.state || "",
          billing_emails: billing_emails,
          billing_phones: billing_phones,
          billing_country: contact.billing_address.country || "US",
          billing_residential: contact.billing_address.is_residental || false,
          shipping_residential: contact.shipping_address.is_residental || false,
          shipping_address_1: contact.shipping_address.street1 || "",
          shipping_address_2: contact.shipping_address.street2 || "",
          shipping_city: contact.shipping_address.city || "",
          shipping_zip: contact.shipping_address.zip || "",
          shipping_state: contact.shipping_address.state || "",
          shipping_country: contact.shipping_address.country || "US",
          shipping_is_shipping: contact.shipping_address.is_shipping || true,
          shipping_is_default: contact.shipping_address.is_default || true,
          shipping_emails: shipping_emails,
          shipping_phones: shipping_phones,
          do_not_call: get(contact, "do_not_call", false),
          do_not_email: get(contact, "do_not_email", false),
          do_not_mail: get(contact, "do_not_mail", false),
          do_not_text: get(contact, "do_not_text", true),
          billing_company: contact?.billing_address?.company || companyData?.name || "",
          shipping_company: contact?.shipping_address?.company || companyData?.name || ""
        };
      });
    }
  }, [contact, edit, companyData?.name]);

  const handleCancel = () => {
    // We are saving current path in history state so that we
    // we can decide wether to get Data(Create Company) locally or from api
    // GetDataLocally: when user is going back to "create customer" from "add-contact"
    // API: when user directly comes to create customer
    if (locationstate?.customerDetails) navigate(-1);
    navigate(`/customers/${customerId}`, { state: { from: location.pathname } });
  };

  const handleSubmit = async (values: ContactFormValidation, resetForm: () => void) => {
    const data: Partial<ContactRequest> = {
      title: values.title,
      is_billing: values.is_billing,
      is_shipping: values.is_shipping,
      website: values.website,
      office_phone: values.office_phone,
      billing_phone: values.billing_phone,
      user: {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        type: "contact"
      },
      billing_address: {
        is_billing: values?.billing_is_billing,
        is_default: values?.billing_is_default,
        is_residental: values.billing_residential,
        first_name: values.address_first_name,
        label: values.label,
        last_name: values.address_last_name,
        fax: values.fax,
        zip: values.billing_zip,
        street1: values.billing_address_1,
        street2: values.billing_address_2,
        city: values.billing_city,
        state: values.billing_state,
        country: values.billing_country,
        type: "contact",
        company: values.billing_company,
        email: (values?.billing_emails?.length && values.billing_emails[0]) || "",
        email2: (values?.billing_emails?.length && values.billing_emails[1]) || "",
        email3: (values?.billing_emails?.length && values.billing_emails[2]) || "",
        email4: (values?.billing_emails?.length && values.billing_emails[3]) || "",
        phone: (values?.billing_phones?.length && values.billing_phones[0]) || "",
        phone2: (values?.billing_phones?.length && values.billing_phones[1]) || ""
      },
      shipping_address: {
        is_shipping: values?.shipping_is_shipping,
        is_default: values?.shipping_is_default,
        is_residental: values.shipping_residential,
        first_name: values.address_first_name,
        label: values.label,
        last_name: values.address_last_name,
        fax: values.fax,
        zip: values.shipping_zip,
        street1: values.shipping_address_1,
        street2: values.shipping_address_2,
        city: values.shipping_city,
        state: values.shipping_state,
        country: values.shipping_country,
        type: "contact",
        company: values.shipping_company,
        email: (values?.shipping_emails?.length && values.shipping_emails[0]) || "",
        email2: (values?.shipping_emails?.length && values.shipping_emails[1]) || "",
        email3: (values?.shipping_emails?.length && values.shipping_emails[2]) || "",
        email4: (values?.shipping_emails?.length && values.shipping_emails[3]) || "",
        phone: (values?.shipping_phones?.length && values.shipping_phones[0]) || "",
        phone2: (values?.shipping_phones?.length && values.shipping_phones[1]) || ""
      },
      do_not_call: values.do_not_call,
      do_not_email: values.do_not_email,
      do_not_mail: values.do_not_mail,
      do_not_text: values.do_not_text
    };

    if (edit) {
      await editContact({
        data,
        company_id: customerId,
        contact_id: contact.id
      });
      navigate(-1);
    } else {
      const addContactResponse = await mutateAsync(data);
      if (addContactResponse?.id) {
        addContactToCompany.mutateAsync({ id: addContactResponse.id }).then(() => {
          resetForm();
          navigate(-1);
        });
      }
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
            <NavBar pageTitle={edit ? "Edit Contact" : "Create Contact"}>
              <div className={classes.headerButtons}>
                <Button onClick={handleCancel} text="Cancel" type="secondary" />
                &nbsp;
                <Button
                  ariaLabel="save contact"
                  submit="submit"
                  text={edit ? "Save Changes" : "Save Contact"}
                  variant="contained"
                />
              </div>
            </NavBar>
            <div style={{ padding: 30 }}>
              <Grid container justifyContent="space-between">
                {/* Back Icon */}
                <Grid container>
                  <Typography
                    className={classes.link}
                    onClick={handleCancel}
                    variant="body2"
                  >
                    <div className={classes.customerBackDiv}>
                      <span>
                        <MuiIcon icon="backArrow" fontSize="small" />
                      </span>{" "}
                      &nbsp;
                      <span>Customer Details</span>
                    </div>
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} lg={8}>
                  <BasicInformation
                    formik={formik}
                    checked={checked}
                    setChecked={setChecked}
                  />
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
