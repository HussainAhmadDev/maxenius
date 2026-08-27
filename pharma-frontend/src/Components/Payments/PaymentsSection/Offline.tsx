import * as React from "react";
import Grid from "@mui/material/Grid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import TextField from "../../Form/TextInput";
import type { FormAction } from "Reducers/formReducer";
import { OfflineState } from "../types";

interface Props {
  classes?: [];
  dispatch: React.Dispatch<FormAction>;
  state: OfflineState;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    label: {
      marginBottom: "0px",
      fontWeight: "normal",
      marginTop: "0px"
    }
  })
);

const Offline: React.FC<Props> = props => {
  const classes = useStyles();
  const { state, dispatch } = props;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch({ type: "HANDLE_INPUT_TEXT", field: name, payload: value });
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid lg={12} item>
          <p className={classes.label}>Amount</p>
          <TextField
            name="amount"
            type="number"
            value={state.amount}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid lg={12} item>
          <p className={classes.label}>Receipt #</p>
          <TextField
            name="receipt"
            type="text"
            value={state.receipt}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Offline;
