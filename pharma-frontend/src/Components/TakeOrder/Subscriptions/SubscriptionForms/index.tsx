import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core/";
import Grid from "@mui/material/Grid";
import MuiIcon from "Components/icons/MuiIcons";
import TextInput from "Components/Form/TextInput";
import Button from "Components/Button";
import { OrderData } from "Interfaces/Order";
import { Form } from "Interfaces/Subscriptions";
import { Actions } from "Reducers/subscriptionForm";
import Switch from "Components/Switch";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      width: "100%",
      height: "460px",
      border: `0.5px solid ${theme.palette.gray[300]}`,
      borderRadius: "6px",
      marginTop: "10px",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    active: {
      border: `2px solid ${theme.palette.primary.main}`,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1)"
    },
    avatar: { width: "56px", height: "56px", background: theme.palette.gray[100] },
    title: {
      fontSize: "20px",
      fontWeight: "bold",
      margin: "0px",
      marginTop: "5px",
      textTransform: "capitalize"
    },
    detail: {
      fontSize: "12px",
      fontWeight: "normal",
      color: theme.palette.gray[500],
      margin: "0px  "
    },
    label: {
      marginBottom: "0px",
      marginTop: "20px",
      fontSize: "12px",
      fontWeight: "bold"
    },
    fields: {
      padding: "0 15px",
      maxHeight: "295px",
      overflowY: "auto",
      marginRight: "5px !important"
    },
    switchContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginTop: "10px"
    }
  })
);

const SubscriptionForm: React.FC<{
  order: OrderData;
  form: Form;
  active: boolean;
  readonly dispatch: React.Dispatch<Actions>;
  readonly handeChangeSelectedForm: (formid: string) => void;
}> = ({ order, form, active, dispatch, handeChangeSelectedForm }) => {
  const classes = useStyles();

  return (
    <Grid
      item
      container
      className={`${classes.body} ${active ? classes.active : ""}`}
      style={{ flexDirection: "column", flexWrap: "nowrap" }}
    >
      <Grid container item>
        {form?.icon && (
          <Grid item xs={3} lg={3} style={{ padding: "15px" }}>
            <Avatar className={classes.avatar}>
              <MuiIcon color={!active ? "disabled" : "primary"} icon={form.icon} />
            </Avatar>
          </Grid>
        )}
        <Grid item xs={9} lg={9} style={{ padding: "15px" }}>
          {form.title && <h3 className={classes.title}>{form.title}</h3>}
          {form.description && <p className={classes.detail}>{form.description}</p>}
        </Grid>
        <Grid item container className={classes.fields}>
          {form.fields.map(field => (
            <>
              {field.type === "boolean" && (
                <div className={classes.switchContainer}>
                  <p className={classes.label} style={{ marginTop: "0px" }}>
                    {field.label}
                  </p>
                  <Switch
                    checked={!!field.value}
                    handleChange={(e, value) => {
                      dispatch({
                        type: "MUTATE",
                        payload: {
                          form_id: form.id,
                          field: field.name,
                          value: value
                        }
                      });
                    }}
                  />
                </div>
              )}
              {(typeof field.value === "string" || typeof field.value === "number") && (
                <Grid item xs={12} lg={12} key={field.name}>
                  <p className={classes.label}>{field.label}</p>
                  <TextInput
                    variant="outlined"
                    margin="dense"
                    placeholder={`Enter ${field.label}`}
                    name={field.name}
                    type={field.type}
                    disabled={!active}
                    value={field.value}
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
              )}
              {field.name === "email" && (
                <Grid item xs={12} lg={12}>
                  <Button
                    style={{ width: "100%" }}
                    icon={<MuiIcon fontSize="medium" icon="copy" />}
                    variant="outlined"
                    type="secondary"
                    disabled={!active || !order.billing_address.email}
                    text="Use Billing Contact Email"
                    onClick={() => {
                      form.fields.forEach(field => {
                        if (field.name === "email")
                          dispatch({
                            type: "MUTATE",
                            payload: {
                              form_id: form.id,
                              field: field.name,
                              value: order.billing_address.email || ""
                            }
                          });
                      });
                    }}
                  />
                </Grid>
              )}
            </>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} lg={12} style={{ position: "relative" }}>
        <Button
          icon={<MuiIcon icon="checkOutlined" fontSize="small" />}
          type={active ? "primary" : "primaryOutlined"}
          variant="outlined"
          text={active ? "Selected" : "Select"}
          style={{
            margin: "0 15px",
            display: "flex",
            width: "calc(100% - 30px)",
            position: "absolute",
            bottom: "15px"
          }}
          onClick={() => handeChangeSelectedForm(form.id)}
        />
      </Grid>
    </Grid>
  );
};

export default SubscriptionForm;
