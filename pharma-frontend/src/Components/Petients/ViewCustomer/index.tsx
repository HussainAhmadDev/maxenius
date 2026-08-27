import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate, useParams } from "react-router-dom";
import MuiIcon from "Components/icons/MuiIcons";
import CustomerInfoSection from "./CustomerInfoSection";
import CustomersOrders from "./CustomersOrder";
import CustomerLogs from "./CustomersLogs";
import { NavBar } from "Components/Navbar";

const useStyles = makeStyles(() =>
  createStyles({
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center"
    },
    customerBackDiv: {
      display: "flex",
      cursor: "pointer"
    }
  })
);
const AddCustomer: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = React.useState(0);
  const { id } = useParams<string>();
  const handleChangeTab = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <NavBar pageTitle={`Patient ID: ${id}`}></NavBar>
      <div style={{ padding: 30 }}>
        <Grid container>
          <Typography
            variant="body2"
            component="div"
            className={classes.customerBackDiv}
            onClick={() => navigate("/Patients")}
          >
            <p>
              <MuiIcon icon="backArrow" fontSize="small" />
            </p>
            <p>Patients</p>
          </Typography>
        </Grid>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeTab}
          aria-label="disabled tabs example"
        >
          <Tab label="Patient Info" />
          <Tab label="History" />
          {/* <Tab label="Logs" /> */}
        </Tabs>
        {tabValue === 0 ? (
          <CustomerInfoSection />
        ) : tabValue === 1 ? (
          <CustomersOrders />
        ) : (
          <CustomerLogs />
        )}
      </div>
    </div>
  );
};

export default AddCustomer;
