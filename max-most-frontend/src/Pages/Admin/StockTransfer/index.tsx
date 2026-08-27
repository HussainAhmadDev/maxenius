import React, { useReducer, useMemo } from "react";
import {
  Card,
  Grid,
  Divider,
  Typography,
  Stack,
  CardContent,
  CardActions
} from "@mui/material";
import SelectField from "../../../Components/SelectField";
import Input from "../../../Components/Input";
import PageTitle from "../../../Components/PageTitle";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../../../Hooks/useProducts";
import {
  useToBrandProducts,
  useToVendors,
  useExpiryAndBatchListToBrand,
  useWareHouseToBrand,
  useCreateStockTransfer
} from "../../../Hooks/useStockTransfer";
import { initialState, reducer } from "./stockTransferReducer";
import { toast } from "react-toastify";
import { getBrandId } from "../../../Hooks/api";
import { useDebounce } from "../../../Hooks/useDebounce";
import { useWebsites } from "../../../Hooks/usePatients";
import { getAllWebsitesWithoutAll } from "../../../Utils/global";
import {
  InventoryItem,
  TransferbodyResponse
} from "../../../Interfaces/stockTransferType";
import LoadingButton from "../../../Components/LoadingButton";
import { useBrandContext } from "../../../Contexts/brandContext";

const StockTransfer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { brands, brandLoading: brandsLoading } = useBrandContext();
  const { data: products, isLoading: productsLoading } = useProducts();
  const activeBrand = getBrandId()?.brand_id;
  const { data: toBrandProducts, isLoading: toBrandProductLoading } = useToBrandProducts(
    state?.toBrand
  );
  const { data: websites, isLoading: websiteLoading } = useWebsites();

  const { data: vendors, isLoading: vendorLoading } = useToVendors(
    debouncedParams,
    true,
    state?.toBrand ?? undefined
  );
  const { data: expiryAndBatch, isLoading: expiryLoading } = useExpiryAndBatchListToBrand(
    state?.fromProduct
  );

  const { data: locations, isLoading: locationLoading } = useWareHouseToBrand(
    state.toBrand ?? undefined
  );
  const { mutate, isLoading: stockTransferLoading } = useCreateStockTransfer();

  const productsOptions = useMemo(() => {
    if (products?.results?.length) {
      return products?.results?.map(el => ({
        label: `${el.name}${el.barcode ? ` (${el.barcode})` : ""}`,
        value: el.id_hash
      }));
    } else {
      return [];
    }
  }, [products]);

  const handleTransfer = () => {
    const bactchFounded = expiryAndBatch?.find(
      (item: InventoryItem) => item.id && state.fromBatch
    );

    const obj = {
      to_brand_id: state.toBrand,
      from_brand_id: activeBrand,
      to_product_id: state.toProduct,
      from_product_id: state.fromProduct,
      quantity: state.fromQuantity,
      warehouse_id: state.toWarehouse,
      vendor_id: state.toVendor,
      website_id: state.fromWebsite,
      expiry_date: bactchFounded ? bactchFounded?.expiry_date : "",
      batch_number: bactchFounded ? bactchFounded?.batch_number : "",
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
        modifiedInvalidFields = modifiedInvalidFields.replace(/\bid\b/g, "");
      }
      modifiedInvalidFields = modifiedInvalidFields.trim();
      toast.error(`${modifiedInvalidFields} fields are required!`);
    } else {
      mutate(obj as TransferbodyResponse);
      dispatch({ type: "RESET_ALL" });
    }
  };

  const handleBrandChange = (selectedBrand: { label: string; value: string }) => {
    dispatch({ type: "SET_TO_BRAND", payload: selectedBrand.value });
    dispatch({ type: "RESET_TO_PRODUCT" });
  };

  return (
    <>
      <PageTitle icon="/assets/icons/stock-transfer-icon.svg" title="Stock Transfer" />
      <Card>
        <Grid container p={1}>
          <Grid item xs={5.5}>
            <Stack direction={"row"} justifyContent={"center"} flex={1}>
              <Typography fontSize={"18px"} fontWeight={"bold"}>
                From
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={1}>
            <Stack direction={"row"} justifyContent={"center"} flex={1}>
              <img src="/assets/icons/Transfer.svg" alt="" />
            </Stack>
          </Grid>
          <Grid item xs={5.5}>
            <Stack direction={"row"} justifyContent={"center"} flex={1}>
              <Typography fontSize={"18px"} fontWeight={"bold"}>
                To
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Divider />
        <CardContent>
          <Grid container px={1}>
            <Grid item xs={12} sm={5.5}>
              <Grid container>
                <Grid item xs={12}>
                  <SelectField
                    options={productsOptions}
                    label="Product"
                    loading={productsLoading}
                    value={state?.fromProduct ?? undefined}
                    name="from_product"
                    handleSelect={opt => {
                      dispatch({ type: "SET_FROM_PRODUCT", payload: opt.value });
                    }}
                    id="cy__StockTransferProduct"
                  />
                </Grid>
                <Grid item xs={12} mt={3}>
                  <SelectField
                    options={
                      expiryAndBatch
                        ? expiryAndBatch?.map(
                            (
                              r: Pick<
                                InventoryItem,
                                | "batch_number"
                                | "expiry_date"
                                | "received_quantity"
                                | "id"
                              >
                            ) => ({
                              label:
                                r.batch_number +
                                " | " +
                                r.expiry_date +
                                " | " +
                                r.received_quantity,
                              value: r.id.toString() // Convert to string
                            })
                          )
                        : []
                    }
                    loading={expiryLoading}
                    value={state?.fromBatch ?? undefined}
                    label="Batch | Expiry | Qty"
                    name="batch"
                    disable={!state.fromProduct}
                    handleSelect={opt => {
                      dispatch({ type: "SET_FROM_BATCH", payload: opt.value });
                    }}
                    id="cy__StockTransferBatch"
                  />
                </Grid>
                <Grid item xs={12} mt={3}>
                  <Typography>Quantity to Move:</Typography>
                  <Input
                    type="number"
                    name="quantity"
                    value={state.fromQuantity}
                    handleChange={({ value }) => {
                      const bactchFound = expiryAndBatch?.find(
                        (item: InventoryItem) =>
                          Number(item?.id) === Number(state?.fromBatch)
                      );

                      const inputNumber = parseInt(value?.toString(), 10);

                      if (
                        inputNumber >= 0 &&
                        inputNumber <= Number(bactchFound?.received_quantity)
                      ) {
                        dispatch({ type: "SET_FROM_QUANTITY", payload: value as string });
                      }
                    }}
                    disabled={!state?.fromBatch}
                    id="cy__StockTransferQty"
                  />
                </Grid>
                <Grid item xs={12} mt={3}>
                  <SelectField
                    options={getAllWebsitesWithoutAll(
                      websites?.results ? websites?.results : []
                    )}
                    label="Website"
                    name="website"
                    loading={websiteLoading}
                    handleSelect={opt => {
                      dispatch({ type: "SET_FROM_WEBSITE", payload: opt.value });
                    }}
                    value={state?.fromWebsite ?? undefined}
                    id="cy__StockTransferWebsite"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={1} />
            <Grid item xs={12} sm={5.5}>
              <Grid container>
                <Grid item xs={12}>
                  <SelectField
                    options={
                      brands
                        ? brands
                            .filter(item => item.id !== activeBrand)
                            .map(item => ({ label: item.name, value: item.id }))
                        : []
                    }
                    label="To Brand"
                    name="to_brand"
                    handleSelect={opt => handleBrandChange(opt)}
                    value={state?.toBrand ?? undefined}
                    loading={brandsLoading}
                    id="cy__StockTransferToBrand"
                  />
                </Grid>
                <Grid item xs={12} mt={3}>
                  <SelectField
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
                    loading={toBrandProductLoading}
                    label="To Product"
                    name="to_product"
                    handleSelect={opt => {
                      dispatch({ type: "SET_TO_PRODUCT", payload: opt.value });
                    }}
                    disable={!state.toBrand}
                    value={state?.toProduct ?? undefined}
                    id="cy__StockTransferToProduct"
                  />
                </Grid>
                <Grid item xs={12} mt={3}>
                  <SelectField
                    options={
                      vendors?.results
                        ? vendors?.results.map(s => ({
                            value: s.id,
                            label: s.name
                          }))
                        : []
                    }
                    label="Vendor"
                    name="vendor"
                    loading={vendorLoading}
                    handleSelect={opt => {
                      dispatch({ type: "SET_TO_VENDOR", payload: opt.value });
                    }}
                    value={state.toVendor ?? undefined}
                    disable={!state.toBrand}
                    id="cy__StockTransferVendor"
                  />
                </Grid>
                <Grid item xs={12} mt={3}>
                  <SelectField
                    options={
                      locations?.results
                        ? locations?.results.map(l => ({
                            value: l.id,
                            label: l.name
                          }))
                        : []
                    }
                    disable={!state.toBrand}
                    loading={locationLoading}
                    label="Warehouse"
                    name="warehouse"
                    handleSelect={opt => {
                      dispatch({ type: "SET_TO_WAREHOUSE", payload: opt.value });
                    }}
                    value={state.toWarehouse ?? undefined}
                    id="cy__StockTransferWarehouse"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions sx={{ p: 2, justifyContent: "end" }}>
          <LoadingButton
            variant="contained"
            onClick={handleTransfer}
            loading={stockTransferLoading}
            id="cy__TransferBtn"
          >
            Transfer
          </LoadingButton>
        </CardActions>
      </Card>
    </>
  );
};

export default StockTransfer;
