import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "../../../../Button";
import MuiIcon from "../../../../icons/MuiIcons";
import UserPic from "../../../../../Assets/images/User.png";
import OrganizationPic from "../../../../../Assets/images/organnization.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: "10px"
    },
    infoSection: {
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      padding: "15px",
      marginTop: "10px"
    },
    activeLabel: {
      background: theme.palette.gray[200],
      borderRadius: "6px",
      padding: "5px",
      fontSize: "12px"
    },
    iconSection: {
      display: "flex",
      alignItems: "center",
      float: "right"
    },
    customerDetailSection: {
      marginTop: "20px"
    },
    label: {
      marginBottom: "8px"
    },
    infoItem: {
      marginBottom: theme.spacing(3)
    },
    userImageDiv: {
      padding: theme.spacing(2),
      height: "330px"
    },
    organizationDiv: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: theme.spacing(1),
      background: theme.palette.gray[1000],
      borderRadius: "6px"
    },
    orgName: {
      color: theme.palette.primary.main,
      paddingLeft: theme.spacing(1)
    }
  })
);

interface KeysTypes {
  label: string;
  value: string;
}

//any eslint-disable-next-line @typescript-eslint/no-explicit-
const userData: KeysTypes[] = [
  {
    label: "Date Created",
    value: "06/12/20210"
  },
  {
    label: "Date Updated",
    value: "06/12/20210"
  },
  {
    label: "Date Joined",
    value: "06/12/20210"
  },
  {
    label: "Last Login",
    value: "06/12/20210"
  },
  {
    label: "Email",
    value: "lanecampbell@gmail.com"
  },
  {
    label: "Password",
    value: "Saad132"
  },
  {
    label: "Mobile Phone Number",
    value: "+1 814 300 8056"
  },
  {
    label: "Office Phone Number",
    value: "+1 814 300 8056"
  },
  {
    label: "Fax Number",
    value: "+1 814 300 8056"
  }
];
const CustomerInfo: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="subtitle1">Basic Information</Typography>
      <div className={classes.infoSection}>
        <Grid container>
          {/* header section */}
          <Grid item lg={8} md={8} sm={8} xs={12}>
            <Typography variant="h6">
              Bruce Campbell <span className={classes.activeLabel}>Active</span>
            </Typography>
          </Grid>
          <Grid item lg={4} md={4} sm={4} xs={12}>
            <div className={classes.iconSection}>
              <Button
                text="Reset Password"
                icon={<MuiIcon icon="edit" />}
                type="secondary"
              />
              &nbsp; &nbsp;
              <Button text="Edit" icon={<MuiIcon icon="edit" />} type="secondary" />
              &nbsp; &nbsp;
              <Button
                onlyIcon={true}
                size="small"
                icon={<MuiIcon icon="dots" fontSize="small" />}
                type="secondary"
              />
            </div>
          </Grid>
          {/* header section */}
          <Grid item lg={7} md={7} sm={12} xs={12}>
            {/* Info Section */}
            <Grid container className={classes.customerDetailSection} alignItems="center">
              {userData.map((item, index) => (
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={6}
                  xs={12}
                  className={classes.infoItem}
                  key={index}
                >
                  <Typography variant="body2" className={classes.label}>
                    {item?.label}
                  </Typography>

                  <Typography variant="subtitle1"> {item?.value}</Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item lg={5} md={5} sm={12} xs={12}>
            <div className={classes.userImageDiv}>
              <img src={UserPic} height="330" alt="userPic" />
            </div>
          </Grid>
        </Grid>
        {/* Info Section */}
      </div>
      <br />
      <Typography variant="h6">User Role</Typography>
      <Grid container>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <div className={classes.infoSection}>
            <Typography variant="subtitle1">Organization Employee</Typography>
            <br />

            <div className={classes.organizationDiv}>
              <div>
                <img src={OrganizationPic} alt="organization" />
              </div>
              <Typography variant="body2" className={classes.orgName}>
                can manage orders across all brands of multiple assigned organizations
              </Typography>
            </div>
          </div>{" "}
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomerInfo;
