import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Select from "Components/Form/Select";
import TextInput from "Components/Form/TextInput";
import MultiSelect from "react-select/creatable";
import DatePicker from "Components/Form/Date";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    labelDiv: {
      minWidth: "110px"
    },
    selectDiv: {
      width: "100%"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%"
    },
    multiSelect: {
      display: "flex",
      alignItems: "center",
      width: "100%"
    },
    skuOptions: {
      minWidth: 220,
      width: "100%"
    }
  })
);

type DateType = "from" | "to";
type StatusType = "shipment" | "payment";
type SpentType = "min" | "max";

interface Option {
  value: string;
  label: string;
}
interface Props {
  readonly header?: boolean;
  handleOrderShipmentDateChange(dateType: DateType, date: Date | null): void;
  handleDateChange(dateType: DateType, date: Date | null): void;
  dateFrom: Date | null;
  dateTo: Date | null;
  shipDateFrom: Date | null;
  shipDateTo: Date | null;
  totalFrom: number;
  totalTo: number;
  orderSkus: string[];
  setOrderSkus: React.Dispatch<React.SetStateAction<string[]>>;
  paymentStatus: Option;
  shipmentStatus: Option;
  paymentStatusOptions: Option[];
  shipmentStatusOptions: Option[];
  handleStatusChange(statusType: StatusType, value: Option): void;
  handleTotalChange(spentType: SpentType, value: number): void;
}

const OrdersDataset: React.FC<Props> = (props: Props) => {
  const {
    dateFrom,
    dateTo,
    shipDateFrom,
    shipDateTo,
    handleOrderShipmentDateChange,
    handleDateChange,
    handleStatusChange,
    handleTotalChange,
    paymentStatus,
    paymentStatusOptions,
    shipmentStatus,
    shipmentStatusOptions,
    totalFrom,
    totalTo,
    orderSkus,
    setOrderSkus
  } = props;

  const classes = useStyles();

  return (
    <>
      <Grid lg={6} xs={12} item>
        <div className={classes.flexAlign}>
          <div className={classes.labelDiv}>
            <p className={classes.label}>Orders From:</p>
          </div>
          <div className={classes.flexAlign}>
            <DatePicker
              onChange={value => handleDateChange("from", value)}
              value={dateFrom}
            />
          </div>
        </div>
      </Grid>
      <Grid lg={6} xs={12} item>
        <div className={classes.flexAlign}>
          <div className={classes.labelDiv}>
            <p className={classes.label}>Orders To:</p>
          </div>
          <div className={classes.flexAlign}>
            <DatePicker
              onChange={value => handleDateChange("to", value)}
              value={dateTo}
            />
          </div>
        </div>
      </Grid>

      <Grid lg={6} xs={12} item>
        <div className={classes.flexAlign}>
          <div className={classes.labelDiv}>
            <p className={classes.label}>Shipped Date From:</p>
          </div>
          <div className={classes.flexAlign}>
            <DatePicker
              onChange={value => {
                handleOrderShipmentDateChange("from", value);
              }}
              value={shipDateFrom}
            />
          </div>
        </div>
      </Grid>
      <Grid lg={6} xs={12} item>
        <div className={classes.flexAlign}>
          <div className={classes.labelDiv}>
            <p className={classes.label}>Shipped Date To:</p>
          </div>
          <div className={classes.flexAlign}>
            <DatePicker
              onChange={value => {
                handleOrderShipmentDateChange("to", value);
              }}
              value={shipDateTo}
            />
          </div>
        </div>
      </Grid>

      <Grid lg={6} xs={12} item>
        <div className={classes.flexAlign}>
          <div className={classes.labelDiv}>
            <p className={classes.label}>Payment Status:</p>
          </div>
          <div className={classes.selectDiv}>
            <Select
              defaultValue={paymentStatusOptions[0]}
              options={paymentStatusOptions}
              value={paymentStatus}
              onChange={value => handleStatusChange("payment", value)}
            />
          </div>
        </div>
      </Grid>

      <Grid lg={6} xs={12} item>
        <div className={classes.flexAlign}>
          <div className={classes.labelDiv}>
            <p className={classes.label}>Shipment Status:</p>
          </div>
          <div className={classes.selectDiv}>
            <Select
              defaultValue={shipmentStatusOptions[0]}
              options={shipmentStatusOptions}
              value={shipmentStatus}
              onChange={value => handleStatusChange("shipment", value)}
            />
          </div>
        </div>
      </Grid>

      <Grid lg={6} xs={12} item>
        <div className={classes.flexAlign}>
          <div className={classes.labelDiv}>
            <p className={classes.label}>Spent From:</p>
          </div>
          <div className={classes.flexAlign}>
            <TextInput
              name="spent_from"
              value={totalFrom}
              onChange={e => handleTotalChange("min", Number.parseFloat(e.target.value))}
              margin="dense"
              variant="outlined"
              type="number"
              placeholder="£0"
            />
          </div>
        </div>
      </Grid>
      <Grid lg={6} xs={12} item>
        <div className={classes.flexAlign}>
          <div className={classes.labelDiv}>
            <p className={classes.label}>Spent To:</p>
          </div>
          <div className={classes.flexAlign}>
            <TextInput
              name="spent_to"
              value={totalTo}
              onChange={e => handleTotalChange("max", Number.parseFloat(e.target.value))}
              margin="dense"
              variant="outlined"
              type="number"
              placeholder="£0"
            />
          </div>
        </div>
      </Grid>
      <Grid lg={12} md={12} xs={12} item>
        <div className={classes.multiSelect}>
          <div className={classes.labelDiv}>
            <p className={classes.label}>Sku(s):</p>
          </div>
          <MultiSelect
            aria-label="SKUS"
            placeholder="Add SKUs"
            isMulti
            className={classes.skuOptions}
            value={orderSkus.map(sku => ({ label: sku, value: sku }))}
            // @ts-expect-error fix
            onChange={(value: Array<Option>) => {
              setOrderSkus(value.map(v => v.value));
            }}
          />
        </div>
      </Grid>
    </>
  );
};

export default OrdersDataset;
