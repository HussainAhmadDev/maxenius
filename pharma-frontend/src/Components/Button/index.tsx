import * as React from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";
import Loader from "../Loader";

interface Props {
  readonly size?: "medium" | "small";
  readonly text?: string;
  // This should be renamed to something like colorClass etc.
  // TODO: fix naming of this prop
  readonly type?:
    | "secondary"
    | "secondaryOutlined"
    | "primary"
    | "primaryOutlined"
    | "neutral";
  readonly onClick?: () => void;
  readonly disabled?: boolean;
  readonly fullWidth?: boolean;
  readonly loading?: boolean;
  readonly icon?: React.ReactElement;
  readonly onlyIcon?: boolean;
  readonly variant?: "text" | "outlined" | "contained" | undefined;
  readonly style?: React.CSSProperties;
  readonly submit?: "submit";
  readonly ariaLabel?: string;
  readonly form?: string;
  readonly id?: string;
}
// styles

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    secondary: {
      background: "#FFFFFF",
      border: `0.5px solid ${theme.palette.gray[300]}`,
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
      borderRadius: "6px",
      color: theme.palette.gray[900],
      fontWeight: 500
    },
    secondaryOutlined: {
      textTransform: "initial",
      border: `0.5px solid ${theme.palette.gray[300]}`,
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
      borderRadius: "6px",
      color: theme.palette.gray[300],
      fontWeight: 500
    },
    primary: {
      "&:hover": {
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main
      },
      background: theme.palette.primary.main,
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
      borderRadius: "6px",
      color: "white",
      fontWeight: 500
    },
    primaryOutlined: {
      border: `0.5px solid ${theme.palette.primary.main}`,
      background: "white",
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
      borderRadius: "6px",
      color: theme.palette.primary.main,
      fontWeight: 500
    },
    neutral: {
      background: theme.palette.gray[700],
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
      borderRadius: "6px",
      color: "white",
      fontWeight: 500
    },
    loaderSpan: {
      margin: "auto"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center"
    },
    text: {
      fontSize: "14px"
    },
    loader: {
      paddingBottom: "3px"
    }
  })
);

const CustomButton: React.FC<Props> = ({
  text,
  onClick,
  type,
  disabled,
  icon,
  size,
  onlyIcon,
  variant,
  style,
  fullWidth,
  loading,
  submit,
  ariaLabel,
  form,
  id
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <div>
      {!onlyIcon ? (
        <Button
          aria-label={ariaLabel}
          variant={variant}
          className={`${type ? classes[type] : ""}`}
          onClick={onClick}
          disabled={disabled || loading}
          size={size}
          style={style}
          fullWidth={fullWidth}
          type={submit}
          startIcon={icon}
          form={form}
          id={id}
        >
          <div className={classes.loaderSpan}>
            {loading ? (
              <div className={classes.loader}>
                <Loader />
              </div>
            ) : (
              <div className={classes.flexAlign}>{text}</div>
            )}
          </div>
        </Button>
      ) : (
        <IconButton
          aria-label={ariaLabel}
          style={style}
          className={`${type ? classes[type] : ""}`}
          onClick={onClick}
          size={size}
          disabled={disabled || loading}
        >
          <div className={classes.loaderSpan}>
            {loading ? (
              <div className={classes.loader}>
                <Loader />
              </div>
            ) : (
              <div className={classes.flexAlign}>{icon}</div>
            )}
          </div>
        </IconButton>
      )}
    </div>
  );
};

export default CustomButton;
