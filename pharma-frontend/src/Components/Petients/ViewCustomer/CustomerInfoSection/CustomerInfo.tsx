import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { PatientResponse } from "Interfaces/Company";
import { ukDateFormat } from "Utils/datesFormat";

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
      fontSize: "12px",
      position: "relative",
      top: "-4px"
    },
    iconSection: {
      display: "flex",
      alignItems: "center"
    },
    customerDetailSection: {
      marginTop: "20px"
    },
    label: {
      marginBottom: "8px"
    }
  })
);

interface IProps {
  patientInfo: PatientResponse | undefined;
}
const CustomerInfo = ({ patientInfo }: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="subtitle1">Basic Information</Typography>
      <div className={classes.infoSection}>
        <Grid container>
          <Grid item lg={10} md={9} sm={9} xs={12}>
            <Typography variant="h6">
              {patientInfo?.results[0].name || "-- --"}{" "}
              <span className={classes.activeLabel}>{"Active"}</span>
            </Typography>
          </Grid>
        </Grid>
        <Grid container className={classes.customerDetailSection} alignItems="center">
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Typography variant="body2" className={classes.label}>
              Date of Birth
            </Typography>
            <Typography variant="subtitle1">
              {/* eslint-disable-next-line */}
              {/* @ts-ignore */}
              {ukDateFormat(patientInfo?.results[0]?.date_of_birth, false)}
            </Typography>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Typography variant="body2" className={classes.label}>
              Address
            </Typography>
            <Typography variant="subtitle1">
              {patientInfo?.results[0]?.address}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default CustomerInfo;
