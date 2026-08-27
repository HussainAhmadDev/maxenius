import * as React from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import * as yup from "yup";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { NavBar } from "../../../Navbar";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import AddBrandInfo from "./AddBrandInfo";
import BrandSocials from "./BrandSocials";
import AddImage from "./AddImage";
import AddBrandAddress from "./AddBrandAddress";
import { Form, Formik } from "formik";
import { BrandFormValues } from "Interfaces/Brands";

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
const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  const initialValues: BrandFormValues = {
    brandName: "",
    description: "",
    email: "",
    officeNumber: "",
    fax: "",
    url: "",
    domains: ["https://www.domain2.com", "https://www.domain3.com"],
    phones: ["415555267187654", "415555872672436"],
    emails: ["johndoe@gmail.com", "bobthebuilder@gmail.com"],
    addressOne: "",
    addressTwo: "",
    state: "",
    city: "",
    zip: "",
    country: "United States",
    twitter: "",
    facebook: "",
    pinterest: "",
    linkdin: "",
    instagram: "",
    tiktok: ""
  };

  const createBrandSchema = yup.object().shape({
    brandName: yup.string().required("BrandName Is Required"),
    description: yup.string().required("Description Is Required"),
    email: yup.string().required("Email Is Required").email("Should be valid email"),
    url: yup.string().required("Url Is Required").url("Should be valid url"),
    officeNumber: yup.string().required("Office Number Is Required"),
    fax: yup.string().required("Fax Is Required"),
    addressOne: yup.string().required("Address 1 Is Required"),
    addressTwo: yup.string().required("Address 2 Is Required"),
    state: yup.string().required("State Is Required"),
    city: yup.string().required("City Is Required"),
    zip: yup.string().required("Zip Is Required"),
    country: yup.string().required("Country Is Required"),
    domains: yup.array().of(yup.string().url("Should be valid url")),
    phones: yup.array().of(yup.string().required("Should be valid phone")),
    emails: yup.array().of(yup.string().email("Should be valid email")),
    twitter: yup.string().url("Should be valid url"),
    facebook: yup.string().url("Should be valid url"),
    pinterest: yup.string().url("Should be valid url"),
    linkdin: yup.string().url("Should be valid url"),
    instagram: yup.string().url("Should be valid url"),
    tiktok: yup.string().url("Should be valid url")
  });

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={createBrandSchema}
        onSubmit={(values, actions) => {
          navigate("/admin/brand/view");
        }}
      >
        {({ errors, touched, values, handleChange, setFieldValue }) => (
          <Form>
            <NavBar pageTitle="Create Brand">
              <div className={classes.headerButtons}>
                <Button text="Cancel" type="secondary" />
                &nbsp;
                <Button text="Save brand" variant="contained" submit="submit" />
              </div>
            </NavBar>
            <div style={{ padding: 30 }}>
              <Grid container justifyContent="space-between">
                {/* Back Icon */}
                <Grid container>
                  <div
                    className={classes.customerBackDiv}
                    onClick={() => navigate("/admin/brands")}
                  >
                    <p>
                      <MuiIcon icon="backArrow" fontSize="small" />
                    </p>{" "}
                    &nbsp;
                    <p>Brands</p>
                  </div>
                </Grid>
              </Grid>
              {/* Back Icon */}
              <Grid container spacing={2}>
                {/* Info Section */}
                <Grid item lg={8} md={8} sm={12} xs={12}>
                  <AddBrandInfo
                    errors={errors}
                    values={values}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                  <AddBrandAddress
                    errors={errors}
                    values={values}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                  <BrandSocials
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

export default CreateUser;
