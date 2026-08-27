import * as React from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { NavBar } from "../../../Navbar";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import AddUserInfo from "./AddUsersInfo";
import AddUserRole from "./UserRole";
import { useFormik } from "formik";
import { UserData } from "Interfaces/User";
import * as yup from "yup";
import { useCreateUser } from "Hooks/useUsers";
import { getBrandId } from "Hooks/api";
import UserBrand from "./UserBrand";

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

const initialFormState: Partial<UserData> = {
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  password: "",
  mobile_phone: "",
  office_phone: "",
  type: "user",
  is_active: true,
  profilePic: "",
  brands: []
};

const validationSchema = yup.object({
  first_name: yup.string().required("User's first name is required"),
  middle_name: yup.string(),
  last_name: yup.string().required("User's Last name is required"),
  email: yup.string().email().required("User email is required"),
  password: yup
    .string()
    .min(8, "Password must consist of 6 or more characters")
    .max(20, "Password must consist of 20 or less characters"),
  mobile_phone: yup.string(),
  office_phone: yup.string(),
  isActive: yup.boolean(),
  profilePic: yup.string(),
  brands: yup.array().min(1, "Must Allow 1 Brand Atleast")
});

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  const { mutate: createUser, isLoading } = useCreateUser();

  const formik = useFormik({
    initialValues: initialFormState,
    validationSchema: validationSchema,
    onSubmit: values => {
      const newValues: typeof values = { ...values, type: "user" };

      if (typeof values.brands === "object") {
        newValues.brands = values.brands?.join();
      }

      createUser(newValues);
    }
  });
  const brandID = getBrandId();

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <NavBar pageTitle="Create User">
          <div className={classes.headerButtons}>
            <Button
              onClick={() => navigate(`/admin/users?brand_id=${brandID}`)}
              text="Cancel"
              type="secondary"
            />
            &nbsp;
            <Button
              text="Save User"
              variant="contained"
              loading={isLoading}
              submit="submit"
            />
          </div>
        </NavBar>
        <div style={{ padding: 30 }}>
          <Grid container justifyContent="space-between">
            {/* Back Icon */}
            <Grid container>
              <div
                className={classes.customerBackDiv}
                onClick={() => navigate("/admin/users")}
              >
                <p>
                  <MuiIcon icon="backArrow" fontSize="small" />
                </p>{" "}
                &nbsp;
                <p>Users</p>
              </div>
            </Grid>
          </Grid>
          {/* Back Icon */}
          <Grid container spacing={2}>
            {/* Info Section */}
            <Grid item lg={8} md={8} sm={12} xs={12}>
              <AddUserInfo addNewUser={true} data={formik.values} formik={formik} />
              <AddUserRole data={formik.values} formik={formik} />
              <UserBrand formik={formik} />
            </Grid>
            {/* <Grid item lg={4} md={4} sm={12} xs={12}>
              <AddImage />
            </Grid> */}
            {/* Info Section */}
          </Grid>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
