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
import { useMediaQuery } from "@mui/material";
import { useCreateDescreaseAdjustment, useExpiryAndBatchList } from "Hooks/useAdjustment";
import { useBrand } from "Context/BrandContext";
import { toast } from "react-toastify";
import { getAllWebsitesWithoutAll } from "Utils/states";
import { useWebsites } from "Hooks/usePatients";

type ProductType = {
  product: {
    label: string;
    value: string;
  };
  expiryAndBatch: {
    label: string;
    value: string;
  };
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
const DecreaseStock = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  //eslint-disable-next-line
  const [eData, setEData] = React.useState({} as any);
  const [editID] = React.useState("" as string);

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

  const { activeBrand: brand_id } = useBrand();

  const {
    data: expiryAndBatch,
    isLoading: expiryLoading,
    refetch: reftechBatchAndExpiry
  } = useExpiryAndBatchList(product?.product?.value, brand_id);

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
      name: "Batch",
      cell: row => (
        <p className={classes.redField}>{row.expiryAndBatch.label.split(" | ")[0]}</p>
      ),
      sortable: false
    },
    {
      name: "Expiry Date",
      cell: row => (
        <p className={classes.redField}>{row.expiryAndBatch.label.split(" | ")[1]}</p>
      ),
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
      name: "Less Quantity",
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
          <p>{row.quantity - row.adjustmentQty}</p>
        ),
      sortable: false,
      width: "20%"
    }
  ];

  const { activeBrand } = useBrand();
  const { mutate, isLoading: descreasePostingLoading } = useCreateDescreaseAdjustment();
  const [websiteID, setWebsiteID] = React.useState<string>();

  const increaseAdjustmentHandler = () => {
    if (
      !purchaseOrderBody.products ||
      !purchaseOrderBody.reason ||
      purchaseOrderBody.products.length === 0 ||
      !websiteID
    ) {
      const missingFields = [];
      if (!purchaseOrderBody.products || purchaseOrderBody.products.length === 0) {
        missingFields.push("Products");
      }
      if (!purchaseOrderBody.reason) {
        missingFields.push("Reason");
      }
      if (!websiteID) {
        missingFields.push("website ID");
      }

      const errorMessage = `Please fill in the following required fields: ${missingFields.join(
        ", "
      )}`;
      toast.error(errorMessage);
      return;
    }

    const convertedData = {
      brand_id: activeBrand || "",
      reason: purchaseOrderBody.reason, // Static value
      website_id: websiteID,
      //eslint-disable-next-line
      products: purchaseOrderBody.products.map((product: any) => ({
        product_id: product.product.value || "",
        sku: product.sku || "",
        quantity: product.adjustmentQty || 0,
        batch_number: product.expiryAndBatch.label.split(" | ")[0],
        expiry_date: product.expiryAndBatch.label.split(" | ")[1]
      }))
    };

    mutate(convertedData);
    refetchProduct();
    reftechBatchAndExpiry();
    setPurchaseOrderBody(prev => ({ ...prev, products: [] }));
  };
  const { data, isLoading } = useWebsites();

  return (
    <>
      <Grid container display={"flex"} alignItems={"center"} justifyContent={"flex-end"}>
        <Button
          loading={descreasePostingLoading}
          disabled={descreasePostingLoading}
          onClick={increaseAdjustmentHandler}
          icon={<MuiIcon icon="add" />}
          variant="contained"
          text="Save"
        />
      </Grid>
      <Grid
        container
        gap={3}
        className={classes.formBody}
        alignItems="center"
        justifyContent={"flex-start"}
      >
        <Grid item lg={3.7} sm={12} md={12}>
          <Grid item container direction="row" alignItems="center">
            <Grid item sm={1.9} md={1.9} lg={3}>
              <div>
                <label className={classes.label}>Website:</label>
              </div>
            </Grid>
            <Grid item sm={10.1} md={10.1} lg={9}>
              <div>
                <Select
                  loading={isLoading}
                  name="websites"
                  options={getAllWebsitesWithoutAll(data?.results ? data?.results : [])}
                  onChange={value => setWebsiteID(value.id)}
                />
              </div>
            </Grid>
          </Grid>
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
        <Stack minWidth={200} maxWidth={250}>
          <span style={{ marginBottom: 8 }}>Search Product</span>
          <Select
            loading={isProductLoading}
            ariaLabel="purchase order search product"
            options={products
              ?.filter(
                (r: {
                  id_hash: string;
                  id: string;
                  name: string;
                  sku: string;
                  stock_quantity: number;
                }) => r.stock_quantity > 0
              )
              .map(
                (r: {
                  id_hash: string;
                  id: string;
                  name: string;
                  sku: string;
                  stock_quantity: number;
                }) => ({
                  value: r.id_hash,
                  label: `${r.name}  (${r.sku})`
                })
              )}
            value={product.product}
            onChange={e => {
              //eslint-disable-next-line
              const productFound: any = products.find((item: ProductType) => {
                return item.id_hash === e.value;
              });
              setProduct(pre => ({
                ...pre,
                quantity: 0,
                sku: productFound?.sku,
                name: productFound?.name,
                product: { label: productFound?.name, value: productFound?.id_hash },
                expiryAndBatch: { label: "", value: "" }
              }));
            }}
          />
        </Stack>

        <Stack minWidth={200} maxWidth={250}>
          <span style={{ marginBottom: 8 }}>Batch | Expiry | Qty</span>
          <Select
            loading={expiryLoading}
            ariaLabel="purchase order search product"
            options={expiryAndBatch?.map(
              (r: {
                id: string;
                expiry_date: string;
                batch_number: string;
                received_quantity: string;
              }) => ({
                label:
                  r.batch_number + " | " + r.expiry_date + " | " + r.received_quantity,
                value: r.id
              })
            )}
            value={product.expiryAndBatch}
            //eslint-disable-next-line
            onChange={(value: { value: string }) => {
              const batchExpiryFound = expiryAndBatch?.find(
                (item: { id: string; valaue: string }) => item.id === value.value && item
              );

              setProduct(pre => ({
                ...pre,
                quantity: batchExpiryFound?.received_quantity || 0,
                batchNumber: batchExpiryFound?.batch_number,
                expiry_date: batchExpiryFound?.expiry_date,
                adjustmentQty: 0,
                expiryAndBatch: {
                  label:
                    batchExpiryFound.batch_number +
                    " | " +
                    batchExpiryFound.expiry_date +
                    " | " +
                    batchExpiryFound.received_quantity,
                  value: batchExpiryFound.id
                }
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
          <span>Less Quantity</span>
          <TextField
            id="AdjustmentQty"
            type="number"
            // defaultValue={0}
            value={product.adjustmentQty}
            hiddenLabel
            variant="outlined"
            disabled={!product.product ? true : false}
            onChange={e => {
              let value = parseFloat(e.target.value);
              // if (value < 0) value = 0;
              if (value < 0) value = 0;
              if (value >= product.quantity) value = product.quantity;
              // Update the adjustmentQty and calculate the afterQty

              setProduct(pre => ({
                ...pre,
                adjustmentQty: value,
                afterQty: pre.quantity - value
              }));
            }}
          />
        </Stack>
        <Stack minWidth={60}>
          <span>After Adjustment Qty</span>
          <TextField
            id="AdjustmentAfterQuantity"
            type="number"
            value={product.quantity - (product.adjustmentQty || 0)} // Calculate the afterQty based on adjustmentQty and quantity
            hiddenLabel
            variant="outlined"
            disabled
          />
        </Stack>

        <div className={classes.flex}>
          <Button
            style={{ width: "max-content", marginTop: "20px" }}
            id="Adjustment_cy_add_item"
            text="Add Item"
            icon={<MuiIcon color="action" fontSize="small" icon="add" />}
            type="secondary"
            disabled={!(product.adjustmentQty && product.product.value)}
            onClick={() => {
              const { products } = purchaseOrderBody; // Assuming you have access to the current state

              // Check if a product with matching label and value already exists
              const productExists = products?.some(existingProduct => {
                return (
                  existingProduct?.expiryAndBatch?.label ===
                    product.expiryAndBatch.label &&
                  existingProduct.product.value === product.product.value
                );
              });

              if (!productExists || !purchaseOrderBody.products) {
                setPurchaseOrderBody(prev => ({
                  ...prev,
                  products: Array.isArray(prev.products)
                    ? [...prev.products, product]
                    : [product]
                }));
              } else {
                toast.info("Product already Added!");
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
                expiryAndBatch: { label: "", value: "" }
              });
            }}
          />
        </div>
      </Grid>
      <DataTable hideNoData={true} columns={columns} data={purchaseOrderBody.products} />
    </>
  );
};
export default DecreaseStock;
