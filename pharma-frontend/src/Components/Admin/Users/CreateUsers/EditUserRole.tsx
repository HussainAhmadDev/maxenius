import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Typography, Radio } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { FormikProps } from "formik";
import { UserData } from "Interfaces/User";

// import Button from "Components/Button";
// import { useAuthUsers, useUpdateAuthUser } from "Hooks/useUsers";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flex: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(1)
    },

    checkedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.primary.main}`,
      marginBottom: theme.spacing(2)
    },
    unCheckedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.gray[300]}`,
      marginBottom: theme.spacing(2),

      color: theme.palette.gray[400]
    },

    headingSection: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    },
    assignBtn: {
      margin: theme.spacing(2),
      marginLeft: theme.spacing(3)
    }
  })
);
const roles = [
  {
    title: "Super Admin",
    description: "can manage orders across all brands of multiple assigned organizations"
  },
  {
    title: "Manager",
    description:
      "Equivalent to Staff with additional authority to add receiving and adjust quantities in Purchase Orders, and modify shipped stock in individual orders."
  },
  {
    title: "Associate",
    description:
      "can take and manage orders for all brands of a single assigned organization"
  },
  {
    title: "Staff",
    description:
      "can take and manage orders for all brands of a single assigned organization"
  }
];

interface Props {
  formik: FormikProps<Partial<UserData>>;
  data: Partial<UserData>;
}
const EditUserRole: React.FC<Props> = ({ data, formik }) => {
  const classes = useStyles();
  const [selectedUserRole, setSelectedUserRole] = React.useState("");
  const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedUserRole(event.target.value);
  };

  // const { data: authUserList } = useAuthUsers(formik?.values?.email);

  React.useEffect(() => {
    if (data?.is_superuser) {
      setSelectedUserRole("Super Admin");
    }
    if (data?.is_staff) {
      setSelectedUserRole("Staff");
    }
    if (data?.is_manager) {
      setSelectedUserRole("Manager");
    }
    if (data?.is_associate) {
      setSelectedUserRole("Associate");
    }
    //eslint-disable-next-line
  }, [data]);

  React.useEffect(() => {
    const role = roles.find(role => role.title === selectedUserRole);

    if (role) {
      formik.setFieldValue("is_superuser", role.title === "Super Admin");
      formik.setFieldValue("is_staff", role.title === "Staff");
      formik.setFieldValue("is_manager", role.title === "Manager");
      formik.setFieldValue("is_associate", role.title === "Associate");
    } else {
      formik.setFieldValue("is_superuser", false);
      formik.setFieldValue("is_staff", false);
      formik.setFieldValue("is_manager", false);
      formik.setFieldValue("is_associate", false);
    }
    //eslint-disable-next-line
  }, [selectedUserRole]);

  // const [blockUser, setBlockUser] = React.useState<boolean>(false)

  // const [authUser, setAuthUser] = React.useState<AuthUser>();

  // React.useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const userFound = authUserList?.find(
  //         ({ name, email }: { name: string; email: string }) =>
  //           (name || email) === formik?.values.email
  //       );
  //       setAuthUser(userFound);

  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   fetchData();
  // }, [authUserList, formik?.values.email]);

  // const { mutate } = useUpdateAuthUser();

  // const blockHandler = (blockStatus: boolean) => {

  //   mutate({
  //     blocked: blockStatus,
  //     user_id: authUser?.user_id ? authUser?.user_id : ""
  //   });
  // };

  // React.useEffect(() => {

  //   formik.setFieldValue("blocked", blockUser)

  // }, [blockUser])

  return (
    <div>
      <div className={classes.headingSection}>
        {/* <Typography variant="h6">Status: {authUser?.blocked}</Typography> */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "5%",
            marginTop: "10px"
          }}
        >
          <Radio
            checked={data.auth0_blocked_status}
            onClick={() =>
              formik.setFieldValue("auth0_blocked_status", !data.auth0_blocked_status)
            } // Toggle the value instead of directly setting it
            value={data.auth0_blocked_status}
          />
          <Typography variant="h6">Block/Unblock</Typography>

          {/* <Button
            style={{ background: "#5cb85c" }}
            text="Unblock"
            variant="contained"
            onClick={() => blockHandler(false)}
          />
          <Button
            text="Block"
            variant="contained"
            style={{ minWidth: "78px" }}
            onClick={() => blockHandler(true)}
          /> */}
        </div>
      </div>

      <div className={classes.headingSection}>
        <Typography variant="h6">User Role</Typography>
      </div>

      <Grid container gap={1}>
        {roles?.map(role => (
          <Grid
            key={role.title}
            lg={2.5}
            md={12}
            sm={12}
            xs={12}
            item
            className={
              selectedUserRole === role.title
                ? classes.checkedType
                : classes.unCheckedType
            }
          >
            <div className={classes.flex}>
              <Radio
                checked={selectedUserRole === role.title}
                onChange={handleChangeType}
                value={role.title}
              />
              <div>
                <Typography variant="body1">{role.title}</Typography>
                {/* <Typography variant="body2">{role.description}</Typography> */}
              </div>
            </div>
            {/* {selectedUserRole === "Organization Employee" &&
            role.title === "Organization Employee" ? (
              <div>
                <hr />
                <div className={classes.assignBtn}>
                  <Button text="Assign Organizations" type="secondary" />
                </div>
              </div>
            ) : (
              ""
            )} */}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EditUserRole;
