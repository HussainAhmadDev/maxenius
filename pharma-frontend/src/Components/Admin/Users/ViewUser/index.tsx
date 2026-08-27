import * as React from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import UserInfoSection from "./UserInfoSection";
import { NavBar } from "../../../Navbar";
import Table from "./ActivityTable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end"
    },
    customerBackDiv: {
      display: "flex",
      color: theme.palette.gray[400],
      cursor: "pointer"
    }
  })
);
const AddCustomer: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);

  const handleChangeTab = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <div>
      <NavBar pageTitle="User:John Mayer">
        <div className={classes.headerButtons}>
          <Button text="Cancel" type="secondary" />
          &nbsp;
          <Button text="Save Customer" variant="contained" />
        </div>
      </NavBar>

      <div style={{ padding: 30 }}>
        <Grid container>
          <div
            className={classes.customerBackDiv}
            onClick={() => navigate("/admin/users")}
          >
            <p>
              <MuiIcon icon="backArrow" fontSize="small" />
            </p>{" "}
            &nbsp;
            <p>Users</p>
          </div>
        </Grid>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeTab}
          aria-label="disabled tabs example"
        >
          <Tab label="User Info" />
          <Tab label="Activity Logs" />
        </Tabs>
        {tabValue === 0 ? <UserInfoSection /> : <Table />}
      </div>
    </div>
  );
};

export default AddCustomer;
