import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack
} from "@mui/material";
import React, { useState } from "react";
import Input from "../../../Components/Input";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { toast } from "react-toastify";
import { useUser } from "../../../Contexts/userContext";
import DataTable from "../../../Components/DataTable";
import { receiveColumns } from "../../../Constants/PurchaseOrders";
import { EditPurchaseOrderData } from "../../../Interfaces/PurchaseOrder";
import { useReceiveOrder } from "../../../Hooks/usePurchaseOrder";
import LoadingButton from "../../../Components/LoadingButton";
import DatePicker from "../../../Components/DatePicker";
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
interface EditReceivingModalProps {
  open: boolean;
  onClose(): void;
  data?: EditPurchaseOrderData;
  progress: boolean;
}
const EditReceivingModal: React.FC<EditReceivingModalProps> = ({
  onClose,
  open,
  data,
  progress
}) => {
  const { user } = useUser();
  const [scanedProductQuantity, setScanedProductQuantity] = useState(0);
  const [visibleInput, setVisibleInput] = useState(true);
  const { mutateAsync, isLoading: receiveLoading } = useReceiveOrder();
  const [item, setItem] = React.useState<{
    sku?: string;
    batch_number?: string;
    expiry_date?: string;
    received_quantity?: number;
    invoice_number?: string;
  }>({ received_quantity: 1 });

  const barcodeRef = React.useRef<HTMLInputElement>(null);
  const batchRef = React.useRef<HTMLInputElement>(null);
  const expiryDateRef = React.useRef<HTMLInputElement>(null);
  const invoiceNumberRef = React.useRef<HTMLInputElement>(null);
  const checkDateFormat = (dateString: string) => {
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    return dateFormat.test(dateString);
  };
  const checkReceivingValidation = () => {
    if (!item.invoice_number) {
      invoiceNumberRef.current?.focus();
      return false;
    }
    if (!item.expiry_date) {
      expiryDateRef.current?.focus();
      return false;
    }
    if (!checkDateFormat(item.expiry_date)) {
      toast.error("Invalid date format. Please enter date in DD-MM-YYYY format.");
      return false;
    }
    if (!item.batch_number) {
      batchRef.current?.focus();
      return false;
    }
    if (!item.sku) {
      barcodeRef.current?.focus();
      return false;
    }

    const convertedExpiryDate = dayjs(item.expiry_date, "DD-MM-YYYY");
    const currentDateWithoutTime = dayjs().startOf("day");
    if (convertedExpiryDate.isSameOrBefore(currentDateWithoutTime)) {
      toast.error(
        `Invalid Expiry Date ${convertedExpiryDate.year()}-${
          convertedExpiryDate.month() + 1
        }-${convertedExpiryDate.date()}`
      );
      return false;
    }
    return true;
  };

  React.useEffect(() => {
    if (user) {
      if (
        user?.is_superuser ||
        user?.is_manager ||
        (user?.is_associate && scanedProductQuantity && scanedProductQuantity > 200)
      ) {
        setVisibleInput(true);
      } else if (
        !scanedProductQuantity ||
        (scanedProductQuantity && scanedProductQuantity < 200)
      ) {
        setVisibleInput(false);
        setItem(prev => ({ ...prev, received_quantity: 1 }));
      }
    }
  }, [user, scanedProductQuantity]);
  const receivingHandler = async () => {
    const { sku } = item;
    let barcodeExist = data?.products.find(item => item.barcode === sku);
    if (!sku) {
      barcodeExist = undefined;
    }
    if (barcodeExist) {
      if (
        Number(barcodeExist.received) + Number(item.received_quantity) <=
          Number(barcodeExist.quantity) &&
        data
      ) {
        mutateAsync({
          ...item,
          purchase_order_id: data.id,
          is_fully_received: true,
          product_id: barcodeExist?.product.value
        }).then(() => {
          setItem({});
          onClose();
        });
      }
    } else {
      toast.error("Item doesn't exist");
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, name: string) => {
    if (event.key === "Enter") {
      switch (name) {
        case "barcode": {
          const validate = checkReceivingValidation();
          if (validate) {
            receivingHandler();
          }
          break;
        }
        case "date": {
          expiryDateRef.current?.focus();
          break;
        }
        case "batch": {
          batchRef.current?.focus();
          break;
        }
      }
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <IconButton
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500]
        }}
        onClick={onClose}
      >
        <Close />
      </IconButton>
      <DialogTitle variant="h6" fontWeight={"bold"}>
        Edit Receiving
      </DialogTitle>
      <DialogContent dividers>
        <Grid container columnSpacing={2}>
          <Grid item xs={12} sm={6} md={3} lg={2.2}>
            <Input
              label="Invoice Number"
              name="invoice_number"
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) =>
                handleKeyPress(event, "date")
              }
              inputRef={invoiceNumberRef}
              InputLabelProps={{ shrink: true }}
              value={item.invoice_number}
              handleChange={({ label, value }) =>
                setItem(prev => ({ ...prev, [label]: value }))
              }
              disable={receiveLoading}
              id="cy__InvoiceNumber"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.2}>
            <DatePicker
              disablePast
              value={item?.expiry_date ? dayjs(item.expiry_date) : undefined}
              onChange={val =>
                setItem({ ...item, expiry_date: dayjs(val).format("YYYY-MM-DD") })
              }
              disabled={receiveLoading}
              label="Exp Date"
              name="expiry_date"
              id="cy__DatePicker"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.2}>
            <Input
              label="Batch"
              name="batch_number"
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) =>
                handleKeyPress(event, "barcode")
              }
              InputLabelProps={{ shrink: true }}
              value={item.batch_number}
              inputRef={batchRef}
              inputProps={{
                maxLength: 12
              }}
              handleChange={({ label, value }) => {
                setItem(prev => ({ ...prev, [label]: value }));
              }}
              disable={receiveLoading}
              id="cy__RecevivngBatch"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.2}>
            <Input
              label="Barcode"
              name="sku"
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) =>
                handleKeyPress(event, "barcode")
              }
              value={item?.sku}
              InputLabelProps={{ shrink: true }}
              inputRef={barcodeRef}
              handleChange={({ label, value }) => {
                if (String(value)?.length > 3) {
                  const productFound = data?.products?.find(
                    item => item.barcode === value
                  );
                  setScanedProductQuantity(productFound?.quantity || 0);
                }
                String(value).length < 15 &&
                  setItem(prev => ({ ...prev, [label]: value }));
              }}
              autoComplete="off"
              onCut={e => e.preventDefault()}
              onCopy={e => e.preventDefault()}
              onPaste={e => e.preventDefault()}
              helperText={`Character Count: ${item?.sku?.length ? item?.sku?.length : 0}`}
              disable={receiveLoading}
              id="cy__EditPurchaseBarcode"
            />
          </Grid>
          {visibleInput && (
            <Grid item xs={12} sm={6} md={3} lg={2.2}>
              <Input
                defaultValue={1}
                disabled={false}
                type="number"
                label="Receive Quantity"
                name="received_quantity"
                InputLabelProps={{ shrink: true }}
                value={item.received_quantity}
                min={0}
                handleChange={({ label, value }) => {
                  setItem(prev => ({ ...prev, [label]: value }));
                }}
                disable={receiveLoading}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={3} lg={1}>
            <Stack minHeight={90} alignItems={"center"} direction={"row"}>
              <LoadingButton
                id="cy__ReceiveButton"
                variant="contained"
                onClick={() => {
                  const validate = checkReceivingValidation();
                  if (validate) {
                    receivingHandler();
                  }
                }}
                loading={receiveLoading}
              >
                Receive
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>

        <Divider />
        <DataTable
          columns={receiveColumns}
          data={data?.products || []}
          loading={progress}
          dense
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditReceivingModal;
