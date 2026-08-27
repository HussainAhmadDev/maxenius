import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "../../../../Button";
import BrandSocial from "./BrandSocials";
import MuiIcon from "../../../../icons/MuiIcons";
import BrandPic from "../../../../../Assets/images/brand.png";
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
      height: "330px",
      textAlign: "right"
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
      color: theme.palette.primary.main
    },
    redText: {
      color: theme.palette.primary.main
    },
    orgInfo: {
      paddingLeft: theme.spacing(2)
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
    label: "Description",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    label: "Date Created",
    value: "06/12/20210"
  },
  {
    label: "Date Updated",
    value: "06/12/20210"
  },

  {
    label: "Email",
    value: "lanecampbell@gmail.com"
  },

  {
    label: "Mobile Phone Number",
    value: "+1 814 300 8056"
  },
  {
    label: "Fax Number",
    value: "+1 814 300 8056"
  },
  {
    label: "URL",
    value: "www.most.com"
  },
  {
    label: "Domains",
    value: "sub.example.com"
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
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={5}>
              <Grid item lg={7} md={7} sm={12} xs={12}>
                {/* Info Section */}
                <Grid
                  container
                  className={classes.customerDetailSection}
                  alignItems="center"
                >
                  {userData.map((item, index) => (
                    <Grid
                      key={index}
                      item
                      lg={item?.label === "Description" ? 12 : 6}
                      md={item?.label === "Description" ? 12 : 6}
                      sm={item?.label === "Description" ? 12 : 6}
                      xs={12}
                      className={classes.infoItem}
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
                  <img src={BrandPic} height="330" alt="BrandPic" />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* Info Section */}
      </div>
      <br />
      <Typography variant="h6">Address</Typography>
      <Grid container>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <div className={classes.infoSection}>
            <Typography variant="body2">Address</Typography>
            <Typography variant="body2" className={classes.redText}>
              Muhammad Usama
            </Typography>
            <Typography variant="body1">Title, Company Name</Typography>
            <Typography variant="body1">Address Line 1 here</Typography>
            <Typography variant="body1">Address Line 2 here</Typography>
            <Typography variant="body1">Country, State, City 54000</Typography>
          </div>{" "}
        </Grid>
      </Grid>
      <BrandSocial />
      <br />
      <Typography variant="h6">Organization Banking Information</Typography>
      <Grid container>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <div className={classes.infoSection}>
            <div className={classes.organizationDiv}>
              <div>
                <img src={OrganizationPic} alt="organization" width="50" />
              </div>
              <div className={classes.orgInfo}>
                <Typography variant="body2" className={classes.orgName}>
                  Organization Number Here Some Long Name
                </Typography>

                <Typography variant="body1">EIN 123456798</Typography>
              </div>
            </div>
          </div>{" "}
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomerInfo;
