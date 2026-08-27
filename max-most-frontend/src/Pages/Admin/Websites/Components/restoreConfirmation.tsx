import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Stack, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import LoadingButton from "../../../../Components/LoadingButton";
import { useRestoreWebsite } from "../../../../Hooks/useWebsites"; // Ensure correct import
import { Website } from "../../../../Interfaces/Company";

interface Props {
  open: boolean;
  onClose(): void;
  row?: Website | null;
}

const RestoreConfirmation: React.FC<Props> = ({ onClose, open, row }) => {
  const { mutateAsync, isLoading: restoreLoading } = useRestoreWebsite();

  const handleRestore = async () => {
    if (row && row.id) {
      try {
        console.log("Attempting to restore website with ID:", row.id);
        await mutateAsync({ websiteID: row.id });
        console.log("Website restored successfully");
        onClose();
      } catch (error) {
        console.error("Error restoring website:", error);
      }
    } else {
      console.warn("No valid website ID provided for restoration");
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
      <DialogTitle variant="h6" fontWeight="bold">
        Restore Website
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" alignItems="center" justifyContent="start" gap={1}>
          <Typography fontSize={16} color="black" fontWeight="bold">
            This will restore the Website{" "}
          </Typography>
          <Typography
            color="primary.main"
            fontSize={16}
            fontWeight="bold"
            whiteSpace="nowrap"
            variant="body2"
            textTransform="capitalize"
          >
            ({row?.title})
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
          onClick={handleRestore}
        >
          Proceed
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default RestoreConfirmation;
