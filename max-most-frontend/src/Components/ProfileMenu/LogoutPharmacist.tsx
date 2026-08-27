import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Stack, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import React from "react";
import { FridgeLogs } from "@interfaces/Fridges";
import LoadingButton from "../LoadingButton";
import { Box } from "@mui/system";
import Input from "../Input";
import { toast } from "react-toastify";
import { User } from "@interfaces/usersType";
import { usePharmacistLogout } from "../../Hooks/useUsers";
import { useUser } from "../..//Contexts/userContext";

interface Props {
  open: boolean;
  onClose(): void;
  row?: FridgeLogs | null;
  user: User | null;
}

const LogoutPharmacist: React.FC<Props> = ({ open, onClose, user }) => {
  const [noteValue, setNoteValue] = React.useState<string>("");

  const { mutate, isLoading } = usePharmacistLogout();
  const { logout } = useUser();

  const handleSubmit = async () => {
    if (!noteValue) {
      toast.error("Please enter a note");
      return;
    }

    if (noteValue.length < 4) {
      toast.error("Note must be at least 4 characters long");
      return;
    }

    const data = {
      note: noteValue,
      user_id: user?.id || ""
    };
    mutate(data, {
      onSuccess: () => {
        toast.success("Logout successful");
        onClose();
        logout();
      },
      onError: (error: Error) => {
        toast.error(`Logout failed: ${error.message}`);
      }
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
      <DialogTitle variant="h6" fontWeight="bold" textAlign={"center"}>
        Logout
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" alignItems="start" justifyContent="start" gap={1}>
          <Box sx={{ width: "100%" }}>
            <Input
              label="Note"
              value={noteValue}
              name="note"
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNoteValue(e.target.value)
              }
              multiline
              rows={3}
              required
              placeholder="Note ..."
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              width: "100%"
            }}
          >
            <Typography fontSize={16} color="black" fontWeight="bold">
              This will Logout
            </Typography>
            <Typography
              color="primary.main"
              fontSize={16}
              fontWeight="bold"
              whiteSpace="nowrap"
              variant="body2"
            >
              ({user?.email || "User Email"})
            </Typography>
          </Box>
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
          onClick={handleSubmit}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutPharmacist;
