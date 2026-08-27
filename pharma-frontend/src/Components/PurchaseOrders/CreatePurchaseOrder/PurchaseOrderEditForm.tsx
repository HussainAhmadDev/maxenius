import * as React from "react";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Button from "../../Button";
import TextInput from "../../Form/TextInput";
import useMediaQuery from "@mui/material/useMediaQuery";
import Select from "Components/Form/Select";
import Radio from "@material-ui/core/Radio";
import { usePurchaseOrderContext } from "Context/PurchaseOrderContext";
import { useParams } from "react-router";
import { useDebounce } from "Hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useBrand } from "Context/BrandContext";
import { useWarehouses } from "Hooks/useWarehouses";
import { useVendors } from "Hooks/useVendors";
import CustomLoader from "Components/Loader";
import { ukDateFormat } from "Utils/datesFormat";
import { useUser } from "Hooks/localStorageUser";

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
      alignItems: "center",
      justifyContent: "space-between"
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
      minWidth: "35%"
    },
    selectDiv: {
      width: "100%"
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
      cursor: "pointer",
      textTransform: "capitalize"
    },
    mediadiv: {
      width: "25.4%"
    },
    vendorDiv: {
      display: "none"
    },
    tabVendorDiv: {
      display: "block"
    },
    marginInvo: {
      marginLeft: "0px"
    },
    [`@media (min-width: 1200px)`]: {
      mediadiv: {
        display: "none"
      },
      innvoicmargin: {
        marginLeft: "4%"
      },
      vendorDiv: {
        display: "block"
      },
      tabVendorDiv: {
        display: "none"
      },
      marginInvo: {
        // marginLeft: "15px"
      }
    },
    radioButton: {
      padding: "7px",
      textTransform: "capitalize"
    }
  })
);
interface Props {
  readonly header?: boolean;
}

interface Option {
  value: string;
  label: string;
}
// const purchaseOrderLocation: Array<Option> = [
//   { label: "All Locations", value: "" },
//   { label: "Default", value: "default" }
// ];
const invoicingCurrency: Array<Option> = [
  { label: "AUD", value: "aud" },
  { label: "CAD", value: "cad" },
  { label: "CNY", value: "cny" },
  { label: "EUR", value: "eur" },
  { label: "GBP", value: "gbp" },
  { label: "MXN", value: "mxn" },
  { label: "USD", value: "usd" }
];
const statusOrder = [
  "pending",
  "approved",
  "accepted",
  "partially_received",
  "delivered"
];

const PurchaseOrderEditForm: React.FC<Props> = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);

  const { activeBrand, currency } = useBrand();

  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("brand_id", activeBrand);
    setSearchParams(newSearchParams);
    //eslint-disable-next-line
  }, [activeBrand]);

  const { data: locations, isLoading: locationLoding } = useWarehouses(
    debouncedParams,
    true
  );
  const { data: suppliers, isLoading: supplierLoading } = useVendors(
    debouncedParams,
    true
  );
  const {
    purchaseOrderBody,
    setPurchaseOrderBody,
    exchangeRate,
    setExchangeRate,
    invoiceCurrency,
    setInvoiceCurrency
  } = usePurchaseOrderContext();

  const [supplier, setSupplier] = React.useState(null);

  React.useEffect(() => {
    if (purchaseOrderBody?.vendor_id && !supplierLoading) {
      const foundSupplier = suppliers?.results.find(
        s => s.id === purchaseOrderBody.vendor_id
      );
      if (foundSupplier) {
        //eslint-disable-next-line
        //@ts-ignore
        setSupplier(foundSupplier);
      }
    }
  }, [purchaseOrderBody?.vendor_id, suppliers, supplierLoading]);

  React.useEffect(() => {
    if (purchaseOrderBody?.warehouse_id && !locationLoding) {
      const warehouse = locations?.results.find(
        l => l.id === purchaseOrderBody.warehouse_id
      );

      if (warehouse) {
        const updatedPurchaseOrderBody = {
          ...purchaseOrderBody,
          warehouse: { value: warehouse.id, label: warehouse.name },
          //eslint-disable-next-line
          //@ts-ignore
          supplier: { value: supplier?.id, label: supplier?.name }
        };

        setPurchaseOrderBody(updatedPurchaseOrderBody);
      }
    }
    //eslint-disable-next-line
  }, [purchaseOrderBody.warehouse_id, locations, locationLoding, supplier]);

  const [showFilters, setShowFilters] = React.useState<boolean>(true);

  const id = useParams();
  const [showOtherStatus, setShowOtherStatus] = React.useState<boolean>(false);

  const [selectedValue, setSelectedValue] = React.useState(purchaseOrderBody.status);

  React.useEffect(() => {
    if (id?.id) {
      setSelectedValue(purchaseOrderBody.status_display);
      setShowOtherStatus(true);
      setPurchaseOrderBody({
        ...purchaseOrderBody,
        status: purchaseOrderBody.status_display
      });
    } else {
      setSelectedValue("pending");
    }
    //eslint-disable-next-line
  }, [id, purchaseOrderBody.status_display]);

  const handleStatusChange = (value: string) => {
    if (isEnabled(value)) {
      setSelectedValue(value);
      setPurchaseOrderBody({ ...purchaseOrderBody, status: value });
    }
  };

  const user = useUser();

  const isEnabled = (status: string) => {
    switch (purchaseOrderBody.status_display) {
      case "pending":
        return (
          (user?.is_superuser || user?.is_manager || user?.is_associate) &&
          (status.includes("pending") || status.includes("approved"))
        );
      case "approved":
        return (
          (user?.is_superuser || user?.is_manager || user?.is_associate) &&
          (status === "accepted" || status === "approved")
        );
      case "accepted":
        return false;
      default:
        return false;
    }
  };
  return (
    <div>
      {!locationLoding && !supplierLoading ? (
        <div className={classes.searchCustomerBody}>
          <Grid container direction="row" justifyContent="space-between">
            <Grid xs={6} item>
              <h5 className={classes.searchHeading}>Purchase Order</h5>
            </Grid>
            <Grid xs={6} container item justifyContent="flex-end">
              <div className={classes.flexContainer}>
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
            <Grid container spacing={1} className={classes.formBody} alignItems="center">
              <Grid item lg={1} xl={12} sm={3} md={1} xs={12}>
                <div className={classes.labelDiv}>
                  <p className={classes.label}>Status:</p>
                </div>
              </Grid>
              {id?.id ? (
                <Grid item container lg={10} md={10}>
                  {statusOrder.map(itm => (
                    <Grid item lg={2.4} xs={6} sm={4} md={2} key={itm}>
                      <div
                        className={`${classes.pointer} ${
                          classes[selectedValue === itm ? "checkedType" : "unCheckedType"]
                        }`}
                        onClick={() => handleStatusChange(itm)}
                      >
                        <Radio
                          size="small"
                          className={classes.radioButton}
                          checked={selectedValue === itm}
                          disabled={!isEnabled(itm)}
                        />
                        {itm.replace(/_/g, " ")}
                      </div>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid item lg={2.4} xs={6} sm={4} md={2}>
                  <div
                    className={`${classes.pointer} ${classes["checkedType"]}`}
                    onClick={() => setSelectedValue("pending")}
                  >
                    <Radio
                      size="small"
                      className={classes.radioButton}
                      checked={!!selectedValue}
                    />
                    Pending
                  </div>
                </Grid>
              )}

              {showOtherStatus && (
                <Grid item lg={3.76} xs={12} sm={8.2} md={8.2}>
                  <div className={matches ? classes.flexAlign : ""}>
                    <div className={classes.labelDiv}>
                      <p className={classes.label}>Date:</p>
                    </div>
                    <div className={classes.selectDiv}>
                      {locations && locations?.results && (
                        <TextInput
                          disabled
                          // onChange={() => {}}
                          value={ukDateFormat(purchaseOrderBody?.ordered, true)}
                          type={""}
                          name={""}
                        />
                      )}
                    </div>
                  </div>
                </Grid>
              )}

              <Grid
                item
                lg={3.9}
                xs={12}
                sm={8.2}
                md={8.2}
                xl={showOtherStatus ? 4 : 3.99}
              >
                <div className={classes.marginInvo}>
                  <div className={matches ? classes.flexAlign : ""}>
                    <div className={classes.labelDiv}>
                      <p className={classes.label}>Organization Currency:</p>
                    </div>
                    <div className={classes.selectDiv}>
                      <Select
                        disabled
                        value={{ label: currency ?? "", value: currency ?? "" }}
                        ariaLabel="invoicing currency"
                        options={invoicingCurrency}
                        name="invoicingcurrency"
                      />
                    </div>
                  </div>
                </div>
              </Grid>

              <Grid
                item
                lg={3.9}
                xs={12}
                sm={8.2}
                md={8.2}
                xl={showOtherStatus ? 4 : 3.99}
              >
                <div className={classes.marginInvo}>
                  <div className={matches ? classes.flexAlign : ""}>
                    <div className={classes.labelDiv}>
                      <p className={classes.label}>Invoicing Currency:</p>
                    </div>
                    <div className={classes.selectDiv}>
                      <Select
                        value={{
                          label: invoiceCurrency?.label ?? "",
                          value: invoiceCurrency?.value ?? ""
                        }}
                        ariaLabel="invoicing currency"
                        options={invoicingCurrency}
                        name="invoicingcurrency"
                        onChange={value => {
                          if (value?.label?.toLowerCase() === currency.toLowerCase()) {
                            setExchangeRate("1");
                          }
                          setInvoiceCurrency(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Grid>

              <Grid
                container
                spacing={1}
                columnSpacing={3}
                mt={1}
                className={classes.formBody}
                alignItems="center"
              >
                <Grid item ml={1} lg={3.84} xs={12} sm={8.2} md={8.2}>
                  <div className={matches ? classes.flexAlign : ""}>
                    <div className={classes.labelDiv}>
                      <p className={classes.label}>Location:</p>
                    </div>
                    <div className={classes.selectDiv} id="cy_location">
                      {locations && locations?.results && (
                        <Select
                          ariaLabel="purchase order location"
                          loading={locationLoding}
                          disabled={locationLoding}
                          options={locations?.results.map(l => ({
                            value: l.id ?? "",
                            label: l.name ?? ""
                          }))}
                          name="polocation"
                          value={{
                            label: purchaseOrderBody?.warehouse?.label ?? "Select",
                            value: purchaseOrderBody?.warehouse?.value ?? ""
                          }}
                          onChange={e =>
                            setPurchaseOrderBody({
                              ...purchaseOrderBody,
                              warehouse: e
                            })
                          }
                        />
                      )}
                    </div>
                  </div>
                </Grid>

                <Grid
                  item
                  ml={2}
                  lg={3.78}
                  xs={12}
                  sm={8.2}
                  md={8.2}
                  className={classes.tabVendorDiv}
                >
                  <div className={matches ? classes.flexAlign : ""}>
                    <div className={classes.labelDiv}>
                      <p className={classes.label}>Vendor:</p>
                    </div>
                    <div className={classes.selectDiv}>
                      <Select
                        id="cy_vendor"
                        ariaLabel="supplier"
                        options={
                          suppliers?.results.map((s: { id: string; name: string }) => ({
                            value: s.id,
                            label: s.name
                          })) || []
                        }
                        value={{
                          label: purchaseOrderBody?.supplier?.label ?? "Select",
                          value: purchaseOrderBody?.supplier?.value ?? ""
                        }}
                        name="supplier"
                        loading={supplierLoading}
                        onChange={e =>
                          setPurchaseOrderBody({ ...purchaseOrderBody, supplier: e })
                        }
                      />
                    </div>
                  </div>
                </Grid>

                <Grid
                  item
                  lg={showOtherStatus ? 3.9 : 3.96}
                  xl={showOtherStatus ? 4 : 3.98}
                  xs={12}
                  sm={8.4}
                  md={8.4}
                  ml={0}
                  className={classes.vendorDiv}
                >
                  <div
                    style={
                      showOtherStatus ? { marginLeft: "3px" } : { marginLeft: "-10px" }
                    }
                  >
                    <div
                      className={matches ? classes.flexAlign : ""}
                      style={
                        showOtherStatus ? { marginLeft: "10px" } : { marginLeft: "20px" }
                      }
                    >
                      <div className={classes.labelDiv}>
                        <p className={classes.label}>Vendor:</p>
                      </div>
                      <div className={classes.selectDiv}>
                        {suppliers && suppliers?.results && (
                          <Select
                            ariaLabel="supplier"
                            options={suppliers?.results.map(s => ({
                              value: s.id,
                              label: s.name
                            }))}
                            name="supplier"
                            value={{
                              label: purchaseOrderBody?.supplier?.label ?? "",
                              value: purchaseOrderBody?.supplier?.value ?? ""
                            }}
                            onChange={e =>
                              setPurchaseOrderBody({ ...purchaseOrderBody, supplier: e })
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Grid>

                <Grid item sm={10.1} md={12} lg={4} display={"flex"}>
                  <div style={{ width: "118px" }} className={classes.labelDiv}>
                    <p className={classes.label}>Exchange Rate:</p>
                  </div>
                  <div style={{ width: "100%" }}>
                    <TextInput
                      style={{ width: "95%" }}
                      inputProps={{ "aria-label": "exchangeRate" }}
                      name="exchangeRate"
                      value={exchangeRate ?? ""}
                      disabled={
                        currency?.toLowerCase() === invoiceCurrency?.label?.toLowerCase()
                      }
                      onChange={e =>
                        +e.target.value >= 0 && setExchangeRate(e.target.value)
                      }
                      margin="dense"
                      variant="outlined"
                      type="number"
                    />
                  </div>
                </Grid>
              </Grid>
            </Grid>
          )}
        </div>
      ) : (
        <CustomLoader />
      )}
    </div>
  );
};

export default PurchaseOrderEditForm;
