/* eslint-disable react-refresh/only-export-components */
import { TableColumn } from "react-data-table-component";
import { QuoteData, QuoteFormProduct } from "../Interfaces/quotatonsTypes";
import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { ukDateFormat } from "../Utils/datesFormat";
import { Cancel, CheckCircle, DeleteForever, ModeEdit } from "@mui/icons-material";
import Input from "../Components/Input";
import LoadingIconButton from "../Components/LoadingIconButton";
import { Link } from "react-router-dom";

type Columns<T> = TableColumn<T>[];
interface QuotesColumnsProps {
  handleEdit(row: QuoteData): void;
  handleDelete(row: QuoteData): void;
  handleRestore(row: QuoteData): void;
  isTrash?: boolean;
}
interface QuoteProductColumnsProps {
  handleEdit?(values: QuoteFormProduct | null): void;
  values?: QuoteFormProduct | null;
  handleDone?(): void;
  handleDelete?(values: QuoteFormProduct): void;
  updateLoading?: boolean;
  deleteLoading?: boolean;
}

const QuotesColumns = (props: QuotesColumnsProps): Columns<QuoteData> => {
  const { handleDelete, isTrash, handleRestore, handleEdit } = props;
  const {
    palette: {
      primary: { main }
    }
  } = useTheme();
  return [
    {
      name: "Vendor Name",
      selector: row => row.vendor_name,
      cell: row => (
        <Button
          variant="text"
          color="primary"
          sx={{
            justifyContent: "start !important",
            textAlign: "left !important"
          }}
          size="small"
          id="cy__VendorName"
        >
          {row?.vendor_name}
        </Button>
      ),
      sortable: true
    },

    {
      name: "Status",
      selector: row => row.status || "",
      cell: row => {
        const statusId = `status-${row?.status?.toLowerCase()}`;
        return (
          <Typography id={statusId} textTransform={"capitalize"} variant="body2">
            {row?.status}
          </Typography>
        );
      },
      sortable: true
    },

    {
      name: "Product Name",
      selector: row => row?.product_name || "",
      sortable: true
    },

    {
      name: "Date",
      selector: row => row?.quotation_date || "",
      cell: row => <p>{ukDateFormat(row?.quotation_date, false)}</p>,
      sortable: true
    },
    {
      name: "Purchase Order Id",
      selector: row => row?.purchase_order_id,
      cell: row => {
        return row?.purchase_order_id ? (
          <Link
            to={`/edit-purchaseOrder/${row?.purchase_order_id}`}
            target="_blank"
            style={{ color: main }}
            className="underline-hover"
          >
            {row?.purchase_order_id || "----"}
          </Link>
        ) : (
          "---"
        );
      },
      ignoreRowClick: true
    },
    {
      name: "Action",
      cell(row) {
        return (
          <Stack direction={"row"}>
            {isTrash && handleRestore ? (
              <IconButton
                onClick={() => {
                  handleRestore(row);
                }}
              >
                <Box component={"img"} src={"/assets/icons/restore-icon.svg"} />
              </IconButton>
            ) : (
              <>
                <IconButton
                  onClick={() => {
                    handleEdit(row);
                  }}
                >
                  <ModeEdit sx={{ color: "primary.main" }} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleDelete(row);
                  }}
                  disabled={Boolean(row?.purchase_order_id)}
                  id="cy__TrashBtn"
                >
                  <DeleteForever
                    sx={{
                      color: row?.purchase_order_id ? "info.main" : "error.main"
                    }}
                  />
                </IconButton>
              </>
            )}
          </Stack>
        );
      },
      button: true
    }
  ];
};

const QuoteProductColumns = (
  props: QuoteProductColumnsProps
): Columns<QuoteFormProduct> => {
  const { handleDone, handleEdit, values, handleDelete, deleteLoading, updateLoading } =
    props;
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
        row.id === values?.id && !deleteLoading && handleEdit ? (
          <Input
            name="quantity"
            value={values?.quantity || 0}
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
        row.id === values?.id && !deleteLoading && handleEdit ? (
          <Input
            name="price"
            value={values?.price || 0}
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
          ? (values?.quantity || 0) * (values?.price || 0)
          : row.total || 0,
      minWidth: "120px"
    },
    {
      name: "Action",
      cell: row => {
        return (
          <Stack direction={"row"} flexWrap={"nowrap"}>
            {!deleteLoading && values && values?.id === row.id && (
              <IconButton
                onClick={() => handleEdit && handleEdit(null)}
                disabled={updateLoading}
              >
                <Cancel color={updateLoading ? "info" : "error"} />
              </IconButton>
            )}
            <LoadingIconButton
              onClick={() =>
                handleDone &&
                handleEdit &&
                (values?.id === row.id ? handleDone() : handleEdit(row))
              }
              loading={Boolean(updateLoading && values && values?.id === row.id)}
              disabled={updateLoading}
            >
              {!deleteLoading && values?.id === row.id ? (
                <CheckCircle sx={{ color: "primary.main" }} />
              ) : (
                <ModeEdit sx={{ color: updateLoading ? "info.main" : "common.black" }} />
              )}
            </LoadingIconButton>
            {!(values && values?.id === row.id && !deleteLoading) && handleDelete && (
              <LoadingIconButton
                id={`cy__trashButton_${row.id}`}
                onClick={() => handleDelete(row)}
                loading={values?.id === row.id && deleteLoading}
                disabled={values?.id !== row.id && deleteLoading}
              >
                <DeleteForever sx={{ color: "error.main" }} />
              </LoadingIconButton>
            )}
          </Stack>
        );
      }
    }
  ];
};
const quotesStatusOptions = [
  {
    label: "Pending",
    value: "pending"
  },
  {
    label: "Approved",
    value: "approved"
  },
  {
    label: "Rejected",
    value: "rejected"
  }
];
export { QuotesColumns, QuoteProductColumns, quotesStatusOptions };
