import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Select from "Components/Form/Select";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import CalendarComponent from "./CalendarComponent"; // Import your calendar component here
// Define a TypeScript type for the date options
type DateOption = {
  label: string;
  value: string;
};

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
    }
  })
);

interface Obj {
  startDate: string | Date;
  endDate: string | Date;
}

interface IDateRange {
  expiryProduct?: boolean;
  setSelectedDateRange: (date: Date | string) => void;
  setCustomDateRange: (dateRange: Obj) => void;
}

const ReportDateFilter: React.FC<IDateRange> = ({
  expiryProduct,
  setSelectedDateRange,
  setCustomDateRange
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [, setSelectedOption] = useState<string>("all_time"); // Default selected option
  const [showCalendar, setShowCalendar] = useState<boolean>(false); // State to show/hide the calendar

  const [dateRange, setDateRange] = React.useState<{
    startDate: Date | string;
    endDate: Date | string;
  }>({
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    if (expiryProduct) {
      handleDateRangeChange({ label: "Today and Before", value: "current_date" });
    }
    //eslint-disable-next-line
  }, [expiryProduct]);

  //eslint-disable-next-line
  const handleDateRangeChange = ({ value, label }: { value: string; label: string }) => {
    setSelectedOption(value);

    if (value === "date_range") {
      setSelectedDateRange("");
      setShowCalendar(true);
    } else {
      setShowCalendar(false);
      setCustomDateRange({
        endDate: "",
        startDate: ""
      });

      // Handle other date range options
      const selectedValue = value;

      if (selectedValue === "current_date") {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
        setSelectedDateRange(formattedDate);
      } else if (selectedValue === "current_week_to_date") {
        const today = new Date();
        const startOfWeek = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - today.getDay()
        );
        const formattedDate = `${startOfWeek.getFullYear()}-${(startOfWeek.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${startOfWeek.getDate().toString().padStart(2, "0")}`;
        setSelectedDateRange(formattedDate);
      } else if (selectedValue === "current_month_to_date") {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const formattedDate = `${startOfMonth.getFullYear()}-${(
          startOfMonth.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${startOfMonth.getDate().toString().padStart(2, "0")}`;
        setSelectedDateRange(formattedDate);
      } else if (selectedValue === "current_year_to_date") {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const formattedDate = `${startOfYear.getFullYear()}-${(startOfYear.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${startOfYear.getDate().toString().padStart(2, "0")}`;
        setSelectedDateRange(formattedDate);
      } else if (selectedValue === "all_time") {
        setSelectedDateRange("all_time"); // or any other value or logic for "All Time"
      }
    }
  };
  React.useEffect(() => {
    const obj = {
      startDate: "",
      endDate: ""
    };

    const startDateInYYYYMMDDFormat =
      dateRange?.startDate && new Date(dateRange.startDate).toLocaleDateString("en-US");

    const endDateInYYYYMMDDFormat =
      dateRange?.endDate && new Date(dateRange.endDate).toLocaleDateString("en-US");

    obj.startDate = startDateInYYYYMMDDFormat;
    obj.endDate = endDateInYYYYMMDDFormat;
    // Clear and set the new date range

    setCustomDateRange(obj);
    //eslint-disable-next-line
  }, [dateRange]);
  // Define the date options, including "Choose Date Range"
  const dateOptions: DateOption[] = [
    { label: "All Time", value: "all_time" },
    { label: `${expiryProduct ? "Today and Before" : "Today"}`, value: "current_date" },
    { label: "Week to Date", value: "current_week_to_date" },
    { label: "Month to Date", value: "current_month_to_date" },
    { label: "Year to Date", value: "current_year_to_date" },
    { label: "Choose Date Range", value: "date_range" } // Add the new option
  ];

  return (
    <Grid container direction="row" justifyContent={"left"}>
      <Grid lg={12} xs={12} item>
        <div className={classes.labelDiv}>
          <p className={classes.label}>Date Range:</p>
        </div>
        <div className={classes.selectDiv}>
          <Select
            name="DateRange"
            defaultValue={
              expiryProduct
                ? { label: "Today and Before", value: "current_date" }
                : { label: "All Time", value: "all_time" }
            }
            options={dateOptions}
            onChange={handleDateRangeChange}
          />
        </div>
      </Grid>

      {showCalendar && (
        <Grid mt={5} container lg={12} xs={12} item>
          <CalendarComponent setDateRange={data => setDateRange(data)} />
        </Grid>
      )}
    </Grid>
  );
};

export default ReportDateFilter;
