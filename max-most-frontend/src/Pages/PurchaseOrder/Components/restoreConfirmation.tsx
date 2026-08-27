import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Stack, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import React from "react";
import { useRestorePurchaseOrder } from "../../../Hooks/usePurchaseOrder";
import { PurchaseOrderData } from "../../../Interfaces/PurchaseOrder";
import LoadingButton from "../../../Components/LoadingButton";

interface Props {
  open: boolean;
  onClose(): void;
  row?: PurchaseOrderData | null;
}

const RestoreConfirmation: React.FC<Props> = props => {
  const { onClose, open, row } = props;
  const { mutateAsync, isLoading: restoreLoading } = useRestorePurchaseOrder();

  const handleDelete = async () => {
    if (row?.id) {
      await mutateAsync({ orderId: row.id });
      onClose();
    } else {
      console.error("Order ID is undefined");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !restoreLoading && onClose()}
      fullWidth
      maxWidth="xs"
      aria-describedby="alert-dialog-slide-description"
    >
      <IconButton
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500]
        }}
        disabled={restoreLoading}
        onClick={onClose}
      >
        <Close />
      </IconButton>
      <DialogTitle variant="h6" fontWeight={"bold"}>
        Restore Purchase order
      </DialogTitle>
      <DialogContent>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
          <Typography fontSize={16} color={"black"} fontWeight={"bold"}>
            This will restore the Purchase order{" "}
          </Typography>
          <Typography
            color={"primary.main"}
            fontSize={16}
            fontWeight={"bold"}
            whiteSpace={"nowrap"}
            variant="body2"
          >
            (#{row?.number})
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button
          color="secondary"
          variant="contained"
          onClick={onClose}
          disabled={restoreLoading}
        >
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          disabled={restoreLoading}
          onClick={handleDelete}
        >
          Proceed
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default RestoreConfirmation;
