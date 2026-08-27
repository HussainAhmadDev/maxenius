/* eslint-disable */

import { TableColumn } from "react-data-table-component";
import {
  EditPurchaseOrderProduct,
  PurchaseOrderData,
  PurchaseOrderProductForm,
  ReceivingHistoryData
} from "../Interfaces/PurchaseOrder";
import { Button, IconButton, Stack, Typography, Box } from "@mui/material";
import { ukDateFormat } from "../Utils/datesFormat";
import { Cancel, CheckCircle, DeleteForever, ModeEdit } from "@mui/icons-material";
import Input from "../Components/Input";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import LoadingIconButton from "../Components/LoadingIconButton";
import SeeDocumentation from "../Components/SeeDocumentation";

type Columns<T> = TableColumn<T>[];

interface PurchaseOrderColumnsProps {
  handleDelete(row: PurchaseOrderData): void;
  handleView(row: PurchaseOrderData): void;
  isTrash?: boolean;
  handleRestore?(row: PurchaseOrderData): void;
}
interface RecieveHistoryColumnsProps {
  handleEdit?(values: ReceivingHistoryData | null): void;
  values?: ReceivingHistoryData | null;
  handleDone?(): void;
  loading?: boolean;
}
interface PurchaseOrderProductsColumnsProps {
  handleEdit?(values: PurchaseOrderProductForm | null): void;
  values?: PurchaseOrderProductForm | null;
  handleDone?(): void;
  handleDelete?(values: PurchaseOrderProductForm): void;
  handleBarcode?(values: PurchaseOrderProductForm): void;
  barcodeLoadingId?: string;
  loading?: boolean;
}
interface EditPurchaseOrderProductsColumnsProps {
  handleEdit?(values: PurchaseOrderProductForm | EditPurchaseOrderProduct | null): void;
  values: PurchaseOrderProductForm | EditPurchaseOrderProduct | null;
  handleDone?(): void;
  loading?: boolean;
  handleBarcode?(values: PurchaseOrderProductForm): void;
  barcodeLoadingId?: string;
}

const PurchaseOrderColumns = (
  props: PurchaseOrderColumnsProps
): Columns<PurchaseOrderData> => {
  const { handleDelete, handleView, isTrash, handleRestore } = props;
  return [
    {
      name: "PO#",
      selector: row => row.id || "",
      cell: row => (
        <Button
          id="cy__POId"
          variant="text"
          color="primary"
          onClick={() => handleView(row)}
          sx={{
            justifyContent: "start !important",
            textAlign: "left !important"
          }}
          size="small"
        >
          {`${row?.id} / ${row?.purchase_order_id}`}
        </Button>
      ),
      sortable: true
    },

    {
      name: "Status",
      selector: row => row.status || "",
      cell: row => (
        <Typography textTransform={"capitalize"} variant="body2">
          {row?.status.includes("partially_received") ? "Partially Received" : row.status}
        </Typography>
      ),
      sortable: true
    },

    {
      name: "Product Name",
      selector: row => row?.product_name || "",

      sortable: true
    },

    {
      name: "Date",
      selector: row => row?.ordered || "",
      cell: row => <p>{ukDateFormat(row?.ordered, false)}</p>,
      sortable: true
    },

    {
      name: "Total",
      selector: row => row?.total_amount || 0,
      sortable: true
    },

    {
      name: "Exchange Total",
      selector: row => row?.exchange_total_amount || 0,
      sortable: true
    },
    {
      name: "Action",
      cell(row) {
        return isTrash && handleRestore ? (
          <IconButton
            onClick={() => {
              handleRestore(row);
            }}
          >
            <Box component={"img"} src={"/assets/icons/restore-icon.svg"} />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => {
              handleDelete(row);
            }}
          >
            <DeleteForever sx={{ color: "error.main" }} />
          </IconButton>
        );
      },
      button: true
    }
  ];
};

const RecieveHistoryColumns = (
  props: RecieveHistoryColumnsProps
): Columns<ReceivingHistoryData> => {
  const { handleDone, handleEdit, loading, values } = props;
  return [
    {
      name: "Product Name",
      cell: row => <Typography color={"primary.main"}>{row.product_name}</Typography>,
      minWidth: "120px"
    },
    {
      name: "Batch Number",
      cell: row =>
        row.id === values?.id && handleEdit ? (
          <Input
            name="batch"
            value={values.batch_number}
            handleChange={({ value }) =>
              handleEdit({ ...values, batch_number: String(value) })
            }
          />
        ) : (
          row?.batch_number?.trim() ?? "---"
        ),
      minWidth: "120px"
    },
    {
      name: "Invoice Number",
      cell: row =>
        row.id === values?.id && handleEdit ? (
          <Input
            name="batch"
            value={values.invoice_number}
            handleChange={({ value }) =>
              handleEdit({ ...values, invoice_number: String(value) })
            }
          />
        ) : (
          row.invoice_number || ""
        ),
      minWidth: "120px"
    },
    {
      name: "Exp Date",
      cell: row =>
        row.id === values?.id && handleEdit ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              defaultValue={dayjs(row.expiry_date)}
              slotProps={{
                textField: { size: "small" }
              }}
              disabled={loading && values && values?.id === row.id}
              onChange={value => {
                if (value) {
                  handleEdit({ ...values, expiry_date: value?.format("YYYY/MM/DD") });
                }
              }}
            />
          </LocalizationProvider>
        ) : (
          ukDateFormat(row.expiry_date, false)
        ),
      minWidth: "120px"
    },
    {
      name: "Received",
      cell: row =>
        row.id === values?.id && handleEdit ? (
          <Input
            disabled
            name="receive_quantity"
            type="number"
            value={values.received_quantity}
            handleChange={({ value }) => {
              const inputValue = Number(value);
              if (!isNaN(inputValue) && inputValue >= 0) {
                handleEdit({ ...values, received_quantity: inputValue });
              }
            }}
          />
        ) : (
          row?.received_quantity || ""
        ),
      minWidth: "120px"
    },
    {
      name: "Date",
      cell: row => ukDateFormat(row.created, false),
      minWidth: "120px"
    },
    {
      name: "Status",
      cell: row => (
        <Typography textTransform={"capitalize"} variant="body2">
          {row?.status?.split("_").join(" ")}
        </Typography>
      ),
      minWidth: "120px"
    },
    {
      name: "Action",
      cell: row => {
        return (
          <Stack direction={"row"} flexWrap={"nowrap"}>
            {values && values?.id === row.id && (
              <IconButton
                onClick={() => handleEdit && handleEdit(null)}
                disabled={loading}
              >
                <Cancel color={loading ? "info" : "error"} />
              </IconButton>
            )}
            <LoadingIconButton
              onClick={() =>
                handleDone &&
                handleEdit &&
                (values?.id === row.id ? handleDone() : handleEdit(row))
              }
              loading={Boolean(loading && values && values?.id === row.id)}
              disabled={loading}
            >
              {values?.id === row.id ? (
                <CheckCircle sx={{ color: "primary.main" }} />
              ) : (
                <ModeEdit sx={{ color: loading ? "info.main" : "common.black" }} />
              )}
            </LoadingIconButton>
          </Stack>
        );
      }
    }
  ];
};

const PurchaseOrderProductsColumns = (
  props: PurchaseOrderProductsColumnsProps
): Columns<PurchaseOrderProductForm> => {
  const {
    handleDone,
    handleEdit,
    loading,
    values,
    handleDelete,
    barcodeLoadingId,
    handleBarcode
  } = props;
  return [
    {
      name: "Product Name",
      cell: row => (
        <Typography color={"primary.main"} variant="body2">
          {row.product.label}
        </Typography>
      ),
      minWidth: "120px"
    },
    {
      name: "Quantity",
      cell: row =>
        row.id === values?.id && handleEdit ? (
          <Input
            name="quantity"
            value={values?.quantity}
            min={1}
            type="number"
            handleChange={({ value }) =>
              values && handleEdit({ ...values, quantity: Number(value) })
            }
          />
        ) : (
          row?.quantity || 0
        ),
      minWidth: "120px"
    },
    {
      name: "Price",
      cell: row =>
        row.id === values?.id && handleEdit ? (
          <Input
            name="price"
            value={values?.price}
            type="number"
            handleChange={({ value }) =>
              values && handleEdit({ ...values, price: Number(value) })
            }
          />
        ) : (
          row.price || 0
        ),
      minWidth: "120px"
    },
    {
      name: "Total",
      cell: row =>
        values && row.id === values?.id && handleEdit
          ? values?.quantity * values?.price
          : row.total || 0,
      minWidth: "120px"
    },
    {
      name: "Exchange Price",
      cell: row => row.exchangePrice,
      minWidth: "120px"
    },
    {
      name: "Exchange Total",
      cell: row => row.exchangeTotal,
      minWidth: "120px"
    },
    {
      name: "Action",
      cell: row => {
        return (
          <Stack direction={"row"} flexWrap={"nowrap"}>
            {values && values?.id === row.id && (
              <IconButton
                onClick={() => handleEdit && handleEdit(null)}
                disabled={loading}
              >
                <Cancel color={loading ? "info" : "error"} />
              </IconButton>
            )}
            <LoadingIconButton
              onClick={() =>
                handleDone &&
                handleEdit &&
                (values?.id === row.id ? handleDone() : handleEdit(row))
              }
              loading={Boolean(loading && values && values?.id === row.id)}
              disabled={loading || Boolean(barcodeLoadingId)}
            >
              {values?.id === row.id ? (
                <CheckCircle sx={{ color: "primary.main" }} />
              ) : (
                <ModeEdit
                  sx={{
                    color:
                      loading || Boolean(barcodeLoadingId) ? "info.main" : "common.black"
                  }}
                />
              )}
            </LoadingIconButton>
            {!(values && values?.id === row.id) && handleDelete && (
              <IconButton onClick={() => handleDelete(row)}>
                <DeleteForever sx={{ color: "error.main" }} />
              </IconButton>
            )}
            {handleBarcode && values?.id !== row.id && (
              <LoadingIconButton
                loading={barcodeLoadingId === row?.id}
                disabled={Boolean(barcodeLoadingId && barcodeLoadingId !== row?.id)}
                onClick={() => handleBarcode(row)}
                sx={{
                  ":disabled": {
                    img: {
                      opacity: 0.5
                    }
                  }
                }}
              >
                <Box component={"img"} src="/assets/icons/barcode-icon.svg" width={20} />
              </LoadingIconButton>
            )}
          </Stack>
        );
      }
    }
  ];
};

const EditPurchaseOrderProductsColumns = (
  props: EditPurchaseOrderProductsColumnsProps
): Columns<PurchaseOrderProductForm> => {
  const {
    handleDone,
    handleEdit,
    loading,
    values,
    handleBarcode,
    barcodeLoadingId = false
  } = props;
  return [
    {
      name: "Product Name",
      cell: row => (
        <Typography color={"primary.main"} variant="body2">
          {row.product.label}
        </Typography>
      ),
      minWidth: "120px"
    },
    {
      name: "Quantity",
      cell: row =>
        row.id === values?.id && handleEdit ? (
          <Input
            name="quantity"
            value={values?.quantity}
            min={0}
            type="number"
            handleChange={({ value }) =>
              values && handleEdit({ ...values, quantity: Number(value) })
            }
          />
        ) : (
          row?.quantity || 0
        ),
      minWidth: "120px"
    },
    {
      name: "Price",
      cell: row =>
        row.id === values?.id && handleEdit ? (
          <Input
            name="price"
            value={values?.price}
            type="number"
            handleChange={({ value }) =>
              values && handleEdit({ ...values, price: Number(value) })
            }
          />
        ) : (
          row.price || 0
        ),
      minWidth: "120px"
    },
    {
      name: "Total",
      cell: row =>
        values && row.id === values?.id && handleEdit
          ? values?.quantity * values?.price
          : row?.quantity * row?.price || 0,
      minWidth: "120px"
    },
    {
      name: "Exchange Price",
      cell: row => row.exchangePrice,
      minWidth: "120px"
    },
    {
      name: "Exchange Total",
      cell: row => row.exchangeTotal,
      minWidth: "120px"
    },
    {
      name: "Action",
      cell: row => {
        return (
          <Stack direction={"row"} flexWrap={"nowrap"}>
            {values && values?.id === row.id && (
              <IconButton
                onClick={() => handleEdit && handleEdit(null)}
                disabled={loading}
              >
                <Cancel color={loading ? "info" : "error"} />
              </IconButton>
            )}
            <LoadingIconButton
              onClick={() =>
                handleDone &&
                handleEdit &&
                (values?.id === row.id ? handleDone() : handleEdit(row))
              }
              loading={Boolean(loading && values && values?.id === row.id)}
              disabled={loading || Boolean(barcodeLoadingId)}
            >
              {values?.id === row.id ? (
                <CheckCircle sx={{ color: "primary.main" }} />
              ) : (
                <ModeEdit
                  sx={{
                    color:
                      loading || Boolean(barcodeLoadingId) ? "info.main" : "common.black"
                  }}
                />
              )}
            </LoadingIconButton>
            {handleBarcode && values?.id !== row.id && (
              <LoadingIconButton
                loading={barcodeLoadingId === row?.id}
                disabled={Boolean(barcodeLoadingId && barcodeLoadingId !== row?.id)}
                onClick={() => handleBarcode(row)}
                sx={{
                  ":disabled": {
                    img: {
                      opacity: 0.5
                    }
                  }
                }}
              >
                <Box component={"img"} src="/assets/icons/barcode-icon.svg" width={20} />
              </LoadingIconButton>
            )}
            <SeeDocumentation
              fileName={"useUpdatePurchaseOrderProduct"}
              title={"Edit Doc"}
            />
          </Stack>
        );
      }
    }
  ];
};

const receiveColumns: Columns<EditPurchaseOrderProduct> = [
  {
    name: "Product Name",
    cell: row => (
      <Box>
        <Typography color={"primary"}>{row.product.label}</Typography>
        <Typography hidden id="cy__ReceivingBarcode">
          {row.barcode}
        </Typography>
      </Box>
    )
  },
  {
    name: "Batch",
    cell: row => <p>{(row as any)?.batch_number || "---"}</p>
  },
  {
    name: "Exp Date",
    cell: row => <p>{ukDateFormat((row as any)?.expiry_date, false)}</p>
  },
  {
    name: "Invoice Number",
    cell: row => <p>{(row as any)?.invoice_number || "---"}</p>
  },
  {
    name: "Quantity",
    cell: row => <p>{row.quantity}</p>
  },
  {
    name: "Received",
    cell: row => <p>{row.received}</p>
  }
];
const purchaseOrdersStatusOptions = [
  {
    label: "Pending",
    value: "pending"
  },
  {
    label: "Approved",
    value: "approved"
  },
  {
    label: "Accepted",
    value: "accepted"
  },
  {
    label: "Partial",
    value: "partially_received"
  },
  {
    label: "Delivered",
    value: "delivered"
  }
];
const orderStatus = [
  "pending",
  "approved",
  "accepted",
  "partially_received",
  "delivered"
];
export {
  purchaseOrdersStatusOptions,
  PurchaseOrderProductsColumns,
  PurchaseOrderColumns,
  RecieveHistoryColumns,
  orderStatus,
  receiveColumns,
  EditPurchaseOrderProductsColumns
};
