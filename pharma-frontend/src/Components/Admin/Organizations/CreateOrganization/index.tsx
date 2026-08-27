import * as React from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import * as yup from "yup";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Formik, Form } from "formik";
import { NavBar } from "Components/Navbar";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import AddOrganizationInfo from "./AddOrganizationInfo";
import OrganizationSocials from "./OrganizationSocials";
import AddImage from "./AddImage";
import AddOrganizationAddress from "./AddOrganizationAddress";
import { CreateOrganizationForm } from "Interfaces/Org";
import { useCreateOrganization } from "Hooks/useOrgs";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end"
    },
    customerBackDiv: {
      display: "flex",
      color: theme.palette.gray[400],
      cursor: "pointer"
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
    }
  })
);

const CreateOrganization: React.FC = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const { mutate: createOrganization, isLoading } = useCreateOrganization();

  const initialValues: CreateOrganizationForm = {} as CreateOrganizationForm;

  const validationSchema = yup.object({
    name: yup.string().required("Organization name is required"),
    email: yup.string().required("Organization email is required"),
    address_street1: yup.string().required("At least one address is required"),
    address_city: yup.string().required("City is required"),
    address_country: yup.string().required("Country is required"),
    address_state: yup.string().required("State is required"),
    address_zip: yup.string().required("Zip is required")
  });

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          const organization = {
            name: values.name,
            ein: values.ein,
            email: values.email,
            office_phone: values.office_phone,
            fax_phone: values.fax,
            url: values.url,
            domain: values.domains[0],
            domain2: values.domains[1],
            address: {
              first_name: "",
              last_name: "",
              street1: values.address_street1,
              street2: values.address_street2,
              country: values.address_country,
              city: values.address_city,
              state: values.address_state,
              zip: values.address_zip,
              phone: values.address_phones[0],
              phone2: values.address_phones[1],
              email: values.address_emails[0],
              email2: values.address_emails[1],
              email3: values.address_emails[2],
              email4: values.address_emails[3]
            },
            twitter: values.twitter,
            facebook: values.facebook,
            pinterest: values.pinterest,
            linkedin: values.linkedin,
            instagram: values.instagram,
            tiktok: values.tiktok
          };
          createOrganization(organization);
        }}
      >
        {({ errors, touched, values, handleChange, setFieldValue }) => (
          <Form>
            <NavBar pageTitle="Create Organization">
              <div className={classes.headerButtons}>
                <Button text="Cancel" type="secondary" />
                &nbsp;
                <Button
                  text="Save organization"
                  variant="contained"
                  submit="submit"
                  loading={isLoading}
                />
              </div>
            </NavBar>
            <div style={{ padding: 30 }}>
              <Grid container justifyContent="space-between">
                {/* Back Icon */}
                <Grid container>
                  <div
                    className={classes.customerBackDiv}
                    onClick={() => navigate("/admin/organizations")}
                  >
                    <p>
                      <MuiIcon icon="backArrow" fontSize="small" />
                    </p>{" "}
                    &nbsp;
                    <p>Organizations</p>
                  </div>
                </Grid>
              </Grid>
              {/* Back Icon */}
              <Grid container spacing={2}>
                {/* Info Section */}
                <Grid item lg={8} md={8} sm={12} xs={12}>
                  <AddOrganizationInfo
                    errors={errors}
                    values={values}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                  <AddOrganizationAddress
                    errors={errors}
                    values={values}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                  <OrganizationSocials
                    errors={errors}
                    values={values}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <AddImage />
                </Grid>
                {/* Info Section */}
              </Grid>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateOrganization;
