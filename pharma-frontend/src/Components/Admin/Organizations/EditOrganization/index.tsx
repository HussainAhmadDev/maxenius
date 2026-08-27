import * as React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Typography } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { Organization } from "Interfaces/Org";
import { NavBar } from "Components/Navbar";
import MuiIcon from "Components/icons/MuiIcons";
import Button from "Components/Button";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: "30px"
    },
    flexDiv: {
      display: "flex",
      width: "fit-content",
      cursor: "pointer"
    },
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end"
    }
  })
);

const validationSchema = yup.object({
  name: yup
    .string()
    .min(2, "Please enter a valid name")
    .required("Product name is required"),
  sku: yup.string().required("Product number is required"),
  description: yup.string().required("Description is required")
});

const EditOrganization = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {} as Partial<Organization>,
    validationSchema: validationSchema,
    onSubmit: values => {
      // do something
    }
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <NavBar pageTitle={"Edit Organization"}>
          <div className={classes.headerButtons}>
            <Button text="Cancel" type="secondary" />
            &nbsp;
            <Button
              text="Save Organization"
              variant="contained"
              loading={false}
              submit="submit"
            />
          </div>
        </NavBar>
        <div className={classes.container}>
          <Typography variant="body2">
            <span
              onClick={() => navigate("/admin/organizations")}
              className={classes.flexDiv}
            >
              <span>
                <MuiIcon icon="backArrow" fontSize="small" />
              </span>{" "}
              &nbsp;
              <span>Organizations</span>
            </span>
          </Typography>
        </div>
      </form>
    </div>
  );
};

export default EditOrganization;
