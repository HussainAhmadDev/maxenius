import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogContentText, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import React from "react";
import { User } from "../../../../Interfaces/usersType";
import { useTrashUser } from "../../../../Hooks/useUsers";
import LoadingButton from "../../../../Components/LoadingButton";
interface Props {
  open: boolean;
  onClose(): void;
  row: User;
}
const DeleteConfirmation: React.FC<Props> = props => {
  const { onClose, open, row } = props;
  const { mutateAsync, isLoading } = useTrashUser();
  const handleDelete = async () => {
    mutateAsync({ id: row?.id }).then(() => {
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
          Delete User
        </Typography>{" "}
      </DialogTitle>
      <DialogContent>
        <DialogContentText fontSize={16} color={"black"} fontWeight={"bold"}>
          This will trash the user{" "}
          <Typography
            display={"inline-block"}
            color={"primary.main"}
            fontSize={16}
            fontWeight={"bold"}
            whiteSpace={"nowrap"}
          >
            ({row?.first_name + " " + row?.last_name})
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
          id="cy__QuoteProcessBtn"
        >
          Process
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
