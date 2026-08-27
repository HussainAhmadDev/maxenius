import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Button from "Components/Button";
import TextInput from "Components/Form/TextInput";
import { createFormReducer } from "Reducers/formReducer";
import { UserPageFilters } from "Interfaces/QueryFilters";
import { useSearchParams } from "react-router-dom";

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
    },
    createBtn: {
      textAlign: "right"
    }
  })
);
interface Props {
  readonly header?: boolean;
  handleUserFilters(filters: Partial<UserPageFilters>): void;
  onSearch?(): unknown;
}

interface FormState {
  username: string;
  first_name: string;
  last_name: string;
  middle_name: string;
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
  search: string;
  is_active: string;
}
const initialFormState: FormState = {
  username: "",
  first_name: "",
  last_name: "",
  middle_name: "",
  email: "",
  mobileNumber: "",
  officePhone: "",
  passwords: "",
  lastLoginFrom: "",
  lastLoginTo: "",
  type: "",
  organization: "",
  brands: "",
  stafRole: "",
  search: "",
  is_active: "1"
};

const formReducer = createFormReducer<FormState>(initialFormState);

const UsersFilters: React.FC<Props> = ({ header, handleUserFilters, onSearch }) => {
  const classes = useStyles();

  const [showFilters, setShowFilters] = React.useState<boolean>(true);
  const [checked] = React.useState<boolean>(true);

  const [formData, dispatch] = React.useReducer(formReducer, initialFormState);

  const [searchParams, setSearchParams] = useSearchParams();
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const key = e.target.name;
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
    dispatch({
      type: "HANDLE_INPUT_TEXT",
      field: e.target.name,
      payload: e.target.value
    });
  };

  const handleReset = () => {
    onSearch?.();
    dispatch({ type: "RESET" });
    setSearchParams();
  };

  React.useEffect(() => {
    const filters: Partial<UserPageFilters> = {};
    if (formData.first_name) {
      filters.first_name = formData.first_name;
    }
    if (formData.email) {
      filters.email = formData.email;
    }
    if (formData.middle_name) {
      filters.middle_name = formData.middle_name;
    }
    if (formData.last_name) {
      filters.last_name = formData.last_name;
    }
    if (formData.search) {
      filters.search = formData.search;
    }
    if (checked) {
      filters.is_active = `${Number(checked)}`;
    }

    handleUserFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.first_name,
    formData.email,
    formData.middle_name,
    formData.last_name,
    formData.search,
    checked
  ]);

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
            columnSpacing={3}
            className={classes.formBody}
            justifyContent="flex-start"
          >
            <Grid lg={4} xs={12} item>
              <TextInput
                name="first_name"
                value={formData.first_name}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="First Name"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="last_name"
                value={formData.last_name}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Last Name"
              />
            </Grid>
            <Grid lg={4} xs={12} item>
              <TextInput
                name="middle_name"
                value={formData.middle_name}
                onChange={handleTextChange}
                margin="dense"
                variant="outlined"
                type="text"
                label="Middle Name"
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
                label="Mobile Number"
              />
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default UsersFilters;
