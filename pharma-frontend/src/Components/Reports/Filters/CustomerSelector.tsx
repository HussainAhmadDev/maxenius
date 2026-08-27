import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import TextInput from "Components/Form/TextInput";
import Select from "Components/Form/Select";
import { createFormReducer } from "Reducers/formReducer";
import states from "Utils/states";
import { Grid, Typography } from "@mui/material";
import IncludeFilterList from "./IncludeFilterList";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexDiv: {
      display: "flex",
      width: "fit-content"
    },
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    labelDiv: {
      minWidth: "130px"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    selectDiv: {
      width: "100%"
    },
    smallText: {
      fontSize: "12px"
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "20px 0"
    },
    dataTypeHeading: {
      textTransform: "capitalize",
      fontWeight: 500
    },
    toggleButton: {
      textTransform: "capitalize"
    }
  })
);

interface CustomerSelectorState {
  spent_from_amount: string;
  spent_to_amount: string;
  type: string;
  state: string;
  city: string;
  customer_zip: string;
  tax_exemption: string;
}

const initialCustomerSelectorState = {} as CustomerSelectorState;

const formReducer = createFormReducer<CustomerSelectorState>(
  initialCustomerSelectorState
);

const rows = [
  {
    id: "11",
    text: "Customer No: 11"
  },
  {
    id: "12",
    text: "Customer No: 12"
  },
  {
    id: "13",
    text: "Customer No: 13"
  },
  {
    id: "14",
    text: "Customer No: 14"
  },
  {
    id: "15",
    text: "Customer No: 15"
  },
  {
    id: "16",
    text: "Customer No: 16"
  },
  {
    id: "17",
    text: "Customer No: 17"
  },
  {
    id: "18",
    text: "Customer No: 18"
  },
  {
    id: "19",
    text: "Customer No: 19"
  }
];

const CustomerSelector = () => {
  const classes = useStyles();
  const [customers, setCustomers] =
    React.useState<Array<{ id: string; text: string }>>(rows);
  const [selectedCustomers, setSelectedCustomers] = React.useState<
    Array<{ id: string; text: string }>
  >([]);
  const [filterType, setFilterType] = React.useState("exclude");
  const [customerSelectorState, dispatch] = React.useReducer(
    formReducer,
    initialCustomerSelectorState
  );

  const handlefilterTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilterType: string | null
  ) => {
    if (newFilterType !== null) {
      setFilterType(newFilterType);
    }
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch({
      type: "HANDLE_INPUT_TEXT",
      field: name,
      payload: value
    });
  };

  const customerType = [
    { value: "individual", label: "Individual" },
    { value: "company", label: "Company" }
  ];

  return (
    <>
      <div className={classes.header}>
        <div>
          <Typography variant="subtitle1" className={classes.dataTypeHeading}>
            Customers
          </Typography>
        </div>
        <div>
          <ToggleButtonGroup
            size="small"
            color="error"
            value={filterType}
            exclusive
            onChange={handlefilterTypeChange}
            aria-label="filter Type"
          >
            <ToggleButton value="exclude" aria-label="exclude">
              <span className={classes.toggleButton}>Exclude</span>
            </ToggleButton>
            <ToggleButton value="include" aria-label="include">
              <span className={classes.toggleButton}>Include</span>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      <Grid container alignItems="start" spacing={3}>
        <Grid item lg={4}>
          <>
            <div className={classes.flexAlign}>
              <TextInput
                name="spent_from_amount"
                margin="dense"
                variant="outlined"
                type="text"
                label="Spent From($)"
                placeholder="$0"
                value={customerSelectorState.spent_from_amount}
                onChange={handleTextChange}
              />
            </div>
            <div className={classes.flexAlign}>
              <TextInput
                name="spent_to_amount"
                margin="dense"
                variant="outlined"
                type="text"
                label="Spent To($)"
                placeholder="$1,000.00"
                value={customerSelectorState.spent_to_amount}
                onChange={handleTextChange}
              />
            </div>
            <div className={classes.flexAlign}>
              <div className={classes.labelDiv}>
                <p className={classes.label}>Type:</p>
              </div>
              <div className={classes.selectDiv}>
                <Select defaultValue={customerType[0]} options={customerType} />
              </div>
            </div>
            <div className={classes.flexAlign}>
              <div className={classes.labelDiv}>
                <p className={classes.label}>State:</p>
              </div>
              <div className={classes.selectDiv}>
                <Select defaultValue={states[0].options[0]} options={states} />
              </div>
            </div>
            <div className={classes.flexAlign}>
              <TextInput
                name="city"
                margin="dense"
                variant="outlined"
                type="text"
                label="City"
                value={customerSelectorState.city}
                onChange={handleTextChange}
              />
            </div>
            <div className={classes.flexAlign}>
              <TextInput
                name="customer_zip"
                margin="dense"
                variant="outlined"
                type="text"
                label="Customer Zip"
                value={customerSelectorState.customer_zip}
                onChange={handleTextChange}
              />
            </div>
            <div className={classes.flexAlign}>
              <TextInput
                name="tax_exemption"
                margin="dense"
                variant="outlined"
                type="text"
                label="Tax Exemption"
                value={customerSelectorState.tax_exemption}
                onChange={handleTextChange}
              />
            </div>
          </>
        </Grid>
        <Grid item lg={4}>
          <IncludeFilterList
            headingText="Customer No's"
            headingButtonText="Add All"
            icon={<ArrowForwardIcon />}
            onRowClicked={(row: { id: string; text: string }) => {
              setSelectedCustomers([
                ...selectedCustomers,
                ...customers.filter(order => order.id === row.id)
              ]);
              setCustomers([...customers.filter(order => order.id !== row.id)]);
            }}
            handleHeadingButton={() => {
              setSelectedCustomers([...customers, ...selectedCustomers]);
              setCustomers([]);
            }}
            data={customers}
          />
        </Grid>
        <Grid item lg={4}>
          <IncludeFilterList
            headingText={
              filterType === "exclude" ? "Excluded Customers" : "Included Customers"
            }
            headingButtonText="Remove All"
            icon={<RemoveCircleOutlineIcon />}
            data={selectedCustomers}
            onRowClicked={(row: { id: string; text: string }) => {
              setCustomers([
                ...customers,
                ...selectedCustomers.filter(order => order.id === row.id)
              ]);
              setSelectedCustomers([
                ...selectedCustomers.filter(order => order.id !== row.id)
              ]);
            }}
            handleHeadingButton={() => {
              setCustomers([...customers, ...selectedCustomers]);
              setSelectedCustomers([]);
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CustomerSelector;
