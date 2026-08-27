import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import TextInput from "Components/Form/TextInput";
import { Form } from "Interfaces/Subscriptions";
import { Actions } from "Reducers/subscriptionForm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainConatiner: {
      width: "70%",
      margin: "auto",
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1)",
      borderRadius: "6px",
      minHeight: "300px",
      marginTop: "20px",
      [theme.breakpoints.down("sm")]: {
        width: "100%"
      }
    },
    bodySection: {
      padding: "15px"
    },
    rowSection: {
      padding: "10px",
      maxHeight: "250px"
    }
  })
);

const ReNewSubscription: React.FC<{
  form: Form;
  readonly dispatch: React.Dispatch<Actions>;
}> = ({ form, dispatch }) => {
  const classes = useStyles();

  return (
    <div className={classes.mainConatiner}>
      <div className={classes.bodySection}>
        <div className={classes.rowSection}>
          <form
            id={form.id}
            onSubmit={e => {
              e.preventDefault();
              //TODO: add api request here
            }}
          ></form>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            {form.fields.map(
              field =>
                typeof field.value === "string" && (
                  <Grid item lg={7} md={7} sm={12} xs={12} key={field.name}>
                    <Typography variant="subtitle1">{field.label}</Typography>
                    <TextInput
                      name={field.name}
                      value={field.value}
                      type={field.type}
                      variant="outlined"
                      margin="dense"
                      onChange={e => {
                        if (
                          (field.type === "number" && Number(e.target.value) > 0) ||
                          field.type !== "number"
                        )
                          dispatch({
                            type: "MUTATE",
                            payload: {
                              form_id: form.id,
                              field: field.name,
                              value: e.target.value
                            }
                          });
                      }}
                    />
                  </Grid>
                )
            )}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default ReNewSubscription;
