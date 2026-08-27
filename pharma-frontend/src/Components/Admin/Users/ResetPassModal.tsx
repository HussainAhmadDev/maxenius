import * as React from "react";
import { Typography } from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { ModalInterface } from "../../../Interfaces/ModalInterface";
import ModalPopup from "../../ModalPopup";
import { ResetPassIcon } from "../../icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
      textAlign: "center"
    },
    iconDiv: {
      margin: "auto",
      width: "fit-content"
    },
    hour: {
      color: theme.palette.text.secondary,
      fontWeight: "bold"
    },
    userSection: {
      textAlign: "left"
    },
    label: {
      color: theme.palette.primary.main
    },
    flex: {
      display: "flex",
      alignItems: "center",
      background: theme.palette.gray[100],
      padding: theme.spacing(1),
      borderRadius: "6px"
    },
    image: {
      borderRadius: "6px"
    },
    emailSection: {
      borderRadius: "6px",
      padding: theme.spacing(1),
      border: `1px solid ${theme.palette.gray[700]}`
    }
  })
);

const ResetPassModal: React.FC<ModalInterface> = props => {
  const classes = useStyles();

  return (
    <div>
      <ModalPopup
        maxWidth="sm"
        modalTitle={props.title}
        saveBtnText={props.saveText}
        checkBox={props.checkBox}
        selectedEditPassword={props.selectedEditPassword}
        {...props}
      >
        <div className={classes.root}>
          <div className={classes.iconDiv}>
            <ResetPassIcon />
          </div>
          <Typography variant="h6">Reset Password!</Typography>
          <Typography variant="body2">
            A reset passwords reset email will be sent to user on their email assocaited
            with their account.{" "}
          </Typography>
          <Typography variant="body2">
            The reset link will exprice automatically after{" "}
            <span className={classes.hour}>48 hours.</span>
          </Typography>
          <div className={classes.userSection}>
            <Typography variant="subtitle1">User Name</Typography>
            <br />
            <div className={classes.flex}>
              {/* <div>
                <img
                  src="https://www.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg"
                  alt="op"
                  width="50"
                  className={classes.image}
                />
              </div> */}
              &nbsp;&nbsp;
              <div>
                <Typography variant="body2" className={classes.label}>
                  {props?.selectedEditPassword?.first_name}
                </Typography>
              </div>
            </div>
            <br />
            <Typography variant="subtitle1">Email</Typography>
            <br />
            <div className={classes.emailSection}>
              {props?.selectedEditPassword?.email}
            </div>
          </div>
        </div>
      </ModalPopup>
    </div>
  );
};

export default ResetPassModal;
