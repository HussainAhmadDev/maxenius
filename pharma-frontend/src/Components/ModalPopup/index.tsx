import * as React from "react";
import { createStyles, Theme, withStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";

import MuiDialogActions from "@mui/material/DialogActions";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Button from "Components/Button";
import CheckBox from "Components/CheckBox";
import MuiIcon from "../icons/MuiIcons";
import { UserData } from "Interfaces/User";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(1.5)
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    },
    checkBoxDiv: {
      margin: "10px"
    },
    titleSection: {
      display: "flex",
      alignItems: "center"
    },
    title: {
      width: "98%"
    },
    modalButtons: {
      display: "flex",
      justifyContent: "flex-end"
    }
  })
);
export interface DialogTitleProps {
  readonly id: string;
  readonly children: React.ReactNode;
  readonly onClose: () => void;
}

export interface Props {
  readonly submit?: string;
  readonly handleReset?: (user: UserData | undefined) => void;
  readonly handleSaveChanges?: () => void;

  readonly handleCloseModal?: () => void;
  readonly openModal: boolean;
  readonly children: React.ReactNode;
  readonly footerButton?: React.ReactNode;
  readonly maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl" | undefined;
  readonly modalTitle?: string;
  readonly saveBtnText?: string;
  readonly saveBtnLoading?: boolean;
  readonly cancelBtnText?: string;
  readonly removeFooterCancelBtn?: boolean;
  readonly noHeader?: boolean;
  readonly noFooter?: boolean;
  readonly disableSaveBtn?: boolean;
  selectedEditPassword?: UserData | undefined;
  readonly checkBox?: {
    readonly text?: string;
    readonly value: boolean;
    readonly handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

const DialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  const classes = useStyles();
  return (
    <MuiDialogTitle className={classes.root} {...other}>
      <div className={classes.titleSection}>
        <div className={classes.title}>
          <Typography variant="h6">{children}</Typography>
        </div>
        <div>
          {onClose ? (
            <Button
              onlyIcon={true}
              type="secondary"
              onClick={onClose}
              icon={<MuiIcon icon="cancel" />}
            ></Button>
          ) : null}
        </div>
      </div>
    </MuiDialogTitle>
  );
};

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    justifyContent: "normal"
  }
}))(MuiDialogActions);

const ModalPopup: React.FC<Props> = props => {
  const {
    handleCloseModal = () => null,
    openModal,
    children,
    maxWidth,
    modalTitle,
    saveBtnText,
    checkBox,
    noHeader,
    noFooter,
    footerButton,
    saveBtnLoading,
    disableSaveBtn = false,
    cancelBtnText = "Cancel",
    submit,
    removeFooterCancelBtn
  } = props;

  const handleSave = () => {
    props?.handleReset && props?.handleReset(props.selectedEditPassword);
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={maxWidth}
        onClose={() => handleCloseModal?.()}
        aria-labelledby="customized-dialog-title"
        open={openModal}
        keepMounted={false}
      >
        {!noHeader && (
          <DialogTitle id="customized-dialog-title" onClose={() => handleCloseModal?.()}>
            {modalTitle}
          </DialogTitle>
        )}

        <DialogContent dividers>{children}</DialogContent>

        {!noFooter && (
          <DialogActions>
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item xs={12} lg={7} md={7} sm={5}>
                {checkBox && (
                  <FormControlLabel
                    style={{ marginLeft: "10px" }}
                    control={
                      <CheckBox
                        checked={checkBox.value}
                        handleChange={checkBox?.handleChange}
                      />
                    }
                    label={checkBox?.text}
                  />
                )}
                {footerButton && footerButton}
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                xs={12}
                lg={12}
                md={12}
                sm={12}
                item
              >
                {!removeFooterCancelBtn && (
                  <Button
                    text={cancelBtnText}
                    onClick={() => handleCloseModal?.()}
                    type="secondary"
                    aria-label="cancel button"
                  />
                )}
                &nbsp;
                {saveBtnText && (
                  <Button
                    loading={saveBtnLoading}
                    text={saveBtnText}
                    onClick={() =>
                      props?.selectedEditPassword?.id
                        ? handleSave()
                        : props?.handleSaveChanges?.()
                    }
                    type="primary"
                    disabled={disableSaveBtn}
                    submit={submit ? "submit" : undefined}
                    form={submit}
                  />
                )}
              </Grid>
            </Grid>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
};

export default ModalPopup;
