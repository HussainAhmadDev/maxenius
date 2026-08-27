import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "../../../Button";
import MuiIcon from "../../../icons/MuiIcons";
import { NavBar } from "../../../Navbar";
import WarehouseInfo from "./WarehouseInfo";
import { useWarehouseById } from "Hooks/useWarehouses";

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

const ViewWarehouse: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id: warehouseId } = useParams<"id">();

  const { data } = useWarehouseById(warehouseId as string);

  return (
    <div>
      <NavBar pageTitle={`Warehouse: ${warehouseId}`}>
        <Button
          onClick={() => navigate("/admin/warehouse/create")}
          icon={<MuiIcon icon="add" />}
          variant="contained"
          text="Add Warehouse"
        />
      </NavBar>

      <div style={{ padding: 30 }}>
        <Grid container>
          <div className={classes.customerBackDiv} onClick={() => navigate(-1)}>
            <p>
              <MuiIcon icon="backArrow" fontSize="small" />
            </p>{" "}
            &nbsp;
            <p>Warehouses</p>
          </div>
        </Grid>
        <Grid container spacing={2}>
          {/* Info Section */}
          <Grid item xs={12}>
            <WarehouseInfo data={data} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ViewWarehouse;
