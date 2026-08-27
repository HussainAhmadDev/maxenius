import { Grid, Typography } from "@mui/material";
import React from "react";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import { useCreateCustomerReport } from "Hooks/useReports";
import ReportDateFilter from "./ReportDateFilter";
import { useBrand } from "Context/BrandContext";
import Select from "react-select";
import Stack from "@mui/material/Stack";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useWebsites } from "Hooks/usePatients";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import MuiTextField, { TextFieldProps } from "@mui/material/TextField";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    loaderSpan: {
      margin: "auto"
    },

    loader: {
      paddingBottom: "3px"
    }
  })
);

const CalendarTextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  function CalendarTextField(props, ref) {
    return <MuiTextField {...props} ref={ref} size="small" />;
  }
);
CalendarTextField.displayName = "CalendarTextField";

const paymentMethods = [
  {
    label: "APPLEPAY",
    value: "APPLEPAY"
  },
  {
    label: "CARD",
    value: "CARD"
  },
  {
    label: "CHEQUE",
    value: "CHEQUE"
  },
  {
    label: "COD",
    value: "COD"
  },
  {
    label: "INVOICE",
    value: "INVOICE"
  }
];

const GenerateReport: React.FC<{
  staticPath: string;
  dateFilter?: boolean;
  title: string;
  isRevenue?: boolean;
}> = ({ staticPath, dateFilter, title, isRevenue }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [selectedDateRange, setSelectedDateRange] = React.useState<Date | string>();
  const [customDateRange, setCustomDateRange] = React.useState<{
    startDate: Date | string;
    endDate: Date | string;
  }>({
    startDate: "",
    endDate: ""
  });

  const [revenueSelectedDateRange, setRevenueSelectedDateRange] = React.useState<
    Date | string
  >();
  const [revenueCustomDateRange, setRevenueCustomDateRange] = React.useState<{
    startDate: Date | string;
    endDate: Date | string;
  }>({
    startDate: "",
    endDate: ""
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<{
    paymentMethods: { value: string; label: string }[];
  }>({
    paymentMethods: [] // Initialize as an empty array
  });

  const { activeBrand: brand_id } = useBrand();

  const { mutate, isLoading } = useCreateCustomerReport();

  const [revenueLoading, setRevenueLoading] = React.useState<boolean>(false);
  const [stockLoading, setStockLoading] = React.useState<boolean>(false);
  const [overviewLoading, setOverviewLoading] = React.useState<boolean>(false);

  // const { products } = usePurchaseOrder();
  const { data: websites } = useWebsites();
  const [selectedWebsites, setSelectedWebsites] = React.useState<{
    websites: { value: string; label: string }[];
  }>({
    websites: [] // Initialize as an empty array
  });

  const [selectedStockStatusDate, setSelectedStockStatusDate] = React.useState({
    expiry_date: ""
  });

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent={"left"}
        alignItems="flex-end"
        gap={10}
        borderBottom={"1px solid #FF173D"}
        paddingBottom={5}
      >
        {dateFilter && (
          <Grid lg={3} md={5} xs={12} item>
            <Grid lg={12} md={5} xs={12} item>
              <Typography color="#1A202E" fontWeight="bold">
                Overview Report
              </Typography>
            </Grid>
            <ReportDateFilter
              setCustomDateRange={data => setCustomDateRange(data)}
              setSelectedDateRange={(data: Date | string) => setSelectedDateRange(data)}
            />
          </Grid>
        )}

        <Grid lg={3} xs={12} item>
          <div className={classes.labelDiv}>
            <p className={classes.label}> {`${title} Report:`}</p>
          </div>
          <Button
            variant="outlined"
            text={`${title} Report`}
            onClick={() => {
              setOverviewLoading(true);
              setRevenueLoading(false);
              setStockLoading(false);
              mutate({
                staticPath: staticPath,
                date_range: selectedDateRange
                  ? selectedDateRange
                  : customDateRange.startDate
                  ? customDateRange
                  : "all_time",
                brand_id: brand_id
              });
            }}
            icon={<MuiIcon icon="equalizer" />}
            loading={isLoading && !revenueLoading && !stockLoading && overviewLoading}
          />
        </Grid>
      </Grid>

      {/* Revenue Report */}
      {isRevenue && (
        <>
          <Typography color="#1A202E" fontWeight="bold" marginBottom={3} marginTop={3}>
            Revenue Report
          </Typography>

          <Grid container gap={10} lg={12} md={12} xs={12} item>
            <Stack minWidth={200} maxWidth={250}>
              <p className={classes.label}>{"Search Websites:"}</p>
              <Select
                isMulti={true}
                name="colors"
                options={websites?.results?.map((r: { id: string; title: string }) => ({
                  value: r?.id,
                  label: r?.title
                }))}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={selectedOptions => {
                  const selectedProducts = selectedOptions.map(option => ({
                    value: option.value,
                    label: option.label
                  }));

                  setSelectedWebsites(prevState => ({
                    ...prevState,
                    websites: selectedProducts
                  }));
                }}
                theme={theme => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#FF173D",
                    primary: "#FF173D"
                  }
                })}
              />
            </Stack>
            <Stack minWidth={200} maxWidth={250}>
              <p className={classes.label}>{"Payment Method:"}</p>
              <Select
                isMulti={true}
                name="colors"
                options={paymentMethods}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={selectedOptions => {
                  const selectedProducts = selectedOptions.map(option => ({
                    value: option.value,
                    label: option.label
                  }));

                  setSelectedPaymentMethod(prevState => ({
                    ...prevState,
                    paymentMethods: selectedProducts
                  }));
                }}
                theme={theme => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#FF173D",
                    primary: "#FF173D"
                  }
                })}
              />
            </Stack>

            <Grid lg={2} md={2} xs={12} item>
              <ReportDateFilter
                setCustomDateRange={data => setRevenueCustomDateRange(data)}
                setSelectedDateRange={(data: Date | string) =>
                  setRevenueSelectedDateRange(data)
                }
              />
            </Grid>
            <Grid lg={2} xs={12} item>
              <div className={classes.labelDiv}>
                <p className={classes.label}>{"Generate Product Report:"}</p>
              </div>
              <Button
                variant="outlined"
                text={"Revenue Report"}
                onClick={() => {
                  setStockLoading(false);
                  setRevenueLoading(true);
                  setOverviewLoading(false);
                  if (selectedWebsites?.websites.length === 0) {
                    toast.error(
                      "Please Select Website To Generate Revenue Report Report!"
                    );
                    return;
                  }
                  const id_s = selectedWebsites?.websites?.map(item => item.value);

                  const payments = selectedPaymentMethod?.paymentMethods?.map(
                    item => item.value
                  );

                  mutate({
                    staticPath: "/order/report/products_revenue/",
                    website_ids: id_s,
                    brand_id: brand_id,
                    payment_method: payments?.length > 0 ? payments : [],
                    date_range: revenueSelectedDateRange
                      ? revenueSelectedDateRange
                      : revenueCustomDateRange.startDate
                      ? revenueCustomDateRange
                      : "all_time"
                  });
                }}
                icon={<MuiIcon icon="equalizer" />}
                loading={revenueLoading && isLoading && !stockLoading && !overviewLoading}
              />
            </Grid>
          </Grid>
        </>
      )}

      {isRevenue && (
        <Grid
          container
          direction="row"
          justifyContent={"left"}
          alignItems="flex-end"
          gap={3}
          borderTop={"1px solid #FF173D"}
          marginTop={5}
          paddingTop={5}
        >
          <Grid lg={12} md={5} xs={12} item>
            <Typography color="#1A202E" fontWeight="bold">
              Product Stock Status
            </Typography>
          </Grid>
          {dateFilter && (
            <Grid lg={3} md={5} xs={12} item>
              <div className={classes.labelDiv}>
                <p className={classes.label}> At Date</p>
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    // minDate={dayjs(currentDate)}
                    format="DD/MM/YYYY"
                    onChange={value => {
                      if (value?.format("DD/MM/YYYY"))
                        setSelectedStockStatusDate({
                          ...selectedStockStatusDate,
                          expiry_date: value?.format("YYYY/MM/DD")
                        });
                    }}
                    formatDensity="dense"
                    defaultValue={dayjs(selectedStockStatusDate.expiry_date)}
                    slots={{ textField: CalendarTextField }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
          )}

          <Grid
            lg={3}
            xs={12}
            item
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"flex-start"}
          >
            <div className={classes.labelDiv}>
              <p className={classes.label} style={{ marginLeft: "-10px" }}>
                {" "}
                Stock Status
              </p>
            </div>
            <Button
              variant="outlined"
              text={`Get Stock Status`}
              onClick={() => {
                setStockLoading(true);
                setOverviewLoading(false);
                setRevenueLoading(false);
                if (!selectedStockStatusDate?.expiry_date) {
                  toast.error("Please Select Stock Status Date");
                  return;
                }
                mutate({
                  staticPath: "/product_stock_status",
                  at_date: selectedStockStatusDate?.expiry_date?.replaceAll("/", "-"),
                  brand_id: brand_id
                });
              }}
              icon={<MuiIcon icon="equalizer" />}
              loading={isLoading && !revenueLoading && !overviewLoading}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default GenerateReport;
