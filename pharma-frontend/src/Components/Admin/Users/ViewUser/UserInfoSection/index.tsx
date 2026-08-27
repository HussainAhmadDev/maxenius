import * as React from "react";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import CustomerInfo from "./CustomerInfo";

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
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <CustomerInfo />
      </Grid>
    </div>
  );
};

export default ViewCustomerInfo;
