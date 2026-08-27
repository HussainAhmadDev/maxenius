import * as React from "react";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Button from "../Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import Select from "Components/Form/Select";
import Radio from "@material-ui/core/Radio";
import Typography from "@material-ui/core/Typography";
import { useSearchParams } from "react-router-dom";
import { orderParamGeneralKeys } from "Utils/queryParamKeys";
import { useWarehouses } from "Hooks/useWarehouses";
import { useVendors } from "Hooks/useVendors";
import { useDebounce } from "Hooks/useDebounce";
import { toast } from "react-toastify";

import { TextField } from "@material-ui/core";
import { usePurchaseOrder } from "./CreatePurchaseOrder/PurchaseOrderEditTable";
import { Product } from "./CreatePurchaseOrder/data";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      justifyContent: "space-between",
      display: "flex"
    },
    heading: {
      fontSize: "21px"
    },
    DateTextField: {
      paddingLeft: "3px"
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
    flexAlign: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center"
    },
    smallText: {
      fontSize: "12px"
    },
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    w100: {
      width: "100%"
    },
    labelDiv: {
      minWidth: "12.8%"
    },
    selectDiv: {
      width: "43%"
    },
    flexContainer: {
      display: "flex",
      alignItems: "center"
    },
    checkboxContainerSmall: {
      display: "flex",
      flexDirection: "column"
    },
    checkedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.primary.main}`,
      marginRight: "5px",
      padding: "0px 13px",
      marginBottom: 4
    },
    unCheckedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.gray[300]}`,
      marginRight: "5px",
      padding: "0px 13px",
      color: theme.palette.gray[400],
      marginBottom: 4
    },
    pointer: {
      cursor: "pointer"
    },
    radioButton: {
      padding: "7px"
    }
  })
);
interface Props {
  readonly header?: boolean;
}

interface IPOFilters {
  status: string;
  warehouseID: string;
  vendorID: string;
}

const queryParamsKeys = [...orderParamGeneralKeys];

const PurchaseOrderFilters: React.FC<Props> = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const [showFilters, setShowFilters] = React.useState<boolean>(true);
  const [selectedValue, setSelectedValue] = React.useState<string>();

  const [searchParams, setSearchParams] = useSearchParams();

  const debouncedParams = useDebounce(searchParams, 800);

  const { data: locations, isLoading: locationLoading } = useWarehouses(
    debouncedParams,
    true
  );
  const { data: suppliers, isLoading: supplierLoading } = useVendors(
    debouncedParams,
    true
  );

  const [locationVal, setLocationVal] = React.useState({
    label: "Select",
    value: ""
  });
  const [vendorVal, setVendorVal] = React.useState({
    label: "Select",
    value: ""
  });

  const { products } = usePurchaseOrder();
  const [product, setProduct] = React.useState<{
    value: string;
    label: string;
  }>({
    label: "Select",
    value: ""
  });
  const purchaseOrderFilterString = localStorage.getItem("purchaseOrderFilter");

  const productID = React.useRef(searchParams.get("product_id"));
  React.useEffect(() => {
    if (purchaseOrderFilterString) {
      try {
        const purchaseOrderFilter = JSON.parse(purchaseOrderFilterString);

        if (purchaseOrderFilter?.product_id || productID?.current) {
          // eslint-disable-next-line
          const productFound: Product | any = products.find(
            ({ id_hash, sku, name }: { id_hash: string; sku: string; name: string }) =>
              id_hash == (purchaseOrderFilter.product_id || productID.current) && {
                id_hash: id_hash,
                name: name,
                sku: sku
              }
          );

          if (productFound) {
            productFound?.id_hash &&
              persistDataToParmas("product_id", productFound?.id_hash);
            setProduct({
              label: `(${productFound?.name}) (${productFound?.sku})`,
              value: productFound?.id_hash
            });
          }
        }
        if (purchaseOrderFilter.warehouseID) {
          const locationSave = locations?.results.find(
            item => item.id === purchaseOrderFilter.warehouseID
          );

          locationSave?.id && persistDataToParmas("warehouseID", locationSave?.id);
          setLocationVal({
            label: locationSave?.name ? locationSave?.name : "Select",
            value: locationSave?.id ? locationSave?.id : ""
          });
        }

        if (purchaseOrderFilter.vendorID) {
          const savedVendor = suppliers?.results.find(
            item => item.id === purchaseOrderFilter.vendorID
          );

          savedVendor?.id && persistDataToParmas("vendorID", savedVendor?.id);

          setVendorVal({
            label: savedVendor?.name ? savedVendor?.name : "Select",
            value: savedVendor?.id ? savedVendor?.id : ""
          });
        }

        if (purchaseOrderFilter.status) {
          setSelectedValue(purchaseOrderFilter.status);
        }
      } catch (error) {
        toast.error("Error parsing purchaseOrderFilter");
      }
    }
    //eslint-disable-next-line
  }, [locations, suppliers, productID.current, products]);

  const persistDataToParmas = async (key: string, value: string) => {
    const newParams = await new URLSearchParams(searchParams);
    await newParams.set(key, value);
    await setSearchParams(newParams);
  };

  const paramHandler = (key: string, value: string) => {
    const purchaseOrderFilterString = localStorage.getItem("purchaseOrderFilter");
    let purchaseOrderFilter: IPOFilters = {
      status: "",
      warehouseID: "",
      vendorID: ""
    };

    if (purchaseOrderFilterString) {
      try {
        purchaseOrderFilter = JSON.parse(purchaseOrderFilterString);
      } catch (error) {
        toast.error("Error parsing purchaseOrderFilter");
      }
    }
    //eslint-disable-next-line
    //@ts-ignore
    purchaseOrderFilter[key] = value;

    localStorage.setItem("purchaseOrderFilter", JSON.stringify(purchaseOrderFilter));

    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  React.useEffect(() => {
    const purchaseOrderFilterString = localStorage.getItem("purchaseOrderFilter");
    const purchaseOrderFilter =
      purchaseOrderFilterString && JSON.parse(purchaseOrderFilterString);
    selectedValue && paramHandler("status", selectedValue ? selectedValue : "all");
    purchaseOrderFilter?.status &&
      !selectedValue &&
      persistDataToParmas(
        "status",
        purchaseOrderFilter?.status ? purchaseOrderFilter.status : "all"
      );

    //eslint-disable-next-line
  }, [selectedValue]);
  return (
    <div>
      <div className={classes.searchCustomerBody}>
        <Grid container direction="row" justifyContent="space-between">
          <Grid xs={6} ml={-1} item>
            <h5 className={classes.searchHeading}>Search</h5>
          </Grid>
          <Grid xs={6} container item justifyContent="flex-end">
            <div className={classes.flexContainer}>
              <Button
                disabled={!showFilters}
                text="Reset"
                type="secondary"
                style={{ margin: "2px" }}
                onClick={async () => {
                  const params = new URLSearchParams(searchParams);
                  queryParamsKeys.forEach(key => params.delete(key));
                  setSearchParams(params);
                  setLocationVal({
                    label: "Select",
                    value: ""
                  });
                  setVendorVal({
                    label: "Select",
                    value: ""
                  });
                  setProduct({
                    label: "Select",
                    value: ""
                  });

                  localStorage.removeItem("purchaseOrderFilter");
                  setSelectedValue("all");
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
          <>
            <div style={{ display: "flex" }}>
              <div style={{ flex: 1.1 }}>
                <div style={{ width: "16%" }}>
                  <Grid item lg={1.6} sm={3} md={3} xs={12}>
                    <div className={classes.selectDiv}>
                      <Typography
                        component="span"
                        display="inline"
                        className={`${classes.label} ${classes.w100}`}
                      >
                        Status:
                      </Typography>
                    </div>
                  </Grid>
                </div>
              </div>

              <div style={{ flex: 7 }}>
                <Grid
                  container
                  spacing={1}
                  className={classes.formBody}
                  alignItems="center"
                >
                  <Grid item lg={2} xs={6} sm={6} md={6} style={{ paddingLeft: "0px" }}>
                    <div
                      className={`${classes.pointer} ${
                        classes[
                          `${
                            selectedValue === "pending" ? "checkedType" : "unCheckedType"
                          }`
                        ]
                      }`}
                      onClick={() => setSelectedValue("pending")}
                    >
                      <Radio
                        size="small"
                        className={classes.radioButton}
                        checked={selectedValue === "pending"}
                      />
                      Pending
                    </div>
                  </Grid>

                  <Grid item lg={2} xs={6} sm={6} md={6}>
                    <div
                      className={`${classes.pointer} ${
                        classes[
                          `${
                            selectedValue === "approved" ? "checkedType" : "unCheckedType"
                          }`
                        ]
                      }`}
                      onClick={() => setSelectedValue("approved")}
                    >
                      <Radio
                        size="small"
                        className={classes.radioButton}
                        checked={selectedValue === "approved"}
                      />
                      Approved
                    </div>
                  </Grid>
                  <Grid item lg={2} xs={6} sm={6} md={6}>
                    <div
                      className={`${classes.pointer} ${
                        classes[
                          `${
                            selectedValue === "accepted" ? "checkedType" : "unCheckedType"
                          }`
                        ]
                      }`}
                      onClick={() => setSelectedValue("accepted")}
                    >
                      <Radio
                        size="small"
                        className={classes.radioButton}
                        checked={selectedValue === "accepted"}
                      />
                      Accepted
                    </div>
                  </Grid>
                  <Grid item lg={2} xs={6} sm={6} md={6}>
                    <div
                      className={`${classes.pointer} ${
                        classes[
                          `${
                            selectedValue === "partially_received"
                              ? "checkedType"
                              : "unCheckedType"
                          }`
                        ]
                      }`}
                      onClick={() => setSelectedValue("partially_received")}
                    >
                      <Radio
                        size="small"
                        className={classes.radioButton}
                        checked={selectedValue === "partially_received"}
                      />
                      Partial
                    </div>
                  </Grid>
                  <Grid item lg={2} xs={6} sm={6} md={6}>
                    <div
                      className={`${classes.pointer} ${
                        classes[
                          `${
                            selectedValue === "delivered"
                              ? "checkedType"
                              : "unCheckedType"
                          }`
                        ]
                      }`}
                      onClick={() => setSelectedValue("delivered")}
                    >
                      <Radio
                        size="small"
                        className={classes.radioButton}
                        checked={selectedValue === "delivered"}
                      />
                      Delivered
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>

            <Grid container spacing={2} mt={2}>
              <Grid item lg={6} xs={12}>
                <div className={matches ? classes.flexAlign : ""}>
                  <div className={classes.labelDiv}>
                    <p className={classes.label}>Location:</p>
                  </div>

                  <Select
                    id="cy_location"
                    defaultValue={{ value: "", label: "Select" }}
                    aria-label="purchase order location"
                    options={
                      locations?.results
                        ? locations?.results.map(l => ({
                            value: l.id,
                            label: l.name
                          }))
                        : [{ label: "", value: "" }]
                    }
                    name="polocation"
                    value={{
                      value: locationVal?.value,
                      label: locationVal?.label
                    }}
                    onChange={e => {
                      setLocationVal({ value: e.value, label: e.label });
                      paramHandler("warehouseID", e.value);
                    }}
                    loading={locationLoading}
                    disabled={locationLoading}
                  />
                </div>
              </Grid>

              <Grid item lg={6} xs={12}>
                <div className={matches ? classes.flexAlign : ""}>
                  <div className={classes.labelDiv}>
                    <p className={classes.label}>Vendor:</p>
                  </div>

                  <Select
                    id="cy_vendor"
                    aria-label="supplier"
                    options={
                      suppliers?.results
                        ? suppliers.results.map(s => ({
                            value: s.id,
                            label: s.name
                          }))
                        : [{ label: "", value: "" }]
                    }
                    name="supplier"
                    value={{
                      value: vendorVal.value,
                      label: vendorVal.label
                    }}
                    onChange={e => {
                      setVendorVal({ value: e.value, label: e.label });
                      paramHandler("vendorID", e.value);
                    }}
                    loading={supplierLoading}
                    disabled={supplierLoading}
                  />
                </div>
              </Grid>

              <Grid item lg={6} xs={12}>
                <div className={matches ? classes.flexAlign : ""}>
                  <div className={classes.labelDiv}>
                    <label className={classes.label}>Purchase#:</label>
                  </div>

                  <TextField
                    inputProps={{ "aria-label": "order number" }}
                    name="number"
                    value={searchParams.get("number") ?? ""}
                    onChange={e => {
                      paramHandler("number", e.target.value);
                    }}
                    margin="dense"
                    variant="outlined"
                    type="number"
                    fullWidth
                  />
                </div>
              </Grid>

              <Grid item lg={6} xs={12}>
                <div className={matches ? classes.flexAlign : ""}>
                  <div className={classes.labelDiv}>
                    <p className={classes.label}>Product:</p>
                  </div>

                  <Select
                    name="colors"
                    options={products?.map(
                      (r: {
                        id_hash: string;
                        id: string;
                        name: string;
                        sku: string;
                      }) => ({
                        value: r.id_hash,
                        label: `${r.name}  (${r.sku})`
                      })
                    )}
                    value={{
                      value: product?.value,
                      label: product?.label
                    }}
                    onChange={selectedOptions => {
                      setProduct({
                        value: selectedOptions.value,
                        label: selectedOptions.label
                      });
                      paramHandler("product_id", selectedOptions.value);
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrderFilters;
