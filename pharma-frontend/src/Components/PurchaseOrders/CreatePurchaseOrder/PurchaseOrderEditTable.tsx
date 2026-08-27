// @ts-check
import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import DataTable from "Components/DataTable/Table";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import Select from "Components/Form/Select";
import { API_URL, getAccessToken } from "Hooks/api";
import TextField from "@material-ui/core/TextField";
import { usePurchaseOrderContext } from "Context/PurchaseOrderContext";
import ModalPopup from "Components/ModalPopup";
import { useParams, useSearchParams } from "react-router-dom";
import { showError, showSuccess } from "Components/Toaster";
import OrderNotesContainer from "../AddNotePurchaseOrder/AddNotesPO";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import { useBrand } from "Context/BrandContext";
import { useDebounce } from "Hooks/useDebounce";
import { isBefore, startOfDay } from "date-fns";
import { ukDateFormat } from "Utils/datesFormat";
import { useUser } from "Hooks/localStorageUser";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MuiTextField, { TextFieldProps } from "@mui/material/TextField";
// import QrCode2Icon from "@mui/icons-material/QrCode2";
import Barcode from "../../../Assets/images/barcode.png";
import { useGenerateBarcodeBySKU } from "Hooks/useProducts";
interface ColumnsProps {
  readonly name: string;
  readonly selector?: (row: string) => string | React.ReactNode | undefined;
  readonly sortable?: boolean;
  readonly cell?: (row: ProductType & { id: string }) => JSX.Element;
  readonly width?: string;
}
interface HistoryColumnsProps {
  readonly name: string;
  readonly cell?: (
    row: {
      id: string;
      purchase_order_id: string;
      sku: string;
      product_id: string;
      product_name: string;
      ordered_quantity: number;
      received_quantity: number;
      created: string;
      status: string;
      batch_number: string;
      expiry_date: string;
      invoice_number: string;
    },
    index?: number
  ) => JSX.Element;
}
interface Props {
  isLoading?: boolean;
  newPurchaseOrder?: boolean;
}

type ProductType = {
  product: { label: string; value: string };
  quantity: number;
  price: number;
  tax: number;
  total: number;
  received: number;
  barcode: string;
  expiry_date: string;
  batch_number: string;
  id: string;
  invoice_number: string;
  sku: string;
  cost_price: number;
  exchangePrice?: string;
  exchangeTotal?: string;
};
const CalendarTextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  function CalendarTextField(props, ref) {
    return <MuiTextField {...props} ref={ref} size="small" />;
  }
);

CalendarTextField.displayName = "CalendarTextField";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    redField: {
      marginBottom: "5px",
      color: theme.palette.primary.main,
      fontWeight: "bold"
    },
    selectButton: {
      marginTop: "10px"
    },
    greyField: {
      color: theme.palette.text.secondary
    },
    flex: {
      display: "flex",
      alignItems: "center"
    },
    passwordItem: {
      display: "flex",
      alignItems: "center",
      marginTop: "-6px"
    },
    iconAvatar: {
      marginLeft: "7px",
      width: "22px",
      height: "22px",
      marginTop: "5px"
    },
    editButton: {
      marginTop: "10px",
      color: theme.palette.text.secondary
    },
    characterCount: {
      fontSize: "12px",
      fontWeight: "bold"
    },
    redBorder: {
      border: "2px solid red",
      borderRadius: "4px"
    }
  })
);
//
const PurchaseOrderEditTable: React.FC<Props> = () => {
  const { id } = useParams<string>();
  const {
    purchaseOrderBody,
    setPurchaseOrderBody,
    receiveOrder,
    receiveOrderHistory,
    updateReceiving,
    updateOrderItem,
    getReceiveOrderHistory,
    loadingEditReceiving,
    setLoadingEditReceiving,
    exchangeRate,
    getPurchaseOrder
  } = usePurchaseOrderContext();
  const { products, product, setProduct } = usePurchaseOrder();

  const [poLoading, setPoLoading] = React.useState<boolean>(true);
  const [receivingLoading, setReceivingLoading] = React.useState<boolean>(true);

  const [modal, setModal] = React.useState({ show: false });
  const [item, setItem] = React.useState({ received_quantity: 1 } as {
    sku: string;
    batch_number: string;
    expiry_date: string;
    received_quantity: number;
    invoice_number: string;
  });
  const [editID, setEditID] = React.useState("" as string);
  //eslint-disable-next-line
  const [eData, setEData] = React.useState({} as any);
  const classes = useStyles();
  const currentDate = new Date().toISOString().split("T")[0];

  const [paginationDetail, setPaginationDetail] = React.useState<{
    count?: string;
    page: string;
    rowsPerPage: string;
    pages: string;
  }>({
    count: "",
    page: "",
    rowsPerPage: "",
    pages: ""
  });

  const { mutate } = useGenerateBarcodeBySKU();

  React.useEffect(() => {
    if (Object.entries(purchaseOrderBody).length !== 0 || !id) {
      setPoLoading(false);
    }
    if (
      receiveOrderHistory?.results?.length !== 0 ||
      Array.isArray(receiveOrderHistory.results)
    ) {
      setPaginationDetail({
        page: (receiveOrderHistory?.page || 1).toString(),
        rowsPerPage: (receiveOrderHistory?.count || 10).toString(),
        pages: (receiveOrderHistory?.pages || 1).toString()
      });
      setReceivingLoading(false);
    }
    //eslint-disable-next-line
  }, [purchaseOrderBody, receiveOrderHistory]);

  const handlePageChange = (p: number) => {
    const obj = {
      pages: paginationDetail.page,
      page: p.toString(),
      rowsPerPage: paginationDetail.rowsPerPage,
      count: paginationDetail.pages
    };

    id && getReceiveOrderHistory(id, obj);
  };

  const handleRowChange = (c: number) => {
    const obj = {
      pages: paginationDetail.pages,
      page: paginationDetail.page,
      rowsPerPage: c?.toString(),
      count: paginationDetail.pages
    };

    id && getReceiveOrderHistory(id, obj);
  };

  const checkReceived = (id: string, rowQuanity: number) => {
    const products = purchaseOrderBody.products;

    let totalQty = 0; // Replace with the desired quantity

    let sumReceived = parseInt(eData.received_quantity);
    let foundMatchingProducts = false;

    // Loop through the products to find matching ones and calculate the sum of received
    for (const product of products) {
      if (id === product.product.value) {
        totalQty = product.quantity;
        sumReceived += product.received;
        foundMatchingProducts = true;
      }
    }

    sumReceived = sumReceived - rowQuanity;

    // Determine whether 'disabled' should be true or false based on the condition
    const isDisabled = foundMatchingProducts ? sumReceived <= totalQty : false;

    return isDisabled;
  };

  const columns: ColumnsProps[] = [
    // {
    //   name: "Product#/SKU",
    //   cell: row => <p className={classes.redField}>{row.sku}</p>,
    //   sortable: true
    // },
    {
      name: "Product Name",
      cell: row => <p className={classes.redField}>{row.product.label}</p>,
      sortable: true
    },
    {
      name: "Quantity",
      cell: row =>
        row.product.value === editID ? (
          <TextField
            id="Quantity"
            type="number"
            value={eData.quantity}
            hiddenLabel
            variant="outlined"
            onChange={e => {
              let value = parseFloat(e.target.value);
              if (value < 0) value = 0;
              setEData({ ...eData, quantity: value });
            }}
          />
        ) : (
          <p>{row.quantity}</p>
        ),
      sortable: true
    },
    {
      name: "Price",
      cell: row =>
        row.product.value === editID ? (
          <TextField
            id="price"
            type="number"
            value={eData.price}
            hiddenLabel
            variant="outlined"
            onChange={e => {
              let value = parseFloat(e.target.value);
              if (value < 0) value = 0;
              setEData({ ...eData, price: value });
            }}
          />
        ) : (
          <p>{row.price}</p>
        ),
      sortable: true
    },

    // {
    //   name: "Tax",
    //   cell: row =>
    //     row.product.value === editID ? (
    //       <TextField
    //         id="tax"
    //         type="number"
    //         value={eData.tax}
    //         hiddenLabel
    //         variant="outlined"
    //         onChange={e => {
    //           let value = parseFloat(e.target.value);
    //           if (value < 0) value = 0;
    //           if (value > 100) value = 100;
    //           setEData({ ...eData, tax: value });
    //         }}
    //       />
    //     ) : (
    //       <p>{row.tax}</p>
    //     ),
    //   sortable: true,
    //   width: "20%"
    // },
    {
      name: "Total",
      cell: row =>
        row.product.value === editID ? (
          <p>
            {eData.tax
              ? (eData.quantity * eData.price * (1 + eData.tax / 100)).toFixed(2) || 0
              : (eData.quantity * eData.price).toFixed(2) || 0}
          </p>
        ) : (
          <p>
            {row.tax
              ? (row.quantity * row.price * (1 + row.tax / 100)).toFixed(2) || 0
              : (row.quantity * row.price).toFixed(2) || 0}
          </p>
        ),
      sortable: true
    },
    {
      name: "Exchange Price",
      cell: row =>
        row.product.value === editID ? (
          <p>
            {row?.exchangePrice
              ? Number(row?.exchangePrice)?.toFixed(2)
              : Number(row?.price).toFixed(2)}
          </p>
        ) : (
          <p>
            {row?.exchangePrice
              ? Number(row?.exchangePrice)?.toFixed(2)
              : Number(row?.price).toFixed(2)}
          </p>
        ),
      sortable: true
    },
    {
      name: "Exchange Total",
      cell: row =>
        row.product.value === editID ? (
          <p>
            {row?.exchangeTotal
              ? Number(row?.exchangeTotal).toFixed(2)
              : Number(row?.price * row?.quantity).toFixed(2)}
          </p>
        ) : (
          <p>
            {row?.exchangeTotal
              ? Number(row?.exchangeTotal).toFixed(2)
              : Number(row?.price * row?.quantity).toFixed(2)}
          </p>
        ),
      sortable: true
    },
    {
      name: "Action",
      cell: row => {
        return row.product.value === editID ? (
          <>
            <Button
              icon={<MuiIcon fontSize="small" icon="check" />}
              onlyIcon={true}
              type="secondary"
              variant="outlined"
              onClick={async () => {
                if (!id) {
                  if (!purchaseOrderBody?.products) purchaseOrderBody.products = [];
                  const itemToUpdate = purchaseOrderBody?.products.find(
                    p => p.product.value === row.product.value
                  );
                  if (itemToUpdate) {
                    itemToUpdate.quantity = eData.quantity;
                    itemToUpdate.price = eData.price;
                    itemToUpdate.tax = eData.tax;
                  }
                  setPurchaseOrderBody({ ...purchaseOrderBody });
                  setProduct({
                    product: {},
                    quantity: 0,
                    price: 0,
                    tax: 0
                  } as ProductType);
                  setEditID("");
                } else {
                  if (!purchaseOrderBody?.products) purchaseOrderBody.products = [];
                  const itemToUpdate = purchaseOrderBody?.products.find(
                    p => p.product.value === row.product.value
                  );

                  if (itemToUpdate) {
                    itemToUpdate.quantity = eData.quantity;
                    itemToUpdate.price = eData.price;
                    itemToUpdate.tax = eData.tax;
                    setPurchaseOrderBody({ ...purchaseOrderBody });
                    setProduct({
                      product: {},
                      quantity: 0,
                      price: 0,
                      tax: 0
                    } as ProductType);
                    setEditID("");
                  } else {
                    await updateOrderItem({ id: row.product.value, ...eData });
                  }
                }
              }}
              size="small"
            />
            &nbsp;
            <Button
              size="small"
              icon={<MuiIcon icon="cancel" />}
              onlyIcon={true}
              onClick={() => {
                setEditID("");
                setEData({});
              }}
              type="secondary"
              variant="outlined"
            />
          </>
        ) : (
          <>
            <Button
              icon={<MuiIcon fontSize="small" icon="edit" />}
              onlyIcon={true}
              onClick={() => {
                setEditID(row.product.value);
                setEData({ quantity: row.quantity, price: row.price, tax: row.tax });
              }}
              type="secondary"
              variant="outlined"
              size="small"
            />
            <div
              style={{
                color: "#212121",
                border: "0.5px solid #CFD8E3",
                background: "#FFFFFF",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                fontWeight: "500",
                borderRadius: "6px",
                marginLeft: "10px",
                width: "37px",
                height: "37px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "3px"
              }}
            >
              <img
                src={Barcode}
                alt=""
                style={{ width: "25px", height: "25px" }}
                onClick={() => {
                  if (id) {
                    mutate({
                      data: [row?.sku]
                    });
                  } else {
                    const label = row?.product?.label;
                    const skuPattern = /\(([^)]+)\)/;

                    const match = label.match(skuPattern);

                    if (match) {
                      const sku = match[1];
                      mutate({
                        data: [sku]
                      });
                    } else {
                      console.log("SKU not found");
                    }
                  }
                }}
              />
            </div>
          </>
        );
      }
    }
  ];
  const receiveColumns: ColumnsProps[] = [
    // {
    //   name: "Product Barcode",
    //   cell: row => <p className={classes.redField}>{row.barcode}</p>
    // },
    {
      name: "Product Name",
      cell: row => <p className={classes.redField}>{row.product.label}</p>
    },
    {
      name: "Batch",
      cell: row => <p>{row.batch_number}</p>
    },
    {
      name: "Exp Date",
      cell: row => <p>{ukDateFormat(row?.expiry_date, false)}</p>
    },
    {
      name: "Invoice Number",
      cell: row => <p>{row.invoice_number}</p>
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

  const receiveHistoryColumns: HistoryColumnsProps[] = [
    // {
    //   name: "Product#/SKU",
    //   cell: row => <p className={classes.redField}>{row.sku}</p>
    // },
    {
      name: "Product Name",
      cell: row => <p className={classes.redField}>{row.product_name}</p>
    },
    {
      name: "Batch Number",
      cell: row =>
        row.id === editID ? (
          <TextField
            name="batch"
            value={eData.batch_number}
            onChange={e => setEData({ ...eData, batch_number: e.target.value })}
          />
        ) : (
          <p>{row.batch_number}</p>
        )
    },
    {
      name: "Invoice Number",
      cell: row =>
        row.id === editID ? (
          <TextField
            style={{ width: "80px" }}
            name="batch"
            value={eData.invoice_number}
            onChange={e => setEData({ ...eData, invoice_number: e.target.value })}
          />
        ) : (
          <p>{row.invoice_number as string}</p>
        )
    },
    {
      name: "Exp Date",
      cell: row =>
        row.id === editID ? (
          // <TextField
          //   type="date"
          //   name="expiry_date"
          //   value={eData.expiry_date}
          //   onChange={e => setEData({ ...eData, expiry_date: e.target.value })}
          // />

          <div style={{ position: "relative", zIndex: 9, marginTop: "-2px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  minDate={dayjs(currentDate)}
                  format="DD/MM/YYYY"
                  onChange={value => {
                    if (value?.format("DD/MM/YYYY"))
                      setEData({ ...eData, expiry_date: value?.format("YYYY/MM/DD") });
                  }}
                  formatDensity="dense"
                  defaultValue={dayjs(eData.expiry_date)}
                  slots={{ textField: CalendarTextField }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        ) : (
          <p>{ukDateFormat(row.expiry_date, false)}</p>
        )
    },
    // {
    //   name: "Qty Ordered",
    //   cell: row => <p>{row.ordered_quantity}</p>
    // },
    {
      name: "Received",
      cell: row =>
        row.id === editID ? (
          <TextField
            style={{ width: "60px" }}
            disabled
            name="receive_quantity"
            type="number"
            value={eData.received_quantity}
            onChange={e => {
              const inputValue = parseFloat(e.target.value);
              if (!isNaN(inputValue) && inputValue >= 0) {
                setEData({ ...eData, received_quantity: inputValue });
              }
            }}
          />
        ) : (
          <p>{row.received_quantity}</p>
        )
    },
    {
      name: "Date",
      cell: row => <p>{row?.created !== "None" && ukDateFormat(row.created, false)}</p>
    },
    {
      name: "Status",
      cell: row => (
        <p style={{ textTransform: "capitalize" }}>{row.status?.replaceAll("_", " ")}</p>
      )
    },
    {
      name: "Action",
      cell: row => {
        return row.id === editID ? (
          <>
            <Button
              icon={<MuiIcon fontSize="small" icon="check" />}
              onlyIcon={true}
              type="secondary"
              variant="outlined"
              onClick={async () => {
                const missingKeys = [];

                if (!eData.batch_number) {
                  missingKeys.push("Batch Number");
                }
                if (!eData.expiry_date) {
                  missingKeys.push("Expiry Date");
                }

                if (!eData.invoice_number) {
                  missingKeys.push("Invoice Number");
                }

                if (missingKeys.length > 0) {
                  toast.error(
                    `${missingKeys.join(" and ")} ${
                      missingKeys.length > 1 ? "are" : "is"
                    } required.`
                  );
                  return;
                }

                const receiveable = await checkReceived(
                  row.product_id,
                  row.received_quantity
                );
                !receiveable &&
                  toast.error("Receiving can not be exceed from Total Quantity..!");
                receiveable &&
                  updateReceiving({
                    id: editID,
                    purchase_order_id: row.purchase_order_id,
                    product_id: row.product_id,
                    sku: row.sku,
                    is_fully_received: true,
                    ...eData
                  });
                setEditID("");
              }}
              size="small"
            />
            &nbsp;
            <Button
              size="small"
              icon={<MuiIcon icon="cancel" />}
              onlyIcon={true}
              onClick={() => {
                setEditID("");
                setEData({});
              }}
              type="secondary"
              variant="outlined"
            />
          </>
        ) : (
          <Button
            icon={<MuiIcon fontSize="small" icon="edit" />}
            onlyIcon={true}
            onClick={() => {
              setEditID(row.id);
              setEData({
                batch_number: row.batch_number,
                invoice_number: row.invoice_number,
                expiry_date: row.expiry_date,
                received_quantity: row.received_quantity
              });
            }}
            type="secondary"
            variant="outlined"
            size="small"
          />
        );
      }
    }
  ];
  const [, setPreviousBarcode] = React.useState("");
  const [, setIsDelaying] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);
  const [delayMessage] = React.useState<boolean>(false);

  const barcodeRef = React.useRef<HTMLInputElement>(null);
  const batchRef = React.useRef<HTMLInputElement>(null);
  const expiryDateRef = React.useRef<HTMLInputElement>(null);
  const invoiceNumberRef = React.useRef<HTMLInputElement>(null);

  const checkDateFormat = (dateString: string) => {
    // Define a regular expression for YYYY-MM-DD format
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

    // Check if the input matches the expected date format
    return dateFormat.test(dateString);
  };

  const checkReceivingValidation = () => {
    const { expiry_date } = item;
    const convertedExpiryDate = new Date(expiry_date);
    const currentDateWithoutTime = startOfDay(new Date());

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

    if (isBefore(convertedExpiryDate, currentDateWithoutTime)) {
      toast.error(
        `Invalid Expiry Date ${convertedExpiryDate.getFullYear()}-${
          convertedExpiryDate.getMonth() + 1
        }-${convertedExpiryDate.getDate()}`
      );
      return false;
    }

    return true;
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, name: string) => {
    if (event.key === "Enter") {
      switch (name) {
        case "barcode":
          //eslint-disable-next-line
          const validate = checkReceivingValidation();

          //eslint-disable-next-line
          if (validate && !loadingEditReceiving) {
            //eslint-disable-next-line
            receivingHandler();
          }

          break;
        case "date":
          expiryDateRef.current?.focus();
          break;
        case "batch":
          batchRef.current?.focus();
          break;

        default:
          // Handle the submit or next action
          break;
      }
    }
  };

  const receivingHandler = async () => {
    const { sku } = item;

    let res;
    let data;
    let barcodeExist = purchaseOrderBody?.products.find(item => item.barcode === sku);

    if (!sku) {
      setPreviousBarcode("");
      barcodeExist = undefined;
    }
    const barcodeNotExist = purchaseOrderBody?.products.filter(
      item => item.barcode !== sku
    );

    if (barcodeExist) {
      if (
        Number(barcodeExist.received) + Number(item.received_quantity) <=
        Number(barcodeExist.quantity)
      ) {
        try {
          res = await receiveOrder({
            ...item,
            purchase_order_id: purchaseOrderBody.id,
            is_fully_received: true,
            product_id: barcodeExist?.product.value
          });

          data = await res.json();
          const updateItem = {
            ...barcodeExist,
            batch_number: data.batch_number,
            invoice_number: data.invoice_number,
            expiry_date: data.expiry_date,
            received: Number(barcodeExist.received) + Number(item.received_quantity) || 0
          };

          setPreviousBarcode(sku); // Update previousBarcode with current barcode
          setPurchaseOrderBody({
            ...purchaseOrderBody,
            products: [updateItem, ...barcodeNotExist]
          });

          if (res.status === 200 || res.status === 201) {
            showSuccess("Item received successfully");
            setLoadingEditReceiving(false);
          }
          if (res?.status === 400) {
            showError(data?.message);
          }
        } catch {
          if (res?.status === 400) {
            showError(data?.message);
          }
        }
      } else {
        showError("Receiving quantity cannot exceed total quantity");
        setLoadingEditReceiving(false);
      }
    } else {
      showError("Item doesn't exist");
      setLoadingEditReceiving(false);
    }

    // Set a new delay after the code execution
    timeoutRef.current = setTimeout(() => {
      setIsDelaying(false);
    }, 3000);
    setIsDelaying(true); // Start the delay
    barcodeRef.current?.focus();

    setItem(prev => ({ ...prev, sku: "" }));
  };

  let computedValue;
  if (product.tax) {
    computedValue = (product.quantity * product.price * (1 + product.tax / 100)).toFixed(
      2
    );
  } else {
    computedValue = (product.quantity * product.price).toFixed(2);
  }
  const user = useUser();
  const doNotAllow = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const [visibleInput, setVisibleInput] = React.useState<boolean>(false);
  const [scanedProductQuantity, setScanedProductQuantity] = React.useState<
    number | undefined
  >(undefined);

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
      }
    }
  }, [user, scanedProductQuantity]);

  const exchangePrice = product.price * Number(exchangeRate) ?? 0;
  const exchangeTotal =
    exchangePrice?.toString() === "NaN" ? 0 : exchangePrice * Number(product.quantity);

  const checkExchangePrice =
    exchangePrice?.toString() === "NaN" ? 0 : exchangePrice?.toFixed(2);

  const checkExchangeTotal =
    exchangeTotal?.toString() === "NaN" ? 0 : exchangeTotal?.toFixed(2);

  return (
    <div>
      <Grid container justifyContent="space-between" alignItems="flex-end">
        <Grid item xs={12} md={12} display="flex" flexDirection="row" gap={2}>
          <Stack minWidth={300}>
            <span style={{ marginBottom: 8 }}>Search Product</span>
            <Select
              id="cy_sarch_product"
              ariaLabel="purchase order search product"
              options={products?.map(
                (r: {
                  id_hash: string;
                  id: string;
                  name: string;
                  sku: string;
                  cost_price: number;
                }) => ({
                  value: r.id_hash,
                  label: `${r.name}  (${r.sku})`,
                  cost_price: r.cost_price
                })
              )}
              value={product.product}
              onChange={e =>
                setProduct(pre => ({ ...pre, price: e.cost_price, product: e }))
              }
            />
          </Stack>
          <Stack minWidth={120} width={120} maxWidth={140}>
            <span>Quantity</span>
            <TextField
              id="Quantity"
              type="number"
              value={product.quantity}
              hiddenLabel
              variant="outlined"
              onChange={e => {
                let value = parseFloat(e.target.value);
                if (value < 0) value = 0;
                setProduct(pre => ({ ...pre, quantity: value }));
              }}
            />
          </Stack>
          <Stack minWidth={120} width={120} maxWidth={140}>
            <span>Price</span>
            <TextField
              id="price"
              type="number"
              value={product.price}
              hiddenLabel
              variant="outlined"
              onChange={e => {
                let value = parseFloat(e.target.value);
                if (value < 0) value = 0;
                setProduct(pre => ({ ...pre, price: value }));
              }}
            />
          </Stack>
          {/* <Stack minWidth={60}>
            <span>Tax</span>
            <TextField
              id="tax"
              type="number"
              value={product.tax}
              hiddenLabel
              variant="outlined"
              onChange={e => {
                let value = parseFloat(e.target.value);
                if (value < 0) value = 0;
                if (value > 100) value = 100;
                setProduct(pre => ({ ...pre, tax: value }));
              }}
            />
          </Stack> */}
          <Stack minWidth={120} width={120} maxWidth={140}>
            <span>Total</span>
            <TextField
              id="total"
              value={computedValue === "NaN" ? 0 : computedValue}
              hiddenLabel
              variant="outlined"
            />
          </Stack>
          <Stack minWidth={120} width={120} maxWidth={140}>
            <span>Exchange Price</span>
            <TextField
              id="total"
              value={checkExchangePrice}
              hiddenLabel
              variant="outlined"
            />
          </Stack>

          <Stack minWidth={120} width={120} maxWidth={140}>
            <span>Exchange Total</span>
            <TextField
              id="total"
              value={checkExchangeTotal}
              hiddenLabel
              variant="outlined"
            />
          </Stack>
          <div className={classes.flex} style={{ marginTop: "18px" }}>
            <Button
              id="cy_add_item"
              text="Add Item"
              icon={<MuiIcon color="action" fontSize="small" icon="add" />}
              type="secondary"
              disabled={!(product?.product?.value && product.quantity)}
              onClick={() => {
                if (product?.product?.value && product.quantity) {
                  const totalPrice = product.tax
                    ? (
                        product.quantity *
                        product.price *
                        (1 + product.tax / 100)
                      ).toFixed(2) || 0
                    : product.quantity * product.price || 0;

                  const selectedProduct = {
                    ...product,
                    total: Number(totalPrice),
                    exchangePrice: checkExchangePrice,
                    exchangeTotal: checkExchangeTotal
                  };

                  if (!purchaseOrderBody?.products) purchaseOrderBody.products = [];
                  const alreadyExist = purchaseOrderBody?.products.find(
                    p => p.product.value === selectedProduct.product.value
                  );

                  if (alreadyExist) {
                    purchaseOrderBody.products = purchaseOrderBody?.products.map(p =>
                      p.product.value === selectedProduct.product.value
                        ? selectedProduct
                        : p
                    );
                  } else {
                    purchaseOrderBody?.products.unshift(selectedProduct);
                  }
                  setPurchaseOrderBody({ ...purchaseOrderBody });
                  setProduct({
                    product: {},
                    quantity: 0,
                    price: 0,
                    tax: 0
                  } as ProductType);
                }
              }}
            />
          </div>
        </Grid>
      </Grid>
      <br />
      <Grid style={{ margin: "10px" }}>
        <span>{purchaseOrderBody?.products?.length} results</span>
      </Grid>
      <DataTable
        columns={columns}
        data={purchaseOrderBody?.products}
        loading={poLoading}
      />
      <br />
      {id && (
        <Button
          variant="contained"
          text="Add Receiving"
          style={{ marginBottom: 16 }}
          disabled={["pending", "p", "a", "approved"].includes(
            purchaseOrderBody?.status_display
          )}
          onClick={() => {
            setModal(pre => ({ ...pre, show: true }));
            setItem(prev => ({ ...prev, batch_number: "" }));
            setItem(prev => ({ ...prev, expiry_date: "" }));
          }}
        />
      )}
      <br />
      {id && (
        <>
          <h2>Receiving History</h2>
          <DataTable
            showPagination
            columns={receiveHistoryColumns}
            data={receiveOrderHistory?.results}
            loading={receivingLoading}
            pagination={paginationDetail}
            onPageChange={handlePageChange}
            onRowChange={handleRowChange}
            filterTenOn={true}
          />
        </>
      )}
      {id && <OrderNotesContainer purchaseOrderID={id} />}

      <br />
      <ModalPopup
        maxWidth="lg"
        modalTitle={"Edit Receiving"}
        openModal={modal.show}
        handleCloseModal={() => {
          getPurchaseOrder();
          id && getReceiveOrderHistory(id, paginationDetail);
          setModal(pre => ({ ...pre, show: false }));
        }}
        removeFooterCancelBtn={true}
        noHeader={false}
      >
        <Stack direction="row" alignItems="center" spacing={2} marginBottom={2}>
          <TextField
            label="Invoice Number"
            name="invoice_number"
            onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) =>
              handleKeyPress(event, "date")
            }
            inputRef={invoiceNumberRef}
            InputLabelProps={{ shrink: true }}
            value={item.invoice_number}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setItem(prev => ({ ...prev, invoice_number: event.target.value }))
            }
          />
          <TextField
            type="date"
            label="Exp Date"
            name="expiry_date"
            onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) =>
              handleKeyPress(event, "batch")
            }
            value={item?.expiry_date}
            inputRef={expiryDateRef}
            InputLabelProps={{ shrink: true }}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => (e.target.type = "date")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setItem(prev => ({ ...prev, expiry_date: event.target.value }))
            }
            inputProps={{ min: currentDate }}
          />

          <TextField
            label="Batch"
            name="batch"
            onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) =>
              handleKeyPress(event, "barcode")
            }
            InputLabelProps={{ shrink: true }}
            value={item.batch_number}
            inputRef={batchRef}
            inputProps={{
              maxLength: 12 // Set the maximum character limit to 12
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setItem(prev => ({ ...prev, batch_number: event.target.value }))
            }
          />

          <Box display="flex" flexDirection={"column"}>
            <Box marginTop={1}>
              <TextField
                label="Barcode"
                name="barcode"
                onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyPress(event, "barcode")
                }
                value={item?.sku}
                InputLabelProps={{ shrink: true }}
                inputRef={barcodeRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event?.target?.value.length > 3) {
                    const productFound = purchaseOrderBody?.products?.find(
                      item => item.barcode == event.target.value
                    );
                    setScanedProductQuantity(productFound?.quantity);
                  }
                  event.target.value.length < 15 &&
                    setItem(prev => ({ ...prev, sku: event.target.value }));
                }}
                InputProps={{
                  readOnly: loadingEditReceiving
                }}
                autoComplete="off"
                onCut={doNotAllow}
                onCopy={doNotAllow}
                onPaste={doNotAllow}
              />
            </Box>
            <span className={classes.characterCount}>{`Character Count: ${
              item?.sku?.length ? item?.sku?.length : 0
            }`}</span>
          </Box>
          {visibleInput && (
            <TextField
              defaultValue={1}
              disabled={false}
              // style={{
              //   display: "none"
              // }}
              type="number"
              label="Receive Quantity"
              name="received_quantity"
              InputLabelProps={{ shrink: true }}
              value={item.received_quantity}
              onChange={event => {
                let value = parseFloat(event.target.value);
                if (value < 1) value = 1;
                setItem(prev => ({ ...prev, received_quantity: value }));
              }}
            />
          )}

          <Button
            variant="contained"
            loading={loadingEditReceiving}
            text="Receive"
            onClick={() => {
              const validate = checkReceivingValidation();
              if (validate) {
                receivingHandler();
              }
            }}
          />
        </Stack>
        {delayMessage && (
          <label className={classes.redField}>
            {" "}
            System detects duplicate scanning. If this is incorrect, please scan item
            again
          </label>
        )}
        <DataTable
          columns={receiveColumns}
          data={purchaseOrderBody?.products}
          loading={poLoading}
        />
      </ModalPopup>
    </div>
  );
};
export default PurchaseOrderEditTable;
//eslint-disable-next-line
export const usePurchaseOrder = () => {
  const [products, setProducts] = React.useState([]);
  const [product, setProduct] = React.useState({
    quantity: 0,
    price: 0,
    tax: 0
  } as ProductType);
  const { activeBrand: branid } = useBrand();
  const [shouldRefetch, setShouldRefetch] = React.useState(false); // State to track if refetch is needed
  const [isLoading, setIsLoading] = React.useState(false); // Loading state

  const [searchParams] = useSearchParams();

  const debouncedParams = useDebounce(searchParams, 800);

  const activeBrand = (searchParams?.get("brand_id") as string) || branid;

  React.useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      if (activeBrand) {
        const res = await fetch(
          `${API_URL}/products_by_sku/?brand_id=${activeBrand}&count=2000`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getAccessToken()}`
            }
          }
        );
        const json = await res.json();
        setProducts(json.results);
        setIsLoading(false);
      }
    };
    if (activeBrand) getProducts();
    if (activeBrand || shouldRefetch) {
      getProducts();
      // Reset shouldRefetch after refetching
      setShouldRefetch(false);
    }
  }, [activeBrand, debouncedParams, shouldRefetch]);
  const refetchProduct = () => {
    setShouldRefetch(true); // Set the flag to trigger a refetch
  };

  return {
    products,
    product,
    setProduct,
    refetchProduct,
    isLoading
  };
};
