import React, { useEffect, useState } from "react";
import { useUdpateDirection } from "../../../Hooks/useOrders";
import { OrderProduct } from "../../../Interfaces/Orders";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from "@mui/material";
import Input from "../../../Components/Input";
import LoadingButton from "../../../Components/LoadingButton";
import { Close } from "@mui/icons-material";
interface UpdateDirectionModalProps {
  data?: OrderProduct | null;
  open: boolean;
  onClose(): void;
}
const UpdateDirectionModal: React.FC<UpdateDirectionModalProps> = ({
  data,
  onClose,
  open
}) => {
  const { mutateAsync, isLoading } = useUdpateDirection();
  const [direction, setDirection] = useState(data?.direction);
  const updateDirectionHanlder = () => {
    const obj = {
      direction: direction ?? undefined,
      productOrderID: data?.id ?? undefined
    };
    if (obj.productOrderID && direction) {
      mutateAsync(obj).then(() => {
        onClose();
      });
    }
  };
  useEffect(() => {
    setDirection(data?.direction);
  }, [data]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle variant="h6" fontWeight={"bold"}>
        Update Directions
      </DialogTitle>
      <IconButton
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500]
        }}
        disabled={isLoading}
        onClick={onClose}
      >
        <Close />
      </IconButton>
      <DialogContent>
        <Input
          name="direction"
          label="Direction :"
          handleChange={({ value }) => setDirection(String(value))}
          value={direction || ""}
        />
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="contained"
          onClick={updateDirectionHanlder}
          loading={isLoading}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDirectionModal;
