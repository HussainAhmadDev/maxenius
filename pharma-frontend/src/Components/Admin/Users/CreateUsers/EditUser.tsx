import * as React from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { NavBar } from "Components/Navbar";
import Button from "Components/Button";
import MuiIcon from "../../../icons/MuiIcons";
import AddUserInfo from "./AddUsersInfo";
import EditUserRole from "./EditUserRole";
import { useFormik } from "formik";
import { BrandType, UserData } from "Interfaces/User";
import * as yup from "yup";
import { useEditUser, useUserByID } from "Hooks/useUsers";
import { getBrandId } from "Hooks/api";
import UserBrand from "./UserBrand";
import { useQueryClient } from "react-query";

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

interface Props {
  userId: string;
}

const EditUser: React.FC<Props> = ({ userId }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { data, isLoading } = useUserByID(userId);
  const { mutate } = useEditUser(userId);

  const initialFormState: Partial<UserData> = {
    first_name: data?.first_name || "",
    middle_name: data?.middle_name || "",
    last_name: data?.last_name || "",
    email: data?.email || "",
    password: "",
    mobile_phone: data?.mobile_phone || "",
    office_phone: data?.office_phone || "",
    type: undefined,
    is_active: data?.is_active || true,
    profilePic: data?.profilePic || "",
    is_superuser: data?.is_superuser,
    is_staff: data?.is_staff,
    is_manager: data?.is_manager,
    is_associate: data?.is_associate,

    auth0_blocked_status: data?.auth0_blocked_status || false,
    auth0_user_id: data?.auth0_user_id || "",
    brands:
      data?.brands && typeof data.brands === "object"
        ? (data.brands as BrandType[]).map(brand => brand.id)
        : ""
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: !isLoading ? initialFormState : initialFormState,
    validationSchema: validationSchema,
    onSubmit: values => {
      const newValues: typeof values = { ...values, type: "user" };

      if (typeof values.brands === "object") {
        newValues.brands = values.brands?.join();
      }
      mutate(newValues, {
        onSuccess: () => {
          queryClient.invalidateQueries(["brands", { userId }]);
        }
      });
    }
  });

  const brandID = getBrandId();

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <NavBar pageTitle="Edit User">
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
              loading={false}
              submit="submit"
            />
          </div>
        </NavBar>
        <div style={{ padding: 30 }}>
          <Grid container justifyContent="space-between">
            {/* Back Icon */}
            <Grid container>
              <div className={classes.customerBackDiv} onClick={() => navigate(-1)}>
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
              <AddUserInfo data={formik.values} formik={formik} />
              <EditUserRole data={formik.values} formik={formik} />
              <UserBrand data={formik.values} formik={formik} />
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

export default EditUser;
