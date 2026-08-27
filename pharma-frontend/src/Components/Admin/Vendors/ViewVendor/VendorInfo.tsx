import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import { useNavigate } from "react-router-dom";
import { VendorData } from "Interfaces/Vendors";
import { ukDateFormat } from "Utils/datesFormat";
// import { useParams } from "react-router";

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
  value?: string;
}

interface props {
  data: VendorData | undefined;
}

const VendorInfo: React.FC<props> = ({ data }) => {
  const classes = useStyles();
  // const { id: organizationId } = useParams<"id">();
  const navigate = useNavigate();
  //any eslint-disable-next-line @typescript-eslint/no-explicit-
  const userData: KeysTypes[] = [
    {
      label: "Date Created",
      value: data?.created ? ukDateFormat(data?.created, false) : "-- --"
    },
    {
      label: "Date Updated",
      value: data?.updated ? ukDateFormat(data?.updated, false) : "-- --"
    },

    {
      label: "Contact Name",
      value: data?.contact_name ? data?.contact_name : "-- --"
    },

    {
      label: "Contact Telephone",
      value: data?.contact_phone ? data?.contact_phone : "-- --"
    },
    {
      label: "Secondary Telephone",
      value: data?.secondary_phone ? data?.secondary_phone : "-- --"
    },
    {
      label: "Fax",
      value: data?.fax ? data?.fax : "-- --"
    },
    {
      label: "Email",
      value: data?.email ? data?.email : "-- --"
    },
    {
      label: "Webpage",
      value: data?.webpage ? data?.webpage : "-- --"
    },
    {
      label: "Currency",
      value: data?.currency ? data?.currency : "-- --"
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
              {data?.name}{" "}
              <span className={classes.activeLabel}>
                {data?.is_active ? "Active" : "Not Active"}
              </span>
              {/* <span className={classes.activeLabel}>Not Active</span> */}
            </Typography>
          </Grid>
          <Grid item lg={4} md={4} sm={4} xs={12}>
            <div className={classes.iconSection}>
              <Button
                text="Edit"
                icon={<MuiIcon icon="edit" />}
                type="secondary"
                onClick={() => {
                  navigate(`/admin/vendor/edit/${data?.id}`);
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
              {/* <Grid item lg={5} md={5} sm={12} xs={12}>
                <div className={classes.userImageDiv}>
                  <img src={BrandPic} height="300" alt="Brand Logo" />
                </div>
              </Grid> */}
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
              {data?.name}
            </Typography>
            <Typography variant="body1">{data?.address}</Typography>
            <Typography variant="body1">{data?.alternative_address}</Typography>
            <Typography variant="body1">
              {data?.country && `${data?.country}, `}
              {data?.region && `${data?.region} ,`}
              {data?.city && `${data?.city} ,`} {data?.post_code}{" "}
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default VendorInfo;
