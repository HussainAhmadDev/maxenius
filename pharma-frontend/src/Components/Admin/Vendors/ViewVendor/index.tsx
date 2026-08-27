import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import { NavBar } from "../../../Navbar";
import VendorInfo from "./VendorInfo";
import { useVendorById } from "Hooks/useVendors";

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
const ViewVendor: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id: vendorId } = useParams<"id">();
  const { data } = useVendorById(vendorId as string);

  return (
    <div>
      <NavBar pageTitle={`Vendor: ${data?.name}`}>
        <Button
          onClick={() => navigate("/admin/vendor/create")}
          icon={<MuiIcon icon="add" />}
          variant="contained"
          text="Add Vendor"
        />
      </NavBar>

      <div style={{ padding: 30 }}>
        <Grid container>
          <div className={classes.customerBackDiv} onClick={() => navigate(-1)}>
            <p>
              <MuiIcon icon="backArrow" fontSize="small" />
            </p>{" "}
            &nbsp;
            <p>Vendors</p>
          </div>
        </Grid>
        <Grid container spacing={2}>
          {/* Info Section */}
          <Grid item xs={12}>
            <VendorInfo data={data} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ViewVendor;
