import { Card, CardContent, Grid, Stack, Typography, styled } from "@mui/material";
import SelectField from "../../../Components/SelectField";
import { TrendingUp } from "@mui/icons-material";
import DateRangePicker from "../../../Components/DateRangePicker";
import { paymentMethods, rangesOptions } from "../../../Constants/reportsConst";
import { useWebsites } from "../../../Hooks/usePatients";
import { useMemo, useState } from "react";
import { SelectOption } from "../../../Interfaces/ui";
import DatePicker from "../../../Components/DatePicker";
import dayjs from "dayjs";
import { DateRange } from "@mui/x-date-pickers-pro";
import MultiSelect from "../../../Components/MultiSelect";
import { useCreateCustomerReport } from "../../../Hooks/useReports";
import { toast } from "react-toastify";
import { TDateRange } from "../../../Interfaces/reportsTypes";
import LoadingButton from "../../../Components/LoadingButton";

const Overview = () => {
  const [values, setValues] = useState(InitialState);
  const { data: websitesData, isLoading: websitesLoading } = useWebsites();
  const [action, setAction] = useState<keyof IValues | null>(null);
  const { mutateAsync, isLoading } = useCreateCustomerReport();

  const websitesOptions: SelectOption[] = useMemo(() => {
    return websitesData?.results?.length
      ? websitesData?.results?.map(item => {
          return {
            label: item.title,
            value: item.id
          };
        })
      : [];
  }, [websitesData]);

  const getRange = (section: keyof Omit<IValues, "stock">): TDateRange | null => {
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
  const handleAction = (action: keyof IValues) => async () => {
    try {
      setAction(action);
      switch (action) {
        case "overview":
          if (getRange("overview")) {
            await mutateAsync({
              staticPath: "/order/report/profit/",
              date_range: getRange("overview")
            });
          } else {
            throw new Error("Invalid Range");
          }
          break;
        case "revenue":
          if (values?.revenue?.website_ids?.length) {
            if (getRange("overview")) {
              await mutateAsync({
                staticPath: "/order/report/products_revenue/",
                website_ids: values.revenue.website_ids,
                payment_method: values.revenue.payment_method,
                date_range: getRange("overview")
              });
            }
          } else {
            throw new Error("Please select websites to generate Revenue Report!");
          }
          break;
        case "stock":
          if (values?.stock.at_date) {
            await mutateAsync({
              staticPath: "/product_stock_status",
              ...values.stock
            });
          } else {
            throw new Error("At Date is reqiured");
          }
          break;
      }
    } catch (err) {
      toast.error((err as Error)?.message);
    } finally {
      handleClear();
    }
  };

  return (
    <Stack gap={2} width={"100%"}>
      <StyledCard>
        <CardContent>
          <Typography variant="h4" fontWeight={"600"} mb={2}>
            Overview Report :
          </Typography>
          <Grid container spacing={2}>
            <Grid item md={4} sm={6} xs={12}>
              <SelectField
                label="Date Range :"
                options={rangesOptions}
                name="range"
                handleSelect={handleSelectChange("overview")}
                value={values.overview.range?.toString()}
                id="cy_DateRange"
              />
            </Grid>
            {values.overview.range === "custom" && (
              <Grid item md={4} sm={6} xs={12}>
                <DateRangePicker
                  label="From - To :"
                  value={[
                    dayjs(values?.overview?.to_from?.[0] || undefined),
                    dayjs(values.overview?.to_from?.[1] || undefined)
                  ]}
                  onAccept={handleRangeChange("overview")}
                  id="cy__SelectDateRange"
                />
              </Grid>
            )}
          </Grid>
          <Stack gap={1} alignItems={"start"} justifyItems={"start"} mt={3}>
            <Typography variant="body2">Generate Overview Report :</Typography>
            <LoadingButton
              size="medium"
              variant="contained"
              startIcon={<TrendingUp />}
              onClick={handleAction("overview")}
              loading={action === "overview" && isLoading}
              id="cy__GenerateOverviewBtn"
            >
              Generate Overview Report
            </LoadingButton>
          </Stack>
        </CardContent>
      </StyledCard>
      <Card>
        <CardContent>
          <Typography variant="h4" fontWeight={"600"} mb={2}>
            Revenue Report :
          </Typography>
          <Grid container spacing={2}>
            <Grid item md={4} sm={6} xs={12}>
              <MultiSelect
                label="Websites :"
                options={websitesOptions}
                loading={websitesLoading}
                value={values.revenue.website_ids}
                name="website_ids"
                handleSelect={handleSelectChange("revenue")}
                id="cy__RevenueReport"
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <MultiSelect
                label="Payment Methods :"
                options={paymentMethods}
                name="payment_method"
                value={values.revenue.payment_method}
                handleSelect={handleSelectChange("revenue")}
                id="cy__PaymentMethod"
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <SelectField
                label="Date Range :"
                options={rangesOptions}
                name="range"
                handleSelect={handleSelectChange("revenue")}
                value={values.revenue.range?.toString()}
                id="RevenueDateSelection"
              />
            </Grid>
            {values.revenue.range === "custom" && (
              <Grid item md={4} sm={6} xs={12}>
                <DateRangePicker
                  label="From - To :"
                  value={[
                    dayjs(values?.revenue?.to_from?.[0] || undefined),
                    dayjs(values.revenue?.to_from?.[1] || undefined)
                  ]}
                  onAccept={handleRangeChange("revenue")}
                />
              </Grid>
            )}
          </Grid>
          <Stack gap={1} alignItems={"start"} justifyItems={"start"} mt={3}>
            <Typography variant="body2">Generate Revenue Report :</Typography>
            <LoadingButton
              size="medium"
              variant="contained"
              startIcon={<TrendingUp />}
              onClick={handleAction("revenue")}
              loading={action === "revenue" && isLoading}
              id="GenerateRevenueBtn"
            >
              Revenue Report
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h4" fontWeight={"600"} mb={2}>
            Product Stock Status :
          </Typography>
          <Grid container spacing={2}>
            <Grid item md={4} sm={6} xs={12}>
              <DatePicker
                label="At Date :"
                value={values.stock.at_date ? dayjs(values.stock.at_date) : null}
                onAccept={val => {
                  handleSelectChange("stock")(
                    { label: "", value: dayjs(val).format("YYYY-MM-DD") },
                    "at_date"
                  );
                }}
                disableFuture
                id="cy__ProductStockStatus"
              />
            </Grid>
          </Grid>
          <Stack gap={1} alignItems={"start"} justifyItems={"start"} mt={3}>
            <Typography variant="body2">Stock Status :</Typography>
            <LoadingButton
              size="medium"
              variant="contained"
              startIcon={<TrendingUp />}
              onClick={handleAction("stock")}
              loading={action === "stock" && isLoading}
              id="cy__GetStockStatus"
            >
              Get Stock Status
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
interface IValues {
  overview: {
    range: string;
    to_from: string[];
  };
  revenue: {
    website_ids: string[];
    payment_method: string[];
    range: string;
    to_from: string[];
  };
  stock: {
    at_date: string;
  };
}
const InitialState: IValues = {
  overview: {
    range: "all_time",
    to_from: []
  },
  revenue: {
    range: "all_time",
    to_from: [],
    payment_method: [],
    website_ids: []
  },
  stock: { at_date: "" }
};

const StyledCard = styled(Card)(() => {
  return {
    boxShadow: "0px 21px 29.3px 0px #0000001A",
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0"
  };
});
export default Overview;
