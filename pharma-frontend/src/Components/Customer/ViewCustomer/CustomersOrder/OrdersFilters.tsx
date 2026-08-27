import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import Button from "../../../Button";
import TextInput from "../../../Form/TextInput";
import { createFormReducer } from "../../../../Reducers/formReducer";
import Select from "../../../Form/Select";
import CheckBox from "../../../CheckBox";

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
  ordersFrom: string;
  ordersTo: string;
  companyName: { label: string; value: string };
  paymentStatus: { label: string; value: string };
  shipmentStatus: { label: string; value: string };
  products: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
}

const initialFormState: FormState = {
  ordersFrom: "",
  ordersTo: "",
  companyName: { label: "Advocay", value: "advocacy" },
  paymentStatus: { label: "Pending", value: "pending" },
  shipmentStatus: { label: "Shipped", value: "shipped" },
  products: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zipcode: ""
};

const formReducer = createFormReducer<FormState>(initialFormState);

const ContactFilters: React.FC = props => {
  const classes = useStyles();
  const [showFilters, setShowFilters] = React.useState<boolean>(true);

  const [formData, dispatch] = React.useReducer(formReducer, initialFormState);
  const [checked, setChecked] = React.useState(true);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const companyOptions = [
    { label: "Advocay", value: "advocacy" },
    { label: "Capitol Info", value: "capitolInfo" },
    { label: "Direction Press", value: "directionPress" }
  ];
  const paymentStatuses = [
    { label: "Pending", value: "pending" },
    { label: "Partial", value: "partial" },
    { label: "Paid", value: "paid" }
  ];
  const shipmentStatuses = [
    { label: "Pending", value: "pending" },
    { label: "Partial", value: "partial" }
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
                name="ordersFrom"
                value={formData.ordersFrom}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="date"
                label="Orders From"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="ordersTo"
                value={formData.ordersTo}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="date"
                disabled
                label="Orders To"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <div style={{ paddingTop: "1.5%" }}>
                <Grid container alignItems="center">
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <span className={classes.selectLabel}>Company Name:</span>
                  </Grid>
                  <Grid item lg={9} md={9} sm={12} xs={12}>
                    <div className={classes.selectConatiner}>
                      <Select
                        options={companyOptions}
                        value={formData.companyName}
                        placeholder="Company Name"
                        disabled
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
                    <span className={classes.selectLabel}>Payment Status:</span>
                  </Grid>
                  <Grid item lg={9} md={9} sm={12} xs={12}>
                    <div className={classes.selectConatiner}>
                      <Select
                        options={paymentStatuses}
                        value={formData.paymentStatus}
                        placeholder="Payment Status"
                        disabled
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item lg={8} md={8} xs={12}>
              <Grid container alignItems="center">
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextInput
                    name="products"
                    value={formData.products}
                    onChange={handleTextChange}
                    margin="dense"
                    label="Product Number"
                    variant="outlined"
                    type="text"
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid lg={4} xs={12} item>
              <div style={{ paddingTop: "1.5%" }}>
                <Grid container alignItems="center">
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <span className={classes.selectLabel}>Shipment Status:</span>
                  </Grid>
                  <Grid item lg={9} md={9} sm={12} xs={12}>
                    <div className={classes.selectConatiner}>
                      <Select
                        options={shipmentStatuses}
                        value={formData.shipmentStatus}
                        placeholder="Payment Status"
                        disabled
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item lg={8} md={8} sm={12} xs={12}>
              <Grid container alignItems="center">
                <Grid item lg={1} md={1} sm={1} xs={1}>
                  <CheckBox checked={checked} disabled handleChange={handleChange} />
                </Grid>
                <Grid item lg={11} md={11} sm={11} xs={11}>
                  <Typography variant="body2">Show Online Product Orders Only</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default ContactFilters;
