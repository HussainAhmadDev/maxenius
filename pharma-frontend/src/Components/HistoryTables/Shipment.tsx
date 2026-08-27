import * as React from "react";
import Grid from "@mui/material/Grid";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import DataTable from "../DataTable/Table";
import Button from "../Button";
import MuiIcon from "../icons/MuiIcons";
import AddShipmentModal from "../Modals/AddShipments";
import { useModal } from "Hooks/useModal";
import { EmptyData } from "../icons/EmptyData";
// import { Avatar } from "@mui/material";
// import get from "lodash/get";
import { OrderData, OrderProduct } from "Interfaces/Order";
import { ukDateFormat } from "Utils/datesFormat";

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  readonly width?: string;
  readonly selector: (row: OrderProduct) => string | React.ReactNode | undefined;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnShipment: {
      border: `1px solid ${theme.palette.green.success}`,
      color: theme.palette.green.success,
      background: theme.palette.green.successBg,
      borderRadius: "80px",
      padding: "6px"
    },
    chip: {
      marginTop: "6px",
      border: `1px solid ${theme.palette.green.success}`,
      color: theme.palette.green.success,
      background: theme.palette.green.successBg
    },
    imgDiv: {
      display: "flex",
      textAlign: "center",
      color: "red"
    },
    productNameSku: {
      lineHeight: "18px",
      color: theme.palette.primary.main,
      display: "flex",
      gap: "5px"
    },
    label: {
      marginBottom: "0px",
      marginTop: "0px",
      fontWeight: "bold",
      fontSize: "12px"
    },
    productName: {
      color: "rgb(255, 23, 61)",
      fontSize: "12px"
    }
  })
);

interface Props {
  order: OrderData;
}
const ShipmentHistory: React.FC<Props> = ({ order }) => {
  const classes = useStyles();
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => null
  });

  const columns: ColumnsProps[] = [
    // {
    //   name: "Product Number",
    //   selector: row => (
    //     <div className={classes.productNameSku}>

    //       <p>{row.sku}</p>
    //     </div>
    //   )
    // },
    {
      name: "Product Name",
      selector: row => (
        <div className={classes.productName}>
          {row?.product?.name || "--"}
          <br />
          <p>{row.prescription_id ? "Prescription id: " + row?.prescription_id : ""}</p>
        </div>
      )
    },

    {
      name: "Qty Ordered",
      selector: row => `${row.quantity}`
    },

    {
      name: "Returned",
      selector: row => {
        return (
          row?.order_product_return?.reduce(
            (sum, item) => sum + +item.return_shipment.quantity,
            0
          ) || 0
        );
      }
    },
    {
      name: "Shipped",
      selector: row => row.shipped_quantity
    },
    {
      name: "Date",
      selector: row => row?.ship_date && ukDateFormat(row?.ship_date, false)
    },
    {
      name: "Status",
      selector: row => (
        <button className={classes.btnShipment}>
          {+row.shipped_quantity === 0
            ? "Not Shipped"
            : (row.quantity -
                row?.order_product_return?.reduce(
                  (sum, item) => sum + +item.return_shipment.quantity,
                  0
                ) || 0) <= row.shipped_quantity
            ? "Shipped"
            : "Partially Shipped"}
        </button>
      )
    }
  ];

  return (
    <div id="shipments">
      <h2>Shipment History</h2>
      <AddShipmentModal
        saveText="Update Shipments"
        title={`${order?.product_shippings?.length > 0 ? "Edit" : "Add"} Shipments`}
        handleSaveChanges={handleSave}
        handleCloseModal={handleModalClose}
        openModal={modalOpen}
        order={order}
      />
      {order?.products ? (
        <DataTable columns={columns} data={order.products} />
      ) : (
        <div style={{ width: "40%", marginLeft: "40%" }}>
          <EmptyData height={100} />
          <p>No shipments added yet</p>
        </div>
      )}
      <br />
      <Grid container>
        <Grid lg={2} xs={6} item>
          <Button
            id="cy_edit_or_add_shipment"
            text={`${order?.product_shippings?.length ? "Edit" : "Add"} Shipments`}
            type="secondary"
            icon={<MuiIcon icon="add" />}
            onClick={() => handleModalOpen()}
            disabled={!order.products?.length || order.is_trash}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ShipmentHistory;
