import {
  CircularProgress,
  IconButtonProps,
  IconButtonOwnProps,
  IconButton
} from "@mui/material";

const LoadingIconButton: React.FC<
  IconButtonOwnProps &
    IconButtonProps & {
      loading?: boolean;
    }
> = ({ children, disabled, loading, ...rest }) => {
  return (
    <IconButton {...rest} disabled={loading || disabled}>
      {loading ? <CircularProgress color="primary" size={20} /> : children}
    </IconButton>
  );
};

export default LoadingIconButton;
