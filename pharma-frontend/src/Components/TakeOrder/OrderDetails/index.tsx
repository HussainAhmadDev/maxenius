import * as React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";

import { useModal } from "Hooks/useModal";

import Chip from "@mui/material/Chip";
import Button from "Components/Button";
import Prompt from "Components/Prompt";
import TextInput from "Components/Form/TextInput";
import MuiIcon from "Components/icons/MuiIcons";

import Select, { Option } from "../../Form/Select";
import { OrderData } from "Interfaces/Order";
import { CompanyData } from "Interfaces/Company";
import usePostShippingData, {
  useEditOrder,
  usePrintShipingLabel,
  useServiceAndProductSelect
} from "Hooks/useOrders";
import { useSendEmailInvoice, useTrashOrder } from "Hooks/useOrders";
import { useRestoreOrder } from "Hooks/useOrders";
import jsPDF from "jspdf";
import logoUrl from "../../../Assets/images/logoUrl.png";
import "./styles.css";
import { Label1, splitLabels } from "Utils/pdfGenerator";
import { useUser } from "Hooks/localStorageUser";
import { toast } from "react-toastify";
import Modal from "@mui/material/Modal";
import Cancel from "@material-ui/icons/Cancel";
import TextField from "@material-ui/core/TextField";
import { selectText } from "Utils/selectText";

import CustomLoader from "Components/Loader";

import { ukDateFormat } from "Utils/datesFormat";
import { ProductData } from "Interfaces/Products";
import { useBrand } from "Context/BrandContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: "21px",
      fontWeight: "bold"
    },
    label: {
      marginBottom: "0px",
      marginTop: "0px",
      fontWeight: "bold",
      fontSize: "12px"
    },
    selectLabel: {
      display: "block",
      marginBottom: "8px",
      marginTop: "0px",
      fontWeight: "bold",
      fontSize: "12px"
    },
    btnSection: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center"
    },
    pdfName: {
      color: "red"
    },
    statusHandler: {
      marginLeft: "10px",
      marginTop: "33px"
    },
    colorTick: {
      filter:
        "invert(24 %) sepia(100%) saturate(1634 %) hue - rotate(95deg) brightness(97 %) contrast(104 %)"
    },
    iconDiv: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    inputField: {
      borderColor: theme.palette.gray[300],
      borderRadius: "6px",
      width: "100%",
      background: "white"
    },
    shippingLabelBtn: {
      width: "100%",
      height: "35px",
      background: "red",
      color: "white",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer"
    },
    pcLabels: {
      display: "none"
    },
    tabLabels: {
      display: "block"
    },
    [`@media (min-width: 1200px)`]: {
      pcLabels: {
        display: "block"
      },
      tabLabels: {
        display: "none"
      }
    },
    disabledButton: {
      cursor: "not-allowed"
    },
    printOnlyContainer: {
      width: "100%",
      display: "flex",
      flex: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: "20px"
    },
    printOnlySelector: {
      width: "300px",
      display: "flex",
      flex: "row",
      alignItems: "center"
    },
    notSyncContainer: {
      width: "100%",
      display: "flex",

      alignItems: "center",
      justifyContent: "flex-start"
    },
    notSyncText: {
      padding: "5px",
      backgroundColor: "rgba(255, 0, 0, 0.8)",
      borderRadius: "3px",
      color: "#ffffff",
      fontSize: "12px",
      fontWeight: 500
    }
  })
);

interface Props {
  order: OrderData;
  customer?: CompanyData;
}

//eslint-disable-next-line
export const options: Option[] = [
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
    label: "On hold",
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

//eslint-disable-next-line
export const optionsStatus: Option[] = [
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
    label: "On hold",
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
  },
  {
    label: "Failed",
    value: "failed"
  },
  {
    label: "Draft",
    value: "draft"
  }
];
const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  borderRadius: "15px",
  boxShadow: 24,
  padding: "20px 32px 32px 20px"
};

const OrderDetails: React.FC<Props> = ({ order }) => {
  const [loadingContent, setLoadingContent] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (order.id) {
      setLoadingContent(false);
    }
  }, [order]);

  const classes = useStyles();

  const [orderStatus, setOrderStatus] = React.useState<Option>();
  const [, setShowChangeStatusWarning] = React.useState(false);

  const [showDeleteWarning, setShowDeleteWarning] = React.useState(false);
  const [orderSource, setOrderSource] = React.useState<Option>();

  const [showChangeSourceWarning, setShowChangeSourceWarning] = React.useState(false);
  const [isFileDownloading, setIsFileDownloading] = React.useState({
    loading: false,
    btnRef: ""
  });
  const { handleSave } = useModal({});
  const { mutate: restoreOrder, isLoading: isLoadingRestoreOrder } = useRestoreOrder();
  const { mutate: sendEmailInvoice } = useSendEmailInvoice(order?.id || "");
  const { mutateAsync: trashOrder, isLoading: isLoadingTrashOrder } = useTrashOrder(
    order?.id || ""
  );

  const [labelLoading, setLabelLoading] = React.useState<boolean>(false);
  const [suplitLoading, setSuplitLoading] = React.useState<boolean>(false);

  const { mutateAsync: changeOrderSource, isLoading: isLoadingChangeOrderSource } =
    useEditOrder(order?.id || "");

  const validationSchema = yup.object({
    email_subject: yup.string().required("Required"),
    email_body: yup.string().required("Required")
  });
  const formik = useFormik({
    initialValues: {
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

  const emailsList: string[] = [];
  const [statusDefault, setStatusDefault] = React.useState<{
    label: string;
    value: string;
  }>({
    label: "",
    value: ""
  });
  const [labelEnable, setLabelEnable] = React.useState<boolean>(false);
  const [quickBook, setQuickBook] = React.useState<string | undefined>("");

  React.useEffect(() => {
    setQuickBook(order?.quickbook_reference_number);
    switch (order.status) {
      case "p":
        setStatusDefault({ label: "Pending", value: "pending" });
        break;
      case "o":
        setStatusDefault({ label: "On Hold", value: "on_hold" });
        break;
      case "g":
        setStatusDefault({ label: "Processing", value: "processing" });
        break;
      case "c":
        setStatusDefault({ label: "Completed", value: "completed" });
        break;
      case "d":
        setStatusDefault({ label: "Cancelled", value: "cancelled" });
        break;
      case "f":
        setStatusDefault({ label: "Refunded", value: "refunded" });
        break;
      case "t":
        setStatusDefault({ label: "Processing", value: "processing" });
        break;
      case "a":
        setStatusDefault({ label: "Draft", value: "draft" });
        break;
      case "i":
        setStatusDefault({ label: "Failed", value: "failed" });
        break;
      case "x":
        setStatusDefault({ label: "Dispensed", value: "dispensed" });

        break;
      default:
        break;
    }

    if (order?.billing_address?.email) emailsList.push(order.billing_address.email);
    if (
      order?.shipping_address?.email &&
      !emailsList.includes(order.shipping_address.email)
    )
      emailsList.push(order.shipping_address.email);
    formik.setFieldValue("email_to", emailsList);
    const orderSrc = options.find(option => option.value === order.source);
    if (orderSrc) {
      setOrderSource(orderSrc);
    }

    if (
      order?.products?.every(
        item => !item.prescription_id || item.prescription_id === ""
      ) &&
      order?.products?.every(item => !item.is_pom)
    ) {
      setLabelEnable(true);
    } else {
      // eslint-disable-next-line no-console
      console.log("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dependency needs formik that will run continuously
  }, [order]);

  const promptMessage = order.is_trash
    ? "This will restore the order."
    : "This will mark the order as trashed.";

  const handleDownload = async (oneItem: boolean) => {
    let product: ProductData[] = [];

    try {
      if (oneItem) {
        setLabelLoading(true);
        const labelData = await Label1(order);

        // Check if labelData is defined and is an array
        if (labelData !== undefined && Array.isArray(labelData)) {
          product = labelData as unknown as ProductData[];
        } else {
          // Handle the case where labelData is not an array or is undefined
          // You might want to set a default value or handle this case accordingly
        }
      } else {
        setSuplitLoading(true);
        const splitData = await splitLabels(order);

        // Check if splitData is defined and is an array
        if (splitData !== undefined && Array.isArray(splitData)) {
          product = splitData as ProductData[];
        } else {
          // Handle the case where splitData is not an array or is undefined
          // You might want to set a default value or handle this case accordingly
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching data:", error);
    }
    // Create a new jsPDF instance with custom page size (76mm x 40mm)
    const pdfDoc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [40, 76]
    });

    // Define variables for prescription information
    const addressPharmacy = "1 Guest Street, Leigh, WN7 2RPh";
    const pharmacyName = "The Healthcare + Aesthetic Pharmacy";
    const logoWidth = 5; // Adjust logo width as needed
    const logoHeight = 5; // Adjust logo height as needed
    // Set font and size for the label
    pdfDoc.setFont("Helvetica", "normal");
    pdfDoc.setFontSize(8);

    pdfDoc.setDrawColor(0, 128, 0); // Set border color to red

    if (product?.length > 0) {
      for (let i = 0; i < product.length; i++) {
        const item = product[i];

        if (i > 0) {
          pdfDoc.addPage(); // Add a new page for each item
        }

        // Set font and size for the label
        pdfDoc.setFont("Helvetica", "normal");
        pdfDoc.setFontSize(8);

        const maxDosageCharacters = 160;
        const truncatedDosage =
          item?.direction && item?.direction.slice(0, maxDosageCharacters);
        pdfDoc.setFont("Helvetica", "bold");
        order?.website?.label_template === "preset"
          ? pdfDoc.text("", 38, 5, { align: "center" })
          : item?.quantity &&
            pdfDoc.text("KEEP OUT OF REACH & SIGHT OF CHILDREN", 38, 5, {
              align: "center"
            });

        // Reset font style to normal
        pdfDoc.setFont("Helvetica", "normal");

        const productNameLines =
          item?.quantity &&
          pdfDoc.splitTextToSize(
            `${item?.quantity} X ${item?.product_name ? item?.product_name : ""}`,
            70
          );

        const dosageLines =
          truncatedDosage && pdfDoc.splitTextToSize(truncatedDosage, 70);

        const productNameLineHeight = 9;
        const dosageLineHeight = productNameLines.length > 1 ? 17 : 13;

        pdfDoc.text(productNameLines, 38, productNameLineHeight, { align: "center" });
        pdfDoc.text(dosageLines, 38, dosageLineHeight, { align: "center" });

        //warning message
        pdfDoc.setFont("Helvetica", "normal");
        pdfDoc.setFontSize(8);

        if (oneItem) {
          const warningMessageLineHeight = dosageLineHeight + 5;
          item.warning_message &&
            pdfDoc.text(
              item.warning_message,
              38,
              item?.quantity ? warningMessageLineHeight : 5,
              {
                maxWidth: 70,
                align: "center"
              }
            );
        } else {
          const maxWarningMessageCharacters = 70;

          const truncatedWarningMessage =
            item?.warning_message &&
            item?.warning_message.slice(0, maxWarningMessageCharacters);

          const warningMessageLines =
            truncatedWarningMessage &&
            pdfDoc.splitTextToSize(truncatedWarningMessage, 70);

          const warningMessageLineHeight = dosageLineHeight + 5;

          pdfDoc.text(warningMessageLines, 38, warningMessageLineHeight, {
            align: "center"
          });
        }

        pdfDoc.text(`${new Date().toLocaleDateString()}`, 55, 27);
        pdfDoc.text(`${item?.patient_name}`, 5, 27);
        pdfDoc.setFontSize(4);

        pdfDoc.setFontSize(6);
        pdfDoc.setFont("Helvetica", "bold");
        pdfDoc.text(`${pharmacyName}`, 8, 30);

        pdfDoc.setFont("Helvetica", "normal");
        order?.website?.label_template === "preset"
          ? pdfDoc.text("", 12, 33)
          : pdfDoc.text(`${addressPharmacy}`, 12, 33);

        pdfDoc.setDrawColor(0, 128, 0);

        order?.website?.label_template === "preset"
          ? pdfDoc.text("", 50, 28)
          : pdfDoc.rect(50, 28, 10, 6);
        order?.website?.label_template === "preset"
          ? pdfDoc.text(``, 51, 31)
          : pdfDoc.text(`Disp.By`, 51, 31);

        order?.website?.label_template === "preset"
          ? pdfDoc.text("", 60, 28)
          : pdfDoc.rect(60, 28, 10, 6);
        order?.website?.label_template === "preset"
          ? pdfDoc.text(``, 61, 31)
          : pdfDoc.text(`Chkd. By`, 61, 31);

        order?.website?.label_template === "preset"
          ? pdfDoc.text("", 3, 29, { maxWidth: logoWidth })
          : pdfDoc.addImage(logoUrl, "PNG", 3, 29, logoWidth, logoHeight);

        pdfDoc.setFontSize(6);
        pdfDoc.setFont("Helvetica", "bold");
        pdfDoc.text(`${pharmacyName}`, 8, 30);
        pdfDoc.setFont("Helvetica", "normal");
        order?.website?.label_template === "preset"
          ? pdfDoc.text(``, 12, 33)
          : pdfDoc.text(`${addressPharmacy}`, 12, 33);

        if (i === product.length - 1) {
          pdfDoc.putTotalPages(product.length.toString()); // Set total number of pages
        }
      }
      oneItem ? setLabelLoading(false) : setSuplitLoading(false);

      // Open the PDF preview in a new tab
      const pdfData = pdfDoc.output("blob");
      const blob = new Blob([pdfData], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      // Clean up
      window.URL.revokeObjectURL(url);
    }
  };

  const externalPDFLinks = (staticURL: string, btnRef: string) => {
    setIsFileDownloading({
      loading: true,
      btnRef: btnRef
    });

    const apiUrl = `${order?.website?.site_url}${staticURL}${order?.website_order_id}`;
    const apiKey = order?.website?.authorization_key;

    fetch(apiUrl, {
      headers: {
        Authorization: `${apiKey}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        setIsFileDownloading({
          loading: false,
          btnRef: ""
        });
        return response.blob();
      })
      .then(blob => {
        // Create a URL for the blob object
        const fileUrl = URL.createObjectURL(blob);
        setIsFileDownloading({
          loading: false,
          btnRef: ""
        });
        // Open the PDF file in a new window
        window.open(fileUrl, "_blank");
      })
      .catch(error => console.log("error", error));
  };
  const user = useUser();

  //shipment code
  const obj = {
    order_id: order?.website_order_id,
    authorization: order?.website?.authorization_key,
    website: order?.website?.site_url
  };

  const { data, isLoading } = useServiceAndProductSelect(
    obj?.order_id,
    obj?.authorization,
    obj?.website
  );

  const [open, setOpen] = React.useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
    setSelectedService({
      label: "",
      value: ""
    });
    setSelectedProduct({
      label: "",
      value: ""
    });
  };

  const [selectedService, setSelectedService] = React.useState<{
    label: string;
    value: string;
  }>({
    label: "",
    value: ""
  });
  const [, setSelectedProduct] = React.useState<{ label: string; value: string }>({
    label: "",
    value: ""
  });

  const [shippingLabelDetail, setShippingLabelDetail] = React.useState<{
    referenceOne: string | number;
    referenceTwo: string;
    referenceThree: string;
    deliveryInstruction: string;
    parcelDescription: string;
  }>({
    referenceOne: "",
    referenceTwo: "",
    referenceThree: "",
    deliveryInstruction: "",
    parcelDescription: ""
  });

  React.useEffect(() => {
    if (order)
      setShippingLabelDetail(prev => ({
        ...prev,
        referenceOne: order?.website_order_id ? order?.website_order_id : "",
        referenceTwo: order?.website?.title ? order?.website?.title : "",
        deliveryInstruction: data?.delivery_instruction ? data?.delivery_instruction : ""
      }));
  }, [order, data]);

  const shippingDetailHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setShippingLabelDetail(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const { mutate, isLoading: postLoading } = usePostShippingData(
    obj?.order_id,
    obj?.authorization,
    obj?.website
  );

  const { mutate: printMutate } = usePrintShipingLabel(
    obj?.order_id,
    obj?.authorization,
    obj?.website
  );

  const submitShippingHandler = () => {
    if (!selectedService?.value) {
      toast.error("Please Select Service ");
      return;
    }

    if (selectedService?.value) {
      const postShipDetail = {
        shippingRef1: shippingLabelDetail?.referenceOne,
        shippingRef2: shippingLabelDetail?.referenceTwo,
        shippingRef3: shippingLabelDetail?.referenceThree,
        deliveryInstructions: shippingLabelDetail?.deliveryInstruction,
        parcelDescription: shippingLabelDetail?.parcelDescription,
        networkCode: selectedService?.value
      };
      mutate(postShipDetail, {
        onSuccess
      });
    }
  };

  //eslint-disable-next-line
  const onSuccess = (response: any) => {
    const blob = new Blob([response], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  async function getShippingContent() {
    printMutate(obj, {
      //eslint-disable-next-line
      onSuccess: async (response: any) => {
        const blob = new Blob([response], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        // You can do something with the `url`, e.g., open it in a new tab
        window.open(url, "_blank");
      }
    });
  }

  const [printerList] = React.useState<{ label: string; value: string }[]>([]);
  const [, setLoadingPrinters] = React.useState<boolean>(false);

  React.useEffect(() => {
    printerList.length > 1 && setLoadingPrinters(false);
  }, [printerList]);
  const { brandDetail } = useBrand();

  const handleSubmit = () => {
    changeOrderSource({
      status: orderStatus?.value,
      quickbook_reference_number: quickBook ?? ""
    });
  };
  return (
    <>
      {!loadingContent ? (
        <div>
          <Prompt
            promptMsg={promptMessage}
            title={order?.is_trash ? "Restore order" : "Trash order"}
            openModal={showDeleteWarning}
            onCancel={() => setShowDeleteWarning(false)}
            onProceed={async () => {
              setShowDeleteWarning(false);
              if (order?.is_trash) {
                restoreOrder({ orderId: order.id });
              } else {
                await trashOrder({ orderId: order?.id });
              }
            }}
          />
          <Prompt
            promptMsg="Changing the order source will impact the overall tax."
            title="Change Order Source"
            openModal={showChangeSourceWarning}
            onCancel={() => {
              setShowChangeSourceWarning(false);
              setOrderSource(options.find(f => f.value === order.source));
            }}
            onProceed={async () => {
              setShowChangeSourceWarning(false);
              changeOrderSource({ source: orderSource?.value, category: order.category });
            }}
          />

          <div className={classes.pcLabels}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item lg={6} md={12}>
                <h3 className={classes.title}>
                  Order
                  {order.is_trash ? (
                    <Chip color="error" label="Trashed" style={{ marginLeft: 12 }} />
                  ) : null}
                </h3>
              </Grid>
              <Grid item lg={6} md={12}>
                <div className={classes.btnSection}>
                  {user?.is_superuser && (
                    <Button
                      style={{
                        width: "max-content"
                      }}
                      loading={isLoadingTrashOrder || isLoadingRestoreOrder}
                      text={order.is_trash ? "Restore" : "Trash Order"}
                      variant="outlined"
                      icon={
                        <MuiIcon
                          icon={order?.is_trash ? "undo" : "delete"}
                          fontSize="small"
                        />
                      }
                      onClick={() => setShowDeleteWarning(true)}
                    />
                  )}
                  &nbsp; &nbsp;
                  <Button
                    style={{
                      width: "max-content"
                    }}
                    text="View Prescription"
                    variant="outlined"
                    onClick={() =>
                      externalPDFLinks(
                        "/wp-json/inventory/v1/view_prescription_pdf?order_id=",
                        "prescription"
                      )
                    }
                    icon={<MuiIcon icon="print" fontSize="small" />}
                    disabled={order?.prescription_ids ? false : true}
                    loading={
                      isFileDownloading.loading &&
                      isFileDownloading.btnRef === "prescription"
                        ? true
                        : false
                    }
                  />
                  &nbsp; &nbsp;
                  <Button
                    style={{
                      width: "max-content"
                    }}
                    text="Print Invoice"
                    variant="outlined"
                    icon={
                      order?.invoice_print ? (
                        <MuiIcon
                          className="greenFilterIcon"
                          icon="check"
                          color="primary"
                          fontSize="small"
                        />
                      ) : (
                        <MuiIcon icon="print" fontSize="small" />
                      )
                    }
                    onClick={() => {
                      const username = user?.first_name + " " + user?.last_name;
                      const email = user?.email || "";
                      const orderIds = "";
                      const documentType = "invoice";
                      const url = `/wp-json/inventory/v1/view_order_pdf?username=${username}&email=${email}&document_type=${documentType}&order_ids=${orderIds}`;
                      externalPDFLinks(url, "invoice");
                    }}
                    loading={
                      isFileDownloading.loading && isFileDownloading.btnRef === "invoice"
                        ? true
                        : false
                    }
                  />
                  &nbsp; &nbsp;
                  <Button
                    style={{
                      width: "max-content"
                    }}
                    text="Packing Slip"
                    variant="outlined"
                    // eslint-disable-next-line
                    //@ts-ignore
                    icon={
                      order?.packing_slip_print ? (
                        <MuiIcon
                          className="greenFilterIcon"
                          icon="check"
                          fontSize="small"
                        />
                      ) : (
                        <MuiIcon icon="print" fontSize="small" />
                      )
                    }
                    onClick={() => {
                      const username = user?.first_name + " " + user?.last_name;
                      const email = user?.email || "";
                      const orderIds = "";
                      const documentType = "packing-slip";
                      const url = `/wp-json/inventory/v1/view_order_pdf?username=${username}&email=${email}&document_type=${documentType}&order_ids=${orderIds}`;
                      externalPDFLinks(url, "packing");
                    }}
                    loading={
                      isFileDownloading.loading && isFileDownloading.btnRef === "packing"
                        ? true
                        : false
                    }
                  />
                  {brandDetail?.brandSettings?.["shipping-label"] && (
                    <Button
                      style={{ marginLeft: "5px", width: "max-content" }}
                      text="Shipping Label"
                      variant="outlined"
                      icon={<MuiIcon icon="ship" />}
                      loading={isLoading}
                      onClick={() => setOpen(true)}
                      disabled={
                        !data || isLoading || !order.products?.length || order.is_trash
                      }
                    />
                  )}
                  <Button
                    style={{ marginLeft: "5px", width: "max-content" }}
                    text="1 Label"
                    variant="outlined"
                    icon={<MuiIcon icon="print" fontSize="small" />}
                    onClick={() => handleDownload(true)}
                    loading={labelLoading}
                    disabled={labelEnable}
                  />
                  <Button
                    style={{ marginLeft: "5px", width: "max-content" }}
                    text="Split Labels"
                    variant="outlined"
                    icon={<MuiIcon icon="print" fontSize="small" />}
                    onClick={() => handleDownload(false)}
                    loading={suplitLoading}
                    disabled={labelEnable}
                  />
                </div>
              </Grid>
            </Grid>
          </div>

          <div className={classes.tabLabels}>
            <Grid container alignItems="center">
              <Grid item lg={2} md={2.8} sm={2.8}>
                <h3 className={classes.title}>
                  Order
                  {order.is_trash ? (
                    <Chip color="error" label="Trashed" style={{ marginLeft: 12 }} />
                  ) : null}
                </h3>
              </Grid>

              <Grid item lg={10} md={9.2} sm={9.2} container direction="row">
                <Grid item lg={6} md={12} container>
                  <div>
                    {user?.is_superuser && (
                      <Button
                        style={{
                          width: "max-content"
                        }}
                        loading={isLoadingTrashOrder || isLoadingRestoreOrder}
                        text={order.is_trash ? "Restore" : "Trash Order"}
                        variant="outlined"
                        icon={
                          <MuiIcon
                            icon={order?.is_trash ? "undo" : "delete"}
                            fontSize="small"
                          />
                        }
                        onClick={() => setShowDeleteWarning(true)}
                      />
                    )}
                  </div>

                  <div style={{ display: "inline-block" }}>
                    <Button
                      style={{
                        width: "max-content"
                      }}
                      text="View Prescription"
                      variant="outlined"
                      onClick={() =>
                        externalPDFLinks(
                          "/wp-json/inventory/v1/view_prescription_pdf?order_id=",
                          "prescription"
                        )
                      }
                      icon={<MuiIcon icon="print" fontSize="small" />}
                      disabled={order?.prescription_ids ? false : true}
                      loading={
                        isFileDownloading.loading &&
                        isFileDownloading.btnRef === "prescription"
                          ? true
                          : false
                      }
                    />
                  </div>

                  <div style={{ display: "inline-block" }}>
                    <Button
                      style={{
                        width: "max-content"
                      }}
                      text="Print Invoice"
                      variant="outlined"
                      icon={
                        order?.invoice_print ? (
                          <MuiIcon
                            className="greenFilterIcon"
                            icon="check"
                            color="primary"
                            fontSize="small"
                          />
                        ) : (
                          <MuiIcon icon="print" fontSize="small" />
                        )
                      }
                      // onClick={() => externalPDFLinks(`/wp-json/inventory/v1/view_order_pdf?username=${user?.first_name + ' ' + user?.last_name}&email=${user?.email ? user?.email : ''}&document_type=invoice&order_ids=`, 'invoice')}
                      onClick={() => {
                        const username = user?.first_name + " " + user?.last_name;
                        const email = user?.email || "";
                        const orderIds = "";
                        const documentType = "invoice";
                        const url = `/wp-json/inventory/v1/view_order_pdf?username=${username}&email=${email}&document_type=${documentType}&order_ids=${orderIds}`;
                        externalPDFLinks(url, "invoice");
                      }}
                      // disabled={
                      //   !order.products?.length || (invoiceData && !invoiceData?.invoices?.length)
                      // }
                      loading={
                        isFileDownloading.loading &&
                        isFileDownloading.btnRef === "invoice"
                          ? true
                          : false
                      }
                    />
                  </div>

                  <div style={{ display: "inline-block" }}>
                    <Button
                      style={{
                        width: "max-content"
                      }}
                      text="Packing Slip"
                      variant="outlined"
                      // eslint-disable-next-line
                      //@ts-ignore
                      icon={
                        order?.packing_slip_print ? (
                          <MuiIcon
                            className="greenFilterIcon"
                            icon="check"
                            fontSize="small"
                          />
                        ) : (
                          <MuiIcon icon="print" fontSize="small" />
                        )
                      }
                      onClick={() => {
                        const username = user?.first_name + " " + user?.last_name;
                        const email = user?.email || "";
                        const orderIds = "";
                        const documentType = "packing-slip";
                        const url = `/wp-json/inventory/v1/view_order_pdf?username=${username}&email=${email}&document_type=${documentType}&order_ids=${orderIds}`;
                        externalPDFLinks(url, "packing");
                      }}
                      // disabled={
                      //   !order.products?.length || (invoiceData && !invoiceData?.invoices?.length)
                      // }
                      loading={
                        isFileDownloading.loading &&
                        isFileDownloading.btnRef === "packing"
                          ? true
                          : false
                      }
                    />
                  </div>
                </Grid>

                <Grid item lg={6} md={12} container ml={-0.6}>
                  {brandDetail?.brandSettings?.["shipping-label"] && (
                    <div>
                      <Button
                        style={{ marginLeft: "5px", width: "max-content" }}
                        text="Shipping Label"
                        variant="outlined"
                        icon={<MuiIcon icon="ship" />}
                        loading={isLoading}
                        onClick={() => setOpen(true)}
                        disabled={
                          !data || isLoading || !order.products?.length || order.is_trash
                        }
                      />
                    </div>
                  )}

                  <div style={{ display: "inline-block" }}>
                    <Button
                      style={{ marginLeft: "5px", width: "max-content" }}
                      text="1 Label"
                      variant="outlined"
                      icon={<MuiIcon icon="print" fontSize="small" />}
                      onClick={() => handleDownload(true)}
                      loading={labelLoading}
                      disabled={labelEnable}
                    />
                  </div>

                  <div style={{ display: "inline-block" }}>
                    <Button
                      style={{ marginLeft: "5px", width: "max-content" }}
                      text="Split Labels"
                      variant="outlined"
                      icon={<MuiIcon icon="print" fontSize="small" />}
                      onClick={() => handleDownload(false)}
                      loading={suplitLoading}
                      disabled={labelEnable}
                    />
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </div>

          <Grid container spacing={1}>
            <Grid item lg={1.5} xs={12}>
              <p className={classes.label}>Website Order ID</p>
              <TextInput
                inputProps={{ "aria-label": "Website Order ID" }}
                variant="outlined"
                margin="dense"
                name="customerNumber"
                type="text"
                disabled
                value={order?.website_order_id || ""}
              />
            </Grid>
            <Grid item lg={1.5} xs={12}>
              <p className={classes.label}>Website Name</p>

              <TextInput
                inputProps={{ "aria-label": "Website Name" }}
                variant="outlined"
                margin="dense"
                name="customerNumber"
                type="text"
                disabled
                value={order?.website?.title}
              />
            </Grid>
            <Grid item lg={1} xs={12}>
              <p className={classes.label}>Order #</p>
              <Grid container alignItems="center" spacing={1}>
                <Grid item lg={12} xs={12}>
                  <TextInput
                    inputProps={{ "aria-label": "order number" }}
                    variant="outlined"
                    margin="dense"
                    name="orderNumber"
                    type="text"
                    disabled={true}
                    value={order?.number || ""}
                  />
                </Grid>
                <Grid item xs={2} lg={2} style={{ display: "none" }}>
                  <Button
                    icon={<MuiIcon icon={"loop"} />}
                    variant="outlined"
                    type="secondary"
                    size="small"
                    onlyIcon={true}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={1} xs={12}>
              <p className={classes.label}>Customer #</p>
              <TextInput
                inputProps={{ "aria-label": "customer number" }}
                variant="outlined"
                margin="dense"
                name="customerNumber"
                type="text"
                disabled
                value={order?.company?.number || ""}
              />
            </Grid>

            <Grid item lg={2.1} xs={12}>
              <p className={classes.label}>Order Date</p>
              <TextInput
                inputProps={{ "aria-label": "order date" }}
                variant="outlined"
                margin="dense"
                name="orderDate"
                type="text"
                disabled
                value={order?.ordered ? ukDateFormat(order?.ordered, true) : ""}
              />
              {/* <DatePicker
            inputAriaLabel="order date"
            onChange={handleDateChfange}
            value={new Date(order.created)}
            pageName="TakeOrder"
            disabled
          /> */}
            </Grid>

            <Grid item lg={2} xs={12}>
              <p className={classes.label}>Quickbook Reference #</p>
              <TextInput
                inputProps={{ "aria-label": "quickbook_reference_number" }}
                variant="outlined"
                margin="dense"
                name="customerNumber"
                type="text"
                placeholder="Type Here.."
                onChange={e => setQuickBook(e.target.value)}
                value={quickBook || ""}
              />
            </Grid>

            {statusDefault && (
              <Grid item lg={2} xs={12}>
                <label htmlFor="Status" className={classes.selectLabel}>
                  Status
                </label>
                <Select
                  loading={isLoadingChangeOrderSource}
                  ariaLabel="status"
                  options={optionsStatus}
                  name="status"
                  disabled={false}
                  // defaultValue={options.find(option => option.value == order.status)}
                  defaultValue={statusDefault}
                  value={orderStatus}
                  onChange={value => {
                    setOrderStatus(value);
                    setShowChangeStatusWarning(true);
                  }}
                />
              </Grid>
            )}
            <Button
              text="Save"
              style={{
                marginLeft: "10px",
                marginTop: "33px"
              }}
              variant="contained"
              onClick={handleSubmit}
            />
          </Grid>
          {order?.number_of_order_items && (
            <div className={classes.notSyncContainer}>
              {order.number_of_order_items !== order.products?.length && (
                <p className={classes.notSyncText}>Products Not Synced Properly</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <Grid
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          width={"100%"}
        >
          <CustomLoader />
        </Grid>
      )}

      {data && !isLoading ? (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {!isLoading ? (
              <Grid container alignItems={"center"} justifyContent={"space-between"}>
                <Grid className={classes.iconDiv}>
                  <h2>Generate Shipping Label</h2>
                  <span onClick={handleClose}>
                    <Cancel
                      color="primary"
                      style={{ color: "#F7CA2A", fontSize: "50px", cursor: "pointer" }}
                    />
                  </span>
                </Grid>

                <Grid
                  container
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  {/* left side */}
                  <Grid item container lg={6} spacing={1} direction={"column"}>
                    <Grid item mb={1} lg={4} xs={12}>
                      <p className={classes.label}>Service *</p>
                      <Select
                        name="service"
                        options={data?.service ? data?.network : []}
                        onChange={value => setSelectedService(value)}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <p className={classes.label}>Reference 1</p>
                      <TextInput
                        inputProps={{ maxLength: 25, "aria-label": "Reference 1" }}
                        variant="outlined"
                        margin="dense"
                        name="referenceOne"
                        type="text"
                        value={shippingLabelDetail.referenceOne}
                        onChange={e => shippingDetailHandler(e)}
                      />
                    </Grid>
                    <Grid item lg={4} xs={12}>
                      <p className={classes.label}>Reference 2</p>
                      <TextInput
                        inputProps={{ maxLength: 25, "aria-label": "Reference 2" }}
                        variant="outlined"
                        margin="dense"
                        value={shippingLabelDetail.referenceTwo}
                        name="referenceTwo"
                        type="text"
                        onChange={e => shippingDetailHandler(e)}
                      />
                    </Grid>
                    <Grid item lg={4} xs={12}>
                      <p className={classes.label}>Reference 3</p>
                      <TextInput
                        inputProps={{ maxLength: 25, "aria-label": "Reference 3" }}
                        variant="outlined"
                        margin="dense"
                        name="referenceThree"
                        type="text"
                        value={shippingLabelDetail.referenceThree}
                        onChange={e => shippingDetailHandler(e)}
                      />
                    </Grid>
                  </Grid>

                  {/* right side */}
                  <Grid item container lg={5} direction={"column"}>
                    {data?.parcelNumbers && (
                      <Grid
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <h3 style={{ width: "fit-content" }}>Track Shipment: </h3>
                        <a target="_blank" href={data?.tracking_link} rel="noreferrer">
                          {data?.parcelNumbers}
                        </a>
                      </Grid>
                    )}
                    <Grid item lg={12} xs={12}>
                      <p className={classes.label}>Delivery Instruction</p>
                      <TextField
                        className={classes.inputField}
                        multiline
                        minRows={4}
                        maxRows={5}
                        name="deliveryInstruction"
                        onChange={e => shippingDetailHandler(e)}
                        inputProps={{
                          maxLength: 50,
                          onDoubleClick: selectText
                        }}
                      />
                    </Grid>
                    <Grid item lg={12} xs={12}>
                      <p className={classes.label}>Parcel description</p>
                      <TextField
                        className={classes.inputField}
                        multiline
                        minRows={4}
                        maxRows={5}
                        name="parcelDescription"
                        onChange={e => shippingDetailHandler(e)}
                        inputProps={{
                          maxLength: 50,
                          onDoubleClick: selectText
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid
                  mt={2}
                  container
                  item
                  lg={12}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Grid item lg={6}>
                    <button
                      disabled={postLoading}
                      onClick={submitShippingHandler}
                      className={`${classes.shippingLabelBtn}`}
                    >
                      {postLoading ? "Loading..." : "Generate Shipping Label"}
                    </button>
                  </Grid>
                  <Grid item lg={5}>
                    <button
                      disabled={!data?.shipmentId}
                      onClick={() => {
                        getShippingContent();
                      }}
                      className={`${classes.shippingLabelBtn} ${
                        postLoading || !data?.shipmentId ? classes.disabledButton : ""
                      }`}
                    >
                      {"View Shipping Label"}
                    </button>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <CustomLoader />
            )}
          </Box>
        </Modal>
      ) : null}
    </>
  );
};

export default OrderDetails;
