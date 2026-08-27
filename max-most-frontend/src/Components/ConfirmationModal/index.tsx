import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import LoadingButton from "../LoadingButton";
import { useAddCustomer } from "../../Hooks/useOrders";
import { getBrandId } from "../../Hooks/api";

const ConfirmationModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { mutate, isLoading } = useAddCustomer();
  const brand = getBrandId();

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
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
      >
        <Close />
      </IconButton>
      <DialogTitle variant="h6" fontWeight={"bold"}>
        Create new customer
      </DialogTitle>
      <DialogContent>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"start"} gap={1}>
          <Typography fontSize={16} color={"black"} fontWeight={"normal"}>
            This will create a customer with the customer number only. You'll have to add
            the rest of the customer information after creation.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button color="secondary" variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          color="error"
          onClick={() => mutate({ brand_id: brand.brand_id })}
          loading={isLoading}
          disabled={isLoading}
        >
          Process
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
