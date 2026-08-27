import React, { useState } from "react";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import Select from "Components/Form/Select";
import { usePurchaseOrder } from "Components/PurchaseOrders/CreatePurchaseOrder/PurchaseOrderEditTable";
import { PurchaseOrderType } from "Context/PurchaseOrderContext";
import DataTable from "Components/DataTable/Table";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useWarehouses } from "Hooks/useWarehouses";
import { useVendors } from "Hooks/useVendors";
import { useDebounce } from "Hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useCreateIncreaseAdjustment } from "Hooks/useAdjustment";
import { useBrand } from "Context/BrandContext";
import { toast } from "react-toastify";
import { isBefore, parse, startOfDay } from "date-fns";
import CustomDatePicker from "./CustomDatePicker";
interface CustomDatePickerState {
  selectedDate: Date | null;
}
type ProductType = {
  product: { label: string; value: string };
  quantity: number;
  price: number;
  tax: number;
  total: number;
  received: number;
  barcode: string;
  batch_number: string;
  id: string;
  invoice_number: string;
  sku: string;
  id_hash: string;
  stock_quantity: number;
  retail_price: number;
  adjustmentQty: number;
  afterQty: number;
  batchNumber: string;
  expiry_date: string;
  name: string;
};
interface ColumnsProps {
  readonly name: string;
  readonly selector?: (row: string) => string | React.ReactNode | undefined;
  readonly sortable?: boolean;
  readonly cell?: (row: ProductType & { id: string }) => JSX.Element;
  readonly width?: string;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    redField: {
      marginBottom: "5px",
      color: theme.palette.primary.main,
      fontWeight: "bold"
    },
    selectButton: {
      marginTop: "10px"
    },
    greyField: {
      color: theme.palette.text.secondary
    },
    flex: {
      display: "flex",
      alignItems: "center"
    },
    passwordItem: {
      display: "flex",
      alignItems: "center",
      marginTop: "-6px"
    },
    iconAvatar: {
      marginLeft: "7px",
      width: "22px",
      height: "22px",
      marginTop: "5px"
    },
    editButton: {
      marginTop: "10px",
      color: theme.palette.text.secondary
    },
    characterCount: {
      fontSize: "12px",
      fontWeight: "bold"
    },
    redBorder: {
      border: "2px solid red",
      borderRadius: "4px"
    },
    formBody: {
      marginTop: "20px"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    labelDiv: {
      minWidth: "35%"
    },
    selectDiv: {
      width: "100%"
    },
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    tabVendorDiv: {
      display: "block"
    }
  })
);
const IncreaseStock = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  //eslint-disable-next-line
  const [eData, setEData] = React.useState({} as any);
  const [editID] = React.useState("" as string);

  // const [purchaseOrderBody, setPurchaseOrderBody] = useState([])
  const [purchaseOrderBody, setPurchaseOrderBody] = useState({} as PurchaseOrderType);

  const { products, refetchProduct, isLoading: isProductLoading } = usePurchaseOrder();
  const classes = useStyles();
  const [product, setProduct] = React.useState({
    quantity: 0,
    adjustmentQty: 0,
    afterQty: 0,
    price: 0,
    batchNumber: "",
    expiry_date: "",
    tax: 0,
    name: ""
  } as ProductType);

  const columns: ColumnsProps[] = [
    {
      name: "Product#/SKU",
      cell: row => <p>{row.sku}</p>,
      sortable: false
    },
    {
      name: "Product Name",
      cell: row => <p className={classes.redField}>{row.name}</p>,
      sortable: false
    },
    {
      name: "Quantity",
      cell: row =>
        row.product.value === editID ? (
          <TextField
            id="StockQuantity"
            type="number"
            value={eData.quantity}
            hiddenLabel
            variant="outlined"
            onChange={e => {
              let value = parseFloat(e.target.value);
              if (value < 0) value = 0;
              setEData({ ...eData, quantity: value });
            }}
          />
        ) : (
          <p>{row.quantity}</p>
        ),
      sortable: false
    },
    {
      name: "Adjustment Quantity",
      cell: row =>
        row.product.value === editID ? (
          <TextField
            id="Adjustmentprice"
            type="number"
            value={eData.price}
            hiddenLabel
            variant="outlined"
            onChange={e => {
              let value = parseFloat(e.target.value);
              if (value < 0) value = 0;
              setEData({ ...eData, price: value });
            }}
          />
        ) : (
          <p>{row.adjustmentQty}</p>
        ),
      sortable: false
    },
    {
      name: "After Adjustment Qty",
      cell: row =>
        row.product.value === editID ? (
          <TextField
            id="AfterQuantity"
            type="number"
            value={eData.tax}
            hiddenLabel
            variant="outlined"
            onChange={e => {
              let value = parseFloat(e.target.value);
              if (value < 0) value = 0;
              if (value > 100) value = 100;
              setEData({ ...eData, tax: value });
            }}
          />
        ) : (
          <p>{row.afterQty}</p>
        ),
      sortable: false,
      width: "20%"
    },
    {
      name: "Batch# ",
      cell: row => <p>{row.batchNumber}</p>,
      sortable: false
    },
    {
      name: "Expiry Date",
      cell: row => <p>{row?.expiry_date}</p>,
      sortable: false
    }
  ];

  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);

  const { data: locations, isLoading: locationLoading } = useWarehouses(
    debouncedParams,
    true
  );
  const { data: suppliers, isLoading: supplierLoading } = useVendors(
    debouncedParams,
    true
  );

  const { activeBrand } = useBrand();
  const { mutate, isLoading } = useCreateIncreaseAdjustment();

  const increaseAdjustmentHandler = () => {
    if (
      !purchaseOrderBody?.warehouse?.value ||
      !purchaseOrderBody?.supplier?.value ||
      !purchaseOrderBody.reason ||
      !purchaseOrderBody.products ||
      purchaseOrderBody.products.length === 0
    ) {
      const missingFields = [];

      if (!purchaseOrderBody?.warehouse?.value) {
        missingFields.push("Location");
      }
      if (!purchaseOrderBody?.supplier?.value) {
        missingFields.push("Vendor");
      }
      if (!purchaseOrderBody.reason) {
        missingFields.push("Reason");
      }
      if (!purchaseOrderBody.products || purchaseOrderBody.products.length === 0) {
        missingFields.push("Products");
      }

      const errorMessage = `Please fill in the following required fields: ${missingFields.join(
        ", "
      )}`;
      toast.error(errorMessage);
      return;
    }

    const convertedData = {
      brand_id: activeBrand || "",
      vendor_id: purchaseOrderBody.supplier.value || "",
      reason: purchaseOrderBody.reason, // Static value
      warehouse_id: purchaseOrderBody.warehouse?.value || "",
      //eslint-disable-next-line
      products: purchaseOrderBody.products.map((product: any) => ({
        product_id: product.product.value || "",
        sku: product.sku || "",
        quantity: product.adjustmentQty || 0,
        batch_number: product.batchNumber || "",
        expiry_date: product.expiry_date || ""
      }))
    };

    mutate(convertedData);
    refetchProduct();
    setPurchaseOrderBody(prev => ({ ...prev, products: [] }));
  };

  const handleDateChange = (date: string) => {
    const value = date;

    setProduct(pre => ({
      ...pre,
      expiry_date: value
    }));
  };
  const [state, setState] = useState<CustomDatePickerState>({
    selectedDate: null
  });

  return (
    <>
      <Grid container display={"flex"} alignItems={"center"} justifyContent={"flex-end"}>
        <Button
          loading={isLoading}
          disabled={isLoading}
          onClick={increaseAdjustmentHandler}
          icon={<MuiIcon icon="add" />}
          variant="contained"
          text="Save"
        />
      </Grid>
      <Grid
        container
        spacing={1}
        columnSpacing={3}
        mt={1}
        className={classes.formBody}
        alignItems="center"
      >
        <Grid ml={2} lg={3.84} xs={12} sm={8.2} md={8.2} item>
          <div className={matches ? classes.flexAlign : ""}>
            <div className={classes.labelDiv}>
              <p className={classes.label}>Location:</p>
            </div>
            <div className={classes.selectDiv} id="cy_location">
              <Select
                ariaLabel="purchase order location"
                loading={locationLoading}
                disabled={locationLoading}
                options={(locations?.results || []).map(l => ({
                  value: l.id,
                  label: l.name
                }))}
                name="polocation"
                value={purchaseOrderBody?.warehouse}
                onChange={e =>
                  setPurchaseOrderBody({
                    ...purchaseOrderBody,
                    warehouse: e
                  })
                }
              />
            </div>
          </div>
        </Grid>

        <Grid
          ml={2}
          lg={3.78}
          xs={12}
          sm={8.2}
          md={8.2}
          item
          className={classes.tabVendorDiv}
        >
          <div className={matches ? classes.flexAlign : ""}>
            <div className={classes.labelDiv}>
              <p className={classes.label}>Vendor:</p>
            </div>
            <div className={classes.selectDiv}>
              <Select
                disabled={locationLoading}
                loading={supplierLoading}
                id="cy_vendor"
                ariaLabel="supplier"
                options={(suppliers?.results || []).map(s => ({
                  value: s.id,
                  label: s.name
                }))}
                name="supplier"
                value={purchaseOrderBody?.supplier}
                onChange={e => {
                  setPurchaseOrderBody({ ...purchaseOrderBody, supplier: e });
                }}
              />
            </div>
          </div>
        </Grid>

        <Grid ml={2} lg={3.84} xs={12} sm={8.2} md={8.2} item>
          <div className={matches ? classes.flexAlign : ""}>
            <div className={classes.labelDiv}>
              <p className={classes.label}>Reason:</p>
            </div>
            <div className={classes.selectDiv} id="adjustment_reason">
              <TextField
                id="adjustment_reason"
                placeholder="Reason"
                value={purchaseOrderBody.reason}
                hiddenLabel
                type="text"
                variant="outlined"
                onChange={e => {
                  const value = e.target.value;
                  setPurchaseOrderBody(pre => ({
                    ...pre,
                    reason: value.toString() // Convert value to string if it's not already
                  }));
                }}
              />
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid item xs={12} md={8} mt={5} mb={5} display="flex" flexDirection="row" gap={2}>
        <Stack minWidth={180} maxWidth={220}>
          <span style={{ marginBottom: 8 }}>Search Product</span>
          <Select
            loading={isProductLoading}
            ariaLabel="purchase order search product"
            options={products?.map(
              (r: { id_hash: string; id: string; name: string; sku: string }) => ({
                value: r.id_hash,
                label: `${r.name}  (${r.sku})`
              })
            )}
            value={product.product}
            onChange={e => {
              const alreadyAdded = purchaseOrderBody?.products?.find(
                item => item?.product?.value === e?.value && item
              );
              if (alreadyAdded?.product?.value === e?.value) {
                toast.info("Product Alrady Selected");
                return;
              }

              //eslint-disable-next-line
              //@ts-ignore
              setProduct({
                quantity: 0,
                sku: "",
                name: "",
                adjustmentQty: 0,
                afterQty: 0,
                product: { label: "", value: "" },
                expiry_date: "",
                batchNumber: ""
              });
              //eslint-disable-next-line
              const productFound: any = products.find((item: ProductType) => {
                return item.id_hash === e.value;
              });

              setProduct(pre => ({
                ...pre,
                quantity: productFound?.stock_quantity || 0,
                sku: productFound?.sku,
                name: productFound?.name,
                product: { label: productFound?.name, value: productFound?.id_hash }
              }));
            }}
          />
        </Stack>
        <Stack minWidth={60}>
          <span>Stock Quantity</span>
          <TextField
            id="AdjustmentQuantity"
            type="number"
            value={product.quantity || 0}
            hiddenLabel
            variant="outlined"
            disabled
            onChange={e => {
              let value = parseFloat(e.target.value);
              if (value < 0) value = 0;
              setProduct(pre => ({ ...pre, quantity: value }));
            }}
          />
        </Stack>
        <Stack minWidth={60}>
          <span>Adjustment QTY</span>
          <TextField
            id="AdjustmentQty"
            type="number"
            // defaultValue={0}
            value={product.adjustmentQty}
            hiddenLabel
            variant="outlined"
            onChange={e => {
              let value = parseFloat(e.target.value);
              if (value < 0) value = 0;
              setProduct(pre => ({
                ...pre,
                adjustmentQty: value,
                afterQty: value + product.quantity
              }));
            }}
          />
        </Stack>
        <Stack minWidth={60}>
          <span>After Adjustment Qty</span>
          <TextField
            id="AdjustmentAfterQuantity"
            type="number"
            value={product.adjustmentQty + product.quantity || 0}
            hiddenLabel
            variant="outlined"
            disabled
            onChange={e => {
              let value = parseFloat(e.target.value);
              if (value < 0) value = 0;
              setProduct(pre => ({
                ...pre,
                afterQty: product.adjustmentQty + product.quantity
              }));
            }}
          />
        </Stack>
        <Stack minWidth={60}>
          <span>Batch #</span>
          <TextField
            id="AdjustmentQuantity"
            type="text"
            value={product.batchNumber}
            hiddenLabel
            variant="outlined"
            onChange={e => {
              const value = e.target.value;
              setProduct(pre => ({ ...pre, batchNumber: value.toString() }));
            }}
          />
        </Stack>

        <Stack width={"fit-content"}>
          <span>Expiry Date</span>

          <CustomDatePicker
            state={state}
            setState={setState}
            handleDateChanges={(date: string) => handleDateChange(date)}
          />
        </Stack>
        <div className={classes.flex}>
          <Button
            style={{ width: "max-content", marginTop: "20px" }}
            id="Adjustment_cy_add_item"
            text="Add Item"
            icon={<MuiIcon color="action" fontSize="small" icon="add" />}
            type="secondary"
            disabled={
              !(
                product.batchNumber &&
                product.adjustmentQty &&
                product.expiry_date &&
                product?.product?.value
              )
            }
            onClick={() => {
              // Parse the date string with day and month swapped
              const parts = product.expiry_date.split("/");
              const swappedDateString = `${parts[1]}/${parts[0]}/${parts[2]}`;
              const convertedExpiryDate = parse(
                swappedDateString,
                "MM/dd/yyyy",
                new Date()
              );
              const currentDateWithoutTime = startOfDay(new Date());
              if (isBefore(convertedExpiryDate, currentDateWithoutTime)) {
                toast.error(
                  `Invalid Expiry Date ${convertedExpiryDate.getFullYear()}-${
                    convertedExpiryDate.getMonth() + 1
                  }-${convertedExpiryDate.getDate()}`
                );
                return;
              }
              setPurchaseOrderBody(prev => ({
                ...prev,
                products: Array.isArray(prev.products)
                  ? [...prev.products, product]
                  : [product]
              }));
              //eslint-disable-next-line
              //@ts-ignore
              setProduct({
                quantity: 0,
                sku: "",
                name: "",
                adjustmentQty: 0,
                afterQty: 0,
                batchNumber: "",
                expiry_date: "",
                product: { label: "", value: "" }
              });
              setState({ selectedDate: null });
            }}
          />
        </div>
      </Grid>
      <DataTable hideNoData={true} columns={columns} data={purchaseOrderBody.products} />
    </>
  );
};
export default IncreaseStock;
