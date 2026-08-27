import * as React from "react";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import MuiIcon from "../icons/MuiIcons";
import { OrderData } from "Interfaces/Order";
import { useBrand } from "Context/BrandContext";

interface Props {
  readonly data?: string;
  order: OrderData;
  /** Wether to show subscription message. Default to false */
  readonly hasSubscriptionMessage?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paymentInfo: {
      width: "100%",
      border: "1px solid #F6CA2A",
      borderRadius: "6px",
      padding: "20px",
      background: "#FFFCEA",
      paddingBottom: "0px",
      paddingTop: "4px",
      display: "flex",
      marginBottom: "10px"
    },
    payments: {
      width: "100%",
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      padding: "20px",
      background: theme.palette.gray[100],
      paddingBottom: "0px",
      display: "flex"
    },
    infoIcon: {
      margin: "10px",
      color: "#F7CA2A"
    },
    grid: {
      textAlign: "right"
    }
  })
);
const PaymentDetails: React.FC<Props> = ({ order, hasSubscriptionMessage = false }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { currencySymbol } = useBrand();
  const subscriptionMessage = hasSubscriptionMessage && (
    <div className={classes.paymentInfo}>
      <MuiIcon icon="info" className={classes.infoIcon} />
      <p> Payment will be split as you have a subscription product in Order.</p>
    </div>
  );

  return (
    <Grid container spacing={2}>
      {subscriptionMessage}
      <Grid container justifyContent="space-between" className={classes.payments}>
        <Grid item lg={8} md={8}>
          <p>
            <b>Net Total:</b>
          </p>
          <p>Recurring Payment:</p>
          <p>Non-Recurring Payment:</p>
          <p>
            <b>Amount Due:</b>
          </p>
        </Grid>
        <Grid item lg={4} md={4}>
          <p>
            <b>{` ${currencySymbol}${Number(order?.total_amount ?? 0).toFixed(2)}`}</b>
          </p>
          <p> {`${currencySymbol}${Number(order?.recurring_payment ?? 0).toFixed(2)}`}</p>
          <p>
            {" "}
            {`${currencySymbol}${Number(order?.non_recurring_payment ?? 0).toFixed(2)}`}
          </p>
          <p>
            <b> {`${currencySymbol}${Number(order?.due_amount ?? 0).toFixed(2)}`}</b>
          </p>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PaymentDetails;
