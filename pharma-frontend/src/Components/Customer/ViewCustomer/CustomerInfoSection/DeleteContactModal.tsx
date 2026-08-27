import React, { useCallback, useEffect, useState } from "react";
import ModalPopup from "Components/ModalPopup";
import { Typography } from "@material-ui/core";
import { createBrowserHistory } from "history";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Cancel from "@material-ui/icons/Cancel";

const paths = ["add-contact", "edit-contact"];

export const DeleteContactPrompt: React.FC<{
  when: boolean;
  title?: string;
  promptMsg?: string;
  onCancel?: () => void;
}> = ({
  when,
  title = "Warning",
  promptMsg = " Are you sure to want to want to delete contact ?",
  onCancel
}) => {
  const history = createBrowserHistory();
  const classes = useStyles();
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (when) {
      history.block(({ location }) => {
        setCurrentPath(location.pathname);
        paths.forEach(path => {
          if (!location.pathname.includes(path)) {
            setShowPrompt(true);
          }
        });
      });
    } else {
      history.block(() => {
        //
      });
    }

    return () => {
      history.block(() => {
        //
      });
    };
  }, [history, when]);

  const handleOK = useCallback(() => {
    setShowPrompt(false);
    history.block(() => {
      //
    });
    history.push(currentPath);
  }, [currentPath, history]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    setShowPrompt(false);
  }, [onCancel]);

  return (
    <ModalPopup
      openModal={showPrompt}
      maxWidth="sm"
      saveBtnText="Delete"
      handleSaveChanges={handleOK}
      handleCloseModal={handleCancel}
    >
      <div className={classes.root}>
        <div className={classes.iconDiv}>
          <Cancel color="secondary" style={{ color: "#F7CA2A", fontSize: "50px" }} />
        </div>
        <div>
          <Typography variant="h6" className={classes.label}>
            {title}
          </Typography>
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
      color: theme.palette.gray[1200],
      fontweight: "bold"
    },
    iconDiv: {
      margin: "auto",
      width: "fit-content"
    },
    description: {
      margin: theme.spacing(2)
    }
  })
);
