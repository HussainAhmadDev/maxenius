import {
  BaseTextFieldProps,
  FormControl,
  FormLabel,
  InputBaseComponentProps,
  Skeleton,
  Stack,
  TextField,
  styled
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

interface InputProps extends BaseTextFieldProps {
  label?: string;
  handleChange?: (vals: { label: string; value: string }) => void;
  disable?: boolean;
  value?: string;
  mode?: "light" | "primary";
  placeholder?: string;
  name?: string;
  loading?: boolean;
  maxLength?: number;
}

function TextArea({
  label,
  handleChange,
  disable,
  value,
  mode = "primary",
  placeholder,
  name,
  loading = false,
  maxLength,
  ...props
}: InputProps) {
  const [params] = useSearchParams();
  return loading ? (
    <Stack width={"100%"} gap={0.6}>
      {label && <Skeleton width={80} variant="rounded" height={22} animation="wave" />}
      <Skeleton width={"100%"} variant="rounded" height={100} animation="wave" />
    </Stack>
  ) : (
    <FormControl fullWidth size="small">
      {label && (
        <FormLabel
          htmlFor={label}
          sx={{
            fontSize: 14,
            fontWeight: 400,
            color: mode === "light" ? "#fff" : "unset"
          }}
        >
          {label}
        </FormLabel>
      )}
      <StyledTextField
        placeholder={placeholder}
        disabled={disable}
        name={label}
        value={value ? value : name ? params.get(name) ?? "" : ""}
        onChange={({ target: { value } }) =>
          handleChange && name && handleChange({ label: name, value })
        }
        size="small"
        multiline
        minRows={4}
        maxRows={6}
        inputProps={{
          mode: mode,
          maxLength: maxLength
        }}
        {...props}
      />
    </FormControl>
  );
}
interface Props extends InputBaseComponentProps {
  mode: "light" | "primary";
}
const StyledTextField = styled(TextField)(({ inputProps }) => {
  const { mode } = inputProps as Props;
  if (mode === "light") {
    return {
      "&> fieldset": {
        borderColor: "#fff !important"
      },
      "&> svg": {
        color: "#fff"
      },
      "&:hover fieldset": {
        borderColor: "#f8f8f8 !important"
      },
      "div[role='combobox'] , input": {
        color: "#fff !important"
      }
    };
  }
});
export default TextArea;
