import { CardContent, Grid, Stack, Typography } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import DateRangePicker from "../../../Components/DateRangePicker";
import SelectField from "../../../Components/SelectField";
import { rangesOptions } from "../../../Constants/reportsConst";
import dayjs from "dayjs";
import LoadingButton from "../../../Components/LoadingButton";
import { useBatches, useCreateCustomerReport } from "../../../Hooks/useReports";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { TDateRange } from "../../../Interfaces/reportsTypes";
import { SelectOption } from "../../../Interfaces/ui";

function BatchDetails() {
  const { mutateAsync, isLoading } = useCreateCustomerReport();
  const { data: batches, isLoading: batchesLoading } = useBatches();
  const [values, setValues] = useState<{
    range: string;
    to_from: string[];
    batch_number: string;
  }>({
    range: "all_time",
    to_from: [],
    batch_number: ""
  });

  const batchOptions: SelectOption[] = useMemo(() => {
    if (batches?.length) {
      return batches?.map(el => {
        return {
          label: el,
          value: el
        };
      });
    } else {
      return [];
    }
  }, [batches]);

  const getRange = (): TDateRange | null => {
    if (values.range === "custom") {
      if (values.to_from.length > 1) {
        return {
          startDate: values.to_from[0],
          endDate: values.to_from[1]
        };
      } else {
        toast.error("Please specify dates range");
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
      if (!values.batch_number) {
        throw new Error("batch is required");
      }
      const range = getRange();
      if (range) {
        await mutateAsync({
          staticPath: "/customer/batch/detail/",
          date_range: range,
          batch_number: values.batch_number
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
          Batch Report :
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={4} sm={6} xs={12}>
            <SelectField
              label="Select Batch # :"
              options={batchOptions}
              loading={batchesLoading}
              name="batch_number"
              handleSelect={({ value }, name) => setValues({ ...values, [name]: value })}
              value={values.batch_number?.toString()}
              id="cy__SelectBatch"
            />
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <SelectField
              label="Date Range :"
              options={rangesOptions}
              name="range"
              handleSelect={({ value }, name) => setValues({ ...values, [name]: value })}
              value={values.range?.toString()}
              id="cy__BatchDateRange"
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
                id="cy__BatchFromto"
              />
            </Grid>
          )}
        </Grid>
        <Stack gap={1} alignItems={"start"} justifyItems={"start"} mt={3}>
          <Typography variant="body2">Generate Batch Report :</Typography>
          <LoadingButton
            size="medium"
            variant="contained"
            startIcon={<TrendingUp />}
            onClick={handleReport}
            loading={isLoading}
            id="cy__GenerateBatchReport"
          >
            Generate Batch Report
          </LoadingButton>
        </Stack>
      </CardContent>
    </>
  );
}

export default BatchDetails;
