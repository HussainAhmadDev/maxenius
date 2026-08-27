import * as React from "react";
import ModalPopup from "Components/ModalPopup";
import { Typography } from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Cancel from "@material-ui/icons/Cancel";

export const Prompt: React.FC<{
  openModal: boolean;
  title?: string;
  promptMsg?: string;
  onCancel?: () => void;
  onProceed(): unknown;
}> = ({
  openModal,
  title = "Warning",
  promptMsg = "There are unsaved changes. Are you sure want to leave this page ?",
  onCancel,
  onProceed
}) => {
  const classes = useStyles();

  return (
    <ModalPopup
      openModal={openModal}
      maxWidth="sm"
      saveBtnText="Proceed"
      handleSaveChanges={() => {
        onProceed?.();
      }}
      handleCloseModal={() => {
        onCancel?.();
      }}
      modalTitle={title}
    >
      <div className={classes.root}>
        <div className={classes.iconDiv}>
          <Cancel color="secondary" style={{ color: "#F7CA2A", fontSize: "50px" }} />
        </div>
        <div>
          {/* <Typography variant="h6" className={classes.label}>
            {title}
          </Typography> */}
          <Typography variant="body2" className={classes.description}>
            {promptMsg}
          </Typography>
        </div>
      </div>
    </ModalPopup>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center"
    },
    label: {
      color: theme.palette.gray[900],
      fontweight: "bold"
    },
    iconDiv: {
      margin: "auto",
      width: "fit-content"
    },
    description: {
      margin: theme.spacing(2),
      color: theme.palette.gray[900]
    }
  })
);

export default Prompt;
