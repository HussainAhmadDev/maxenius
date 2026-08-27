import React, { useState } from "react";
import { OrderData, OrderProduct } from "../../../Interfaces/Orders";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import LoadingButton from "../../../Components/LoadingButton";
import { Close } from "@mui/icons-material";
import DataTable from "../../../Components/DataTable";
import { OrderAddReturnColumns } from "../../../Constants/Orders";
import { useAddOrderReturn, useUpdateOrderReturn } from "../../../Hooks/useOrders";
import SeeDocumentation from "../../../Components/SeeDocumentation";

interface OrderAddReturnModalProps {
  data?: OrderProduct[];
  open: boolean;
  onClose(): void;
  order?: OrderData;
}
const OrderAddReturnModal: React.FC<OrderAddReturnModalProps> = ({
  onClose,
  data,
  open,
  order
}) => {
  const [values, setValues] = useState<{ vals: OrderProduct | null; qty: number | null }>(
    { qty: null, vals: null }
  );
  const handleEdit = ({
    vals,
    qty
  }: {
    vals: OrderProduct | null;
    qty: number | null;
  }) => {
    setValues({
      qty,
      vals
    });
  };

  const { mutateAsync: addReturn, isLoading: addLoading } = useAddOrderReturn(
    order?.id || ""
  );
  const { mutateAsync: updateReturn, isLoading: updateLoading } = useUpdateOrderReturn(
    order?.id || ""
  );
  const handleDone = () => {
    if (!values.vals) {
      return;
    }
    const productFound = values?.vals?.order_product_return?.find(
      item => values?.vals?.id === item?.ordered_product_id
    );
    if (productFound?.id) {
      updateReturn({
        quantity: values.qty ?? productFound?.return_shipment.quantity,
        ordered_product_id: productFound?.ordered_product_id,
        return_id: productFound.id
      }).then(() => handleEdit({ qty: null, vals: null }));
    } else {
      addReturn({
        ordered_product_id: values.vals?.id,
        quantity: values.qty || values?.vals?.return_shipment?.quantity
      }).then(() => handleEdit({ qty: null, vals: null }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display={"flex"} alignItems={"center"} justifyContent={"left"} gap={2}>
          <Typography variant="h6" fontWeight={"bold"}>
            Add Returns
          </Typography>
          <SeeDocumentation fileName={"useAddOrderReturn"} title={"See Add Return"} />
          <SeeDocumentation fileName={"useUpdateOrderReturn"} title={"See Edit Return"} />
        </Box>
      </DialogTitle>
      <IconButton
        id="cy__ReturnClosebtn"
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500]
        }}
        onClick={onClose}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <DataTable
          columns={OrderAddReturnColumns({
            handleDone,
            handleEdit,
            loading: addLoading || updateLoading,
            values
          })}
          data={data || []}
          loading={false}
        />
      </DialogContent>
      <DialogActions>
        <LoadingButton variant="contained" onClick={onClose}>
          Close
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default OrderAddReturnModal;
