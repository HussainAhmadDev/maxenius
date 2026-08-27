import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import CustomerInfo from "./CustomerInfo";
import ContactPersonSection from "./ContactPersons";
// import CustomerLogs from "./CustomerLogs";
import { useCompany } from "Hooks/useCompanies";
import { useParams } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: "20px"
    },
    taxEmpMainDiv: {
      marginTop: "2%"
    },
    taxEmpContainer: {
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      marginTop: "2%",
      padding: "3%"
    },
    label: {
      marginBottom: "8px"
    }
  })
);

const ViewCustomerInfo: React.FC = () => {
  const classes = useStyles();
  const { id: companyId } = useParams<"id">();
  const { data: company } = useCompany(companyId as string);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <CustomerInfo />
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <ContactPersonSection />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <div className={classes.taxEmpMainDiv}>
            <Typography variant="h6">Tax Exemption</Typography>
            <div className={classes.taxEmpContainer}>
              <Grid container>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Typography variant="body2" className={classes.label}>
                    Tax Exemption
                  </Typography>
                  <Typography variant="subtitle1">
                    {company?.is_tax_exempt ? "Yes" : "No"}
                  </Typography>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Typography variant="body2" className={classes.label}>
                    Tax Exemption ID
                  </Typography>
                  <Typography variant="subtitle1">
                    {company?.tax_exempt_id || "-- --"}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          {/* <CustomerLogs /> */}
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewCustomerInfo;
