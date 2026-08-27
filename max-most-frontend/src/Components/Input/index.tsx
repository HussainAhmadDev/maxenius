import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  BaseTextFieldProps,
  FormControl,
  FormLabel,
  FormLabelOwnProps,
  IconButton,
  InputAdornment,
  InputBaseComponentProps,
  Skeleton,
  Stack,
  TextField,
  styled,
  useTheme
} from "@mui/material";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

interface InputProps extends BaseTextFieldProps {
  label?: string;
  handleChange?: ({ value, label }: { value: string | number; label: string }) => void;
  disable?: boolean;
  value?: string | number;
  mode?: "light" | "primary";
  placeholder?: string;
  name?: string;
  loading?: boolean;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  readOnly?: boolean;
  noFocus?: boolean;
  min?: number;
  max?: number;
  onChange?(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
}

const Input: React.FC<InputProps> = ({
  label,
  handleChange,
  disable,
  value,
  mode = "primary",
  placeholder,
  name,
  loading = false,
  type,
  required = false,
  readOnly = false,
  noFocus,
  onChange,
  ...props
}) => {
  const [params] = useSearchParams();
  const [showPass, setShowPass] = useState(false);
  const togglePassword = () => setShowPass(!showPass);

  return loading ? (
    <Stack width={"100%"} gap={0.6}>
      {label && <Skeleton width={80} variant="rounded" height={22} animation="wave" />}
      <Skeleton width={"100%"} variant="rounded" height={40} animation="wave" />
    </Stack>
  ) : (
    <FormControl fullWidth size="small">
      {label && (
        <Label mode={mode} htmlFor={label}>
          {label}
        </Label>
      )}
      <StyledTextField
        placeholder={placeholder}
        disabled={disable || props?.disabled}
        name={name}
        value={
          value !== undefined
            ? type === "number"
              ? String(value)?.replace(/^0+(?=\d)/, "")
              : value
            : undefined
        }
        defaultValue={value === undefined ? (name ? params.get(name) : "") : undefined}
        onChange={e => {
          const {
            target: { value }
          } = e;
          if (onChange !== undefined) {
            onChange(e);
          }
          if (handleChange !== undefined && name) {
            handleChange({
              label: name!,
              value: type === "number" ? Number(value) : value
            });
          }
        }}
        size="small"
        type={type === "password" ? (showPass ? "text" : "password") : type}
        required={required}
        {...props}
        inputProps={{
          mode: mode
        }}
        id={props?.id}
        focused={noFocus ? false : readOnly ? true : undefined}
        autoComplete={
          !props.autoComplete && type === "password" ? "new-password" : props.autoComplete
        }
        InputProps={{
          endAdornment: type === "password" && (
            <InputAdornment position="end">
              <IconButton onClick={togglePassword}>
                {showPass ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          readOnly: readOnly,
          inputProps: {
            min: props.min === undefined ? 0 : props.min
          }
        }}
      />
    </FormControl>
  );
};
interface Props extends InputBaseComponentProps {
  mode: "light" | "primary";
}
interface LabelProps extends FormLabelOwnProps {
  mode: "primary" | "light";
}
const StyledTextField = styled(TextField)(({ inputProps, InputProps }) => {
  const { mode } = inputProps as Props;

  return {
    ...(InputProps?.readOnly && {
      "&>input": {
        pointerEvents: "none"
      }
    }),
    ...(mode === "light" && {
      ".Mui-disabled": {
        opacity: ".7 !important",
        cursor: "not-allowed"
      },
      "& fieldset": {
        borderColor: "#fff !important"
      },
      "& > svg": {
        color: "#fff !important"
      },
      "&:hover fieldset": {
        borderColor: "#f8f8f8 !important"
      },
      "div[role='combobox'] , input": {
        color: "#fff !important",
        WebkitTextFillColor: "#fff !important"
      }
    })
  };
});

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
export default Input;
