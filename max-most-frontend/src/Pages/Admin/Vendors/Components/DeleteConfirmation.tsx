import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogContentText, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import React from "react";
import { Vendor } from "../../../../Interfaces/vendorsType";
import { useTrashVendor } from "../../../../Hooks/useVendors";
import LoadingButton from "../../../../Components/LoadingButton";
interface Props {
  open: boolean;
  onClose(): void;
  row: Vendor;
}
const DeleteConfirmation: React.FC<Props> = props => {
  const { onClose, open, row } = props;
  const { mutateAsync, isLoading } = useTrashVendor(row?.id);
  const handleDelete = async () => {
    mutateAsync({ vendorId: row?.id }).then(() => {
      onClose();
    });
  };
  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()}
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
        disabled={isLoading}
        onClick={onClose}
      >
        <Close />
      </IconButton>
      <DialogTitle>
        <Typography variant="h6" fontWeight={"bold"}>
          Delete Vendor
        </Typography>{" "}
      </DialogTitle>
      <DialogContent>
        <DialogContentText fontSize={16} color={"black"} fontWeight={"bold"}>
          This will trash the vendor{" "}
          <Typography
            display={"inline-block"}
            color={"primary.main"}
            fontSize={16}
            fontWeight={"bold"}
            whiteSpace={"nowrap"}
          >
            ({row?.name ?? "--------"})
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button
          color="secondary"
          variant="contained"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          color="error"
          loading={isLoading}
          onClick={handleDelete}
        >
          Process
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
