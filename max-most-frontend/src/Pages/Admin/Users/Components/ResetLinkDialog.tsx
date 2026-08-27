import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import React from "react";
import Input from "../../../../Components/Input";
import { User } from "../../../../Interfaces/usersType";
import { useForgetPassword } from "../../../../Hooks/useUsers";
import LoadingButton from "../../../../Components/LoadingButton";
interface Props {
  open: boolean;
  onClose(): void;
  row: User;
}
const ResetLinkDialog: React.FC<Props> = props => {
  const { onClose, open, row } = props;
  const { mutateAsync, isLoading } = useForgetPassword();
  const handleSendLink = async () => {
    mutateAsync({
      email: row?.email,
      origin: window.location.origin + "/reset-password"
    }).then(() => {
      onClose();
    });
  };
  return (
    <Dialog open={open} fullWidth maxWidth="sm" onClose={() => !isLoading && onClose()}>
      <IconButton
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500]
        }}
        onClick={onClose}
        disabled={isLoading}
      >
        <Close />
      </IconButton>
      <DialogTitle>
        <Typography variant="h6" fontWeight={"bold"}>
          Reset Password!
        </Typography>{" "}
      </DialogTitle>
      <DialogContent dividers>
        <Stack gap={0.4} justifyContent={"center"} alignItems={"center"}>
          <Icon />
          <Typography textAlign={"center"} fontSize={16} fontWeight={600}>
            A reset passwords reset email will be sent to user on their email assocaited
            with their account.
          </Typography>
          <Typography textAlign={"center"} fontSize={16} fontWeight={600}>
            The reset link will exprice automatically after{" "}
            <Typography
              color={"primary.main"}
              display={"inline-block"}
              fontSize={16}
              fontWeight={600}
            >
              48 hours
            </Typography>
            .
          </Typography>
          <Input
            label="Full Name"
            value={row?.first_name + " " + row?.last_name}
            readOnly
          />
          <Input label="Email Address" value={row?.email} readOnly />
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
          color="primary"
          loading={isLoading}
          onClick={handleSendLink}
        >
          Send Reset Link
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

function Icon() {
  const {
    palette: {
      primary: { main },
      common: { black, white }
    }
  } = useTheme();
  return (
    <svg
      width={130}
      height={130}
      viewBox="0 0 86 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx={43} cy={43} r={43} fill="#F9FAFB" />
      <path
        d="M60.875 62.922h-35.75c-4.48 0-8.125-3.645-8.125-8.125s3.645-8.125 8.125-8.125h35.75c4.48 0 8.125 3.645 8.125 8.125s-3.645 8.125-8.125 8.125z"
        fill={main}
      />
      <path
        d="M37.922 57.336a2.539 2.539 0 100-5.078 2.539 2.539 0 000 5.078zM27.766 57.336a2.539 2.539 0 100-5.078 2.539 2.539 0 000 5.078zM49.094 29.406H36.906a1.523 1.523 0 01-1.523-1.523v-4.266C35.383 19.417 38.8 16 43 16s7.617 3.417 7.617 7.617v4.266c0 .841-.682 1.523-1.523 1.523zM38.43 26.36h9.14v-2.742c0-2.52-2.05-4.57-4.57-4.57-2.52 0-4.57 2.05-4.57 4.57v2.742z"
        fill={black}
      />
      <path
        d="M43 16v3.047c2.52 0 4.57 2.05 4.57 4.57v2.742H43v3.047h6.094c.841 0 1.523-.682 1.523-1.523v-4.266C50.617 19.417 47.2 16 43 16z"
        fill={black}
      />
      <path
        d="M52.648 41.492H33.352a1.523 1.523 0 01-1.524-1.523V27.883c0-.841.682-1.524 1.524-1.524h19.296c.842 0 1.524.682 1.524 1.524v12.086c0 .841-.682 1.523-1.524 1.523z"
        fill={main}
      />
      <path
        d="M52.648 26.36H43v15.132h9.648c.842 0 1.524-.682 1.524-1.523V27.883c0-.841-.682-1.524-1.524-1.524z"
        fill={main}
      />
      <path
        d="M45.54 32.96c0-.84-.683-1.523-1.524-1.523h-2.032a1.523 1.523 0 00-.507 2.959v.596a1.523 1.523 0 003.046 0v-.596a1.523 1.523 0 001.016-1.435z"
        fill={white}
      />
      <path
        d="M60.875 46.672H43v16.25h17.875c4.48 0 8.125-3.645 8.125-8.125s-3.645-8.125-8.125-8.125z"
        fill={main}
      />
      <path
        d="M48.078 57.336a2.539 2.539 0 100-5.078 2.539 2.539 0 000 5.078zM58.234 57.336a2.539 2.539 0 100-5.078 2.539 2.539 0 000 5.078zM44.016 31.438H43v5.078c.841 0 1.523-.682 1.523-1.524v-.596a1.523 1.523 0 00-.507-2.959z"
        fill={white}
      />
      <circle cx={65} cy={57} r={13.5} fill={"#fff"} stroke={"#F9FAFB"} strokeWidth={3} />
      <path
        d="M65 45c-6.63 0-12 5.37-12 12s5.37 12 12 12 12-5.37 12-12-5.37-12-12-12zm-.18 20.43V63a5.963 5.963 0 01-4.065-1.755A6.006 6.006 0 0159 57c0-1.05.27-2.07.78-2.97l1.11 1.11A4.646 4.646 0 0060.5 57c0 1.2.465 2.325 1.32 3.18.81.795 1.905 1.23 3 1.275V59.07L68 62.25l-3.18 3.18zm5.4-5.46l-1.11-1.11c.265-.585.39-1.215.39-1.86 0-1.2-.465-2.325-1.32-3.18a4.454 4.454 0 00-3-1.32v2.43L62 51.75l3.18-3.18v2.49c1.5.045 2.97.615 4.065 1.695A6.006 6.006 0 0171 57c0 1.05-.27 2.07-.78 2.97z"
        fill={main}
      />
    </svg>
  );
}

export default ResetLinkDialog;
