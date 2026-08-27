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
        {...props}
      >
        <div className={classes.root}>
          <div className={classes.iconDiv}>
            <ResetPassIcon />
          </div>
          <Typography variant="h6">{props.title} Organization</Typography>
          <br />
          <Typography variant="body2">
            {props.title === "Enable"
              ? `By disabling the brand users won’t be able to manage order, products and customers of the brand unless
                   untill Enabled again.`
              : `By disabling the brand users will be able to manage order, products and customers of the brand unless
                   untill Disabled again.`}
          </Typography>

          <br />
          <br />
          <div className={classes.userSection}>
            <div className={classes.flex}>
              <div>
                <img
                  src="https://www.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg"
                  alt="op"
                  width="50"
                  className={classes.image}
                />
              </div>
              &nbsp;&nbsp;
              <div>
                <Typography variant="body2" className={classes.label}>
                  Organization Name
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </ModalPopup>
    </div>
  );
};

export default ResetPassModal;
