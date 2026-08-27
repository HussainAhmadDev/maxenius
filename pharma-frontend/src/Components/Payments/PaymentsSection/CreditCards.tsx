import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import MaskingInput from "../../Form/MaskingInput";
import { CreditCardState } from "../types";
import { FormAction } from "Reducers/formReducer";

interface Props {
  amountDue: number;
  cardState: CreditCardState;
  dispatch: React.Dispatch<FormAction>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    label: {
      marginBottom: "0px",
      marginTop: "0px"
    }
  })
);

const CreditCards = (props: Props) => {
  const classes = useStyles();
  const { amountDue, cardState, dispatch } = props;

  const handleInputChange = (name: string, value: string) => {
    dispatch({ type: "HANDLE_INPUT_TEXT", field: name, payload: value });
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid lg={12} item>
          <p className={classes.label}>Card Number</p>
          <MaskingInput
            type="text"
            maskType="card"
            name="card_number"
            placeholder="Card Number"
            value={cardState.card_number}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid lg={6} item>
          <p className={classes.label}>Expiration</p>
          <MaskingInput
            type="text"
            showMask={true}
            maskType="expDate"
            name="exp_date"
            placeholder="MM / YY"
            value={cardState.exp_date}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid lg={6} item>
          <p className={classes.label}>Security Code</p>
          <MaskingInput
            type="text"
            maskType="csc"
            name="csc"
            placeholder="CSC"
            value={cardState.csc}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid lg={12} item>
          <p className={classes.label}>Amount</p>
          <MaskingInput
            type="text"
            maskType="transaction"
            name="amount"
            placeholder="$0.00"
            limit={2300}
            value={amountDue}
            disabled
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default CreditCards;
