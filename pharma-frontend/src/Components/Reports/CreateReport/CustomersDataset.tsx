import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Select from "Components/Form/Select";
import DatePicker from "Components/Form/Date";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    labelDiv: {
      minWidth: "100px"
    },
    selectDiv: {
      width: "100%"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%"
    },
    inputDiv: {
      width: "49%"
    }
  })
);

interface Option {
  label: string;
  value: string;
}

type DateType = "from" | "to";

interface Props {
  readonly header?: boolean;
  orderedFrom: Date | null;
  orderedTo: Date | null;
  isTaxExempt: Option;
  taxExemptOptions: Option[];
  handleDateChange(dateType: DateType, value: Date | null): void;
  handleTaxPayerType(value: Option): void;
}

const CustomersDataset = (props: Props) => {
  const {
    orderedFrom,
    orderedTo,
    taxExemptOptions,
    handleDateChange,
    handleTaxPayerType
  } = props;

  const classes = useStyles();

  return (
    <>
      <Grid lg={6} xs={12} item>
        <div className={classes.flexAlign}>
          <div className={classes.labelDiv}>
            <p className={classes.label}>Orders From:</p>
          </div>
          <div className={classes.flexAlign}>
            <DatePicker
              onChange={value => {
                handleDateChange("from", value);
              }}
              value={orderedFrom}
              // disabled
            />
          </div>
        </div>
      </Grid>
      <Grid lg={6} xs={12} item>
        <div className={classes.flexAlign}>
          <div className={classes.labelDiv}>
            <p className={classes.label}>Orders To:</p>
          </div>
          <div className={classes.flexAlign}>
            <DatePicker
              onChange={value => {
                handleDateChange("to", value);
              }}
              value={orderedTo}
            />
          </div>
        </div>
      </Grid>

      <Grid lg={6} xs={12} item>
        <div className={classes.flexAlign}>
          <div className={classes.labelDiv}>
            <p className={classes.label}>Tax Exempt:</p>
          </div>
          <div className={classes.selectDiv}>
            <Select
              defaultValue={taxExemptOptions[0]}
              options={taxExemptOptions}
              onChange={handleTaxPayerType}
            />
          </div>
        </div>
      </Grid>
    </>
  );
};

export default CustomersDataset;
