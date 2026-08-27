import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import ModalPopUp from "../ModalPopup";
import Cancel from "@material-ui/icons/Cancel";
import CheckCircle from "@material-ui/icons/CheckCircle";
import { ModalInterface } from "Interfaces/ModalInterface";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center"
    },
    label: {
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

const failureMsg = "Please try again..";
const successMsg = `Your payment was successfull. You can view your payment in Payment History inside an order`;

const PaymentResponseModal: React.FC<
  ModalInterface & {
    heading?: string;
    description?: string;
    type: "success" | "fail";
  }
> = ({
  type,
  heading = `Payment ${type === "success" ? "Successful" : "Failed"}`,
  description,
  children,
  ...rest
}) => {
  const classes = useStyles();
  const message = description
    ? description
    : type === "success"
    ? successMsg
    : failureMsg;

  const icon =
    type === "success" ? (
      <CheckCircle color="primary" style={{ fontSize: "50px" }} />
    ) : (
      <Cancel color="secondary" style={{ color: "#F7CA2A", fontSize: "50px" }} />
    );

  return (
    <ModalPopUp
      saveBtnText={type === "success" ? "Add Another Payment" : "Try again"}
      cancelBtnText="Back to Order"
      {...rest}
    >
      <div className={classes.root}>
        <div className={classes.iconDiv}>{icon}</div>
        <div>
          <Typography variant="h6" className={classes.label}>
            {heading}
          </Typography>
          <Typography variant="body2" className={classes.description}>
            {message}
          </Typography>
        </div>
      </div>
    </ModalPopUp>
  );
};

export default PaymentResponseModal;
