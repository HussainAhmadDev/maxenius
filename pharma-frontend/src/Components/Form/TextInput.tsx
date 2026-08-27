import * as React from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { selectText } from "Utils/selectText";
import { useTheme } from "@mui/material/styles";
import { FilledInputProps } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputField: {
      borderColor: theme.palette.gray[300],
      borderRadius: "6px",
      width: "100%",
      background: "white"
    },
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    textGrid: {
      display: "flex",
      alignItems: "center"
    },

    labelDiv: {
      minWidth: "130px"
    }
  })
);

interface Props {
  readonly type: string;
  readonly id?: string;
  readonly disabled?: boolean;
  readonly variant?: "filled" | "standard" | "outlined";
  readonly style?: React.CSSProperties;
  readonly name: string;
  readonly value?: string | number;
  readonly label?: string;
  readonly isMultiline?: boolean;
  readonly placeholder?: string;
  readonly margin?: "dense" | "none";
  readonly minRows?: number;
  readonly maxRows?: number;
  readonly error?: boolean;
  readonly helperText?: string | false | undefined;
  readonly defaultValue?: TextFieldProps["defaultValue"];
  readonly inputProps?: FilledInputProps["inputProps"];

  readonly onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const TextInput: React.FC<Props> = props => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const {
    type,
    id,
    onChange,
    variant,
    value,
    name,
    label,
    isMultiline,
    placeholder,
    margin,
    disabled,
    minRows,
    maxRows,
    style,
    error,
    helperText,
    defaultValue,
    inputProps
  } = props;
  const classes = useStyles();
  return (
    <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
      <Grid item lg={12} xs={12} className={matches ? classes.textGrid : ""}>
        {label && (
          <div className={classes.labelDiv}>
            <span className={classes.label}>{label}:</span>
          </div>
        )}
        <TextField
          className={classes.inputField}
          type={type}
          id={id}
          name={name}
          value={value}
          variant={variant}
          placeholder={placeholder}
          disabled={disabled}
          onChange={e => onChange?.(e)}
          margin={margin}
          multiline={isMultiline}
          minRows={minRows}
          maxRows={maxRows}
          style={style}
          error={error}
          inputProps={{
            onDoubleClick: selectText,
            ...inputProps
          }}
          helperText={helperText}
          defaultValue={defaultValue}
        />
      </Grid>
    </Grid>
  );
};

export default TextInput;
