import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Stack, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import React from "react";
import LoadingButton from "../../../../Components/LoadingButton";
import { QuoteData } from "../../../../Interfaces/quotatonsTypes";
import { useTrashQuotation } from "../../../../Hooks/useQuotation";

interface Props {
  open: boolean;
  onClose(): void;
  row?: QuoteData | null;
}
const DeleteConfirmation: React.FC<Props> = props => {
  const { onClose, open, row } = props;
  const { mutateAsync, isLoading } = useTrashQuotation();
  const handleDelete = async () => {
    mutateAsync({ id: row?.id || "" }).then(() => {
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
      <DialogTitle variant="h6" fontWeight={"bold"}>
        Delete Quotation
      </DialogTitle>
      <DialogContent>
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
          justifyContent={"start"}
          flexWrap={"wrap"}
        >
          <Typography
            color={"common.black"}
            fontSize={16}
            fontWeight={"bold"}
            whiteSpace={"nowrap"}
          >
            This will trash the Quotation{" "}
          </Typography>
          <Typography
            color={"primary.main"}
            fontSize={16}
            fontWeight={"bold"}
            whiteSpace={"nowrap"}
          >
            ({row?.id})
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
          onClick={handleDelete}
          id="cy__QuoteProcessBtn"
        >
          Process
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
