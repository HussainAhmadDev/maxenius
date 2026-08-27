import * as React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// Components
import Grid from "@mui/material/Grid";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import TextInput from "Components/Form/TextInput";
import CheckBox from "Components/CheckBox";
import Select from "Components/Form/Select";
import DatePicker from "Components/Form/Date";
import MaskingInput from "Components/Form/MaskingInput";
import Prompt from "Components/Prompt";
//hooks
import { useBrand } from "Context/BrandContext";
import { useTheme } from "@mui/material/styles";
import { useCreateCompany } from "Hooks/useCompanies";
//utils
import { getAllStates } from "Utils/states";
import {
  customerParamsGeneralKeys,
  customerParamsContactKeys
} from "Utils/queryParamKeys";

const queryParamsKeys = [...customerParamsContactKeys, ...customerParamsGeneralKeys];

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
      marginTop: theme.spacing(1)
    },
    headerButton: {
      display: "flex",
      justifyContent: "flex-end"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    flex: {
      display: "flex",
      alignItems: "center"
    },
    smallText: {
      fontSize: "12px"
    },
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    labelDiv: {
      minWidth: "130px"
    },
    selectDiv: {
      width: "100%"
    },
    alignCheckBox: {
      marginTop: "1.3rem"
    },
    flexContainer: {
      display: "flex",
      alignItems: "center"
    },
    checkboxContainerSmall: {
      display: "flex",
      flexDirection: "column"
    }
  })
);
interface Props {
  readonly header?: boolean;
}

const CustomerFilters: React.FC<Props> = ({ header }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { pathname } = useLocation();
  const { activeBrand } = useBrand();
  const { mutate: createCompany } = useCreateCompany();
  const [showFilters, setShowFilters] = React.useState<boolean>(true);
  const [showWarning, setShowWarning] = React.useState(false);
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [searchParams, setSearchParams] = useSearchParams();

  // Event handlers
  // This function stores the input values inside query parameters
  const handleChange = ({ key, value }: { key: string; value: string }) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  // This function stores the date values inside query params as ISO strings
  // This function is not needed at the moment but will be required when
  // date filters is functional on the backend side.
  const handleDateChange = (date: Date | null, key: string) => {
    if (date) {
      date
        ? handleChange({ key, value: date.toISOString() })
        : handleChange({ key, value: "" });
    }
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name: key, value } = event.currentTarget;
    handleChange({ key, value });
  };

  const searchByBillTo = searchParams.get("search_by_bill_to");
  const searchByShipTo = searchParams.get("search_by_ship_to");

  const disableFields = React.useMemo(
    () => !(!!searchByBillTo || !!searchByShipTo),
    [searchByBillTo, searchByShipTo]
  );

  // Set the default values of search_by_ship_to and search_by_bill_to to true.
  React.useEffect(() => {
    const initialParams = new URLSearchParams(searchParams);
    initialParams.set("search_by_bill_to", "1");
    initialParams.set("search_by_ship_to", "1");
    // If it's the trash page, also add is_trash to the query params
    ["/trash", "/trash/"].includes(pathname)
      ? initialParams.set("is_trash", "1")
      : initialParams.delete("is_trash");

    setSearchParams(initialParams);
    //eslint-disable-next-line
  }, [pathname]);

  return (
    <div>
      <Prompt
        promptMsg={
          "This will create a customer with the customer number only. You'll have to add the rest of the customer information after creation."
        }
        title={`Create new customer`}
        openModal={showWarning}
        onCancel={() => setShowWarning(false)}
        onProceed={() => {
          setShowWarning(false);
          createCompany(activeBrand);
        }}
      />
      {header && (
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item lg={3}>
            <h4 className={classes.heading}>Customer</h4>
          </Grid>
          <Grid item lg={2}>
            <Button
              text="Create Customer"
              type="primaryOutlined"
              icon={<MuiIcon icon="add" />}
              onClick={() => {
                setShowWarning(true);
              }}
              aria-label="create customer"
            />
          </Grid>
        </Grid>
      )}
      <div>
        <div className={classes.searchCustomerBody}>
          <Grid container direction="row" justifyContent="space-between">
            <Grid xs={6} item>
              <h5 className={classes.searchHeading}>Search</h5>
            </Grid>
            <Grid xs={6} container item justifyContent="flex-end">
              <div className={classes.flexContainer}>
                <Button
                  disabled={!showFilters}
                  text="Reset"
                  type="secondary"
                  style={{ margin: "2px" }}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    queryParamsKeys.forEach(key => params.delete(key));
                    setSearchParams(params);
                  }}
                />
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  text={showFilters ? "Hide" : "Show"}
                  style={{ margin: "2px" }}
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
              aria-label="filters container"
              component="form"
            >
              <Grid lg={4} md={6} sm={6} xs={12} item>
                <TextInput
                  name="number"
                  value={searchParams.get("number") || ""}
                  margin="dense"
                  onChange={handleTextChange}
                  variant="outlined"
                  type="text"
                  label="Customer Number"
                  inputProps={{ "aria-label": "customer number" }}
                />
              </Grid>
              <Grid lg={4} xs={12} item>
                <DatePicker
                  inputAriaLabel="last order from"
                  onChange={(date: Date | null) =>
                    handleDateChange(date, "ordered__from")
                  }
                  value={
                    searchParams.get("ordered_from")
                      ? new Date(searchParams.get("ordered__from") as string)
                      : null
                  }
                  label="Last Order From"
                  disabled
                />
              </Grid>
              <Grid lg={4} xs={12} item>
                <DatePicker
                  onChange={(date: Date | null) => handleDateChange(date, "ordered__to")}
                  value={
                    searchParams.get("ordered__to")
                      ? new Date(searchParams.get("ordered__to") as string)
                      : null
                  }
                  label="Last Order to"
                  disabled
                />
              </Grid>

              <Grid lg={4} xs={12} item>
                <TextInput
                  name="first_name"
                  value={searchParams.get("first_name") || ""}
                  margin="dense"
                  variant="outlined"
                  type="text"
                  label="Contact First Name"
                  onChange={handleTextChange}
                  disabled={disableFields}
                  inputProps={{ "aria-label": "contact first name" }}
                />
              </Grid>
              <Grid lg={4} xs={12} item>
                <TextInput
                  name="last_name"
                  value={searchParams.get("last_name") || ""}
                  margin="dense"
                  variant="outlined"
                  type="text"
                  label="Contact Last Name"
                  onChange={handleTextChange}
                  disabled={disableFields}
                  inputProps={{ "aria-label": "contact last name" }}
                />
              </Grid>

              <Grid lg={4} xs={12} item>
                <TextInput
                  name="name"
                  value={searchParams.get("name") || ""}
                  margin="dense"
                  variant="outlined"
                  type="text"
                  label="Company Name"
                  inputProps={{ "aria-label": "company name" }}
                  onChange={handleTextChange}
                />
              </Grid>
              <Grid lg={4} xs={12} item>
                <TextInput
                  name="email"
                  value={searchParams.get("email") || ""}
                  margin="dense"
                  variant="outlined"
                  type="email"
                  label="Email"
                  onChange={handleTextChange}
                  disabled={disableFields}
                  inputProps={{ "aria-label": "contact email" }}
                />
              </Grid>
              <Grid lg={4} xs={12} item container>
                <div
                  className={matches ? classes.flexAlign : ""}
                  style={{ width: "100%" }}
                >
                  <div className={classes.labelDiv}>
                    <p className={classes.label}>Phone:</p>
                  </div>
                  <div className={classes.selectDiv}>
                    <MaskingInput
                      ariaLabel="contact phone"
                      type="text"
                      showMask={true}
                      maskType="phone"
                      name={`phone`}
                      value={searchParams.get("phone") || ""}
                      placeholder="+x (xxx) xxx-xxxx"
                      onChange={(name, value) => handleChange({ key: name, value })}
                      disabled={disableFields}
                    />
                  </div>
                </div>
              </Grid>
              <Grid lg={4} xs={12} item>
                <TextInput
                  name="street1"
                  value={searchParams.get("street1") || ""}
                  margin="dense"
                  variant="outlined"
                  type="text"
                  label="Address 1"
                  onChange={handleTextChange}
                  disabled={disableFields}
                  inputProps={{ "aria-label": "address 1" }}
                />
              </Grid>
              <Grid lg={4} xs={12} item>
                <TextInput
                  name="street2"
                  value={searchParams.get("street2") ?? ""}
                  margin="dense"
                  variant="outlined"
                  type="text"
                  label="Address 2"
                  onChange={handleTextChange}
                  disabled={disableFields}
                  inputProps={{ "aria-label": "address 2" }}
                />
              </Grid>

              <Grid lg={4} xs={12} item>
                <div className={matches ? classes.flexAlign : ""}>
                  <div className={classes.selectDiv}>
                    <TextInput
                      name="city"
                      value={searchParams.get("city") || ""}
                      margin="dense"
                      variant="outlined"
                      type="text"
                      label="City"
                      onChange={handleTextChange}
                      disabled={disableFields}
                      inputProps={{ "aria-label": "city" }}
                    />
                  </div>
                </div>
              </Grid>
              <Grid lg={4} xs={12} item>
                <div className={matches ? classes.flexAlign : ""}>
                  <div className={classes.labelDiv}>
                    <p className={classes.label}>State:</p>
                  </div>
                  <div className={classes.selectDiv}>
                    <Select
                      disabled={disableFields}
                      name="state"
                      value={
                        getAllStates().find(
                          item =>
                            item.value.toLowerCase() ===
                            (searchParams.get("state") || "").toLowerCase()
                        ) || { label: "Select", value: "" }
                      }
                      options={getAllStates()}
                      onChange={(value: { lable: string; value: string }) => {
                        handleChange({
                          key: "state",
                          value: value.value
                        });
                      }}
                    />
                  </div>
                </div>
              </Grid>

              <Grid lg={4} xs={12} item>
                <TextInput
                  name="zip"
                  value={searchParams.get("zip") || ""}
                  margin="dense"
                  variant="outlined"
                  type="text"
                  label="Zipcode"
                  onChange={handleTextChange}
                  disabled={disableFields}
                  inputProps={{ "aria-label": "zip code" }}
                />
              </Grid>
              <Grid lg={4} xs={12} item>
                <TextInput
                  name="search"
                  value={searchParams.get("search") || ""}
                  margin="dense"
                  variant="outlined"
                  type="text"
                  label="Search"
                  onChange={handleTextChange}
                  inputProps={{ "aria-label": "search" }}
                />
              </Grid>
              <Grid lg={4} xs={12} item>
                <div
                  className={
                    isSmallScreen ? classes.flexContainer : classes.checkboxContainerSmall
                  }
                >
                  <div className={classes.flexContainer}>
                    <CheckBox
                      name="search_by_bill_to"
                      checked={!!searchParams.get("search_by_bill_to")}
                      handleChange={e => {
                        handleChange({
                          key: e.target.name,
                          value: e.target.checked ? "1" : ""
                        });
                      }}
                      inputProps={{ "aria-label": "search by bill to" }}
                    />
                    <p className={classes.smallText}>Search by Bill To</p>
                  </div>
                  <div className={classes.flexContainer}>
                    <CheckBox
                      name="search_by_ship_to"
                      checked={!!searchParams.get("search_by_ship_to")}
                      handleChange={e => {
                        handleChange({
                          key: e.target.name,
                          value: e.target.checked ? "1" : ""
                        });
                      }}
                      inputProps={{ "aria-label": "search by ship to" }}
                    />
                    <p className={classes.smallText}>Search by Ship To</p>
                  </div>
                </div>
              </Grid>
            </Grid>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerFilters;
