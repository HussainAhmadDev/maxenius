/* eslint-disable react-refresh/only-export-components */
import { TableColumn } from "react-data-table-component";
import {
  Box,
  Button,
  IconButton,
  Palette,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import {
  Cancel,
  CheckCircle,
  DeleteForever,
  Done,
  DoneAll,
  FiberManualRecord,
  ModeEdit,
  RemoveRedEye
} from "@mui/icons-material";

import { ukDateFormat } from "../Utils/datesFormat";
import {
  HistoryData,
  OrderData,
  PaymentData,
  ResponseOrderBatch,
  Returned
} from "../Interfaces/Orders";

import Chip from "../Components/Chip";
import { SelectOption } from "../Interfaces/ui";
import { OrderProduct } from "../Interfaces/Orders";
import { getBrandDetails } from "../Hooks/api";
import Input from "../Components/Input";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import LoadingIconButton from "../Components/LoadingIconButton";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type Columns<T> = TableColumn<T>[];
type Props = {
  handleDelete(row: OrderData): void;
  handleView(row: OrderData): void;
  handleRestore?(row: OrderData): void;
  isTrash?: boolean;
  restoreLoading?: boolean;
};
type OrderProductsColumnsProps = {
  handleDirections?(row: OrderProduct): void;
  handlePatientHistory?(row: OrderProduct): void;
  handleBatchExpiry?(row: OrderProduct): void;
  handleEdit?(values: OrderProduct | null): void;
  values?: OrderProduct | null;
  vat?: OrderProduct | null;
  // setSubTotalTax?: SetStateAction<number> | undefined;
  setSubTotalTax?: (value: number) => void;
  handleDone?(): void;
  loading?: boolean;
};
type OrderBatchExpiryColumnsProps = {
  handleEdit(values: ResponseOrderBatch | null): void;
  values: ResponseOrderBatch | null;
  handleDone(): void;
  loading: boolean;
};
type OrderShipmentHistoryProps = {
  handleEdit(values: OrderProduct | null): void;
  values: OrderProduct | null;
  handleDone(): void;
  loading: boolean;
};
type OrderAddReturnProps = {
  handleEdit(props: { vals: OrderProduct | null; qty: number | null }): void;
  values: { vals: OrderProduct | null; qty: number | null };
  handleDone(): void;
  loading: boolean;
};
const OrdersColumns = (props: Props): Columns<OrderData> => {
  const { handleDelete, handleView, isTrash, handleRestore } = props;

  return [
    {
      name: "Customer Name",
      sortable: true,
      cell: row => {
        return (
          <Button
            id="cy__Customer"
            variant="text"
            color="primary"
            onClick={() => handleView(row)}
            sx={{
              justifyContent: "start !important",
              textAlign: "left !important"
            }}
            size="small"
          >
            {row.billing_address_first_name + " " + row.billing_address_last_name}
          </Button>
        );
      },
      minWidth: "140px"
    },
    {
      name: "Website Order ID",
      sortable: true,
      cell: row => {
        const { status, notes, website_order_id, packing_slip_print, invoice_print } =
          row;
        const isProcessingOrOnHold = status === "processing" || status === "on_hold";
        const hasSourceWithU = notes?.some(item =>
          item?.source?.toLowerCase().trim().includes("u")
        );
        const hasTextWithGuest = notes?.some(item =>
          item?.text?.toLowerCase().trim().includes("guest")
        );
        const hasTextWithClick = notes?.some(item =>
          item?.text?.toLowerCase().trim().includes("click")
        );

        return (
          <Stack direction="row" alignItems="center" gap={0.3}>
            {website_order_id && <Typography noWrap>{website_order_id}</Typography>}
            {isProcessingOrOnHold && (
              <>
                {hasSourceWithU && <FiberManualRecord sx={{ color: "grey.A200" }} />}
                {hasTextWithGuest ? (
                  <FiberManualRecord sx={{ color: "error.main" }} />
                ) : (
                  hasTextWithClick && <FiberManualRecord sx={{ color: "grey.A100" }} />
                )}
              </>
            )}
            {packing_slip_print && invoice_print ? (
              <IconButton>
                <DoneAll sx={{ color: "success.main" }} />
              </IconButton>
            ) : (
              (packing_slip_print || invoice_print) && (
                <IconButton>
                  <Done sx={{ color: "success.main" }} />
                </IconButton>
              )
            )}
          </Stack>
        );
      }
    },
    {
      name: "Website",
      selector: row => `${row.website ? row.website : "---"}`,
      sortable: true,
      id: "cy__OrderWebsiteTable"
    },
    {
      name: "Order Date",
      selector: row => (row?.ordered ? ukDateFormat(row?.ordered, true) : "---"),
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Order No.",
      selector: row => row.number,
      cell: row => <Typography id="cy__OrderID">{row.number}</Typography>,
      sortable: true
    },
    {
      name: "QB Ref",
      selector: row => row?.quickbook_reference_number,
      cell: row => <Typography>{row?.quickbook_reference_number ?? ""}</Typography>,
      sortable: true
    },
    {
      name: "Status",
      selector: row => row?.status || "",
      cell: row => {
        const status = row?.status?.toLowerCase();
        let color: keyof Palette;

        switch (status) {
          case "on_hold":
          case "refunded":
          case "partially_refunded":
          case "cancelled":
            color = "error";
            break;
          case "dispensed":
            color = "info";
            break;
          case "completed":
            color = "success";
            break;
          default:
            color = "warning";
        }

        return (
          <Chip
            color={color}
            label={row?.status?.replace(/_/g, " ")?.toUpperCase()}
            variant="filled"
            size="small"
          />
        );
      },
      sortable: true,
      minWidth: "160px"
    },
    {
      name: "Shipment Status",
      selector: row => row?.shipping_status || "",
      cell: row => {
        const status = row?.shipping_status;
        let color: keyof Palette;

        switch (status) {
          case "not_shipped":
            color = "error";
            break;
          case "partially_shipped":
            color = "warning";
            break;
          default:
            color = "success";
        }

        return (
          <Chip
            label={status?.replace(/_/g, " ")?.toUpperCase()}
            color={color}
            variant="filled"
            size="small"
          />
        );
      },
      sortable: true,
      minWidth: "160px"
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

const OrderProductsColumns = (
  props: OrderProductsColumnsProps
): Columns<OrderProduct> => {
  const {
    handleDirections,
    handlePatientHistory,
    handleBatchExpiry,
    handleDone,
    handleEdit,
    // values,
    loading,
    vat,
    setSubTotalTax
  } = props;
  return [
    {
      name: "Name",
      selector: row => row.product?.name || "",
      cell(row) {
        return (
          <Stack gap={0.2} justifyContent={"start"} width={"100%"} py={1}>
            <Typography variant="body2" color={"primary.main"} title={row?.product?.name}>
              {row?.product?.name}
            </Typography>
            {row?.direction && (
              <Stack
                width={"100%"}
                direction={"row"}
                justifyContent={"start"}
                gap={1}
                alignItems={"center"}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"start"}
                  alignItems={"center"}
                  flex={1}
                  width={"100%"}
                >
                  <Typography variant="body2" noWrap fontWeight={"bold"}>
                    Directions :
                  </Typography>
                  {handleDirections && (
                    <IconButton onClick={() => handleDirections(row)} size="small">
                      <ModeEdit fontSize="small" sx={{ color: "common.black" }} />
                    </IconButton>
                  )}
                </Stack>
                <Typography variant="body2" flex={2} title={row?.direction}>
                  {row?.direction}
                </Typography>
              </Stack>
            )}
            {row?.prescription_id && (
              <Stack
                direction={"row"}
                gap={1}
                justifyContent={"start"}
                alignItems={"center"}
                width={"100%"}
              >
                <Tooltip title="Prescription Id">
                  <Typography noWrap flex={1} variant="body2" fontWeight={"bold"}>
                    Rx id :
                  </Typography>
                </Tooltip>

                <Typography variant="body2" flex={2} title={row.prescription_id}>
                  {row.prescription_id}
                </Typography>
              </Stack>
            )}
            {row?.patient_name && (
              <Stack width={"100%"} direction={"row"} gap={1} alignItems={"center"}>
                <Stack
                  direction={"row"}
                  gap={0}
                  justifyContent={"start"}
                  alignItems={"center"}
                  width={"100%"}
                  flex={1}
                >
                  <Typography variant="body2" noWrap fontWeight={"bold"}>
                    Patient Name :
                  </Typography>
                  {handlePatientHistory && (
                    <IconButton onClick={() => handlePatientHistory(row)}>
                      <RemoveRedEye sx={{ color: "primary.main" }} />
                    </IconButton>
                  )}
                </Stack>
                <Typography variant="body2" flex={2} title={row?.patient_name}>
                  {row?.patient_name}
                </Typography>
              </Stack>
            )}
          </Stack>
        );
      },

      minWidth: "250px"
    },
    {
      name: "Batch & Expiry",
      cell: row => {
        return row?.batch_details?.length ? (
          <Box sx={{ position: "relative", padding: handleBatchExpiry ? "20px 0" : "0" }}>
            <Box
              sx={{
                borderRadius: "2px",
                overflowX: "hidden",
                overflowY: "auto",
                outline: theme => `1px solid ${theme.palette.primary.main}`,
                table: {
                  "td,th": {
                    outline: theme => `1px solid ${theme.palette.primary.main}`,
                    padding: "2px"
                  },
                  th: {
                    padding: "2px",
                    background: theme => theme.palette.primary.main,
                    color: theme => theme.palette.common.white,
                    fontSize: "12px"
                  }
                },
                maxHeight: 100
              }}
            >
              <table cellSpacing={0}>
                <thead>
                  <tr>
                    {["Batch Number", "Expiry Date", "Sold Qty"].map((heading, key) => (
                      <th key={key}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {row?.batch_details?.map((item, index) => (
                    <tr key={index}>
                      {(
                        [
                          "batch_number",
                          "expiry_date",
                          "quantity_sold"
                        ] as (keyof typeof item)[]
                      ).map((sub, key) => (
                        <td key={key}>{item[sub] || "---"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            {handleBatchExpiry && (
              <IconButton
                sx={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px"
                }}
                size="small"
                onClick={() => handleBatchExpiry(row)}
              >
                <RemoveRedEye sx={{ color: "primary.main" }} fontSize="small" />
              </IconButton>
            )}
          </Box>
        ) : (
          "---"
        );
      },

      minWidth: "270px"
    },
    {
      name: "Qty",
      selector: row => row.quantity
    },
    {
      name: "Returned",
      cell(row) {
        const val = row?.order_product_return
          ?.map(item => +item.return_shipment.quantity)
          .reduce((sum, quantity) => sum + quantity, 0);
        const brand = getBrandDetails();
        return val ? `${brand?.currency_symbol}${val?.toFixed(2) || 0}` : "---";
      }
    },
    //_______________________________
    // {
    //   name: "Cost Price",
    //   cell: row =>
    //     row.id === values?.id && handleEdit ? (
    //       <Input
    //         name="price"
    //         value={values?.cost_price}
    //         type="number"
    //         handleChange={({ value }) =>
    //           values && handleEdit({ ...values, cost_price: Number(value) })
    //         }
    //       />
    //     ) : (
    //       row?.cost_price || 0
    //     ),
    //   minWidth: "120px"
    // },

    {
      name: "Unit Price",
      selector: row => row?.unit_price || "---",
      cell: row => {
        const brand = getBrandDetails();
        return row?.unit_price
          ? `${brand?.currency_symbol}${row?.unit_price?.toFixed(2)}`
          : "---";
      }
    },
    {
      name: "Shipping Date",
      selector: row => row?.ship_date || "---",
      cell: row =>
        row.ship_date?.toLowerCase() === "none"
          ? "---"
          : row?.ship_date
            ? ukDateFormat(row?.ship_date, false)
            : "---",

      minWidth: "150px"
    },
    // {
    //   name: "Total Price",
    //   selector: row => row.total_cost,
    //   cell: row => {
    //     const brand = getBrandDetails();
    //     const price = row?.unit_price || 0;
    //     const quantity = row?.quantity || 0;
    //     const vatPercent = row?.vat_percent || 0;

    //     const totalValue = price * quantity;
    //     const vatAmount = (totalValue * vatPercent) / 100;
    //     const totalWithVAT = totalValue + vatAmount;

    //     return totalValue
    //       ? `${brand?.currency_symbol}${totalWithVAT?.toFixed(2)}`
    //       : "---";
    //   }
    // },
    {
      name: "Total Price",
      selector: row => row.total_cost,
      cell: row => {
        const brand = getBrandDetails();
        return row?.total_cost
          ? `${brand?.currency_symbol}${row?.total_cost?.toFixed(2)}`
          : "---";
      }
    },
    //_________________________Vat Percent ___________________

    {
      name: "VAT %",
      cell: row =>
        row.id === vat?.id && handleEdit ? (
          <Input
            name="vat"
            value={vat?.vat_percent}
            type="number"
            handleChange={({ value }) =>
              vat && handleEdit({ ...vat, vat_percent: Number(value) })
            }
          />
        ) : (
          row?.vat_percent || 0
        ),
      minWidth: "120px"
    },
    {
      name: "Tax",
      selector: row => {
        const price = row?.unit_price || 0;
        const quantity = row?.quantity || 0;
        const vatPercent = vat?.id === row.id ? vat?.vat_percent : row?.vat_percent || 0;

        const totalValue = price * quantity;
        const vatAmount = (totalValue * vatPercent) / 100;

        return vatAmount || 0;
      },
      cell: row => {
        const brand = getBrandDetails();
        const price = row?.unit_price || 0;
        const quantity = row?.quantity || 0;
        const vatPercent = vat?.id === row.id ? vat?.vat_percent : row?.vat_percent || 0;

        const totalValue = price * quantity;
        const vatAmount = (totalValue * vatPercent) / 100;
        // totalTax
        if (vatAmount && setSubTotalTax) {
          setSubTotalTax(vatAmount);
        }

        return totalValue ? `${brand?.currency_symbol}${vatAmount?.toFixed(2)}` : "---";
      }
    },

    //____________________________________________
    // cost price
    // {
    //   name: "Action",
    //   cell: row => {
    //     return (
    //       <Stack direction={"row"} flexWrap={"nowrap"}>
    //         {values && values?.id === row.id && (
    //           <IconButton
    //             onClick={() => handleEdit && handleEdit(null)}
    //             disabled={loading}
    //           >
    //             <Cancel color={loading ? "info" : "error"} />
    //           </IconButton>
    //         )}
    //         <LoadingIconButton
    //           onClick={() =>
    //             handleDone &&
    //             handleEdit &&
    //             (values?.id === row.id ? handleDone() : handleEdit(row))
    //           }
    //           loading={Boolean(loading && values && values?.id === row.id)}
    //         >
    //           {values?.id === row.id ? (
    //             <CheckCircle sx={{ color: "primary.main" }} />
    //           ) : (
    //             <ModeEdit />
    //           )}
    //         </LoadingIconButton>
    //       </Stack>
    //     );
    //   }
    // }
    {
      name: "Action",
      cell: row => {
        return (
          <Stack direction={"row"} flexWrap={"nowrap"}>
            {vat && vat?.id === row.id && (
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
                (vat?.id === row.id ? handleDone() : handleEdit(row))
              }
              loading={Boolean(loading && vat && vat?.id === row.id)}
            >
              {vat?.id === row.id ? (
                <CheckCircle sx={{ color: "primary.main" }} />
              ) : (
                <ModeEdit />
              )}
            </LoadingIconButton>
          </Stack>
        );
      }
    }
  ];
};

const OrderShipmentHistoryColumns = (
  props?: OrderShipmentHistoryProps
): Columns<OrderProduct> => {
  const columns: Columns<OrderProduct> = [
    {
      name: "Product Name",
      cell: row => (
        <Stack width={"100%"} gap={0.2}>
          <Typography variant="body2" color="primary.main" title={row?.product?.name}>
            {row?.product?.name || "--"}
          </Typography>
          <Typography variant="body2" title={row?.prescription_id}>
            {row.prescription_id ? (
              <>
                <b>Prescription id: </b>
                {row?.prescription_id}
              </>
            ) : (
              ""
            )}
          </Typography>
          <Typography id="cy__shipment_barcode" display={"none"}>
            {row?.product?.barcode}
          </Typography>
        </Stack>
      ),

      minWidth: "200px"
    },
    {
      name: "Qty Ordered",
      selector: row => row.quantity,
      cell: row => <Typography id="cy__OrderedQty">{row.quantity}</Typography>
    },
    {
      name: "Returned",
      cell: row => {
        const val =
          row?.order_product_return?.reduce(
            (sum, item) => sum + +item.return_shipment.quantity,
            0
          ) || 0;
        return <Typography id="cy__ReturnedQty">{val || 0}</Typography>;
      }
    },
    {
      name: "Shipped",
      selector: row => row.shipped_quantity || 0,
      cell: row => {
        if (props) {
          const val =
            row?.order_product_return?.reduce(
              (sum, item) => sum + +item.return_shipment.quantity,
              0
            ) || 0;
          const { values, handleEdit, loading } = props;
          return values?.id === row.id ? (
            <Input
              value={Number(values?.shipped_quantity || 0)}
              disable={loading}
              handleChange={({ value }) => {
                if (
                  Number(value) <=
                    (Number(row.quantity) || 0) -
                      (Number(val) || 0) -
                      (Number(row.shipped_quantity) || 0) &&
                  Number(value) >= 0
                ) {
                  handleEdit({ ...values, shipped_quantity: Number(value) });
                }
              }}
              min={0}
              name="shipped_quantity"
              type="number"
            />
          ) : (
            <Typography id="cy__ShippedQty">{row.shipped_quantity || 0}</Typography>
          );
        } else {
          return row.shipped_quantity || 0;
        }
      }
    },
    {
      name: "Date",
      id: "cy__Date",
      cell: row => ukDateFormat(row?.ship_date, false)
    },
    {
      name: "Status",
      cell: row => {
        const title =
          +row.shipped_quantity === 0
            ? "Not Shipped"
            : (row.quantity -
                  row?.order_product_return?.reduce(
                    (sum, item) => sum + +item.return_shipment.quantity,
                    0
                  ) || 0) <= row.shipped_quantity
              ? "Shipped"
              : "Partially Shipped";
        let color: keyof Palette;
        switch (title) {
          case "Shipped":
            color = "success";
            break;
          case "Not Shipped":
            color = "warning";
            break;
          case "Partially Shipped":
            color = "warning";
            break;
          default:
            color = "primary";
            break;
        }
        return <Chip variant="filled" color={color} label={title} />;
      }
    }
  ];
  if (props) {
    const { values, loading, handleEdit, handleDone } = props;
    columns.pop();
    columns.push({
      name: "Action",
      id: "cy__Action",
      cell: row => {
        return (
          <Stack direction={"row"} flexWrap={"nowrap"}>
            {values && values?.id === row.id && (
              <IconButton onClick={() => handleEdit(null)} disabled={loading}>
                <Cancel color={loading ? "info" : "error"} />
              </IconButton>
            )}
            <LoadingIconButton
              onClick={() => (values?.id === row.id ? handleDone() : handleEdit(row))}
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
    });
  }
  return columns;
};
const OrderPaymentHistoryColumns = (): Columns<PaymentData> => {
  return [
    {
      name: "Date",
      selector: row => ukDateFormat(row.created, false)
    },
    {
      name: "Payment Method",
      selector: row => row?.payment_method?.name
    },
    {
      name: "Transaction ID",
      selector: row => row?.receipt
    },
    {
      name: "Paid",
      cell: row => {
        const brand = getBrandDetails();
        const currencySymbol = brand?.currency_symbol;
        return `${currencySymbol}${Number(row.total).toFixed(2)}`;
      }
    },
    {
      name: "Refunded",
      cell: row => `${row.is_refunded ? "YES" : "NO"}`
    },
    {
      name: "Status",
      selector: row => row.status,
      cell: row => (
        <Chip color="success" variant="filled" label={row?.status.toUpperCase()} />
      )
    }
  ];
};

const OrderReturnHistoryColumns = (): Columns<Returned> => {
  return [
    {
      name: "Product Name",
      cell: row => (
        <Stack width={"100%"} gap={0.2}>
          <Typography variant="body2" color={"primary.main"} title={row.name}>
            {row.name || "--"}
          </Typography>
          <Typography variant="body2" title={row?.prescription_id}>
            {row.prescription_id ? (
              <>
                <b>Prescription id: </b>
                {row?.prescription_id}
              </>
            ) : (
              ""
            )}
          </Typography>
        </Stack>
      )
    },
    {
      name: "Qty Ordered",
      selector: row => row.quantityOrdered || 0
    },
    {
      name: "Returned",
      selector: row => row.quantityReturned || 0
    },
    {
      name: "Shipped",
      selector: row => row.quantityShipped || 0
    },

    {
      name: "Date",
      selector: row => row.date || "--"
    },
    {
      name: "Amount Refunded",
      selector: row => row.amountRefunded || "--"
    }
  ];
};
const OrderAddReturnColumns = (props: OrderAddReturnProps): Columns<OrderProduct> => {
  const { handleDone, handleEdit, loading, values } = props;
  return [
    {
      name: "Product Name",
      cell: row => (
        <Stack width={"100%"} gap={0.2}>
          <Typography variant="body2" color={"primary.main"} title={row?.product?.name}>
            {row?.product?.name || "--"}
          </Typography>
          <Typography variant="body2" title={row?.prescription_id}>
            {row.prescription_id ? (
              <>
                <b>Prescription id: </b>
                {row?.prescription_id}
              </>
            ) : (
              ""
            )}
          </Typography>
        </Stack>
      ),
      minWidth: "140px"
    },
    {
      name: "Price",
      selector: row => row?.unit_price || 0,
      minWidth: "80px"
    },
    {
      name: "Qty Ordered",
      selector: row => row?.quantity || 0,
      minWidth: "80px"
    },
    {
      name: "Returned",
      cell: row => {
        const returned = row.order_product_return.find(
          item => item.ordered_product_id === row.id && item
        );
        return returned?.return_shipment?.quantity || 0;
      }
    },
    {
      name: "Shipping Qty",
      selector: row => Number(row?.shipped_quantity) || 0
    },
    {
      name: "Current Qty",
      cell: row => {
        const returned = row.order_product_return.find(
          item => item.ordered_product_id === row.id && item
        );
        return Number(
          row?.quantity -
            (returned?.return_shipment?.quantity || 0) -
            Number(row?.shipped_quantity) || 0
        );
      }
    },
    {
      name: "Return",
      cell: row => {
        const returned = row.order_product_return.find(
          item => item.ordered_product_id === row.id && item
        );
        return values.vals?.id === row.id ? (
          <Input
            value={values?.qty || 0}
            disable={loading}
            name="quantity"
            type="number"
            id="cy__ReturnQty"
            handleChange={({ value }) => {
              const quantity = Number(value);
              if (
                Number(quantity) >= 0 &&
                Number(quantity) <=
                  Number(
                    row?.quantity -
                      (returned?.return_shipment?.quantity || 0) -
                      Number(row?.shipped_quantity) || 0
                  )
              ) {
                handleEdit({ qty: quantity, vals: row });
              }
            }}
          />
        ) : (
          row?.return_shipment?.quantity || 0
        );
      },
      minWidth: "100px"
    },
    {
      name: "Action",
      cell: row => {
        return (
          <Stack direction={"row"} flexWrap={"nowrap"}>
            <LoadingIconButton
              id="cy__AddRetrnEditbtn"
              onClick={() =>
                row.id === values.vals?.id
                  ? handleDone()
                  : handleEdit({ qty: 0, vals: row })
              }
              loading={Boolean(row.id === values.vals?.id && loading)}
              disabled={loading}
            >
              {values?.vals?.id === row.id ? (
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
const OrderBatchExpiryColumns = (
  props: OrderBatchExpiryColumnsProps
): Columns<ResponseOrderBatch> => {
  const { values, handleDone, handleEdit, loading } = props;
  return [
    {
      name: "Invoice #",
      selector: row => row.invoice_number,
      cell: row =>
        values?.id === row.id ? (
          <Input
            value={values.invoice_number}
            name="invoice_number"
            handleChange={({ value }) => {
              handleEdit({ ...values, invoice_number: String(value) });
            }}
            disable={loading && values && values?.id === row.id}
          />
        ) : (
          row.invoice_number
        ),
      minWidth: "150px"
    },
    {
      name: "Batch #",
      selector: row => row.batch_number,
      cell: row =>
        values?.id === row.id ? (
          <Input
            value={values.batch_number}
            name="batch_number"
            handleChange={({ value }) => {
              handleEdit({ ...values, batch_number: String(value) });
            }}
            disable={loading && values && values?.id === row.id}
          />
        ) : (
          row.batch_number
        ),
      minWidth: "150px"
    },
    {
      name: "Expiry Date",
      selector: row => row.expiry_date,
      cell: row =>
        values?.id === row.id ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              defaultValue={dayjs(row.expiry_date)}
              slotProps={{
                textField: { size: "small" }
              }}
              disabled={loading && values && values?.id === row.id}
              onChange={value => {
                if (value) {
                  const formattedDate = value
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss.SSSSSS[+00:00]");
                  handleEdit({
                    ...values,
                    expiry_date: formattedDate
                  });
                }
              }}
            />
          </LocalizationProvider>
        ) : (
          ukDateFormat(row.expiry_date, false)
        ),
      minWidth: "150px"
    },
    {
      name: "Quantity",
      selector: row => `${row.received_quantity}`
    },
    {
      name: "Action",
      cell: row => {
        return (
          <Stack direction={"row"} flexWrap={"nowrap"}>
            {values && values?.id === row.id && (
              <IconButton onClick={() => handleEdit(null)} disabled={loading}>
                <Cancel color={loading ? "info" : "error"} />
              </IconButton>
            )}
            <LoadingIconButton
              onClick={() => (values?.id === row.id ? handleDone() : handleEdit(row))}
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
const OrderProductPatientHistoryColumns: Columns<HistoryData> = [
  {
    name: "Product Name",
    selector: row => row.name,
    cell(row) {
      return (
        <Stack width={"100%"} gap={1} p={1}>
          <Typography color={"primary.main"} variant="body2">
            {row.name}
          </Typography>
          <Stack direction={"row"} gap={1} width={"100%"}>
            <Typography fontWeight={"bold"} variant="body2">
              {" "}
              Direction:{" "}
            </Typography>
            <Typography variant="body2">{row.direction}</Typography>
          </Stack>
        </Stack>
      );
    },
    minWidth: "200px"
  },
  {
    name: "Quantity",
    selector: row => row?.quantity
  },
  {
    name: "Price",
    selector: row => row?.price
  },
  {
    name: "Prescription ID",
    selector: row => row?.website_prescription_id
  },
  {
    name: "Order Number",
    selector: row => row?.website_order_id
  },
  {
    name: "Order Date",
    selector: row => row?.website_order_date,
    cell: row => ukDateFormat(row.website_order_date, false)
  }
];
const orderStatusOptions: SelectOption[] = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Pending",
    value: "pending"
  },
  {
    label: "Processing",
    value: "processing"
  },
  {
    label: "Dispensed",
    value: "dispensed"
  },
  {
    label: "On Hold",
    value: "on_hold"
  },
  {
    label: "Completed",
    value: "completed"
  },
  {
    label: "Cancelled",
    value: "cancelled"
  },
  {
    label: "Refunded",
    value: "refunded"
  }
];
const shipmentStatusOptions: SelectOption[] = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Not Shipped",
    value: "not_shipped"
  },
  {
    label: "Partially Shipped",
    value: "partially_shipped"
  },
  {
    label: "Shipped",
    value: "shipped"
  }
];
export {
  OrderProductPatientHistoryColumns,
  OrderShipmentHistoryColumns,
  OrderPaymentHistoryColumns,
  OrderReturnHistoryColumns,
  OrderBatchExpiryColumns,
  OrderAddReturnColumns,
  shipmentStatusOptions,
  OrderProductsColumns,
  orderStatusOptions,
  OrdersColumns
};
