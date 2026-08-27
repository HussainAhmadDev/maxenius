import { Card, CardContent, Grid, Stack, Typography, styled } from "@mui/material";
import SelectField from "../../../Components/SelectField";
import { TrendingUp } from "@mui/icons-material";
import DateRangePicker from "../../../Components/DateRangePicker";
import { rangesOptions } from "../../../Constants/reportsConst";
import { useMemo, useState } from "react";
import { SelectOption } from "../../../Interfaces/ui";
import dayjs from "dayjs";
import { DateRange } from "@mui/x-date-pickers-pro";
import MultiSelect from "../../../Components/MultiSelect";
import { useCreateCustomerReport } from "../../../Hooks/useReports";
import { toast } from "react-toastify";
import { TDateRange } from "../../../Interfaces/reportsTypes";
import LoadingButton from "../../../Components/LoadingButton";
import { useProducts } from "../../../Hooks/useProducts";
import { getBrandId } from "../../../Hooks/api";

const Products = () => {
  const [values, setValues] = useState(InitialState);
  const { data: productsData, isLoading: productsLoading } = useProducts(
    new URLSearchParams("?count=1000")
  );
  const [action, setAction] = useState<keyof IValues | null | "expiry">(null);
  const { mutateAsync, isLoading } = useCreateCustomerReport();

  const productOptions: SelectOption[] = useMemo(() => {
    return productsData?.results?.length
      ? productsData?.results?.map(item => {
          return {
            value: item?.id_hash,
            label: `${item?.name}  (${item?.sku})`
          };
        })
      : [];
  }, [productsData]);

  const getRange = (
    section: keyof Omit<IValues, "productSalePurchase">
  ): TDateRange | null => {
    if (values[section]?.range === "custom") {
      if (values[section]?.to_from?.length > 1) {
        return {
          startDate: values[section]?.to_from?.[0],
          endDate: values[section]?.to_from?.[1]
        };
      } else {
        toast.error("Please specifiy dates range");
        return null;
      }
    } else if (values[section].range === "all_time") {
      return values[section].range;
    } else {
      return dayjs(values[section].range).format("YYYY-MM-DD");
    }
  };
  const handleClear = () => {
    setAction(null);
  };
  const handleSelectChange =
    (section: keyof IValues) => (opts: SelectOption[] | SelectOption, name: string) => {
      const updatedValue = (values[section] as Record<string, string | string[]>)?.[name];
      setValues({
        ...values,
        [section]: {
          ...values[section],
          [name]:
            Array.isArray(updatedValue) && Array.isArray(opts)
              ? opts.map(el => el.value)
              : !Array.isArray(opts) && opts.value
        }
      });
    };
  const handleRangeChange =
    (section: keyof IValues) => (value: DateRange<dayjs.Dayjs>) => {
      setValues({
        ...values,
        [section]: {
          ...values[section],
          ["to_from"]: value.map(el => dayjs(el).format("M/D/YYYY"))
        }
      });
    };
  const handleAction = (action: keyof IValues | "expiry") => async () => {
    try {
      const brand_id = getBrandId();
      setAction(action);
      switch (action) {
        case "product":
          if (getRange("product")) {
            await mutateAsync({
              staticPath: "/order/report/products/",
              date_range: getRange("product")
            });
          } else {
            throw new Error("Invalid range");
          }
          break;
        case "product_sale":
          if (values?.product_sale?.product_ids?.length) {
            if (getRange("product_sale")) {
              await mutateAsync({
                staticPath: "/product-sale/",
                product_ids: values.product_sale.product_ids,
                date_range: getRange("product_sale")
              });
            } else {
              throw new Error("Invalid range");
            }
          } else {
            throw new Error("Please select products to generate Product Sale Report!");
          }
          break;
        case "expiry":
          await mutateAsync({
            staticPath: "/order/report/batch/",
            date_range: "all_time"
          });
          break;
        case "productSalePurchase":
          if (values?.productSalePurchase?.product_id) {
            await mutateAsync({
              staticPath: "/product_sale_purchase_report/",
              brand_id: brand_id?.brand_id,
              product_id: values?.productSalePurchase?.product_id
            });
          } else {
            throw new Error(
              "Product is Required For Generation of Sale and Purchase Report"
            );
          }

          break;
        default:
          break;
      }
    } catch (error) {
      toast.error((error as Error)?.message);
    } finally {
      handleClear();
    }
  };

  return (
    <Stack gap={2} width={"100%"}>
      <StyledCard>
        <CardContent>
          <Typography variant="h4" fontWeight={"600"} mb={2}>
            Product Report :
          </Typography>
          <Grid container spacing={2}>
            <Grid item md={4} sm={6} xs={12}>
              <SelectField
                label="Date Range :"
                options={rangesOptions}
                name="range"
                handleSelect={handleSelectChange("product")}
                value={values.product.range?.toString()}
                id="cy__ProductDateRange"
              />
            </Grid>
            {values.product.range === "custom" && (
              <Grid item md={4} sm={6} xs={12}>
                <DateRangePicker
                  label="From - To :"
                  value={[
                    dayjs(values?.product?.to_from?.[0] || undefined),
                    dayjs(values.product?.to_from?.[1] || undefined)
                  ]}
                  onAccept={handleRangeChange("product")}
                  id="cy__FromTo"
                />
              </Grid>
            )}
          </Grid>
          <Stack gap={1} alignItems={"start"} justifyItems={"start"} mt={3}>
            <Typography variant="body2">Generate Product Report :</Typography>
            <LoadingButton
              size="medium"
              variant="contained"
              startIcon={<TrendingUp />}
              onClick={handleAction("product")}
              loading={action === "product" && isLoading}
              id="cy__GenerateProductReport"
            >
              Generate Product Report
            </LoadingButton>
          </Stack>
        </CardContent>
      </StyledCard>
      <Card>
        <CardContent>
          <Typography variant="h4" fontWeight={"600"} mb={2}>
            Expiry Report :
          </Typography>
          <Stack gap={1} alignItems={"start"} justifyItems={"start"} mt={3}>
            <Typography variant="body2">Generate Expiry Report :</Typography>
            <LoadingButton
              size="medium"
              variant="contained"
              startIcon={<TrendingUp />}
              onClick={handleAction("expiry")}
              loading={action === "expiry" && isLoading}
              id="ProductExpiryReport"
            >
              Generate Expiry Report
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h4" fontWeight={"600"} mb={2}>
            Product Sale :
          </Typography>
          <Grid container spacing={2}>
            <Grid item md={4} sm={6} xs={12}>
              <MultiSelect
                label="Search Product :"
                options={productOptions}
                loading={productsLoading}
                value={values.product_sale.product_ids}
                name="product_ids"
                handleSelect={handleSelectChange("product_sale")}
                id="cy__SearchProduct"
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <SelectField
                label="Date Range :"
                options={rangesOptions}
                name="range"
                handleSelect={handleSelectChange("product_sale")}
                value={values.product_sale.range?.toString()}
                id="cy__ProductDateRange"
              />
            </Grid>
            {values.product_sale.range === "custom" && (
              <Grid item md={4} sm={6} xs={12}>
                <DateRangePicker
                  label="From - To :"
                  value={[
                    dayjs(values?.product_sale?.to_from?.[0] || undefined),
                    dayjs(values.product_sale?.to_from?.[1] || undefined)
                  ]}
                  onAccept={handleRangeChange("product_sale")}
                />
              </Grid>
            )}
          </Grid>
          <Stack gap={1} alignItems={"start"} justifyItems={"start"} mt={3}>
            <Typography variant="body2">Generate Product Sale Report :</Typography>
            <LoadingButton
              size="medium"
              variant="contained"
              startIcon={<TrendingUp />}
              onClick={handleAction("product_sale")}
              loading={action === "product_sale" && isLoading}
              id="cy__GenerateProductSaleReport"
            >
              Generate Product Sale Report
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>

      {/* sale purchase order */}
      <Card>
        <CardContent>
          <Typography variant="h4" fontWeight={"600"} mb={2}>
            Product Sale/Purchase Report :
          </Typography>
          <Grid container spacing={2}>
            <Grid item md={4} sm={6} xs={12}>
              <SelectField
                label="Search Product :"
                options={productOptions}
                loading={productsLoading}
                value={values?.productSalePurchase.product_id}
                name="product_id"
                handleSelect={selectedOptions =>
                  setValues(prev => ({
                    ...prev,
                    productSalePurchase: {
                      ...prev.productSalePurchase,
                      product_id: selectedOptions.value
                    }
                  }))
                }
              />
            </Grid>
            {values.product_sale.range === "custom" && (
              <Grid item md={4} sm={6} xs={12}>
                <DateRangePicker
                  label="From - To :"
                  value={[
                    dayjs(values?.product_sale?.to_from?.[0] || undefined),
                    dayjs(values.product_sale?.to_from?.[1] || undefined)
                  ]}
                  onAccept={handleRangeChange("product_sale")}
                />
              </Grid>
            )}
          </Grid>
          <Stack gap={1} alignItems={"start"} justifyItems={"start"} mt={3}>
            <Typography variant="body2">Generate Product Sale/Purchase :</Typography>
            <LoadingButton
              size="medium"
              variant="contained"
              startIcon={<TrendingUp />}
              onClick={handleAction("productSalePurchase")}
              loading={action === "productSalePurchase" && isLoading}
            >
              Product Sale/Purchase
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
interface IValues {
  product: {
    range: string;
    to_from: string[];
  };
  product_sale: {
    product_ids: string[];
    range: string;
    to_from: string[];
  };
  productSalePurchase: {
    product_id: string;
    brand_id: string;
    staticPath: string;
  };
}
const InitialState: IValues = {
  product: {
    range: "all_time",
    to_from: []
  },
  product_sale: {
    product_ids: [],
    range: "all_time",
    to_from: []
  },
  productSalePurchase: {
    product_id: "",
    brand_id: "",
    staticPath: ""
  }
};

const StyledCard = styled(Card)(() => {
  return {
    boxShadow: "0px 21px 29.3px 0px #0000001A",
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0"
  };
});
export default Products;
