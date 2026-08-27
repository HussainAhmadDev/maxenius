import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import { OrderResponse, OrderData } from "Interfaces/Order";
import DataTable from "../DataTable/Table";
import Button from "../Button";
import MuiIcon from "../icons/MuiIcons";
import * as yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
// import RestoreIcon from "@mui/icons-material/Restore";
import IconButton from "@material-ui/core/IconButton";
import PrintModal from "./PrintModal";
import { useModal } from "Hooks/useModal";
import EmailInvoice from "../TakeOrder/OrderDetails/EmailInvoice";
import { useFormik } from "formik";
import { useSendEmailInvoice, useTrashOrder, useRestoreOrder } from "Hooks/useOrders";
import Prompt from "Components/Prompt";
import get from "lodash/get";
import AddBulkShipmentModal from "Components/Modals/AddBulkShipment";
import { toast } from "react-toastify";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { ukDateFormat } from "Utils/datesFormat";
interface Props {
  isLoading: boolean;
  orders: OrderResponse | undefined;
}

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  readonly maxWidth?: number;
  readonly cell?: (row: OrderData) => JSX.Element;
  readonly selector?: (row: OrderData) => string | React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    blackField: {
      color: "#2a2a2a"
    },
    redField: {
      color: theme.palette.primary.main
    },
    selectButton: {
      marginTop: "10px"
    },
    successChip: {
      background: theme.palette.gray[1400],
      border: `0.5px solid ${theme.palette.gray[1500]}`,
      padding: "2px",
      color: theme.palette.gray[1500],
      borderRadius: "6px",
      minWidth: "95px",
      fontSize: 12
    },
    warnChip: {
      borderRadius: "6px",
      minWidth: "95px",
      background: "#FFF8E3",
      border: "0.5px solid #D9A81A",
      padding: "2px",
      color: "#D9A81A",
      fontSize: 12
    },
    dangerChip: {
      minWidth: "95px",
      background: "#FFF2F4",
      border: `0.5px solid ${theme.palette.primary.main}`,
      padding: "2px",
      color: theme.palette.primary.main,
      borderRadius: "6px",
      fontSize: 12
    },
    dispensedColor: {
      minWidth: "95px",
      background: "lightblue",
      border: `0.5px solid blue`,
      padding: "2px",
      color: "blue",
      borderRadius: "6px",
      fontSize: 12
    },
    circleRed: {
      backgroundColor: "red",
      width: "10px",
      height: "10px",
      borderRadius: "100%"
    },
    circleBlue: {
      backgroundColor: "blue",
      width: "10px",
      height: "10px",
      borderRadius: "100%"
    },
    circleTomato: {
      backgroundColor: "Tomato",
      width: "10px",
      height: "10px",
      borderRadius: "100%"
    },
    dynamicBlue: {
      backgroundColor: "#1F51FF",
      marginLeft: "10px",
      padding: "0px 15px",
      borderRadius: "10px"
    },
    flex: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "10px"
    },
    alreadyOpen: {
      margin: 0,
      padding: 0
    }
  })
);
type HeadersType = {
  [key: string]: string;
};
const OrderTable: React.FC<Props> = ({ orders, isLoading }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showWarning, setShowWarning] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<OrderData>();
  const { handleSave, handleModalClose, modalOpen } = useModal({
    onSave: () => null
  });
  const bulkShipmentModal = useModal({
    onSave: () => null
  });
  const [selectedRow, setSelectedRows] = React.useState<OrderData[]>([]);
  const { mutate: sendEmailInvoice } = useSendEmailInvoice(selectedRow[0]?.id);
  const { mutateAsync: trashOrder } = useTrashOrder();
  const { mutateAsync: restoreOrder } = useRestoreOrder();

  const pagination = {
    page: (orders?.page || 1).toString(),
    rowsPerPage: (orders?.count || 100).toString(),
    pages: (orders?.pages || 1).toString(),
    total: (orders?.total || 0).toString()
  };

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  const handleRowSelection = ({
    selectedRows
  }: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: OrderData[];
  }) => {
    setSelectedRows(selectedRows);
  };

  const handlePageChange = (p: number) => {
    handleChange("page", `${p}`);
  };
  const handleRowChange = (c: number) => {
    handleChange("count", `${c}`);
  };

  const columns: ColumnsProps[] = [
    {
      name: "Customer Name",
      selector: row => row.company.name,
      cell: row => (
        <p onClick={() => handleRowClick(row?.id)} className={classes.blackField}>
          {/* {get(row, "")} */}
          {row.billing_address_first_name + " " + row.billing_address_last_name}
        </p>
      ),
      sortable: true
    },
    {
      name: "Website Order ID",
      selector: row => row.number,
      cell: row => (
        <div
          style={{ display: "flex", alignItems: "center", gap: "1px" }}
          onClick={() => handleRowClick(row?.id)}
          className={classes.blackField}
        >
          {row?.website_order_id && (
            <p style={{ margin: 0, marginRight: "4px", whiteSpace: "nowrap" }}>
              {row?.website_order_id}
            </p>
          )}
          {row.status === "processing" || row.status === "on_hold" ? (
            <>
              {row?.notes?.some(item =>
                item?.source?.toLowerCase().trim().includes("u")
              ) && <div className={classes.circleTomato}></div>}
              {row?.notes?.some(item =>
                item?.text?.toLowerCase().trim().includes("guest")
              ) ? (
                <div className={classes.circleRed}></div>
              ) : (
                row?.notes?.some(item =>
                  item?.text?.toLowerCase().trim().includes("click")
                ) && <div className={classes.circleBlue}></div>
              )}
            </>
          ) : null}
          {row?.packing_slip_print && row?.invoice_print ? (
            <IconButton className={classes.alreadyOpen}>
              <DoneAllIcon className="greenFilterIcon" />
            </IconButton>
          ) : row?.packing_slip_print || row?.invoice_print ? (
            <IconButton className={classes.alreadyOpen}>
              <DoneIcon className="greenFilterIcon" />
            </IconButton>
          ) : null}
        </div>
      ),
      sortable: true,
      maxWidth: 100
    },

    {
      name: "Website",
      selector: row => row.company.number,
      cell: row => (
        <p onClick={() => handleRowClick(row?.id)} className={classes.blackField}>
          {get(row, "website")}
        </p>
      ),
      sortable: true
    },

    {
      name: "Order Date",
      selector: row => row.created,
      cell: row => (
        <p onClick={() => handleRowClick(row?.id)}>
          {row?.ordered ? ukDateFormat(row?.ordered, true) : ""}
          {/* {row?.ordered} */}
        </p>
      ),
      sortable: true
    },
    {
      name: "Order No.",
      selector: row => row.number,
      cell: row => (
        <p className={classes.blackField} onClick={() => handleRowClick(row?.id)}>
          {get(row, "number", "")}
        </p>
      ),
      sortable: true,
      maxWidth: 100
    },
    {
      name: "QB Ref",
      selector: row => row.number,
      cell: row => (
        <p className={classes.blackField} onClick={() => handleRowClick(row?.id)}>
          {row?.quickbook_reference_number ?? ""}
        </p>
      ),
      sortable: true,
      maxWidth: 100
    },
    {
      name: "Status",
      selector: row => `${row?.status}`,
      cell: row => (
        <div
          style={{ padding: "8px" }}
          onClick={() => handleRowClick(row?.id)}
          className={
            row?.status.toLowerCase() === "on_hold" ||
            row?.status.toLowerCase() === "refunded" ||
            row?.status.toLowerCase() === "partially_refunded" ||
            row?.status.toLowerCase() === "cancelled"
              ? classes.dangerChip
              : row.status.toLowerCase() === "dispensed"
              ? classes.dispensedColor
              : row.status.toLowerCase() === "completed"
              ? classes.successChip
              : classes.warnChip
          }
        >
          {get(row, "status", "").split("_").join(" ").toUpperCase()}
        </div>
      ),
      sortable: true
    },
    // {
    //   name: "Payment Status",
    //   selector: row => `${row?.payment_status}`,
    //   cell: row => (
    //     <div
    //       onClick={() => handleRowClick(row?.id)}
    //       className={
    //         row?.payment_status === "not_paid"
    //           ? classes.dangerChip
    //           : row.payment_status === "paid"
    //             ? classes.successChip
    //             : classes.warnChip
    //       }
    //     >
    //       {get(row, "payment_status", "").split("_").join(" ").toUpperCase()}
    //     </div>
    //   ),
    //   sortable: true
    // },
    {
      name: "Shipment Status",
      selector: row => `${row?.shipping_status}`,
      cell: row => (
        <div
          style={{ padding: "8px" }}
          onClick={() => handleRowClick(row?.id)}
          className={
            row?.shipping_status === "not_shipped"
              ? classes.dangerChip
              : row.shipping_status === "partially_shipped"
              ? classes.warnChip
              : classes.successChip
          }
        >
          {get(row, "shipping_status", "").split("_").join(" ").toUpperCase()}
        </div>
      ),
      sortable: true
    },
    {
      name: "Action",
      maxWidth: 100,
      selector: row => {
        return (
          <IconButton
            aria-label={`${row?.is_trash ? "Restore" : "Delete"} order ${get(
              row,
              "number",
              ""
            )}`}
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={() => {
              setSelectedOrder(row);
              setShowWarning(true);
            }}
          >
            {row?.is_trash ? (
              // <RestoreIcon color="success" />
              <></>
            ) : (
              <DeleteIcon color="error" />
            )}
          </IconButton>
        );
      }
    }
  ];

  const handleRowClick = (id: string) => {
    navigate(`/orders/${id}`);
  };

  const validationSchema = yup.object({
    email_from: yup.string().email("Enter a valid email").required("Email is required"),
    email_subject: yup.string().required("Required"),
    email_body: yup.string().required("Required")
  });

  const formik = useFormik({
    initialValues: {
      email_from: "",
      email_subject: "",
      email_body: "",
      email_to: [],
      email_cc: [],
      email_bcc: []
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      sendEmailInvoice(values);
      handleSave();
    }
  });

  // const sendInvoice = () => {
  //   handleModalOpen();
  // };

  const pageNumberInUrl = Number.parseInt(searchParams.get("page") || "1");

  React.useEffect(() => {
    if (orders?.pages && orders.pages < pageNumberInUrl) {
      const params = new URLSearchParams(searchParams);
      params.set("page", `${orders.pages}`);
      setSearchParams(params);
    }
  }, [orders?.pages, pageNumberInUrl, searchParams, setSearchParams]);

  const [isFileDownloading, setIsFileDownloading] = React.useState({
    loading: false,
    btnRef: ""
  });

  const externalPDFLinks = async (staticURL: string, btnRef: string) => {
    // Create a new array to store the extracted items
    const extractedItems = [];

    // Create a map to store website URLs and their associated website_order_ids
    const websiteOrderMap: { [website_url: string]: string[] } = {};

    // Iterate through the selectedRow array
    for (const item of selectedRow) {
      // Extract the desired properties
      const { website_url, website_order_id, website_authorization_key } = item;

      // Create an object with the extracted properties
      const extractedItem = {
        website_url: website_url,
        website_order_id: website_order_id,
        website_authorization_key: website_authorization_key
      };

      // Push the extractedItem to the extractedItems array
      extractedItems.push(extractedItem);
      if (website_url) {
        // Update the websiteOrderMap with website_order_id and website_url
        if (!websiteOrderMap[website_url]) {
          websiteOrderMap[website_url] = [];
        }
        if (website_order_id !== undefined) {
          websiteOrderMap[website_url].push(website_order_id.toString());
        }
      }
    }

    // Create a new array to store the final items with website_order_ids
    const finalItems = [];

    // Iterate through the websiteOrderMap to create final items
    for (const website_url in websiteOrderMap) {
      const website_order_ids = websiteOrderMap[website_url].join("x");

      const extractedItem = extractedItems.find(
        item => item.website_url === website_url
      )!;

      const finalItem = {
        website_url: website_url,
        website_order_id: website_order_ids,
        website_authorization_key: extractedItem.website_authorization_key
      };
      finalItems.push(finalItem);
    }

    try {
      setIsFileDownloading({
        loading: true,
        btnRef: btnRef
      });

      console.log("finalItems", finalItems);
      for (const item of finalItems) {
        //eslint-disable-next-line
        //@ts-ignore
        if (item?.prescription_ids?.length < 0 || !btnRef.includes("prescription")) {
          const apiUrl = `${item?.website_url}${staticURL}${item?.website_order_id}`;

          const apiKey = item?.website_authorization_key;

          const headers: HeadersType = {};

          if (apiKey) {
            headers["Authorization"] = apiKey;
          }

          const response = await fetch(apiUrl, {
            headers: headers
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          const responseArrayBuffer = await response.arrayBuffer();
          const blob = new Blob([responseArrayBuffer], { type: "application/pdf" });
          const fileUrl = URL.createObjectURL(blob);
          window.open(fileUrl, "_blank");
        } else {
          toast.error(
            `Order # ${item.website_order_id}  not containing the prescription ID`
          );
        }
      }

      setIsFileDownloading({
        loading: false,
        btnRef: ""
      });
    } catch (error) {
      setIsFileDownloading({
        loading: false,
        btnRef: ""
      });
    }
  };

  const isTrash = searchParams.get("is_trash");

  return (
    <div>
      <Prompt
        openModal={showWarning}
        title={isTrash === "1" ? "Restore Order" : "Delete Order"}
        promptMsg={`This will ${isTrash === "1" ? "restore" : "trash"} the order number ${
          selectedOrder?.number
        }.`}
        onProceed={async () => {
          if (selectedOrder) {
            selectedOrder.is_trash
              ? await restoreOrder({ orderId: selectedOrder.id })
              : await trashOrder({ orderId: selectedOrder.id });
          }
          setShowWarning(false);
        }}
        onCancel={() => setShowWarning(false)}
      />

      <div className={classes.flex}>
        <Button
          text="Bulk Invoices"
          onClick={() =>
            externalPDFLinks(
              "/wp-json/inventory/v1/view_order_pdf?document_type=invoice&order_ids=",
              "invoice"
            )
          }
          icon={<MuiIcon icon="print" />}
          type="secondary"
          loading={
            isFileDownloading.loading && isFileDownloading.btnRef === "invoice"
              ? true
              : false
          }
        />

        <Button
          text="Bulk Packing Slip"
          icon={<MuiIcon icon="print" />}
          onClick={() =>
            externalPDFLinks(
              "/wp-json/inventory/v1/view_order_pdf?document_type=packing-slip&order_ids=",
              "packing"
            )
          }
          loading={
            isFileDownloading.loading && isFileDownloading.btnRef === "packing"
              ? true
              : false
          }
          type="secondary"
        />

        {/* <Button text="Bulk View Prescription"
          loading={isFileDownloading.loading && isFileDownloading.btnRef == 'prescription' ? true : false}
          onClick={() => externalPDFLinks('/wp-json/inventory/v1/view_prescription_pdf?order_id=', 'prescription')} icon={<MuiIcon icon="print" />} type="secondary" /> */}
      </div>

      <PrintModal
        saveText="Confirm Print"
        title="Print"
        handleSaveChanges={handleSave}
        handleCloseModal={handleModalClose}
        openModal={modalOpen}
      />
      <AddBulkShipmentModal
        saveText="Add Shipment"
        title="Add Bulk Shipment"
        handleSaveChanges={bulkShipmentModal.handleSave}
        handleCloseModal={bulkShipmentModal.handleModalClose}
        openModal={bulkShipmentModal.modalOpen}
      />
      <Grid container justifyContent="space-between">
        {/* <Grid item xs={12} lg={4}></Grid> */}

        <Grid item xs={12} lg={6}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <EmailInvoice
              handleCloseModal={handleModalClose}
              handleSaveChanges={() => formik.handleSubmit()}
              openModal={modalOpen}
              saveText="Confirm Send"
              title="Email Invoice"
              formik={formik}
            />
            &nbsp;
            {/* <Button
              icon={<MuiIcon color="action" fontSize="small" icon="add" />}
              text="Bulk Shipment"
              type="secondary"
              onClick={bulkShipmentModal.handleModalOpen}
            />
            &nbsp;
            <Button
              icon={<MuiIcon color="action" fontSize="small" icon="send" />}
              text="Send Invoices"
              type="secondary"
              disabled
              onClick={sendInvoice}
            />
            &nbsp;
            <Button
              icon={<MuiIcon color="action" fontSize="small" icon="download" />}
              text="Download Invoices"
              onClick={handleModalOpen}
              type="secondary"
              disabled
            />
            &nbsp;
            <Button
              icon={<MuiIcon color="action" fontSize="small" icon="delete" />}
              text="Trash"
              type="secondary"
              disabled
            /> */}
          </div>
        </Grid>
      </Grid>
      <Grid item xs={12} lg={4}>
        <span>{orders?.total} results </span>
        {/* <span className={classes.blackField}>({0} selected)</span> */}
      </Grid>
      <br />
      <DataTable
        // tableStyles={{
        //   width: "calc(100vw - 320px)"
        // }}
        selectableRows={true}
        columns={columns}
        data={orders?.results}
        showPagination
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowChange={handleRowChange}
        onRowSelection={handleRowSelection}
        onRowClicked={({ id }) => handleRowClick(id)}
      />
    </div>
  );
};

export default OrderTable;
