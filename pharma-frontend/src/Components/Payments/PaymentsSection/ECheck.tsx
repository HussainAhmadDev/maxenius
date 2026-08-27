import * as React from "react";
import Grid from "@mui/material/Grid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import TextInput from "../../Form/TextInput";
import MaskingInput from "../../Form/MaskingInput";
import { FormAction } from "Reducers/formReducer";
import { ECheckState } from "../types";

interface Props {
  readonly classes?: [];
  amountDue: number;
  dispatch: React.Dispatch<FormAction>;
  state: ECheckState;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    label: {
      marginBottom: "0px",
      marginTop: "0px"
    },
    checkedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.primary.main}`,
      marginRight: "5px"
    },
    unCheckedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.gray[300]}`,
      marginRight: "5px",
      color: theme.palette.gray[400]
    },
    accountTypeOptionsContainer: {
      padding: "5px 0",
      display: "flex",
      alignItems: "center"
    }
  })
);

const ECheck: React.FC<Props> = props => {
  const classes = useStyles();

  const { amountDue, dispatch, state } = props;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch({ type: "HANDLE_INPUT_TEXT", field: name, payload: value });
  };

  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch({ type: "HANDLE_INPUT_TEXT", field: "type", payload: value });
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid lg={12} item>
          <p className={classes.label}>Routing Number</p>
          <TextInput
            margin="dense"
            variant="outlined"
            name="routing"
            placeholder="xxxx xxxx xxxx xxxx"
            type="number"
            value={state.routing}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid lg={12} item>
          <p className={classes.label}>Account Number</p>
          <TextInput
            margin="dense"
            variant="outlined"
            name="number"
            type="number"
            placeholder="xxxx xxxx xxxx xxxx"
            value={state.number}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid lg={12} item>
          <p className={classes.label}>Account Name</p>
          <TextInput
            margin="dense"
            variant="outlined"
            name="name"
            placeholder="John Doe"
            type="text"
            value={state.name}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid lg={12} item>
          <p className={classes.label} style={{ marginBottom: "10px" }}>
            Account Type
          </p>
          <Grid container>
            <Grid xs={12} lg={4} item>
              <div
                className={`${
                  state.type === "Checking" ? classes.checkedType : classes.unCheckedType
                } ${classes.accountTypeOptionsContainer}`}
              >
                <Radio
                  checked={state.type === "checking"}
                  onChange={handleAccountTypeChange}
                  value="checking"
                  inputProps={{ "aria-label": "A" }}
                />
                <div>Checking</div>
              </div>
            </Grid>
            <Grid xs={12} lg={4} item>
              <div
                className={`${
                  state.type === "Checking" ? classes.checkedType : classes.unCheckedType
                } ${classes.accountTypeOptionsContainer}`}
              >
                <Radio
                  checked={state.type === "savings"}
                  onChange={handleAccountTypeChange}
                  value="savings"
                  name="radio-button-demo"
                  inputProps={{ "aria-label": "A" }}
                />
                <div>Savings</div>
              </div>
            </Grid>
            <Grid xs={12} lg={4} item>
              <div
                className={`${
                  state.type === "Checking" ? classes.checkedType : classes.unCheckedType
                } ${classes.accountTypeOptionsContainer}`}
              >
                <Radio
                  checked={state.type === "bussiness_checking"}
                  onChange={handleAccountTypeChange}
                  value="bussiness_checking"
                  name="radio-button-demo"
                  inputProps={{ "aria-label": "A" }}
                />
                <div>Bussiness Checking</div>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid lg={12} item>
          <p className={classes.label}>Amount</p>
          <MaskingInput
            type="text"
            showMask={true}
            maskType="transaction"
            name="amount"
            placeholder="$0.00"
            value={amountDue}
            disabled
          />
        </Grid>
      </Grid>
    </div>
  );
};
export default ECheck;
