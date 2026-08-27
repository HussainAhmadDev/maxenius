import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Stack, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import React from "react";
import { Fridge } from "@interfaces/Fridges";
import LoadingButton from "../../../../Components/LoadingButton";
import { useTrashFridges } from "../../../../Hooks/useFridgesList";

interface Props {
  open: boolean;
  onClose(): void;
  row?: Fridge | null;
}
const DeleteConfirmationFridge: React.FC<Props> = props => {
  const { onClose, open, row } = props;
  const { mutateAsync, isLoading } = useTrashFridges(row?.id);
  const handleRestore = async () => {
    mutateAsync({ fridge_id: row?.id }).then(() => {
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
      <DialogTitle variant="h6" fontWeight="bold">
        Delete Fridge
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" alignItems="center" justifyContent="start" gap={1}>
          <Typography fontSize={16} color="black" fontWeight="bold">
            This will trash the fridge
          </Typography>
          <Typography
            color="primary.main"
            fontSize={16}
            fontWeight="bold"
            whiteSpace="nowrap"
            variant="body2"
          >
            ({row?.id || "---"})
          </Typography>
        </Stack>
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
          onClick={handleRestore}
        >
          Process
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationFridge;
