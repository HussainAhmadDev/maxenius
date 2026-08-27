import * as React from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Button from "../../Button";
import MuiIcon from "../../icons/MuiIcons";
import TextInput from "../../Form/TextInput";
import { createFormReducer } from "../../../Reducers/formReducer";

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
    }
  })
);

interface FormState {
  contactFirstName: string;
  contactLastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
}

const initialFormState: FormState = {
  contactFirstName: "",
  contactLastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zipcode: ""
};

const formReducer = createFormReducer<FormState>(initialFormState);

const ContactFilters: React.FC = props => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = React.useState<boolean>(true);

  const [formData, dispatch] = React.useReducer(formReducer, initialFormState);

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
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item lg={3}>
          <h4 className={classes.heading}>Contacts</h4>
        </Grid>
        <Grid item lg={2}>
          <div className={classes.buttonDiv}>
            <Button
              text="Create Contact"
              type="primaryOutlined"
              icon={<MuiIcon icon="add" />}
              onClick={() => navigate("/customers/contact")}
            />
          </div>
        </Grid>
      </Grid>

      <div className={classes.searchCustomerBody}>
        <Grid container direction="row" justifyContent="space-between">
          <Grid item lg={3} xs={6}>
            <h5 className={classes.searchHeading}>Search Customer</h5>
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
                name="contactFirstName"
                value={formData.contactFirstName}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Contact First Name"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="contactLastName"
                value={formData.contactLastName}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Contact Last Name"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="email"
                value={formData.email}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="email"
                label="Email"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="phone"
                value={formData.phone}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="number"
                label="Phone"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="address1"
                value={formData.address1}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Address 1"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="address2"
                value={formData.address2}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Address 2"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="city"
                value={formData.city}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="City"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="state"
                value={formData.state}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="State"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="zipcode"
                value={formData.zipcode}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Zipcode"
              />
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default ContactFilters;
