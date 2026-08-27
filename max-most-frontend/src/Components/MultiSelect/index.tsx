import {
  Autocomplete,
  FormControl,
  FormLabel,
  FormLabelOwnProps,
  Skeleton,
  Stack,
  TextField,
  styled,
  useTheme
} from "@mui/material";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  label: string;
  mode?: "primary" | "light";
  value?: string[];
  handleSelect?: (selectedOption: Option[], name: string) => void;
  placeholder?: string;
  noDefault?: boolean;
  name?: string;
  loading?: boolean;
  disable?: boolean;
  maxWidth?: number;
  id?: string;
}

function MultiSelect({
  options,
  label,
  mode = "primary",
  handleSelect,
  placeholder = "",
  name,
  loading = false,
  disable,
  maxWidth,
  id
}: MultiSelectProps) {
  return loading ? (
    <Stack width={"100%"} gap={0.6} sx={{ maxWidth: maxWidth || "unset" }}>
      <Skeleton width={80} variant="rounded" height={22} animation="wave" />
      <Skeleton width={"100%"} variant="rounded" height={40} animation="wave" />
    </Stack>
  ) : (
    <FormControl fullWidth size="small" sx={{ maxWidth: maxWidth || "unset" }}>
      <Label htmlFor={label} mode={mode}>
        {label}
      </Label>
      <Autocomplete
        size="small"
        id={id}
        ChipProps={{
          color: "primary"
        }}
        multiple
        getOptionKey={opt => opt?.value}
        onChange={(_e, value) => {
          const originalValue = value.map(el => el.value) as string[];
          const opts = options.filter(el => originalValue?.includes(String(el?.value)));
          if (name) {
            handleSelect && handleSelect(opts || [], name);
          }
        }}
        isOptionEqualToValue={(opt, val) => opt.value === val.value}
        options={options}
        getOptionLabel={opt => opt.label}
        renderInput={params => (
          <TextField {...params} placeholder={placeholder || "Select..."} />
        )}
        disableClearable
        disableCloseOnSelect
        disabled={disable}
      />
    </FormControl>
  );
}
interface LabelProps extends FormLabelOwnProps {
  mode: "primary" | "light";
}
const Label = styled(FormLabel)(({ mode }: LabelProps) => {
  const {
    palette: {
      common: { white, black }
    }
  } = useTheme();
  return {
    fontSize: 14,
    fontWeight: 400,
    color: `${mode === "light" ? white : black} !important`,
    marginBottom: "6px"
  };
});
export default MultiSelect;
