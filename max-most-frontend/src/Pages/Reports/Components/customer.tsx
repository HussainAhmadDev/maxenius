import { CardContent, Grid, Stack, Typography } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import DateRangePicker from "../../../Components/DateRangePicker";
import SelectField from "../../../Components/SelectField";
import { rangesOptions } from "../../../Constants/reportsConst";
import dayjs from "dayjs";
import LoadingButton from "../../../Components/LoadingButton";
import { useCreateCustomerReport } from "../../../Hooks/useReports";
import { useState } from "react";
import { toast } from "react-toastify";
import { TDateRange } from "../../../Interfaces/reportsTypes";

function Customer() {
  const { mutateAsync, isLoading } = useCreateCustomerReport();
  const [values, setValues] = useState<{ range: string; to_from: string[] }>({
    range: "all_time",
    to_from: []
  });

  const getRange = (): TDateRange | null => {
    if (values.range === "custom") {
      if (values.to_from.length > 1) {
        return {
          startDate: values.to_from[0],
          endDate: values.to_from[1]
        };
      } else {
        toast.error("Please specify the date range");
        return null;
      }
    } else if (values.range === "all_time") {
      return values.range;
    } else {
      return dayjs(values.range).format("YYYY-MM-DD");
    }
  };

  const handleReport = async () => {
    try {
      const range = getRange();
      if (range) {
        await mutateAsync({
          staticPath: "/customer/report/spent/",
          date_range: range
        });
      }
    } catch (error) {
      toast.error((error as Error)?.message);
    }
  };

  return (
    <>
      <CardContent>
        <Typography variant="h4" fontWeight={"600"} mb={2}>
          Customer Spent Report :
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={4} sm={6} xs={12}>
            <SelectField
              label="Date Range :"
              options={rangesOptions}
              name="range"
              handleSelect={({ value }, name) => setValues({ ...values, [name]: value })}
              value={values.range?.toString()}
              id="cy__CustomerDateRange"
            />
          </Grid>
          {values.range === "custom" && (
            <Grid item md={4} sm={6} xs={12}>
              <DateRangePicker
                label="From - To :"
                value={[
                  dayjs(values?.to_from?.[0] || undefined),
                  dayjs(values?.to_from?.[1] || undefined)
                ]}
                onAccept={val =>
                  setValues({
                    ...values,
                    to_from: val.map(el => dayjs(el).format("M/D/YYYY"))
                  })
                }
                id="cy__CustomerFromTo"
              />
            </Grid>
          )}
        </Grid>
        <Stack gap={1} alignItems={"start"} justifyItems={"start"} mt={3}>
          <Typography variant="body2">Generate Customer Spent Report :</Typography>
          <LoadingButton
            size="medium"
            variant="contained"
            startIcon={<TrendingUp />}
            onClick={handleReport}
            loading={isLoading}
            id="cy__GenerateCustomerSpentReport"
          >
            Generate Customer Spent Report
          </LoadingButton>
        </Stack>
      </CardContent>
    </>
  );
}

export default Customer;
