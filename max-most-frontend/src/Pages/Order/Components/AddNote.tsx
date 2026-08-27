import React, { useState } from "react";
import { useCreateOrderNote } from "../../../Hooks/useOrders";
import { OrderData } from "../../../Interfaces/Orders";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import LoadingButton from "../../../Components/LoadingButton";
import { Close } from "@mui/icons-material";
import TextArea from "../../../Components/Textarea";
import { useUser } from "../../../Contexts/userContext";
interface AddNoteProps {
  data?: OrderData | null;
  open: boolean;
  onClose(): void;
  mode: "public" | "private";
}
const AddNote: React.FC<AddNoteProps> = ({ data, onClose, open, mode }) => {
  const { mutateAsync, isLoading } = useCreateOrderNote(data?.id);
  const { user } = useUser();
  const handleSubmit = async () => {
    if (note && mode) {
      mutateAsync({
        text: note,
        source: "user",
        type: mode,
        note_username: `${(user?.first_name || "") + " " + (user?.last_name || "")}`
      }).then(() => {
        onClose();
        setNote("");
      });
    }
  };
  const [note, setNote] = useState("");
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <Typography variant="h6" fontWeight={"bold"} textTransform={"capitalize"}>
          Add {mode} Note
        </Typography>{" "}
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
        <TextArea
          name="note"
          label="Note :"
          handleChange={({ value }) => setNote(value)}
          value={note}
          id="cy__EditNote"
        />
      </DialogContent>
      <DialogActions>
        <LoadingButton
          id="cy__Savebtn"
          variant="contained"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={!note}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddNote;
