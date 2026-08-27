import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  EditQuoteResponse,
  QuoteToPurchaseOrder
} from "../../../../Interfaces/quotatonsTypes";
import { useQuoteToPurchaseOrder } from "../../../../Hooks/useQuotation";
import { Grid } from "@mui/material";
import Input from "../../../../Components/Input";
import SelectField from "../../../../Components/SelectField";
import { useWarehouses } from "../../../../Hooks/useWarehouses";
import { currencyOptions } from "../../../../Constants";
import { useBrandContext } from "../../../../Contexts/brandContext";
import { toast } from "react-toastify";
import LoadingButton from "../../../../Components/LoadingButton";
interface QuoteToPoModalProps {
  open: boolean;
  onClose(): void;
  quote?: EditQuoteResponse;
}
const QuoteToPoModal: React.FC<QuoteToPoModalProps> = ({ onClose, open, quote }) => {
  const [values, setValues] = useState<QuoteToPurchaseOrder>({
    exchange_rate: "1",
    invoicing_currency: "",
    quotation_id: quote?.id || "",
    unit_cost_amounts: "tax exclusive",
    warehouse_id: ""
  });
  const { brand } = useBrandContext();

  const brandRef = useRef(brand);
  const { mutateAsync, isLoading } = useQuoteToPurchaseOrder();

  const { data: locations, isLoading: locationLoading } = useWarehouses();
  const locationData = useMemo(() => {
    if (locations?.results?.length) {
      return locations?.results?.map(loc => {
        return {
          value: loc.id,
          label: loc.name
        };
      });
    }
    return [];
  }, [locations]);
  const handleSubmit = () => {
    if (!quote?.id) {
      toast.error("Invalid Quote");
      return;
    }
    mutateAsync({
      ...values,
      exchange_rate: Number(values?.exchange_rate) <= 0 ? "1" : values?.exchange_rate,
      quotation_id: quote?.id
    }).then(() => {
      onClose();
    });
  };
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };
  useEffect(() => {
    if (!brandRef.current) {
      return;
    }
    const brandCurrency = brandRef.current.currency.toLowerCase();
    const matchCurrency = currencyOptions.find(
      item => item.value.toLowerCase() === brandCurrency
    );
    if (matchCurrency && !values.invoicing_currency) {
      setValues(prev => ({
        ...prev,
        invoicing_currency: matchCurrency.value,
        exchange_rate: "1"
      }));
    }
  }, [values.invoicing_currency]);

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Move to Purchase Order
      </DialogTitle>
      <IconButton
        aria-label="close"
        disabled={isLoading}
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <SelectField
              options={locationData}
              loading={locationLoading}
              label="Location :"
              name="warehouse_id"
              value={values?.warehouse_id}
              handleSelect={({ value }) => setValues({ ...values, warehouse_id: value })}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Input
              label="Organization Currency :"
              value={brand?.currency?.toUpperCase()}
              disable
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <SelectField
              label="Invoice Currency :"
              name="invoicing_currency"
              value={values.invoicing_currency}
              options={currencyOptions}
              handleSelect={({ value }) =>
                setValues({ ...values, invoicing_currency: value?.toUpperCase() })
              }
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Input
              label="Exchange Rate :"
              type="number"
              min={0}
              name="exchange_rate"
              value={values?.exchange_rate}
              disabled={
                values?.invoicing_currency?.toLowerCase() ===
                brand?.currency?.toLowerCase()
              }
              handleChange={({ value }) =>
                setValues({ ...values, exchange_rate: value?.toString() })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button
          color="secondary"
          variant="contained"
          onClick={handleClose}
          disabled={isLoading}
        >
          Close
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleSubmit}
          disabled={!quote?.id || !values?.warehouse_id || !values?.invoicing_currency}
          loading={isLoading}
        >
          Process
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default QuoteToPoModal;
