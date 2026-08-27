import {
  Autocomplete,
  BaseTextFieldProps,
  FormControl,
  FormLabel,
  FormLabelOwnProps,
  Skeleton,
  Stack,
  SxProps,
  TextField,
  Theme,
  styled,
  useTheme
} from "@mui/material";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends BaseTextFieldProps {
  options: Option[];
  label: string;
  mode?: "primary" | "light";
  value?: string | string[];
  handleSelect?: (selectedOption: Option, name: string) => void;
  placeholder?: string;
  name?: string;
  loading?: boolean;
  disable?: boolean;
  maxWidth?: number;
  subValue?: string;
}

function SelectField({
  options,
  label,
  mode = "primary",
  handleSelect,
  placeholder = "",
  name,
  loading = false,
  value,
  disable,
  maxWidth,
  id,
  subValue,
  ...props
}: SelectFieldProps) {
  const [params] = useSearchParams();
  const initialValue = useMemo(
    () => (value !== undefined ? value : name ? params.get(name) || "" : ""),
    [value, name, params]
  );

  return loading ? (
    <Stack width={"100%"} gap={0.6} sx={{ maxWidth: maxWidth || "unset" }}>
      <Skeleton width={80} variant="rounded" height={22} animation="wave" />
      <Skeleton width={"100%"} variant="rounded" height={40} animation="wave" />
    </Stack>
  ) : (
    <FormControl
      fullWidth
      size="small"
      sx={{ maxWidth: maxWidth || "unset" }}
      key={String(initialValue)}
    >
      <Label htmlFor={label} mode={mode}>
        {label}
      </Label>
      <Autocomplete
        size="small"
        id={id}
        value={options.find(
          el => String(el?.value)?.toLowerCase() === String(initialValue)?.toLowerCase()
        )}
        onChange={(_e, value) => {
          const opt = options.find(
            el => String(el?.value)?.toLowerCase() === String(value?.value)?.toLowerCase()
          );
          if (opt && name) {
            handleSelect && handleSelect(opt, name);
          }
        }}
        getOptionKey={opt => opt?.value}
        isOptionEqualToValue={(opt, val) => opt.value === val.value}
        options={options}
        sx={{ ...(mode === "light" ? sxProps : {}) }}
        getOptionLabel={opt => opt.label}
        renderInput={params => {
          params.inputProps.value =
            params.inputProps.value && subValue
              ? `${params.inputProps.value} ${subValue}`
              : params.inputProps.value;
          return (
            <TextField {...params} placeholder={placeholder || "Select..."} {...props} />
          );
        }}
        disableClearable
        disabled={disable || props?.disabled}
      />
    </FormControl>
  );
}
const sxProps: SxProps<Theme> = {
  fieldset: {
    borderColor: "#fff !important"
  },
  "svg , input": {
    color: "#fff"
  },
  "div[role='combobox']": {
    color: "#fff !important"
  }
};
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
export default SelectField;
