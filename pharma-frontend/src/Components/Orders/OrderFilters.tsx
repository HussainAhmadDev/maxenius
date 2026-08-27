import * as React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Button from "../Button";
import TextInput from "../Form/TextInput";
// import DatePicker from "../Form/Date";
// import CheckBox from "../CheckBox";
import useMediaQuery from "@mui/material/useMediaQuery";
import Select from "Components/Form/Select";
import { getAllWebsitesOrders } from "Utils/states";
import {
  orderBillingShippingParamKeys,
  orderParamsGeneralKeys,
  orderCompanyParamKeys
} from "Utils/queryParamKeys";
import { useWebsites } from "Hooks/usePatients";
// import { IWebsites } from "Components/Customer/PatientFilters";
import { options } from "Components/TakeOrder/OrderDetails";
// import { useEditOrder } from "Hooks/useOrders";
import { useURLParams } from "./useOrderFilterHook";
import { useBrand } from "Context/BrandContext";
import { useDebounce } from "Hooks/useDebounce";
import { usePurchaseOrder } from "Components/PurchaseOrders/CreatePurchaseOrder/PurchaseOrderEditTable";
type Product = {
  id_hash: string;
  id?: string;
  name: string;
  sku: string;
};

const QUERY_PARAM_KEYS = [
  ...orderBillingShippingParamKeys,
  ...orderParamsGeneralKeys,
  ...orderCompanyParamKeys
];

interface URLParams {
  brand_id?: string;
  status?: string;
  shipment_status?: string;
  website_id?: string;
  website_order_id?: string;
  order_number?: string;
  payment_status?: string;
  company_name?: string;
  product_id?: string;
}
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
    labelDiv: {
      minWidth: "130px"
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
    shippment_Lable: {
      marginTop: "0px"
    },
    status_label: {
      marginTop: "0px"
    },
    [`@media (max-width: 1200px)`]: {
      shippment_Lable: {
        marginTop: "10px"
      },
      status_label: {
        marginTop: "7px"
      }
    },
    selectLabel: {
      display: "block",
      marginBottom: "8px",
      marginTop: "0px",
      fontWeight: "bold",
      fontSize: "12px"
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
// interface IData {
//   data: IWebsites
// }
// const paymentStatuses: Array<Option> = [
//   { label: "All", value: "" },
//   { label: "Not Paid", value: "not_paid" },
//   { label: "Partially Paid", value: "partially_paid" },
//   { label: "Paid", value: "paid" }
// ];
const shipmentStatuses: Array<Option> = [
  { label: "All", value: "" },
  { label: "Not Shipped", value: "not_shipped" },
  { label: "Partially Shipped", value: "partially_shipped" },
  { label: "Shipped", value: "shipped" }
];

const OrderFilters: React.FC<Props> = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const { pathname } = useLocation();
  const { activeBrand } = useBrand();

  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = React.useState<boolean>(true);

  const { data, isLoading, refetch } = useWebsites();

  const [params, setParams] = useURLParams();
  const [localClear, setLocalClear] = React.useState<boolean>(false);
  const debouncedParams = useDebounce(searchParams, 800);

  React.useEffect(() => {
    refetch();
  }, [activeBrand, debouncedParams, refetch]);

  const handleChange = ({ key, value }: { key: keyof URLParams; value: string }) => {
    setParams({ ...params, [key]: value });
  };

  const handleReset = async () => {
    const newParams = new URLSearchParams(searchParams);
    QUERY_PARAM_KEYS.forEach(key => newParams.delete(key));
    setSearchParams(newParams);
    localStorage.removeItem("ordersFilter");
    setLocalClear(!localClear);
    setProduct({
      label: "Select",
      value: ""
    });
  };

  React.useEffect(() => {
    (async () => {
      const initialParams = new URLSearchParams(searchParams);
      const ordersFilter = await localStorage.getItem("ordersFilter");
      const parsedFilter = ordersFilter && (await JSON.parse(ordersFilter));
      if (parsedFilter && typeof parsedFilter === "object") {
        for (const [key, value] of Object.entries(parsedFilter)) {
          await initialParams.set(key, value as string);
        }
      }

      !parsedFilter?.status && (await initialParams.set("status", "processing"));

      ["/trash", "/trash/"].includes(pathname)
        ? initialParams.set("is_trash", "1")
        : initialParams.delete("is_trash");
      setSearchParams(initialParams);
    })();
    //eslint-disable-next-line
  }, [pathname, isLoading, localClear]);

  const { products } = usePurchaseOrder();
  const [product, setProduct] = React.useState<{
    value: string;
    label: string;
  }>({
    label: "Select",
    value: ""
  });

  React.useEffect(() => {
    if (params) {
      // eslint-disable-next-line
      const productFound: Product | any = products.find(
        ({ id_hash, sku, name }: { id_hash: string; sku: string; name: string }) =>
          id_hash == params.product_id && { id_hash: id_hash, name: name, sku: sku }
      );

      if (productFound) {
        setProduct({
          label: `(${productFound?.name}) (${productFound?.sku})`,
          value: productFound?.id_hash
        });
      }
    }
    //eslint-disable-next-line
  }, [products, products]);

  return (
    <div>
      <div className={classes.searchCustomerBody}>
        <Grid container direction="row" justifyContent="space-between">
          <Grid xs={6} item>
            <h5 className={classes.searchHeading}>Search</h5>
          </Grid>
          <Grid xs={6} container item justifyContent="flex-end">
            <div className={classes.flexContainer}>
              <Button
                disabled={!showFilters}
                text="Reset"
                type="secondary"
                style={{ margin: "2px" }}
                onClick={handleReset}
              />
              <Button
                onClick={() => setShowFilters(!showFilters)}
                text={showFilters ? "Hide" : "Show"}
                style={{ margin: "2px" }}
                type="secondary"
              />
              {/* <Button
                disabled={!showFilters}
                text="Submit"
                type="secondary"
                style={{ margin: "2px" }}
                onClick={handleReset}
              /> */}
            </div>
          </Grid>
        </Grid>

        {showFilters && (
          <>
            <Grid item container direction="row" columnGap={4} alignItems="center">
              <Grid item lg={3.7} sm={12} md={12}>
                <Grid item container direction="row" alignItems="center">
                  <Grid item sm={1.9} md={1.9} lg={3}>
                    <div>
                      <label className={classes.label}>Web Site:</label>
                    </div>
                  </Grid>
                  <Grid item sm={10.1} md={10.1} lg={9}>
                    <div>
                      <Select
                        defaultValue={{ label: "All", value: "" }}
                        name="websites"
                        value={getAllWebsitesOrders(
                          data?.results ? data?.results : []
                        ).find(itm => itm.id === params.website_id)}
                        options={getAllWebsitesOrders(data?.results ? data?.results : [])}
                        onChange={value =>
                          value.value?.includes("all")
                            ? handleChange({ key: "website_id", value: "" })
                            : handleChange({ key: "website_id", value: value.id })
                        }
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item lg={3.7} sm={12} md={12}>
                <Grid item container direction="row" alignItems="center">
                  <Grid item sm={1.9} md={1.9} lg={3}>
                    <div>
                      <label className={classes.label}>Website Order ID:</label>
                    </div>
                  </Grid>
                  <Grid item sm={10.1} md={10.1} lg={9}>
                    <div>
                      <TextInput
                        id="cy_web_orderId"
                        inputProps={{ "aria-label": "website_order_id" }}
                        name="website_order_id"
                        value={params.website_order_id ? params.website_order_id : ""}
                        onChange={e =>
                          handleChange({ key: "website_order_id", value: e.target.value })
                        }
                        margin="dense"
                        variant="outlined"
                        type="text"
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item lg={3.7} sm={12} md={12}>
                <Grid item container direction="row" alignItems="center">
                  <Grid item sm={1.9} md={1.9} lg={3}>
                    <div>
                      <label className={classes.label}>Order Number:</label>
                    </div>
                  </Grid>
                  <Grid item sm={10.1} md={10.1} lg={9}>
                    <div>
                      <TextInput
                        inputProps={{ "aria-label": "order number" }}
                        name="order_number"
                        value={params.order_number ? params.order_number : ""}
                        onChange={e =>
                          handleChange({ key: "order_number", value: e.target.value })
                        }
                        margin="dense"
                        variant="outlined"
                        type="text"
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item container direction="row" columnGap={4} alignItems="center">
              <Grid item lg={3.7} sm={12} md={12} className={classes.status_label}>
                <Grid container direction="row" alignItems="center">
                  <Grid item sm={1.9} md={1.9} lg={3}>
                    <div>
                      <label className={classes.label}>Status:</label>
                    </div>
                  </Grid>
                  <Grid item sm={10.1} md={10.1} lg={9}>
                    <div id="cy_order_status">
                      <Select
                        ariaLabel="status"
                        options={options}
                        name="status"
                        defaultValue={{
                          label: "Processing",
                          value: "processing"
                        }}
                        value={options.find(item => item.value === params.status)}
                        onChange={(value: { lable: string; value: string }) =>
                          handleChange({
                            key: "status",
                            value: value.value
                          })
                        }
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item lg={3.7} sm={12} md={12} className={classes.shippment_Lable}>
                <Grid item container direction="row" alignItems="center">
                  <Grid item sm={1.9} md={1.9} lg={3}>
                    <div>
                      <label className={classes.label}>Shipment Status:</label>
                    </div>
                  </Grid>
                  <Grid item sm={10.1} md={10.1} lg={9}>
                    <div id="cy_Ship_status">
                      <Select
                        ariaLabel="shipment status"
                        options={shipmentStatuses}
                        defaultValue={{
                          label: "All",
                          value: "all"
                        }}
                        name="shipment_status"
                        value={shipmentStatuses.find(
                          item => item.value === params.shipment_status
                        )}
                        onChange={(value: { lable: string; value: string }) =>
                          handleChange({
                            key: "shipment_status",
                            value: value.value
                          })
                        }
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item lg={3.7} sm={12} md={12}>
                <Grid item container direction="row" alignItems="center">
                  <Grid item sm={1.9} md={1.9} lg={3}>
                    <div>
                      <label className={classes.label}>Customer Name:</label>
                    </div>
                  </Grid>
                  <Grid item sm={10.1} md={10.1} lg={9}>
                    <div>
                      <TextInput
                        inputProps={{ "aria-label": "company_name" }}
                        name="company_name"
                        value={params.company_name ? params.company_name : ""}
                        onChange={e =>
                          handleChange({ key: "company_name", value: e.target.value })
                        }
                        margin="dense"
                        variant="outlined"
                        type="text"
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item lg={3.7} xs={12} mt={1}>
                <div className={matches ? classes.flexAlign : ""}>
                  <Grid item sm={1.9} md={1.9} lg={4}>
                    <div>
                      <label className={classes.label}>Product:</label>
                    </div>
                  </Grid>

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

                      handleChange({
                        key: "product_id",
                        value: selectedOptions.value
                      });
                    }}
                  />
                </div>
              </Grid>
            </Grid>

            <Grid
              container
              direction="row"
              spacing={1}
              columnSpacing={3}
              className={classes.formBody}
              alignItems="start"
            >
              <Grid lg={4} xs={12} item>
                <div
                  className={
                    matches ? classes.flexContainer : classes.checkboxContainerSmall
                  }
                ></div>
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderFilters;
