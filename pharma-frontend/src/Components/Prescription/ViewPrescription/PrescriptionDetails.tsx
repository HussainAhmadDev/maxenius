import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
// components
import Button from "Components/Button";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import TextInput from "Components/Form/TextInput";
// import MuiIcon from "Components/icons/MuiIcons";
import Select, { Option } from "../../Form/Select";
// import { OrderData } from "Interfaces/Order";
// import { CompanyData } from "Interfaces/Company";
// import theme from "theme";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: "21px",
      fontWeight: "bold"
    },
    dBlock: {
      display: "block"
    },
    label: {
      marginBottom: "14px",
      marginTop: "0px",
      fontWeight: "bold",
      fontSize: "12px"
    },
    selectLabel: {
      display: "block",
      marginBottom: "8px",
      marginTop: "0px",
      fontWeight: "bold",
      fontSize: "12px"
    },
    selectDiv: {
      width: "100%"
    },
    btnSection: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    labelDiv: {
      minWidth: "130px"
    }
  })
);
const prescriptionStatus: Array<Option> = [
  { label: "All", value: "" },
  { label: "Mine", value: "mine" },
  { label: "Published", value: "published" },
  { label: "Bin", value: "bin" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
  { label: "Purchased", value: "purchased" },
  { label: "Approved", value: "approved" }
];
const PrescriptionDetails: React.FC = () => {
  const classes = useStyles();
  // const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <div>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item lg={6} md={12}>
          <h3 className={classes.title}>Prescription #70789</h3>
        </Grid>
        <Grid item lg={6} md={12}>
          <div className={classes.btnSection}>
            <Button text={"Generate PDF"} type="secondary" />
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={4} xs={12}>
          <p className={classes.label}>Date Created:</p>
          <p>2023-03-27 @ 12:16:06</p>
          <p>
            <span className={classes.dBlock}>
              <strong>Patient:</strong> Fname Lname
            </span>
            <span className={classes.dBlock}>
              <strong>Partner:</strong> Fname Lname
            </span>
          </p>
          <p>
            <strong>Comments:</strong>{" "}
          </p>
        </Grid>
        <Grid item lg={4} xs={12}>
          <div>
            <div className={classes.labelDiv}>
              <p className={classes.label}>Prescription Status:</p>
            </div>
            <div className={classes.selectDiv}>
              <Select
                ariaLabel="prescription type"
                options={prescriptionStatus}
                name="prescriptiontype"
              />{" "}
            </div>
          </div>
        </Grid>
        <Grid item lg={4} xs={12}>
          <p className={classes.label}>Customer: </p>
          <p>Fname Lname {"(#123 - info@xyz.com)"}</p>
        </Grid>
      </Grid>
    </div>
  );
};

export default PrescriptionDetails;
