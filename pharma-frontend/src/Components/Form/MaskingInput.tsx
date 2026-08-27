import * as React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputField: {
      borderColor: theme.palette.gray[300],
      borderRadius: "6px",
      width: "100%",
      background: "white",
      outline: "none !important"
    },
    inputFieldError: {
      border: `0.2px solid ${theme.palette.primary.main}`,
      borderRadius: "6px",
      width: "100%",
      background: "white",
      outline: "none !important",
      "& > .MuiBase-input:focus": {
        outline: "none"
      }
    },
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    redText: {
      color: theme.palette.primary.main,
      marginTop: "5px",
      fontSize: "12px"
    }
  })
);

interface Props {
  readonly type: string;
  readonly masking?: boolean;
  readonly onChange?: (name: string, value: string) => void;
  readonly disabled?: boolean;
  readonly style?: React.CSSProperties;
  readonly name: string;
  readonly value?: string | number;
  readonly placeholder?: string;
  readonly limit?: number;
  readonly showMask?: boolean;
  readonly helperText?: string | false | undefined;
  readonly error?: boolean;
  readonly prefix?: string;
  readonly maskType?: "card" | "expDate" | "csc" | "transaction" | "phone" | "number";
  readonly phoneCode?: string;
  readonly ariaLabel?: string;
}

function limit(val: string, max: string) {
  if (val.length === 1 && val[0] > max[0]) {
    val = "0" + val;
  }
  if (val.length === 2) {
    if (Number(val) === 0) {
      val = "01";
    } else if (val > max) {
      val = max;
    }
  }
  return val;
}

function cardExpiry(val: string) {
  const month = limit(val.substring(0, 2), "12");
  const year = val.substring(2, 4);
  return month + (year.length ? "/" + year : "");
}

const NumberFormatCustom: React.FC<Props> = props => {
  const {
    onChange,
    maskType,
    showMask,
    value,
    limit,
    placeholder,
    name,
    disabled,
    error,
    prefix,
    helperText,
    ariaLabel,
    phoneCode
  } = props;
  const classes = useStyles();

  const withValueLimit = ({ floatValue }: NumberFormatValues) =>
    !!(limit ? floatValue && floatValue <= limit : true);

  const maskInputFormat =
    maskType === "card"
      ? "#### #### #### ####"
      : maskType === "expDate"
      ? cardExpiry
      : maskType === "csc"
      ? "####"
      : maskType === "phone"
      ? `${phoneCode ? phoneCode : "+1"} (###) ###-####`
      : maskType === "number"
      ? "###########"
      : undefined;

  return (
    <div>
      <NumberFormat
        format={maskInputFormat}
        customInput={TextField}
        value={maskType === "phone" ? value?.toString().replace(/-/g, "") : value}
        className={error ? classes.inputFieldError : classes.inputField}
        mask={showMask ? "_" : ""}
        thousandSeparator
        placeholder={placeholder}
        isNumericString
        allowNegative={false}
        prefix={prefix}
        isAllowed={withValueLimit}
        disabled={disabled}
        getInputRef={(el: HTMLInputElement) => {
          if (el) el.children[0].children[0].setAttribute("aria-label", ariaLabel || "");
        }}
        onValueChange={values => {
          onChange?.(name, values.value);
        }}
      />
      {error && (
        <Typography variant="body2" className={classes.redText}>
          &nbsp;&nbsp;{helperText}
        </Typography>
      )}
    </div>
  );
};
export default NumberFormatCustom;
