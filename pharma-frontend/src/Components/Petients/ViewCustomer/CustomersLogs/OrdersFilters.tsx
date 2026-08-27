import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Button from "../../../Button";
import TextInput from "../../../Form/TextInput";
import { createFormReducer } from "../../../../Reducers/formReducer";
import Select from "../../../Form/Select";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      justifyContent: "space-between",
      display: "flex"
    },
    heading: {
      fontSize: "21px"
    },
    searchCustomerBody: {
      widht: "100%",
      background: theme.palette.gray[100],
      borderRadius: "6px",
      marginTop: "10px",
      padding: "25px"
    },
    searchHeading: {
      fontSize: "14px"
    },
    formBody: {
      marginTop: "20px"
    },

    headerButton: {
      display: "flex",
      justifyContent: "flex-end"
    },
    buttonDiv: {
      textAlign: "right"
    },
    selectLabel: {
      color: theme.palette.text.secondary,
      fontSize: "11px"
    },
    selectConatiner: {
      width: "89%",
      marginLeft: "auto"
    }
  })
);

interface FormState {
  logsFrom: string;
  logsTo: string;
  contentType: { label: string; value: string };
  paymentStatus: { label: string; value: string };
}

const initialFormState = {
  logsFrom: "",
  logsTo: "",
  contentType: { label: "Advocay", value: "advocacy" },
  paymentStatus: { label: "Pending", value: "pending" }
};

const formReducer = createFormReducer<FormState>(initialFormState);

const ContactFilters: React.FC = props => {
  const classes = useStyles();
  const [showFilters, setShowFilters] = React.useState<boolean>(true);

  const [formData, dispatch] = React.useReducer(formReducer, initialFormState);

  const contentTypeOptions = [
    { label: "Advocay", value: "advocacy" },
    { label: "Capitol Info", value: "capitolInfo" },
    { label: "Direction Press", value: "directionPress" }
  ];
  const paymentStatuses = [
    { label: "Pending", value: "pending" },
    { label: "Partial", value: "partial" },
    { label: "Paid", value: "paid" }
  ];

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch({
      type: "HANDLE_INPUT_TEXT",
      field: e.target.name,
      payload: e.target.value
    });
  };

  return (
    <div>
      <div className={classes.searchCustomerBody}>
        <Grid container direction="row" justifyContent="space-between">
          <Grid item lg={3} xs={6}>
            <h5 className={classes.searchHeading}>Search</h5>
          </Grid>
          <Grid item lg={4} xs={6}>
            <div className={classes.headerButton}>
              <Button disabled={!showFilters} text="Search" type="secondary" />
              &nbsp;
              <Button disabled={!showFilters} text="Reset" type="secondary" />
              &nbsp;
              <Button
                onClick={() => setShowFilters(!showFilters)}
                text={showFilters ? "Hide" : "Show"}
                type="secondary"
              />
            </div>
          </Grid>
        </Grid>

        {showFilters && (
          <Grid
            container
            direction="row"
            spacing={1}
            className={classes.formBody}
            justifyContent="space-between"
          >
            <Grid item lg={4} xs={12}>
              <TextInput
                name="logsFrom"
                value={formData.logsFrom}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="date"
                label="Logs From"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="logsTo"
                value={formData.logsTo}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="date"
                label="Logs To"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <div style={{ paddingTop: "1.5%" }}>
                <Grid container alignItems="center">
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <span className={classes.selectLabel}>Content Type</span>
                  </Grid>
                  <Grid item lg={9} md={9} sm={12} xs={12}>
                    <div className={classes.selectConatiner}>
                      <Select
                        options={contentTypeOptions}
                        value={formData.contentType}
                        placeholder="Content Type"
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid lg={4} xs={12} item>
              <div style={{ paddingTop: "1.5%" }}>
                <Grid container alignItems="center">
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <span className={classes.selectLabel}>User:</span>
                  </Grid>
                  <Grid item lg={9} md={9} sm={12} xs={12}>
                    <div className={classes.selectConatiner}>
                      <Select
                        options={paymentStatuses}
                        value={formData.paymentStatus}
                        placeholder="Payment Status"
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default ContactFilters;
