import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import TextInput from "Components/Form/TextInput";
import DatePicker from "Components/Form/Date";
import Select from "Components/Form/Select";
import CheckBox from "Components/CheckBox";
import { createFormReducer } from "Reducers/formReducer";
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

interface Option {
  value: string;
  label: string;
}

interface OrderSelectorState {
  order_from_amount: string;
  order_to_amount: string;
  paymentStatus: string;
  shippingStatus: string;
  orderBy: string;
  standing_order: boolean;
}

const initialOrderSelectorState: OrderSelectorState = {} as OrderSelectorState;

const formReducer = createFormReducer<OrderSelectorState>(initialOrderSelectorState);

const rows = [
  {
    id: "11",
    text: "Order No: 11"
  },
  {
    id: "12",
    text: "Order No: 12"
  },
  {
    id: "13",
    text: "Order No: 13"
  },
  {
    id: "14",
    text: "Order No: 14"
  },
  {
    id: "15",
    text: "Order No: 15"
  },
  {
    id: "16",
    text: "Order No: 16"
  },
  {
    id: "17",
    text: "Order No: 17"
  },
  {
    id: "18",
    text: "Order No: 18"
  },
  {
    id: "19",
    text: "Order No: 19"
  }
];

const OrderSelector = () => {
  const classes = useStyles();
  const [orders, setOrders] = React.useState<Array<{ id: string; text: string }>>(rows);
  const [selectedOrders, setSelectedOrders] = React.useState<
    Array<{ id: string; text: string }>
  >([]);
  const [filterType, setFilterType] = React.useState("exclude");
  const [ordersFrom, setOrdersFrom] = React.useState<Date | null>(null);
  const [ordersTo, setOrdersTo] = React.useState<Date | null>(null);
  const [orderSelectorState, dispatch] = React.useReducer(
    formReducer,
    initialOrderSelectorState
  );
  // const {data : orders} = useOrders();
  const paymentStatuses: Array<Option> = [
    { label: "Pending", value: "pending" },
    { label: "Partial", value: "partial" },
    { label: "Paid", value: "paid" }
  ];
  const shipmentStatuses: Array<Option> = [
    { label: "Pending", value: "pending" },
    { label: "Partial", value: "partial" },
    { label: "Shipped", value: "shipped" }
  ];

  const handlefilterTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilterType: string | null
  ) => {
    if (newFilterType !== null) {
      setFilterType(newFilterType);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    dispatch({
      type: "HANDLE_INPUT_TEXT",
      field: name,
      payload: checked
    });
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

  const handleOrdersFromChange = (date: Date | null) => {
    setOrdersFrom(date);
  };
  const handleOrdersToChange = (date: Date | null) => {
    setOrdersTo(date);
  };

  return (
    <>
      <div className={classes.header}>
        <div>
          <Typography variant="subtitle1" className={classes.dataTypeHeading}>
            Orders
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
          <div className={classes.flexAlign}>
            <DatePicker
              onChange={handleOrdersFromChange}
              value={ordersFrom}
              label="Orders From"
              // disabled
            />
          </div>
          <div className={classes.flexAlign}>
            <DatePicker
              onChange={handleOrdersToChange}
              value={ordersTo}
              label="Orders To"
              // disabled
            />
          </div>
          <div className={classes.flexAlign}>
            <TextInput
              name="order_from_amount"
              margin="dense"
              variant="outlined"
              type="text"
              label="Order From($)"
              placeholder="$0"
              value={orderSelectorState.order_from_amount}
              onChange={handleTextChange}
            />
          </div>
          <div className={classes.flexAlign}>
            <TextInput
              name="order_to_amount"
              margin="dense"
              variant="outlined"
              type="text"
              label="Order To($)"
              placeholder="$1,000.00"
              value={orderSelectorState.order_to_amount}
              onChange={handleTextChange}
            />
          </div>
          <div className={classes.flexAlign}>
            <div className={classes.labelDiv}>
              <p className={classes.label}>Payment Status:</p>
            </div>
            <div className={classes.selectDiv}>
              <Select defaultValue={paymentStatuses[0]} options={paymentStatuses} />
            </div>
          </div>
          <div className={classes.flexAlign}>
            <div className={classes.labelDiv}>
              <p className={classes.label}>Shipping Status:</p>
            </div>
            <div className={classes.selectDiv}>
              <Select defaultValue={shipmentStatuses[0]} options={shipmentStatuses} />
            </div>
          </div>
          <div className={classes.flexAlign}>
            <div className={classes.labelDiv}>
              <p className={classes.label}>Order By:</p>
            </div>
            <div className={classes.selectDiv}>
              <Select options={[]} />
            </div>
          </div>
          <div className={classes.flexDiv}>
            <CheckBox
              name="standing_order"
              handleChange={handleCheckboxChange}
              checked={orderSelectorState.standing_order}
            />
            <p className={classes.smallText}>Standing Order</p>
          </div>
        </Grid>
        <Grid item lg={4}>
          <IncludeFilterList
            headingText="Order No's"
            headingButtonText="Add All"
            icon={<ArrowForwardIcon />}
            onRowClicked={(row: { id: string; text: string }) => {
              setSelectedOrders([
                ...selectedOrders,
                ...orders.filter(order => order.id === row.id)
              ]);
              setOrders([...orders.filter(order => order.id !== row.id)]);
            }}
            handleHeadingButton={() => {
              setSelectedOrders([...orders, ...selectedOrders]);
              setOrders([]);
            }}
            data={orders}
          />
        </Grid>
        <Grid item lg={4}>
          <IncludeFilterList
            headingText={filterType === "exclude" ? "Excluded Orders" : "Included Orders"}
            headingButtonText="Remove All"
            icon={<RemoveCircleOutlineIcon />}
            data={selectedOrders}
            onRowClicked={(row: { id: string; text: string }) => {
              setOrders([
                ...orders,
                ...selectedOrders.filter(order => order.id === row.id)
              ]);
              setSelectedOrders([...selectedOrders.filter(order => order.id !== row.id)]);
            }}
            handleHeadingButton={() => {
              setOrders([...orders, ...selectedOrders]);
              setSelectedOrders([]);
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default OrderSelector;
