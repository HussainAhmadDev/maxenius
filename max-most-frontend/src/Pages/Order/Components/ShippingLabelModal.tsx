import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import React from "react";
import { OrderData } from "../../../Interfaces/Orders";
// import { useServiceAndProductSelect } from "../../../Hooks/useOrders";
interface Props {
  open: boolean;
  onClose(): void;
  data?: OrderData | null;
}
const ShippingLabelModal: React.FC<Props> = ({ onClose, open }) => {
  // const obj = {
  //   order_id: data?.website_order_id,
  //   authorization: data?.website?.authorization_key,
  //   website: data?.website?.site_url
  // };
  // const { data: newData, isLoading } = useServiceAndProductSelect(
  //   obj?.order_id,
  //   obj?.authorization,
  //   obj?.website
  // );
  // const [shippingLabelDetail, setShippingLabelDetail] = React.useState<{
  //   referenceOne: string | number;
  //   referenceTwo: string;
  //   referenceThree: string;
  //   deliveryInstruction: string;
  //   parcelDescription: string;
  // }>({
  //   referenceOne: "",
  //   referenceTwo: "",
  //   referenceThree: "",
  //   deliveryInstruction: "",
  //   parcelDescription: ""
  // });
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
      <DialogTitle>
        <Typography variant="h6" fontWeight={"bold"}>
          Generate Shipping Label
        </Typography>
      </DialogTitle>
      <DialogContent>hhi</DialogContent>
    </Dialog>
  );
};

export default ShippingLabelModal;
