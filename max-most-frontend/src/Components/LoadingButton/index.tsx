import { Button, ButtonBaseProps, ButtonOwnProps, CircularProgress } from "@mui/material";

const LoadingButton: React.FC<
  ButtonBaseProps &
    ButtonOwnProps & {
      loading?: boolean;
    }
> = ({ children, startIcon, endIcon, disabled, loading, ...rest }) => {
  return (
    <Button
      {...rest}
      startIcon={
        loading
          ? startIcon &&
            !endIcon && (
              <CircularProgress
                color={rest.variant === "contained" ? "primary" : "info"}
                size={16}
              />
            )
          : startIcon
      }
      endIcon={
        loading
          ? ((!startIcon && endIcon) || (!startIcon && !endIcon)) && (
              <CircularProgress
                color={rest.variant === "contained" ? "primary" : "info"}
                size={16}
              />
            )
          : endIcon
      }
      disabled={loading || disabled}
    >
      {children}
    </Button>
  );
};

export default LoadingButton;
