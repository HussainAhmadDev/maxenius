import * as React from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import * as yup from "yup";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { NavBar } from "../../../Navbar";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import AddVendorInfo from "./AddVendorInfo";
import { Form, Formik } from "formik";
import { VendorData, VendorFormValues } from "Interfaces/Vendors";
import { useEditVendor } from "Hooks/useVendors";

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
//eslint-disable-next-line
const CreateVendor: React.FC<VendorData> = ({ vendorDetails }: any) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const { mutate: EditVendor } = useEditVendor(vendorDetails.id);

  const initialValues: VendorFormValues = {
    name: vendorDetails ? vendorDetails.name : "",
    contact_name: vendorDetails.contact_name,
    address: vendorDetails.address,
    alternative_address: vendorDetails.alternative_address,
    city: vendorDetails.city,
    region: vendorDetails.region,
    post_code: vendorDetails.post_code,
    country: vendorDetails.country,
    contact_phone: vendorDetails.contact_phone,
    secondary_phone: vendorDetails.secondary_phone,
    fax: vendorDetails.fax,
    email: vendorDetails.email,
    webpage: vendorDetails.webpage,
    currency: vendorDetails.currency,
    is_active: vendorDetails.is_active
  };

  const createVendorSchema = yup.object().shape({
    name: yup.string().required("Vendor Name Is Required"),
    contact_name: yup.string(),
    address: yup.string().required("Address Is Required"),
    alternative_address: yup.string(),
    city: yup.string(),
    region: yup.string(),
    post_code: yup.string(),
    country: yup.string(),
    contact_phone: yup.string().required("Phone Is Required"),
    secondary_phone: yup.string(),
    fax: yup.string(),
    email: yup.string().required("Email Is Required.").email("Should be valid email"),
    webpage: yup.string().url("Should be valid url"),
    currency: yup.string()
  });

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={createVendorSchema}
        onSubmit={(values, actions) => {
          EditVendor(
            { ...values },
            {
              onSuccess: data => {
                navigate(`/admin/vendor/view/${data.id}`);
              }
            }
          );
        }}
      >
        {({ errors, touched, values, handleChange, setFieldValue }) => (
          <Form>
            <NavBar pageTitle="Update Vendor">
              <div className={classes.headerButtons}>
                <Button text="Cancel" type="secondary" />
                &nbsp;
                <Button text="Save Vendor" variant="contained" submit="submit" />
              </div>
            </NavBar>
            <div style={{ padding: 30 }}>
              <Grid container justifyContent="space-between">
                {/* Back Icon */}
                <Grid container>
                  <div
                    className={classes.customerBackDiv}
                    onClick={() => navigate("/admin/vendors")}
                  >
                    <p>
                      <MuiIcon icon="backArrow" fontSize="small" />
                    </p>{" "}
                    &nbsp;
                    <p>Vendors</p>
                  </div>
                </Grid>
              </Grid>
              {/* Back Icon */}
              <Grid container spacing={2}>
                {/* Info Section */}
                <Grid item lg={8} md={8} sm={12} xs={12}>
                  <AddVendorInfo
                    errors={errors}
                    values={values}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
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

export default CreateVendor;
