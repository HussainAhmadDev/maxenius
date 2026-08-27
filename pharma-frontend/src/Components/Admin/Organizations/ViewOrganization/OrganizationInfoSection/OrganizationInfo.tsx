import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "Components/Button";
import BrandSocial from "./OrganizationSocials";
import MuiIcon from "Components/icons/MuiIcons";
import BrandPic from "Assets/images/brand.png";
import { Organization } from "Interfaces/Org";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";

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

interface Props {
  data: Organization | undefined;
}
const CustomerInfo: React.FC<Props> = ({ data }) => {
  const classes = useStyles();
  const { id: organizationId } = useParams<"id">();
  const navigate = useNavigate();
  //any eslint-disable-next-line @typescript-eslint/no-explicit-
  const userData: KeysTypes[] = [
    {
      label: "Date Created",
      value: data?.created ? new Date(data?.created || "").toLocaleDateString() : "-- --"
    },
    {
      label: "Date Updated",
      value: data?.updated ? new Date(data?.updated || "").toLocaleDateString() : "-- --"
    },

    {
      label: "Email",
      value: data?.email || "-- --"
    },

    {
      label: "Mobile Phone Number",
      value: data?.office_phone || "-- --"
    },
    {
      label: "Fax Number",
      value: data?.fax_phone || "-- --"
    },
    {
      label: "URL",
      value: data?.url || "-- --"
    },
    {
      label: "Domain",
      value: data?.domain || "-- --"
    }
  ];
  return (
    <div className={classes.root}>
      <Typography variant="subtitle1">Basic Information</Typography>
      <div className={classes.infoSection}>
        <Grid container>
          {/* header section */}
          <Grid item lg={8} md={8} sm={8} xs={12}>
            <Typography variant="h6">
              {data?.name.toUpperCase() || "-- --"}{" "}
              {data?.is_active ? (
                <span className={classes.activeLabel}>Active</span>
              ) : (
                <span className={classes.activeLabel}>Not Active</span>
              )}
            </Typography>
          </Grid>
          <Grid item lg={4} md={4} sm={4} xs={12}>
            <div className={classes.iconSection}>
              <Button
                text="Edit"
                icon={<MuiIcon icon="edit" />}
                type="secondary"
                onClick={() => {
                  navigate(`/admin/organization/edit/${organizationId}`);
                }}
              />
              &nbsp; &nbsp;
              <Button
                onlyIcon={true}
                size="small"
                icon={<MuiIcon icon="dots" fontSize="small" />}
                type="secondary"
                disabled
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
                  rowSpacing={2}
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
                  <img src={data?.logo || BrandPic} height="300" alt="Brand Logo" />
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
              {data?.address?.first_name + " " + data?.address?.last_name}
            </Typography>
            <Typography variant="body1">{data?.address?.label}</Typography>
            <Typography variant="body1">{data?.address?.street1}</Typography>
            <Typography variant="body1">{data?.address?.street2}</Typography>
            <Typography variant="body1">
              {data?.address?.country}, {data?.address?.state}, {data?.address?.city},
              {data?.address?.zip}{" "}
            </Typography>
          </div>{" "}
        </Grid>
      </Grid>
      <BrandSocial data={data} />
    </div>
  );
};

export default CustomerInfo;
