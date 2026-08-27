import React from "react";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import { Grid } from "@mui/material";
import { useBatchDropDown, useGenerateBatchReport } from "Hooks/useReports";
import ReportDateFilter from "./ReportDateFilter";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import Select from "Components/Form/Select";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

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

const BatchReport = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get("brand_id");

  const { data, isLoading } = useBatchDropDown(brandId);

  const [batchOption, setBatchOption] = React.useState<
    { label: string; value: string }[]
  >([]);

  const [selectedBatchOption, setSelectedBatchOption] = React.useState<{
    label: string;
    value: string;
  }>();

  React.useEffect(() => {
    if (!isLoading && data) {
      // Use the map function to transform data into an array of options
      //eslint-disable-next-line
      const batchOptions = data.map((item: any) => ({
        label: item,
        value: item
      }));

      // Set the batchOption state with the array of options
      batchOptions && setBatchOption(batchOptions);
    }
  }, [isLoading, data]);

  const [selectedDateRange, setSelectedDateRange] = React.useState<Date | string>();
  const [customDateRange, setCustomDateRange] = React.useState<{
    startDate: Date | string;
    endDate: Date | string;
  }>({
    startDate: "",
    endDate: ""
  });

  const { mutate } = useGenerateBatchReport();

  const generateReportHandler = () => {
    const obj = {
      date_range: selectedDateRange
        ? selectedDateRange
        : customDateRange.startDate
        ? customDateRange
        : "all_time",

      batch_number: selectedBatchOption?.value,
      brand_id: brandId
    };
    obj.batch_number ? mutate(obj) : toast.error("batch is required!");
  };

  return (
    <Grid container gap={5} lg={12} md={12} xs={12} item>
      <Grid lg={3} md={5} xs={12} item>
        <ReportDateFilter
          setCustomDateRange={data => setCustomDateRange(data)}
          setSelectedDateRange={(data: Date | string) => setSelectedDateRange(data)}
        />
      </Grid>
      <Grid lg={3} md={5} xs={12} item>
        <div className={classes.labelDiv}>
          <p className={classes.label}>Select Batch#</p>
        </div>
        <Select
          name="Batch"
          defaultValue={{ label: "Select", value: "Select" }}
          options={batchOption}
          disabled={isLoading}
          onChange={value => setSelectedBatchOption(value)}
          loading={isLoading}
        />
      </Grid>
      <Grid lg={3} mt={5} xs={12} item>
        <Button
          variant="outlined"
          text={"Batch Report"}
          onClick={generateReportHandler}
          icon={<MuiIcon icon="equalizer" />}
        />
      </Grid>
    </Grid>
  );
};
export default BatchReport;
