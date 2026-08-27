import React, { useEffect, useState } from "react";
import { OrderData, OrderProduct, ResponseOrderBatch } from "../../../Interfaces/Orders";
import {
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
import { useGetBatchAndExpiry, useUpdateBatchAndExpiry } from "../../../Hooks/useOrders";
import { OrderBatchExpiryColumns } from "../../../Constants/Orders";
interface BatchExpiryModalProps {
  data?: OrderProduct | null;
  order?: OrderData;
  open: boolean;
  onClose(): void;
}
const BatchExpiryModal: React.FC<BatchExpiryModalProps> = ({
  data,
  onClose,
  order,
  open
}) => {
  const {
    mutate: batchAndExpiry,
    data: batchAndExpiryList,
    isLoading: batchExpiryLoading
  } = useGetBatchAndExpiry();
  const { mutateAsync, isLoading: updateLoading } = useUpdateBatchAndExpiry();
  const [values, setValues] = useState<ResponseOrderBatch | null>(null);
  const [count, setCount] = useState(0);
  const handleEdit = (vals: ResponseOrderBatch | null) => {
    setValues(vals);
  };
  const handleDone = () => {
    if (values) {
      const obj = {
        ...values
      };
      mutateAsync(obj).then(() => {
        setValues(null);
        setCount(count + 1);
      });
    }
  };
  useEffect(() => {
    if (open && data && order) {
      const obj = {
        order_id: order?.id,
        ordered_product_id: data?.id,
        product_id: data?.product_id
      };
      batchAndExpiry(obj);
    }
  }, [open, data, count, batchAndExpiry, order]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h6" fontWeight={"bold"}>
          Edit Batch Expiry ({data?.product?.name})
        </Typography>{" "}
      </DialogTitle>
      <IconButton
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
          columns={OrderBatchExpiryColumns({
            handleDone,
            handleEdit,
            values,
            loading: updateLoading
          })}
          data={batchAndExpiryList || []}
          loading={batchExpiryLoading}
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

export default BatchExpiryModal;
