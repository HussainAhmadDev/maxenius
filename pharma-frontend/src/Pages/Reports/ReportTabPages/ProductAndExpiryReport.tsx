import React, { useCallback } from "react";
import ReportDateFilter from "./ReportDateFilter";
import { makeStyles, createStyles, useTheme } from "@material-ui/core/styles";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import { toast } from "react-toastify";
import { Grid, Typography } from "@mui/material";
import { useCreateCustomerReport } from "Hooks/useReports";
import { useBrand } from "Context/BrandContext";
import Loader from "Components/Loader";
import Stack from "@mui/material/Stack";
import { usePurchaseOrder } from "Components/PurchaseOrders/CreatePurchaseOrder/PurchaseOrderEditTable";
import Select from "react-select";

const useStyles = makeStyles(() =>
  createStyles({
    label: {
      // color: theme.palette.gray[500],
      fontSize: "12px"
    },
    labelDiv: {
      minWidth: "130px"
    },
    selectDiv: {
      width: "100%"
    },
    loaderSpan: {
      margin: "auto"
    },

    loader: {
      paddingBottom: "3px"
    }
  })
);
const ProductAndExpiryReport = () => {
  const defaultTheme = useTheme();
  const classes = useStyles();
  const [selectedDateRange, setSelectedDateRange] = React.useState<Date | string>();

  const [customDateRange, setCustomDateRange] = React.useState<{
    startDate: Date | string;
    endDate: Date | string;
  }>({
    startDate: "",
    endDate: ""
  });

  //For Product Sale
  const [selectedDateRangePs, setSelectedDateRangePs] = React.useState<Date | string>();
  const [customDateRangePs, setCustomDateRangePs] = React.useState<{
    startDate: Date | string;
    endDate: Date | string;
  }>({
    startDate: "",
    endDate: ""
  });

  const { activeBrand: brand_id } = useBrand();

  const { products } = usePurchaseOrder();
  const [product, setProduct] = React.useState<{
    product: { value: string; label: string }[];
  }>({
    product: [] // Initialize as an empty array
  });

  const { mutate, isLoading } = useCreateCustomerReport();

  const createHandler = useCallback(() => {
    mutate({
      staticPath: "/order/report/products/",
      brand_id: brand_id,
      date_range: selectedDateRange
        ? selectedDateRange
        : customDateRange?.startDate
        ? customDateRange
        : "all_time"
    });

    //eslint-disable-next-line
  }, [mutate, brand_id, selectedDateRange, customDateRange]);

  // For Product sales/purchaes
  const [selectedProductForSalePurchase, setSelectedProductForSalePurchase] =
    React.useState<{
      value: string;
      label: string;
    }>({
      value: "",
      label: "Select..."
    });

  return (
    <Grid container direction="column" justifyContent={"space-evenly"} gap={5}>
      {/* Product Report Section */}
      <Grid
        container
        item
        lg={12}
        md={12}
        xs={12}
        direction="row"
        justifyContent={"left"}
        paddingBottom={5}
        borderBottom={"1px solid red"}
      >
        <Grid lg={12} paddingBottom={5} md={5} xs={12} item>
          <Typography color="#1A202E" fontWeight="bold">
            Product Report
          </Typography>
        </Grid>
        <Grid container gap={10} lg={12} md={12} xs={12} item>
          <Grid lg={3} md={5} xs={12} item>
            <ReportDateFilter
              setCustomDateRange={data => setCustomDateRange(data)}
              setSelectedDateRange={(data: Date | string) => setSelectedDateRange(data)}
            />
          </Grid>
          <Grid lg={2} xs={12} item>
            <div className={classes.labelDiv}>
              <p className={classes.label}>{"Generate Product Report:"}</p>
            </div>
            <Button
              variant="outlined"
              text={"Product Report"}
              onClick={createHandler}
              icon={<MuiIcon icon="equalizer" />}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Expiry Report Section */}
      <Grid
        container
        direction="row"
        justifyContent={"left"}
        pb={3}
        borderBottom={"1px solid red"}
      >
        <Grid lg={12} md={5} xs={12} item>
          <Typography paddingBottom={5} color="#1A202E" fontWeight="bold">
            Expiry Report
          </Typography>
        </Grid>

        <Grid lg={2} xs={12} item>
          <div className={classes.labelDiv}>
            <p className={classes.label}>{"Generate Expiry Report:"}</p>
          </div>
          <Button
            variant="outlined"
            text={"Expiry Report"}
            onClick={() =>
              mutate({
                staticPath: "/order/report/batch/",
                brand_id: brand_id,
                date_range: "all_time"
              })
            }
            icon={<MuiIcon icon="equalizer" />}
          />
        </Grid>
      </Grid>

      {/* Product Sale Section */}

      <Grid
        item
        container
        lg={12}
        md={12}
        xs={12}
        direction="row"
        justifyContent={"left"}
      >
        <Grid lg={12} paddingBottom={5} md={5} xs={12} item>
          <Typography color="#1A202E" fontWeight="bold">
            Product Sale
          </Typography>
        </Grid>
        <Grid container gap={10} lg={12} md={12} xs={12} item>
          <Stack minWidth={250} maxWidth={320}>
            <p className={classes.label}>{"Search Product:"}</p>
            <Select
              isMulti={true}
              name="colors"
              options={products?.map(
                (r: { id_hash: string; id: string; name: string; sku: string }) => ({
                  value: r.id_hash,
                  label: `${r.name}  (${r.sku})`
                })
              )}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={selectedOptions => {
                const selectedProducts = selectedOptions.map(option => ({
                  value: option.value,
                  label: option.label
                }));

                setProduct(prevState => ({ ...prevState, product: selectedProducts }));
              }}
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: defaultTheme.palette.gray[300],
                  primary: defaultTheme.palette.primary.main
                }
              })}
            />
          </Stack>

          <Grid lg={3} md={5} xs={12} item>
            <ReportDateFilter
              setCustomDateRange={data => setCustomDateRangePs(data)}
              setSelectedDateRange={(data: Date | string) => setSelectedDateRangePs(data)}
            />
          </Grid>
          <Grid lg={2} xs={12} item>
            <div className={classes.labelDiv}>
              <p className={classes.label}>{"Generate Product Report:"}</p>
            </div>
            <Button
              variant="outlined"
              text={"Product Sale"}
              onClick={() => {
                if (product?.product.length === 0) {
                  toast.error("Please Select Product To Generate Product Sale Report!");
                  return;
                }
                const id_s = product?.product?.map(item => item.value);
                mutate({
                  staticPath: "/product-sale/",
                  product_ids: id_s,
                  brand_id: brand_id,
                  date_range: selectedDateRangePs
                    ? selectedDateRangePs
                    : customDateRangePs?.startDate
                    ? customDateRangePs
                    : "all_time"
                });
              }}
              icon={<MuiIcon icon="equalizer" />}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* product_sale_purchase_report */}
      <Grid
        item
        container
        lg={12}
        md={12}
        xs={12}
        direction="row"
        justifyContent={"left"}
        paddingTop={5}
        borderTop={"1px solid red"}
      >
        <Grid lg={12} paddingBottom={5} md={5} xs={12} item>
          <Typography color="#1A202E" fontWeight="bold">
            Product Sale/Purchase Report
          </Typography>
        </Grid>
        <Grid container gap={10} lg={12} md={12} xs={12} item>
          <Stack minWidth={250} maxWidth={320}>
            <p className={classes.label}>{"Search Product:"}</p>
            <Select
              isMulti={false}
              name="colors"
              options={products?.map(
                (r: { id_hash: string; id: string; name: string; sku: string }) => ({
                  value: r.id_hash,
                  label: `${r.name}  (${r.sku})`
                })
              )}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={selectedOptions =>
                setSelectedProductForSalePurchase({
                  label: selectedOptions?.label ?? "Select...",
                  value: selectedOptions?.value ?? ""
                })
              }
              value={selectedProductForSalePurchase}
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: defaultTheme.palette.gray[300],
                  primary: defaultTheme.palette.primary.main
                }
              })}
            />
          </Stack>

          <Grid lg={2} xs={12} item>
            <div className={classes.labelDiv}>
              <p className={classes.label}>{"Product Sale/Purchase"}</p>
            </div>
            <Button
              variant="outlined"
              text={"Product Sale/Purchase"}
              onClick={() => {
                if (selectedProductForSalePurchase?.value?.length < 1) {
                  toast.error(
                    "Please Select Product To Generate Product Sale/Purchase Report!"
                  );
                  return;
                }

                mutate({
                  staticPath: "/product_sale_purchase_report/",
                  brand_id: brand_id,
                  product_id: selectedProductForSalePurchase?.value
                });
              }}
              icon={<MuiIcon icon="equalizer" />}
            />
          </Grid>
        </Grid>
      </Grid>

      {
        <div className={classes.loaderSpan}>
          {isLoading && (
            <div className={classes.loader}>
              <Loader />
            </div>
          )}
        </div>
      }
    </Grid>
  );
};
export default ProductAndExpiryReport;
