import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import MaskingInput from "../../Form/MaskingInput";
import { createFormReducer } from "../../../Reducers/formReducer";

interface Props {
  readonly classes?: string;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    label: {
      marginBottom: "0px",
      marginTop: "0px",
      fontWeight: "normal"
    }
  })
);

interface FormState {
  cardNumber: string;
  expiration: string;
  securityCode: string;
  amount: string;
}

const initialFormState: FormState = {
  cardNumber: "",
  expiration: "",
  securityCode: "",
  amount: ""
};

const formReducer = createFormReducer<FormState>(initialFormState);

const Sticky: React.FC<Props> = props => {
  const classes = useStyles();

  const [formData, dispatch] = React.useReducer(formReducer, initialFormState);
  const handleTextChange = (name: string, value: string) => {
    dispatch({
      type: "HANDLE_INPUT_TEXT",
      field: name,
      payload: value
    });
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid lg={12} item>
          <p className={classes.label}>Card Number</p>
          <MaskingInput
            type="text"
            showMask={true}
            maskType="card"
            name="cardNumber"
            placeholder="xxxx xxxx xxxx xxxx"
            value={formData.cardNumber}
            onChange={handleTextChange}
          />
        </Grid>
        <Grid lg={6} item>
          <p className={classes.label}>Expiration</p>
          <MaskingInput
            type="text"
            showMask={true}
            maskType="expDate"
            name="expiration"
            placeholder="MM / YY"
            value={formData.expiration}
            onChange={handleTextChange}
          />
        </Grid>
        <Grid lg={6} item>
          <p className={classes.label}>Security Code</p>
          <MaskingInput
            type="text"
            showMask={true}
            maskType="csc"
            name="securityCode"
            placeholder="CCV"
            value={formData.securityCode}
            onChange={handleTextChange}
          />
        </Grid>
        <Grid lg={12} item>
          <p className={classes.label}>Amount</p>
          <MaskingInput
            type="text"
            showMask={true}
            maskType="transaction"
            name="amount"
            placeholder="$0.00"
            value={formData.amount}
            limit={2300}
            onChange={handleTextChange}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Sticky;
