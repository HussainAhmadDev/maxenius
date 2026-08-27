import { Dayjs } from "dayjs";
import {
  FormControl,
  FormLabel,
  Skeleton,
  Stack,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider, DatePicker as Handler } from "@mui/x-date-pickers";

interface Props extends DatePickerProps<Dayjs, false> {
  label?: string;
  loading?: boolean;
  maxWidth?: number;
  id?: string;
}
const DatePicker: React.FC<Props> = ({ label, loading, maxWidth, id, ...props }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
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
          slotProps={{
            textField: { size: "small", id }
          }}
          orientation={matches ? "landscape" : "portrait"}
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

export default DatePicker;
