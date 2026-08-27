import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import MultiSelect from "react-select/creatable";
import TextInput from "Components/Form/TextInput";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      color: theme.palette.gray[500],
      fontSize: "12px",
      paddingLeft: 8,
      marginRight: 80,
      minWidth: 80,
      width: "auto"
    },

    selectDiv: {
      width: "100%"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center"
    },
    inputDiv: {
      width: "49%"
    }
  })
);
interface Props {
  readonly header?: boolean;
  skus: string[];
  setSkus: React.Dispatch<React.SetStateAction<string[]>>;
  priceFrom: number;
  priceTo: number;
  setPriceFrom: React.Dispatch<React.SetStateAction<number>>;
  setPriceTo: React.Dispatch<React.SetStateAction<number>>;
}

interface Option {
  value: string;
  label: string;
}

const OrdersDataset = (props: Props) => {
  const { setSkus, skus, priceFrom, setPriceFrom, priceTo, setPriceTo } = props;
  const classes = useStyles();

  return (
    <>
      <Grid item lg={6} md={6}>
        <div className={classes.flexAlign}>
          <span className={classes.label}>Price From:</span>
          <TextInput
            aria-label="Price From"
            placeholder="$0.00"
            type="number"
            name="priceFrom"
            value={priceFrom}
            onChange={e => setPriceFrom(Number(e.target.value))}
          />
        </div>
      </Grid>

      <Grid item lg={6} md={6}>
        <div className={classes.flexAlign}>
          <span className={classes.label}>Price To:</span>
          <TextInput
            aria-label="Price To"
            placeholder="$0.00"
            value={priceTo}
            type="number"
            name="priceTo"
            onChange={e => setPriceTo(Number(e.target.value))}
          />
        </div>
      </Grid>

      <Grid item lg={12} md={12}>
        <div className={classes.flexAlign}>
          <span className={classes.label}>Sku(s):</span>
          <MultiSelect
            aria-label="SKUS"
            placeholder="Add SKUs"
            style={{ width: `100%` }}
            isMulti
            className={classes.selectDiv}
            value={skus.map(sku => ({ label: sku, value: sku }))}
            //@ts-expect-error this
            onChange={(value: Option[]) => {
              setSkus(value.map(v => v.value));
            }}
          />
        </div>
      </Grid>
    </>
  );
};

export default OrdersDataset;
