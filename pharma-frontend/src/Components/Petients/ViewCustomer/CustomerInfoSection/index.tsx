import * as React from "react";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import CustomerInfo from "./CustomerInfo";
import ContactPersonSection from "./ContactPersons";
import { useParams } from "react-router";
import { usePatientById, useSingleWebsite } from "Hooks/usePatients";
import CustomLoader from "Components/Loader";

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
    },
    loader: {
      width: "100%",
      height: "20vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  })
);

const ViewCustomerInfo: React.FC = () => {
  const classes = useStyles();

  const { id } = useParams<string>();

  const { website_id } = useParams<string>();

  const { data } = useSingleWebsite(website_id as string);

  const site_url = data?.site_url || "";
  const authorization_key = data?.authorization_key || "";

  const {
    data: patientInfo,
    isLoading,
    refetch
  } = usePatientById(
    `${site_url}/wp-json/inventory/v1/patient_list?id=${id}`,
    authorization_key
  );
  React.useEffect(() => {
    refetch();

    //eslint-disable-next-line
  }, [site_url, authorization_key]);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {!isLoading ? (
          <>
            <Grid item lg={8} md={8} sm={12} xs={12}>
              <CustomerInfo patientInfo={patientInfo} />
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <ContactPersonSection patientInfo={patientInfo} />
            </Grid>
          </>
        ) : (
          <Grid className={classes.loader}>
            <CustomLoader />
          </Grid>
        )}
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
