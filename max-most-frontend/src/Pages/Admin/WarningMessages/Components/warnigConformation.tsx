import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import LoadingButton from "../../../../Components/LoadingButton";
import { ProductData } from "../../../../Interfaces/Products";
import { useBrandContext } from "../../../../Contexts/brandContext";
import { useSyncMessages } from "../../../../Hooks/useWarning";
import { InputValueAndLabel } from "@interfaces/global";

interface Props {
  open: boolean;
  onClose(): void;
  row?: ProductData | null;
  selectedWarningOption: InputValueAndLabel;
}

const RestoreConfirmation: React.FC<Props> = ({
  open,
  onClose,
  selectedWarningOption
}) => {
  const { brand } = useBrandContext();

  const { mutateAsync: syncWarningHandler, isLoading } = useSyncMessages();

  const handleSubmit = async () => {
    try {
      await syncWarningHandler({
        from_brand: `${selectedWarningOption.value}`,
        to_brand: brand!.id,
        message: ""
      });
      // Close the modal only if the API call succeeds
      onClose();
    } catch (error) {
      // Handle error if needed
      console.error("Failed to submit:", error);
      // The modal will remain open because onClose is not called
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()} // Disable close button while loading
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
        onClick={onClose}
        disabled={isLoading} // Disable while loading
      >
        <Close />
      </IconButton>
      <DialogTitle variant="h6" fontWeight={"bold"}>
        <Typography>
          Are you sure want to sync <strong>{brand?.name}</strong> product warning
          messages with <strong>{selectedWarningOption.label}</strong>?
        </Typography>
      </DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button
          color="secondary"
          variant="contained"
          onClick={onClose}
          disabled={isLoading} // Disable while loading
        >
          Cancel
        </Button>
        <LoadingButton variant="contained" onClick={handleSubmit} loading={isLoading}>
          Proceed
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default RestoreConfirmation;
