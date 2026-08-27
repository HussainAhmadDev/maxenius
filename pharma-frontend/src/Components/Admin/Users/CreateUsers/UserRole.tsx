import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Typography, Radio } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import Button from "../../../Button";
import { FormikProps } from "formik";
import { UserData } from "Interfaces/User";

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
    description:
      "can manage orders , customers, organizations, brands, products and users for all organizations"
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
  data?: Partial<UserData>;
}
// const defaultRole = "Staff";

const AddUserRole: React.FC<Props> = ({ formik }) => {
  const classes = useStyles();
  const [selectedValue, setSelectedValue] = React.useState("Staff");
  const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  React.useEffect(() => {
    const role = roles.find(role => role.title === selectedValue);

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
  }, [selectedValue]);

  return (
    <div>
      <div className={classes.headingSection}>
        <Typography variant="h6">User Role</Typography>
      </div>

      <Grid item container gap={1}>
        {roles?.map(role => (
          <Grid
            key={role.title}
            lg={2.5}
            md={3}
            sm={12}
            xs={12}
            item
            className={
              selectedValue === role.title ? classes.checkedType : classes.unCheckedType
            }
          >
            <div className={classes.flex}>
              <Radio
                checked={selectedValue === role.title}
                onChange={handleChangeType}
                value={role.title}
              />
              <div>
                <Typography variant="body1">{role.title}</Typography>
                {/* <Typography variant="body2">{role.description}</Typography> */}
              </div>
            </div>
            {selectedValue === "Organization Employee" &&
            role.title === "Organization Employee" ? (
              <div>
                <hr />
                <div className={classes.assignBtn}>
                  <Button text="Assign Organizations" type="secondary" />
                </div>
              </div>
            ) : (
              ""
            )}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AddUserRole;
