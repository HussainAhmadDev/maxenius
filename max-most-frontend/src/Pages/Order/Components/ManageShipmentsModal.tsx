import React, { useState } from "react";
import {
  OrderData,
  OrderProduct,
  OrderProductShipping
} from "../../../Interfaces/Orders";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from "@mui/material";
import LoadingButton from "../../../Components/LoadingButton";
import { Close } from "@mui/icons-material";
import DataTable from "../../../Components/DataTable";
import { OrderShipmentHistoryColumns } from "../../../Constants/Orders";
import {
  useAddOrderShipment,
  useBarcodeScaning,
  useEditOrderProductShipping
} from "../../../Hooks/useOrders";
import Input from "../../../Components/Input";
import SeeDocumentation from "../../../Components/SeeDocumentation";
interface ManageShipmentsModalProps {
  data?: OrderData;
  open: boolean;
  onClose(): void;
}
const ManageShipmentsModal: React.FC<ManageShipmentsModalProps> = ({
  onClose,
  data,
  open
}) => {
  const [values, setValues] = useState<OrderProduct | null>(null);
  const [barcode, setBarcode] = useState("");
  const { mutateAsync: addShipment, isLoading } = useAddOrderShipment(data?.id || "");
  const { mutateAsync: editShipment, isLoading: isLoadingEditShipping } =
    useEditOrderProductShipping(data?.id || "");
  const { mutateAsync, isLoading: barcodeLoading } = useBarcodeScaning(data?.id || "");
  const handleEdit = (vals: OrderProduct | null) => {
    setValues(vals);
  };
  const handleDone = () => {
    if (!values) {
      return;
    }
    const alreadyInShipments = data?.product_shippings.find(
      shipping => shipping.ordered_product_id === values?.id
    );
    if (alreadyInShipments) {
      editShipment({
        id: alreadyInShipments.id,
        ship_date: new Date().toISOString(),
        quantity:
          Number(values?.shipped_quantity) -
          (Number(alreadyInShipments?.shipped_quantity) || 0),
        ordered_product_id: values.id
      }).then(() => {
        setValues(null);
      });
    } else {
      addShipment({
        ordered_product_id: values.id,
        quantity: Number(values?.shipped_quantity),
        ship_date: new Date().toISOString()
      } as Omit<OrderProductShipping, "id" | "created">).then(() => {
        setValues(null);
      });
    }
  };
  const doNotAllow = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      mutateAsync({
        barcode
      }).then(() => setBarcode(""));
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box display={"flex"} alignItems={"center"} justifyContent={"left"} gap={2}>
        <DialogTitle variant="h6" fontWeight={"bold"}>
          Manage Shipments
        </DialogTitle>
        <SeeDocumentation fileName={"useAddOrderShipment"} title={"See Add Shipment"} />
        <SeeDocumentation
          fileName={"useEditOrderProductShipping"}
          title={"See Edit Shipment"}
        />
        <SeeDocumentation fileName={"useBarcodeScaning"} title={"See Barcode Scanning"} />
      </Box>
      <IconButton
        id="cy__closebtn"
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
        <Box maxWidth={300}>
          <Input
            label="Barcode :"
            value={barcode}
            handleChange={({ value }) => setBarcode(String(value))}
            name="barcode"
            onKeyDown={handleKeyPress}
            onCut={doNotAllow}
            onCopy={doNotAllow}
            onPaste={doNotAllow}
            autoComplete="off"
            disable={barcodeLoading}
            id="cy__barcode"
          />
        </Box>
        <DataTable
          columns={OrderShipmentHistoryColumns({
            handleDone,
            handleEdit,
            loading: isLoadingEditShipping || isLoading,
            values
          })}
          data={data?.products || []}
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

export default ManageShipmentsModal;
