import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "Components/Button";
import Select from "Components/Form/Select";
import TextInput from "Components/Form/TextInput";
import { NavBar } from "Components/Navbar";
import { usePurchaseOrder } from "Components/PurchaseOrders/CreatePurchaseOrder/PurchaseOrderEditTable";
// import StockTransferTable from "Components/StockTransfer/StockTransferTable";
import Layout from "Components/layout";
import { useBrand } from "Context/BrandContext";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import { useBrandByUserId } from "Hooks/useBrands";
import { useDebounce } from "Hooks/useDebounce";
import { useWebsites } from "Hooks/usePatients";
import {
  useCreateStockTransfer,
  useExpiryAndBatchListToBrand,
  // useStockTransferHistory,
  useToBrandProducts,
  useToVendors,
  useWareHouseToBrand
} from "Hooks/useStockTransfer";
import { getAllWebsitesWithoutAll } from "Utils/states";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      color: theme.palette.gray[500]
    },
    websiteInnerContainer: {
      marginTop: "20px"
    }
  })
);
const StockTransfer = () => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const classes = useStyles();

  // const { data: stockTransferHistory, isLoading: stockTransferHistoryLoading } =
  //   useStockTransferHistory(debouncedParams);

  const { data: brands, isLoading } = useBrandByUserId();
  const { products } = usePurchaseOrder();

  const [toProduct, setToProduct] = React.useState<{
    label: string;
    value: string;
    quantity: string;
    sku: string;
    batchNumber?: string;
    expiry_date?: string;
    adjustmentQty?: string;
    expiryAndBatch?: { label: string; value: string };
  }>({
    label: "Select",
    value: "",
    quantity: "",
    sku: "",
    batchNumber: "",
    expiry_date: "",
    adjustmentQty: "",
    expiryAndBatch: { label: "", value: "" }
  });

  const [product, setProduct] = React.useState<{
    label: string;
    value: string;
    quantity: string;
    sku: string;
    expiry_date: string;
    batchNumber: string;
    expiryAndBatch: {
      label: string;
      value: string;
    };
  }>({
    label: "Select",
    value: "",
    quantity: "",
    sku: "",
    expiry_date: "",
    batchNumber: "",
    expiryAndBatch: {
      label: "Select",
      value: ""
    }
  });

  const [quantity, setQuantity] = React.useState<string>("0");

  const { activeBrand } = useBrand();

  const [toBrand, setToBrand] = useState<{ label: string; value: string }>({
    label: "Select",
    value: ""
  });

  const { data: toBrandProducts, isLoading: toBrandProductLoading } = useToBrandProducts(
    toBrand.value
  );
  const [websiteID, setWebsiteID] = React.useState<{ label: string; value: string }>({
    label: "Select",
    value: ""
  });

  const { mutate, isLoading: stockTransferLoading } = useCreateStockTransfer();

  const { data, isLoading: websiteLoading } = useWebsites();
  const { data: vendors, isLoading: vendorLoading } = useToVendors(
    debouncedParams,
    true,
    toBrand?.value
  );
  const [vendor, setVendor] = React.useState<{ label: string; value: string }>({
    label: "Select",
    value: ""
  });
  const [warehouse, setWarehouse] = React.useState<{ label: string; value: string }>({
    label: "Select",
    value: ""
  });

  const { data: expiryAndBatch, isLoading: expiryLoading } = useExpiryAndBatchListToBrand(
    product?.value
  );

  const { data: locations, isLoading: locationLoding } = useWareHouseToBrand(
    toBrand?.value
  );
  const [isValid, setIsValid] = React.useState<string>("");

  const transferHandler = () => {
    const obj: {
      to_brand_id: string;
      from_brand_id: string;
      to_product_id: string;
      from_product_id: string;
      quantity: string;
      warehouse_id: string;
      vendor_id: string;
      website_id: string;
      expiry_date: string;
      batch_number: string;
      stock_transfer: boolean;
    } = {
      from_brand_id: activeBrand,
      from_product_id: product.value,
      batch_number: product.batchNumber,
      quantity: quantity,
      website_id: websiteID.value ? websiteID.value : "",
      to_brand_id: toBrand.value,
      to_product_id: toProduct.value,
      expiry_date: product?.expiry_date,
      vendor_id: vendor.value,
      warehouse_id: warehouse.value,
      stock_transfer: true
    };

    // Check for empty, null, or undefined values in the object
    const invalidField = Object.keys(obj).find(key => {
      const value = obj[key as keyof typeof obj];
      return (
        value === "" ||
        value === null ||
        value === undefined ||
        (key === "quantity" && +value === 0)
      );
    });

    if (invalidField) {
      let modifiedInvalidFields = invalidField.split("_").join(" ");
      if (modifiedInvalidFields.includes("id")) {
        // Remove the word "id" from modifiedInvalidFields
        modifiedInvalidFields = modifiedInvalidFields.replace(/\bid\b/g, "");
      }
      // Trim any extra spaces that might result from removing "id"
      modifiedInvalidFields = modifiedInvalidFields.trim();
      setIsValid(modifiedInvalidFields);
      toast.error(`${modifiedInvalidFields} fields are required!`);
    } else {
      mutate(obj);

      setIsValid("");
      setQuantity("0");
      setToProduct({
        value: "",
        label: "",
        quantity: "",
        sku: ""
      });
      setProduct(pre => ({
        ...pre,
        label: "Select",
        value: "",
        quantity: "",
        sku: "",
        batchNumber: "",
        expiry_date: "",
        adjustmentQty: "",
        expiryAndBatch: {
          label: "Select",
          value: ""
        }
      }));
      setVendor({ label: "Select", value: "" });
      setWarehouse({ label: "Select", value: "" });
      setToBrand({ label: "Select", value: "" });
      setWebsiteID({ label: "Select", value: "" });
    }
  };

  const handleBrandChange = (selectedBrand: { label: string; value: string }) => {
    setIsValid("");
    resetToProduct(); // Reset product state
    setVendor({ label: "Select", value: "" });
    setWarehouse({ label: "Select", value: "" });

    const productFound = findProductBySku(selectedBrand.value);
    if (productFound) {
      setToProduct({
        label: productFound.name,
        value: productFound.id_hash,
        quantity: String(productFound.quantity),
        sku: productFound.sku
      });
    }
    setToBrand(selectedBrand);
  };

  // Function to reset ToProduct state
  const resetToProduct = () => {
    setToProduct({
      label: "Select",
      value: "",
      quantity: "",
      sku: "",
      batchNumber: "",
      expiry_date: "",
      adjustmentQty: "",
      expiryAndBatch: { label: "Select", value: "" }
    });
  };

  // Function to find product by SKU
  const findProductBySku = (sku: string) => {
    return toBrandProducts?.results.find(item => item.sku === sku);
  };

  return (
    <Layout title="Stock Transfer">
      <NavBar pageTitle="Stock Transfer"></NavBar>
      <Grid
        container
        item
        lg={12}
        direction="row"
        pt={1}
        style={{ width: "100%" }}
        alignItems={"center"}
        justifyContent="center"
      >
        {/* left */}
        <Grid
          container
          bgcolor="#f1f5f9"
          padding={2}
          item
          lg={5}
          md={12}
          sm={12}
          style={{
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adjust the values according to your preference
            borderRadius: "8px", // Optional: Add border radius for a rounded look
            height: "50%"
          }}
        >
          <h3>From</h3>

          <Grid item lg={12} xs={12} mt={1}>
            <Stack mt={3}>
              <span style={{ marginBottom: 8 }}>Product:</span>
              <Select
                ariaLabel="purchase order search product"
                options={products
                  ?.filter(
                    (r: { stock_quantity: string }) => parseInt(r.stock_quantity, 10) > 0
                  )
                  .map(
                    (r: {
                      id_hash: string;
                      name: string;
                      sku: string;
                      stock_quantity: string;
                    }) => ({
                      value: r.id_hash,
                      label: `${r.name}  (${r.sku})`,
                      quantity: r.stock_quantity,
                      sku: r.sku
                    })
                  )}
                error={isValid.includes("from product")}
                value={{ label: product.label, value: product.value }}
                onChange={e => {
                  setIsValid("");
                  setProduct(pre => ({
                    ...pre,
                    quantity: "",
                    batchNumber: "",
                    expiry_date: "",
                    adjustmentQty: "",
                    expiryAndBatch: {
                      label: "Select",
                      value: ""
                    }
                  }));
                  setProduct(pre => ({
                    ...pre,
                    value: e.value,
                    label: e.label,
                    sku: e.sku,
                    quantity: e.quantity
                  }));
                }}
              />
            </Stack>
          </Grid>

          <Grid item lg={12} xs={12} mt={1}>
            <Stack>
              <span style={{ marginBottom: 8 }}>Batch | Expiry | Qty</span>
              <Select
                error={isValid.includes("expiry date")}
                loading={expiryLoading}
                disabled={!product.value}
                ariaLabel="purchase order search product"
                options={expiryAndBatch?.map(
                  (r: {
                    id: string;
                    expiry_date: string;
                    batch_number: string;
                    received_quantity: string;
                  }) => ({
                    label:
                      r.batch_number +
                      " | " +
                      r.expiry_date +
                      " | " +
                      r.received_quantity,
                    value: r.id
                  })
                )}
                onChange={(value: { value: string }) => {
                  setIsValid("");
                  const batchExpiryFound = expiryAndBatch?.find(
                    (item: { id: string; valaue: string }) =>
                      item.id === value.value && item
                  );
                  setQuantity("0");
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
                value={{
                  label: product?.expiryAndBatch?.label,
                  value: product?.expiryAndBatch?.value
                }}
              />
            </Stack>
          </Grid>
          <Grid item lg={12} xs={12} mt={1}>
            <div className={classes.websiteInnerContainer}>
              <label className={classes.label}>{`Quantity To Move ${
                +product.quantity > 0 && product?.expiry_date
                  ? `(Available Stock ${product.quantity}):`
                  : ":"
              }`}</label>

              <TextInput
                inputProps={{ "aria-label": "order number" }}
                name="order_number"
                value={quantity}
                onChange={e => {
                  setIsValid("");
                  const inputNumber = parseInt(e.target.value, 10);
                  if (
                    !isNaN(inputNumber) &&
                    inputNumber >= 0 &&
                    inputNumber <= +product.quantity
                  ) {
                    setQuantity(inputNumber.toString());
                  }
                }}
                error={isValid.includes("quantity")}
                disabled={product.quantity == "0" || !product?.expiry_date}
                margin="dense"
                variant="outlined"
                type="number"
              />
            </div>
          </Grid>
          <Grid item lg={12} xs={4} mt={1}>
            <div>
              {/* <label className={classes.label}>Website:</label> */}
              <p>Website:</p>
              <Grid sm={10} md={10} lg={12} item>
                <div>
                  <Select
                    error={isValid.includes("website")}
                    loading={isLoading || websiteLoading}
                    name="websites"
                    value={{ label: websiteID.label, value: websiteID.value }}
                    options={getAllWebsitesWithoutAll(data?.results ? data?.results : [])}
                    onChange={value => {
                      setIsValid("");
                      setWebsiteID({ label: value.label, value: value.id });
                    }}
                  />
                </div>
              </Grid>
            </div>
          </Grid>
        </Grid>
        {/* middle */}
        <Grid
          item
          lg={1}
          md={12}
          sm={12}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          style={{ height: "50%" }}
        >
          <ExitToAppIcon />
        </Grid>

        {/* right */}
        <Grid
          item
          lg={5}
          md={12}
          sm={12}
          container
          bgcolor="#f1f5f9"
          padding={2}
          style={{
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            height: "100%"
          }}
        >
          <h3>To</h3>

          <Grid item lg={12} xs={12}>
            <div>
              <div>
                <p>To Brand:</p>
              </div>
              <Select
                error={isValid.includes("to brand")}
                loading={isLoading}
                defaultValue={{ value: "", label: "Select" }}
                ariaLabel="purchase order location"
                value={{ label: toBrand.label || "", value: toBrand.value || "" }}
                options={
                  brands
                    ? brands
                        .filter(item => item.id !== activeBrand)
                        .map(item => ({ label: item.name, value: item.id }))
                    : []
                }
                name="polocation"
                onChange={handleBrandChange}
              />
            </div>
          </Grid>
          <Grid item lg={12} xs={12}>
            <Stack mt={3}>
              <span style={{ marginBottom: 8 }}>To Product:</span>
              <Select
                error={isValid.includes("to product")}
                disabled={!toBrand.value}
                loading={toBrandProductLoading}
                ariaLabel="purchase order search product"
                options={
                  toBrandProducts?.results
                    ? toBrandProducts?.results.map(
                        (r: { id_hash: string; name: string; sku: string }) => ({
                          value: r.id_hash,
                          label: `${r.name}  (${r.sku})`
                        })
                      )
                    : []
                }
                value={{ label: toProduct.label, value: toProduct.value }}
                onChange={e => {
                  setIsValid("");
                  setToProduct({
                    value: e.value,
                    label: e.label,
                    quantity: e.quantity,
                    sku: e.sku
                  });
                }}
              />
            </Stack>
          </Grid>

          <Grid item lg={12} xs={12}>
            <Stack mt={3}>
              <span style={{ marginBottom: 8 }}>Vendor</span>
              <Select
                error={isValid.includes("vendor")}
                disabled={!toBrand.value}
                ariaLabel="vendor"
                options={
                  vendors?.results
                    ? vendors?.results.map(s => ({
                        value: s.id,
                        label: s.name
                      }))
                    : []
                }
                name="vendor"
                value={vendor}
                onChange={e => {
                  setIsValid("");
                  setVendor({ value: e.value, label: e.label });
                }}
                loading={vendorLoading}
              />
            </Stack>
          </Grid>
          <Grid item lg={12} xs={12}>
            <Stack mt={3}>
              <span style={{ marginBottom: 8 }}>Warehouse</span>
              <Select
                error={isValid.includes("warehouse")}
                disabled={!toBrand.value}
                ariaLabel="purchase order location"
                loading={locationLoding}
                options={
                  locations?.results
                    ? locations?.results.map(l => ({
                        value: l.id,
                        label: l.name
                      }))
                    : []
                }
                name="polocation"
                value={{ label: warehouse.label, value: warehouse.value }}
                onChange={e => {
                  setIsValid("");
                  setWarehouse({
                    label: e.label,
                    value: e.value
                  });
                }}
              />
            </Stack>
          </Grid>
        </Grid>
        <Grid mt={5}>
          <Button
            loading={stockTransferLoading}
            text="Transfer"
            type="primary"
            style={{
              color: "white",
              background: "#FF173D",
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
              fontWeight: "500",
              borderRadius: "6px",
              width: "200px",
              height: "40px"
            }}
            onClick={transferHandler}
          />
        </Grid>
      </Grid>
      {/* <StockTransferTable
        stockTransfer={stockTransferHistory}
        isLoading={stockTransferHistoryLoading}
      /> */}
    </Layout>
  );
};
export default StockTransfer;
