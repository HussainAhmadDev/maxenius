import * as React from "react";
import { ModalInterface } from "Interfaces/ModalInterface";
import ModalPopUp from "../../ModalPopup";
import { Grid, Typography } from "@mui/material";
import Select from "Components/Form/Select";
import OrdersDataset from "./OrdersDataset";
import CustomersDataset from "./CustomersDataset";
import ProductsDataset from "./ProductsDataset";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { useCreateFilter } from "Hooks/useReports";
import { Filter } from "Interfaces/Reports";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {},
    datasetBody: {
      width: "100%",
      background: theme.palette.gray[100],
      borderRadius: "6px",
      marginTop: "20px",
      padding: "25px 20px 0 20px",
      border: `1px solid ${theme.palette.gray[700]}`
    },
    formBody: {
      padding: "25px 0px"
    },
    datasetTypeHeading: {
      fontSize: "12px",
      fontWeight: 400,
      color: "#475569"
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

const options: Array<Option> = [
  {
    value: "orders",
    label: "Orders"
  },
  {
    value: "customers",
    label: "Customers"
  },
  {
    value: "products",
    label: "Products"
  }
];

const TAX_EXEMPT_OPTIONS: Option[] = [
  { label: "All", value: "" },
  { label: "YES", value: "1" },
  { label: "NO", value: "0" }
];

type DateType = "from" | "to";
type StatusType = "shipment" | "payment";
type SpentType = "min" | "max";

const PAYMENT_STATUS_OPTIONS: Option[] = [
  { label: "All", value: "" },
  { label: "Paid", value: "paid" },
  { label: "Not Paid", value: "not_paid" },
  { label: "Partially Paid", value: "partially_paid" }
];

const SHIPMENT_STATUS_OPTIONS: Option[] = [
  { label: "All", value: "" },
  { label: "Shipped", value: "shipped" },
  { label: "Not Shipped", value: "not_shipped" },
  { label: "Partially Shipped", value: "partially_shipped" }
];

interface Props extends ModalInterface {
  reportId: string;
}

const AddDatasetModal = (props: Props) => {
  const { handleSaveChanges, handleCloseModal, reportId, ...modalProps } = props;
  const classes = useStyles();
  const [datasetType, setDatasetType] = React.useState<Option>(options[0]);
  const [filterType, setFilterType] = React.useState("include");
  // Customers related state
  const [orderedFrom, setOrderedFrom] = React.useState<Date | null>(null);
  const [orderedTo, setOrderedTo] = React.useState<Date | null>(null);
  const [isTaxExempt, setTaxExempt] = React.useState<Option>(TAX_EXEMPT_OPTIONS[0]);
  // Products related state
  const [skus, setSkus] = React.useState<string[]>([]);
  const [priceFrom, setPriceFrom] = React.useState<number>(0);
  const [priceTo, setPriceTo] = React.useState<number>(0);
  // Orders related state
  const [dateFrom, setDateFrom] = React.useState<Date | null>(null);
  const [dateTo, setDateTo] = React.useState<Date | null>(null);
  const [shipDateFrom, setShipDateFrom] = React.useState<Date | null>(null);
  const [shipDateTo, setShipDateTo] = React.useState<Date | null>(null);
  const [paymentStatus, setPaymentStatus] = React.useState<Option>(
    PAYMENT_STATUS_OPTIONS[0]
  );
  const [shipmentStatus, setShipmentStatus] = React.useState<Option>(
    SHIPMENT_STATUS_OPTIONS[0]
  );
  const [totalAmountFrom, setTotalAmountFrom] = React.useState(0);
  const [totalAmountTo, setTotalAmountTo] = React.useState(0);
  const [orderSkus, setOrderSkus] = React.useState<string[]>([]);
  // React Query hooks
  const { mutate: createFilter } = useCreateFilter();
  const exclude = filterType === "exclude" || false;

  const handleCustomerOrderDateChange = (dateType: DateType, value: Date | null) => {
    if (dateType === "from") {
      setOrderedFrom(value);
    }
    if (dateType === "to") {
      setOrderedTo(value);
    }
  };

  const handleOrderDateChange = (dateType: DateType, value: Date | null) => {
    if (dateType === "from") {
      setDateFrom(value);
    }
    if (dateType === "to") {
      setDateTo(value);
    }
  };

  const handleOrderShipmentDateChange = (dateType: DateType, value: Date | null) => {
    if (dateType === "from") {
      setShipDateFrom(value);
    }
    if (dateType === "to") {
      setShipDateTo(value);
    }
  };

  const handlefilterTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilterType: string | null
  ) => {
    if (newFilterType !== null) {
      setFilterType(newFilterType);
    }
  };

  const handleStatusChange = (statusTye: StatusType, value: Option) => {
    if (statusTye === "payment") {
      setPaymentStatus(value);
    } else if (statusTye === "shipment") {
      setShipmentStatus(value);
    }
  };

  const handleTotalChange = (spentType: SpentType, value: number) => {
    if (spentType === "min") {
      setTotalAmountFrom(value);
    } else if (spentType === "max") {
      setTotalAmountTo(value);
    }
  };

  const handleAddProductFilters = () => {
    const defaultValues: Partial<Filter> = {
      exclude,
      type: "product",
      template_id: reportId
    };
    const filters: Partial<Filter>[] = [];

    if (skus.length > 0) {
      filters.push({
        ...defaultValues,
        field_name: "sku",
        field_value: skus
      });
      setSkus([]);
    }
    if (priceFrom) {
      filters.push({
        ...defaultValues,
        field_name: "price_from",
        field_value: priceFrom
      });
      setPriceFrom(0);
    }
    if (priceTo) {
      filters.push({
        ...defaultValues,
        field_name: "price_to",
        field_value: priceTo
      });
      setPriceTo(0);
    }

    filters.forEach(filter => {
      createFilter(filter);
    });
  };

  const handleAddOrderFilters = () => {
    const defaultValues: Partial<Filter> = {
      exclude,
      type: "order",
      template_id: reportId
    };
    const filters: Partial<Filter>[] = [];

    if (totalAmountFrom) {
      filters.push({
        ...defaultValues,
        field_name: "total_amount_from",
        field_value: totalAmountFrom
      });
      setTotalAmountFrom(0);
    }
    if (paymentStatus.value) {
      filters.push({
        ...defaultValues,
        field_name: "payment_status",
        field_value: paymentStatus.value
      });
      setPaymentStatus(PAYMENT_STATUS_OPTIONS[0]);
    }
    if (shipmentStatus.value) {
      filters.push({
        ...defaultValues,
        field_name: "shipment_status",
        field_value: shipmentStatus.value
      });

      setShipmentStatus(SHIPMENT_STATUS_OPTIONS[0]);
    }
    if (totalAmountTo) {
      filters.push({
        ...defaultValues,
        field_name: "total_amount_to",
        field_value: totalAmountTo
      });
      setTotalAmountTo(0);
    }
    if (shipDateFrom) {
      filters.push({
        ...defaultValues,
        field_name: "shipped_date_from",
        field_value: shipDateFrom.toISOString()
      });
      setShipDateFrom(null);
    }
    if (shipDateTo) {
      filters.push({
        ...defaultValues,
        field_name: "shipped_date_to",
        field_value: shipDateTo.toISOString()
      });
      setShipDateTo(null);
    }

    if (dateFrom) {
      filters.push({
        ...defaultValues,
        field_name: "date_from",
        field_value: dateFrom.toISOString()
      });
      setDateFrom(null);
    }
    if (dateTo) {
      filters.push({
        ...defaultValues,
        field_name: "date_to",
        field_value: dateTo.toISOString()
      });
      setDateTo(null);
    }
    if (orderSkus.length > 0) {
      filters.push({
        ...defaultValues,
        field_name: "sku",
        field_value: orderSkus
      });
      setOrderSkus([]);
    }

    filters.forEach(filter => {
      createFilter(filter);
    });
  };

  const handleAddCustomerFilters = () => {
    const defaultValues: Partial<Filter> = {
      exclude,
      type: "customer",
      template_id: reportId
    };
    const filters: Partial<Filter>[] = [];

    if (orderedFrom) {
      filters.push({
        ...defaultValues,
        field_name: "ordered_from",
        field_value: orderedFrom.toISOString()
      });
      setOrderedFrom(null);
    }
    if (orderedTo) {
      filters.push({
        ...defaultValues,
        field_name: "ordered_to",
        field_value: orderedTo.toISOString()
      });
      setOrderedTo(null);
    }
    if (isTaxExempt.value) {
      filters.push({
        ...defaultValues,
        field_name: "is_tax_exempt",
        field_value: isTaxExempt.value === "1"
      });
      setTaxExempt(TAX_EXEMPT_OPTIONS[0]);
    }
    filters.forEach(filter => {
      createFilter(filter);
    });
  };

  const handleAddFilters = () => {
    switch (datasetType.value) {
      case "orders": {
        handleAddOrderFilters();
        break;
      }
      case "customers": {
        handleAddCustomerFilters();
        break;
      }
      case "products": {
        handleAddProductFilters();
        break;
      }

      default:
        break;
    }
  };

  return (
    <ModalPopUp
      maxWidth="md"
      modalTitle={props.title}
      saveBtnText={props.saveText}
      checkBox={props.checkBox}
      handleCloseModal={handleCloseModal}
      handleSaveChanges={() => {
        handleAddFilters();
        setTimeout(() => {
          handleSaveChanges();
        }, 300);
      }}
      {...modalProps}
    >
      <div className={classes.container}>
        <Grid
          container
          alignItems="flex-end"
          justifyContent="space-between"
          rowSpacing={1}
        >
          <Grid container item xs={12} lg={6} md={6}>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <p className={classes.datasetTypeHeading}>Dataset Type:</p>
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8}>
              <Select
                value={datasetType}
                onChange={values => {
                  setDatasetType(options.find(option => values.value === option.value)!);
                }}
                options={options}
              />
            </Grid>
          </Grid>
          <Grid item container xs={12} sm={6} md={6} lg={6} justifyContent="flex-end">
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
          </Grid>
        </Grid>

        <div>
          <div className={classes.datasetBody}>
            <Typography variant="subtitle1">Customize Dataset</Typography>
            <Grid
              container
              direction="row"
              spacing={1}
              className={classes.formBody}
              justifyContent="flex-start"
            >
              {datasetType.value === "orders" && (
                <OrdersDataset
                  handleDateChange={handleOrderDateChange}
                  handleOrderShipmentDateChange={handleOrderShipmentDateChange}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  shipDateFrom={shipDateFrom}
                  shipDateTo={shipDateTo}
                  totalFrom={totalAmountFrom}
                  totalTo={totalAmountTo}
                  paymentStatusOptions={PAYMENT_STATUS_OPTIONS}
                  shipmentStatusOptions={SHIPMENT_STATUS_OPTIONS}
                  paymentStatus={paymentStatus}
                  shipmentStatus={shipmentStatus}
                  handleStatusChange={handleStatusChange}
                  handleTotalChange={handleTotalChange}
                  orderSkus={orderSkus}
                  setOrderSkus={setOrderSkus}
                />
              )}
              {datasetType.value === "customers" && (
                <CustomersDataset
                  orderedFrom={orderedFrom}
                  orderedTo={orderedTo}
                  isTaxExempt={isTaxExempt}
                  taxExemptOptions={TAX_EXEMPT_OPTIONS}
                  handleDateChange={handleCustomerOrderDateChange}
                  handleTaxPayerType={(value: Option) => setTaxExempt(value)}
                />
              )}
              {datasetType.value === "products" && (
                <ProductsDataset
                  skus={skus}
                  setSkus={setSkus}
                  priceFrom={priceFrom}
                  priceTo={priceTo}
                  setPriceFrom={setPriceFrom}
                  setPriceTo={setPriceTo}
                />
              )}
            </Grid>
          </div>
        </div>
      </div>
    </ModalPopUp>
  );
};

export default AddDatasetModal;
