import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core/";
import MuiIcon from "../../icons/MuiIcons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    firstStepSection: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center"
    },
    veticalHr: {
      borderRight: `2px solid ${theme.palette.gray[700]}`,
      minWidth: "10px",
      marginRight: "5px",
      minHeight: "20px"
    },
    horizontalHr: {
      width: "30px",
      marginLeft: "8px"
    },
    linkStyles: {
      "&:link": {
        textDecoration: "inherit",
        color: "inherit"
      },

      "&:visited": {
        textDecoration: "inherit",
        color: "inherit"
      }
    }
  })
);

export default function HorizontalLinearStepper({
  selectedCustomer,
  addedShipments,
  addedPayments
}: {
  selectedCustomer: boolean;
  addedShipments: boolean;
  addedPayments: boolean;
}): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.firstStepSection}>
        <div className={classes.flexAlign}>
          <MuiIcon
            icon={selectedCustomer ? "checkOutlined" : "radio"}
            fontSize="small"
            color="primary"
          />{" "}
          &nbsp;&nbsp; <Typography>Customer</Typography>
        </div>
        <div className={classes.horizontalHr}>
          <hr />
        </div>
        &nbsp;
        <div className={classes.flexAlign}>
          <MuiIcon
            icon={selectedCustomer ? "checkOutlined" : "radio"}
            fontSize="small"
            color={selectedCustomer ? "primary" : "disabled"}
          />{" "}
          &nbsp;&nbsp; <Typography>Create Order</Typography>
        </div>
      </div>
      <div className={classes.firstStepSection}>
        <div className={classes.flexAlign}>
          <MuiIcon
            icon={addedShipments ? "checkOutlined" : "radio"}
            fontSize="small"
            color={selectedCustomer ? "primary" : "disabled"}
          />{" "}
          &nbsp;&nbsp;{" "}
          <Typography>
            <a href={"#shipments"} className={classes.linkStyles}>
              Shipping
            </a>
          </Typography>
        </div>
        <div className={classes.veticalHr}></div>
        <div className={classes.flexAlign}>
          <MuiIcon
            icon={addedPayments ? "checkOutlined" : "radio"}
            fontSize="small"
            color={selectedCustomer ? "primary" : "disabled"}
          />{" "}
          &nbsp;&nbsp;{" "}
          <Typography>
            <a href={"#payments"} className={classes.linkStyles}>
              Payment
            </a>
          </Typography>
        </div>
      </div>
    </div>
  );
}
