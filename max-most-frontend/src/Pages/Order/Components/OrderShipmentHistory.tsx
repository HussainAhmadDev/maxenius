import { Button, CardActions, CardContent } from "@mui/material";
import React, { useState } from "react";
import DataTable from "../../../Components/DataTable";
import { OrderShipmentHistoryColumns } from "../../../Constants/Orders";
import { OrderData, OrderProduct } from "../../../Interfaces/Orders";
import { ModeEdit } from "@mui/icons-material";
import ManageShipmentsModal from "./ManageShipmentsModal";

interface OrderShipmentHistoryProps {
  loading: boolean;
  mode?: "full";
  data?: OrderProduct[];
  order?: OrderData;
}

const OrderShipmentHistory: React.FC<OrderShipmentHistoryProps> = ({
  loading,
  mode,
  data,
  order
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <CardContent>
        <DataTable
          columns={OrderShipmentHistoryColumns()}
          data={data || []}
          loading={loading}
          dense={mode !== "full"}
        />
      </CardContent>
      {mode === "full" && (
        <CardActions>
          <Button
            id="cy__ManageShipmentsbtn"
            startIcon={<ModeEdit />}
            variant="contained"
            size="small"
            onClick={handleOpen}
          >
            Manage Shipments
          </Button>
        </CardActions>
      )}
      <ManageShipmentsModal onClose={handleClose} open={open} data={order} />
    </>
  );
};

export default OrderShipmentHistory;
