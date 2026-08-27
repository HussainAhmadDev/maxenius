import dayjs, { Dayjs } from "dayjs";
import {
  DateRangePicker as Handler,
  DateRangePickerProps,
  LocalizationProvider,
  SingleInputDateRangeField
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { PickersShortcutsItem } from "@mui/x-date-pickers/PickersShortcuts";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import { FormControl, FormLabel, Skeleton, Stack, styled } from "@mui/material";

interface Props extends DateRangePickerProps<Dayjs, false> {
  label?: string;
  loading?: boolean;
  maxWidth?: number;
  id?: string;
}
const DateRangePicker: React.FC<Props> = ({ label, loading, maxWidth, id, ...props }) => {
  return loading ? (
    <Stack width={"100%"} gap={0.6} sx={{ maxWidth: maxWidth || "unset" }}>
      {label && <Skeleton width={80} variant="rounded" height={22} animation="wave" />}
      <Skeleton width={"100%"} variant="rounded" height={40} animation="wave" />
    </Stack>
  ) : (
    <FormControl fullWidth size="small" sx={{ maxWidth: maxWidth || "unset" }}>
      {label && <Label>{label}</Label>}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Handler
          slots={{
            field: SingleInputDateRangeField
          }}
          slotProps={{
            textField: {
              size: "small",
              id
            },
            shortcuts: {
              items: shortcutsItems
            }
          }}
          format="DD/MM/YYYY" // Specify the date format here
          {...props}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

const Label = styled(FormLabel)(({ theme }) => {
  const {
    palette: {
      common: { black }
    }
  } = theme;
  return {
    fontSize: 14,
    fontWeight: 400,
    color: black,
    marginBottom: "6px"
  };
});
const shortcutsItems: PickersShortcutsItem<DateRange<dayjs.Dayjs>>[] = [
  {
    label: "This Week",
    getValue: () => {
      const today = dayjs();
      return [today.startOf("week"), today.endOf("week")];
    }
  },
  {
    label: "Last Week",
    getValue: () => {
      const today = dayjs();
      const prevWeek = today.subtract(7, "day");
      return [prevWeek.startOf("week"), prevWeek.endOf("week")];
    }
  },
  {
    label: "Last 7 Days",
    getValue: () => {
      const today = dayjs();
      return [today.subtract(7, "day"), today];
    }
  },
  {
    label: "Current Month",
    getValue: () => {
      const today = dayjs();
      return [today.startOf("month"), today.endOf("month")];
    }
  },
  {
    label: "Next Month",
    getValue: () => {
      const today = dayjs();
      const startOfNextMonth = today.endOf("month").add(1, "day");
      return [startOfNextMonth, startOfNextMonth.endOf("month")];
    }
  }
];
export default DateRangePicker;
