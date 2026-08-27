import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import useMediaQuery from "@mui/material/useMediaQuery";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { useTheme } from "@mui/material/styles";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    labelInTab: {
      marginBottom: "6px",
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    takeOrder: {
      width: "100%",
      "& > div": {
        marginTop: "6x",
        "& > input": {
          padding: "9px 14px"
        }
      }
    },
    custumDate: {
      width: "100%",
      "& > div": {
        "& > input": {
          padding: "7px 14px"
        }
      }
    },
    textGrid: {
      display: "flex",
      alignItems: "center"
    },
    labelDiv: {
      minWidth: "130px"
    },
    textFieldContainer: {
      position: "relative",
      width: "100%"
    },
    endAdornment: {
      position: "absolute",
      top: "50%",
      right: "14px"
    },
    notDisabled: {
      "& .MuiInputBase-root .Mui-disabled": {
        backgroundColor: "white !important",
        cursor: "pointer"
      }
    }
  })
);

interface Props {
  readonly label?: string;
  readonly pageName?: string;
  readonly value: Date | null;
  readonly margin?: string;
  readonly onChange?: (e: Date | null) => void;
  readonly disabled?: boolean;
  readonly inputAriaLabel?: string;
}
const BasicDatePicker: React.FC<Props> = props => {
  const theme = useTheme();
  const tablet = useMediaQuery(theme.breakpoints.up("md"));
  const { label, onChange, value, pageName, disabled } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
      <Grid item lg={12} md={12} xs={12} className={tablet ? classes.textGrid : ""}>
        {label && (
          <div className={classes.labelDiv}>
            <span className={tablet ? classes.label : classes.labelInTab}>{label}:</span>
          </div>
        )}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={value}
            onChange={(e: Date | null) => onChange?.(e)}
            disabled={disabled}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            //eslint-disable-next-line
            renderInput={({ inputRef, inputProps, InputProps }: any) => (
              <div className={classes.textFieldContainer}>
                <TextField
                  aria-label={props.inputAriaLabel}
                  ref={inputRef}
                  disabled
                  inputProps={{ ...inputProps, disabled: true }}
                  className={`${pageName ? classes.takeOrder : classes.custumDate} ${
                    !disabled ? classes.notDisabled : ""
                  }`}
                  onClick={() => {
                    if (!disabled) setOpen(true);
                  }}
                />
                <div className={classes.endAdornment}>{InputProps?.endAdornment}</div>
              </div>
            )}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};
export default BasicDatePicker;
