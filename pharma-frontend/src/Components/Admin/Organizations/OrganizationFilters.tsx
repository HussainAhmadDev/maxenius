import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "Components/Button";
import TextInput from "Components/Form/TextInput";
import CheckBox from "Components/CheckBox";
import { createFormReducer } from "Reducers/formReducer";
import DatePicker from "Components/Form/Date";
import { OrganizationPageFilters } from "Interfaces/QueryFilters";

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
      marginTop: "20px",
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
    flex: {
      display: "flex",
      alignItems: "center"
    }
  })
);
interface Props {
  readonly header?: boolean;
  handleOrganizationFilters(filters: Partial<OrganizationPageFilters>): void;
}

interface FormState {
  name: string;
  middleName: string;
  email: string;
  mobileNumber: string;
  officePhone: string;
  passwords: string;
  lastLoginFrom: string;
  lastLoginTo: string;
  type: string;
  organization: string;
  brands: string;
  stafRole: string;
  ein: string;
}

const initialFormState: FormState = {
  name: "",
  organization: "",
  middleName: "",
  email: "",
  mobileNumber: "",
  officePhone: "",
  passwords: "",
  lastLoginFrom: "",
  lastLoginTo: "",
  type: "",
  brands: "",
  stafRole: "",
  ein: ""
};

const formReducer = createFormReducer<FormState>(initialFormState);

const UsersFilters: React.FC<Props> = ({ header, handleOrganizationFilters }) => {
  const classes = useStyles();
  const [showFilters, setShowFilters] = React.useState<boolean>(true);
  const [checked, setChecked] = React.useState(true);
  const [formData, dispatch] = React.useReducer(formReducer, initialFormState);
  const [dateValue, setDateValue] = React.useState<Date | null>(null);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch({
      type: "HANDLE_INPUT_TEXT",
      field: e.target.name,
      payload: e.target.value
    });
  };

  const handleDateChange = (date: Date | null) => {
    setDateValue(date);
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  React.useEffect(() => {
    const filters: Partial<OrganizationPageFilters> = {};
    if (formData.name) {
      filters.name = formData.name;
    }
    if (formData.email) {
      filters.email = formData.email;
    }
    if (formData.ein) {
      filters.ein = formData.ein;
    }
    handleOrganizationFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.name, formData.email, formData.ein]);

  return (
    <div>
      <div className={classes.searchCustomerBody}>
        <Grid container direction="row" justifyContent="space-between">
          <Grid item lg={3} xs={6}>
            <h5 className={classes.searchHeading}>Search</h5>
          </Grid>
          <Grid item lg={4} xs={6}>
            <div className={classes.headerButton}>
              <Button
                disabled={!showFilters}
                text="Reset"
                type="secondary"
                onClick={handleReset}
              />
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
            justifyContent="flex-start"
          >
            <Grid lg={4} xs={12} item>
              <TextInput
                name="name"
                value={formData.name}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Name"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="organization"
                value={formData.organization}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Organization"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="ein"
                value={formData.ein}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="EIN"
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
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="number"
                label="Office Phone"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="officePhone"
                value={formData.officePhone}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="numebr"
                label="Fax"
                disabled
              />
            </Grid>

            <Grid lg={4} xs={12} item>
              <TextInput
                name="passwords"
                value={formData.passwords}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="URL"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <DatePicker
                onChange={handleDateChange}
                value={dateValue}
                label="Date Created From"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <DatePicker
                onChange={handleDateChange}
                value={dateValue}
                label="Date Created To"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="type"
                value={formData.type}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Domain"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="organization"
                value={formData.organization}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Address"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="brands"
                value={formData.brands}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Address City"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="stafRole"
                value={formData.stafRole}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Address State"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="stafRole"
                value={formData.stafRole}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="number"
                label="Address Phone"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="stafRole"
                value={formData.stafRole}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="emaikl"
                label="Address Email"
                disabled
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <div className={classes.flex}>
                <CheckBox checked={checked} handleChange={handleChange} disabled />{" "}
                <Typography variant="body2">Show Active Brands only </Typography>
              </div>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default UsersFilters;
