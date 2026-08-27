import { toast } from "react-toastify";
import { OrderData } from "../Interfaces/Orders";
import { ProductData } from "../Interfaces/Products";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PurchaseOrderPDFResponse } from "../Interfaces/PurchaseOrder";
type HeadersType = {
  [key: string]: string;
};

const externalPDFLinksOrder = async (
  staticURL: string,
  order: OrderData,
  callback: () => void = () => {}
) => {
  const apiUrl = `${order?.website?.site_url}${staticURL}${order?.website_order_id}`;
  const apiKey = order?.website?.authorization_key;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `${apiKey}`
      }
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const blob = await response.blob();
    if (blob instanceof Blob) {
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
      callback();
    }
  } catch (error) {
    toast.error((error as Error)?.message);
  }
};
const externalPDFLinksOrders = async (
  staticURL: string,
  selectedRow: OrderData[],
  callback: () => void
) => {
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
      if (website_order_id) {
        websiteOrderMap[website_url].push(String(website_order_id));
      }
    }
  }

  // Create a new array to store the final items with website_order_ids
  const finalItems = [];
  // Iterate through the websiteOrderMap to create final items
  for (const website_url in websiteOrderMap) {
    const website_order_ids = websiteOrderMap[website_url].join("x");

    const extractedItem = extractedItems.find(item => item.website_url === website_url)!;

    const finalItem = {
      website_url: website_url,
      website_order_id: website_order_ids,
      website_authorization_key: extractedItem.website_authorization_key
    };
    finalItems.push(finalItem);
  }

  try {
    for (const item of finalItems) {
      if (item?.website_order_id?.length) {
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
      }
    }
  } catch (error) {
    toast.error((error as Error)?.message);
  } finally {
    callback();
  }
};

const splitLabels = async (order: OrderData) => {
  const filterPrescriptionId = order?.products
    ?.map(item => {
      const returnQuantitySum = item?.order_product_return
        ?.map(itm => +itm.return_shipment.quantity)
        .reduce((sum, quantity) => sum + quantity, 0);

      if ((item.prescription_id && item.prescription_id.length > 0) || item.is_pom) {
        const modifiedQuantity = item.quantity - returnQuantitySum;
        return modifiedQuantity !== 0 ? { ...item, quantity: modifiedQuantity } : null;
      } else {
        return null;
      }
    })
    .filter(item => item !== null);

  const product = filterPrescriptionId?.flatMap(lineitem => {
    const patientName = lineitem?.patient_name || "N/A";
    const quantity = lineitem?.quantity;
    const quantity_per_pack = lineitem?.product?.quantity_per_pack;

    const labelCount =
      quantity && quantity_per_pack && Math.ceil(quantity / quantity_per_pack);
    const products = Array(labelCount).fill({
      patient_name: patientName,
      direction: lineitem?.direction ? lineitem?.direction : "",
      product_name: lineitem?.product?.name ? lineitem.product?.name : "",
      quantity: 1,
      quantity_per_pack,
      warning_message: lineitem?.product?.warning_message
        ? lineitem.product.warning_message
        : ""
    });

    return products;
  });
  return product;
};
const Label1 = async (order: OrderData) => {
  const filterPrescriptionId = order?.products
    ?.map(item => {
      const returnQuantitySum = item?.order_product_return
        ?.map(itm => +itm.return_shipment.quantity)
        .reduce((sum, quantity) => sum + quantity, 0);

      if ((item.prescription_id && item.prescription_id.length > 0) || item.is_pom) {
        const modifiedQuantity = item.quantity - returnQuantitySum;
        return modifiedQuantity !== 0 ? { ...item, quantity: modifiedQuantity } : null;
      } else {
        return null;
      }
    })
    .filter(item => item !== null);

  const product = filterPrescriptionId?.flatMap(lineitem => {
    const patientName = lineitem?.patient_name || "N/A";
    const warningMessage = lineitem?.product?.warning_message || "";

    const firstLabelMaxLength = 50;

    const chunkMaxLength = 300;

    // Split the warning message into chunks
    const warningChunks = [];
    let remainingWarning = warningMessage.trim(); // Trim to remove leading and trailing spaces

    // Handle the first label separately
    let firstLabel = remainingWarning.substr(0, firstLabelMaxLength);

    // Check if the first label is shorter than the specified maximum length
    if (firstLabel.length < firstLabelMaxLength) {
      firstLabel = remainingWarning; // Use the full warning message if it's shorter
    } else {
      const lastSpaceIndex = firstLabel.lastIndexOf(" ");
      if (lastSpaceIndex !== -1) {
        firstLabel = firstLabel.substr(0, lastSpaceIndex);
      }
    }

    const firstLabelObject: {
      patient_name: string;
      direction: string;
      product_name: string;
      quantity?: number;
      warning_message: string;
    } = {
      patient_name: patientName,
      direction: lineitem?.direction || "",
      product_name: lineitem?.product?.name || "",
      quantity: lineitem?.quantity,
      warning_message: firstLabel.trim() // Trim to remove leading and trailing spaces
    };

    warningChunks.push(firstLabelObject);
    remainingWarning = remainingWarning.substr(firstLabel.length).trim(); // Trim to remove processed part

    // Continue with the logic for other chunks
    while (remainingWarning.length > 0) {
      let chunk = remainingWarning.substr(0, chunkMaxLength);

      // Check if appending the remaining warning message exceeds the chunk length
      const remainingChunkLength =
        chunk.length + remainingWarning.substr(chunk.length).indexOf(" ");
      if (remainingChunkLength > chunkMaxLength) {
        // If it exceeds, find the last space in the chunk
        const lastSpaceIndex = chunk.lastIndexOf(" ");
        if (lastSpaceIndex !== -1) {
          chunk = chunk.substr(0, lastSpaceIndex);
        }
      }

      const warningObject: {
        patient_name: string;
        direction: string;
        product_name: string;
        quantity: string;
        warning_message: string;
      } = {
        patient_name: "",
        direction: "",
        product_name: "",
        quantity: "",
        warning_message: chunk.trim() // Trim to remove leading and trailing spaces
      };

      warningChunks.push(warningObject);
      remainingWarning = remainingWarning.substr(chunk.length).trim(); // Trim to remove processed part
    }

    return warningChunks;
  });

  return product;
};
const handleLabelsExport = async (
  mode: "one" | "split",
  order: OrderData,
  callback: () => void = () => {}
) => {
  let product: ProductData[] = [];
  try {
    if (mode === "one") {
      const labelData = await Label1(order);
      if (labelData !== undefined && Array.isArray(labelData)) {
        product = labelData as unknown as ProductData[];
      } else {
        throw new Error("No data");
      }
    } else {
      const splitData = await splitLabels(order);
      if (splitData !== undefined && Array.isArray(splitData)) {
        product = splitData as ProductData[];
      } else {
        throw new Error("No data");
      }
    }
  } catch (error) {
    toast.error("something wents wrong");
    console.error("Error fetching data:", error);
    return;
  }
  const pdfDoc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [40, 76]
  });

  const addressPharmacy = "1 Guest Street, Leigh, WN7 2RPh";
  const pharmacyName = "The Healthcare + Aesthetic Pharmacy";
  const logoWidth = 5;
  const logoHeight = 5;
  pdfDoc.setFont("Helvetica", "normal");
  pdfDoc.setFontSize(8);
  pdfDoc.setDrawColor(0, 128, 0);
  if (product?.length > 0) {
    for (let i = 0; i < product.length; i++) {
      const item = product[i];

      if (i > 0) {
        pdfDoc.addPage();
      }

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

      pdfDoc.setFont("Helvetica", "normal");

      const productNameLines =
        item?.quantity &&
        pdfDoc.splitTextToSize(
          `${item?.quantity} X ${item?.product_name ? item?.product_name : ""}`,
          70
        );

      const dosageLines = truncatedDosage && pdfDoc.splitTextToSize(truncatedDosage, 70);

      const productNameLineHeight = 9;
      const dosageLineHeight = productNameLines.length > 1 ? 17 : 13;

      pdfDoc.text(productNameLines, 38, productNameLineHeight, { align: "center" });
      pdfDoc.text(dosageLines, 38, dosageLineHeight, { align: "center" });

      pdfDoc.setFont("Helvetica", "normal");
      pdfDoc.setFontSize(8);
      if (mode === "one") {
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
          truncatedWarningMessage && pdfDoc.splitTextToSize(truncatedWarningMessage, 70);
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
        : pdfDoc.addImage(
            "/assets/maxeniusLogo.png",
            "PNG",
            3,
            29,
            logoWidth,
            logoHeight
          );
      pdfDoc.setFontSize(6);
      pdfDoc.setFont("Helvetica", "bold");
      pdfDoc.text(`${pharmacyName}`, 8, 30);
      pdfDoc.setFont("Helvetica", "normal");
      order?.website?.label_template === "preset"
        ? pdfDoc.text(``, 12, 33)
        : pdfDoc.text(`${addressPharmacy}`, 12, 33);
      if (i === product.length - 1) {
        pdfDoc.putTotalPages(product.length.toString());
      }
    }
    const pdfData = pdfDoc.output("blob");
    const blob = new Blob([pdfData], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
    window.URL.revokeObjectURL(url);
  } else {
    toast.info("No data to export");
  }
  callback();
};

const generatePurchaserOrderPDF = (purchaseOrder: PurchaseOrderPDFResponse) => {
  const {
    exchange_rate,
    invoicing_currency,
    location,
    order_date,
    order_number,
    products,
    receivings,
    vendor_name,
    purchase_order_number
  } = purchaseOrder;

  const doc = new jsPDF({
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let cursorY = margin;

  // Add gradient header image at the top of the page
  const headerHeight = 10; // Adjust as needed based on the height of your PNG
  doc.addImage("/assets/gradient.png", "PNG", 0, 0, pageWidth, headerHeight);
  cursorY += headerHeight;

  // Add logo at top right corner
  const imgWidth = 50;
  const imgHeight = 5;
  doc.addImage(
    "/assets/refine-group-logo.jpeg",
    "JPEG",
    pageWidth - imgWidth - margin,
    margin + 5, // Position logo slightly lower than the top margin
    imgWidth,
    imgHeight
  );

  // Add address details below the logo
  const addressLines = [
    "1 Guest Street, Leigh",
    "Greater Manchester",
    "WN7 2RP",
    "0161 706 1247",
    "sales@refinegroup.co.uk"
  ];
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let addressCursorY = cursorY + imgHeight + 5;
  addressLines.forEach(line => {
    doc.text(line, pageWidth - 15, addressCursorY, { align: "right" });
    addressCursorY += 5;
  });

  // Move the cursor below the address details
  cursorY = addressCursorY + 10;

  // Draw header
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(`Purchase order`, margin, cursorY);
  doc.setFont("helvetica", "normal");
  doc.text(`#${purchase_order_number || order_number}`, margin + 75, cursorY);
  cursorY += 15;

  // Draw Date
  doc.setFontSize(15);

  // Draw Date
  doc.setFont("helvetica", "bold");
  doc.text("Date: ", margin, cursorY);
  doc.setFont("helvetica", "normal");
  doc.text(order_date, margin + doc.getTextWidth("Date: "), cursorY);
  cursorY += 10;

  // Draw Location and Vendor parallel
  const column2X = margin + 100;

  doc.setFont("helvetica", "bold");
  doc.text("Location: ", margin, cursorY);
  doc.setFont("helvetica", "normal");
  doc.text(location, margin + doc.getTextWidth("Location: ") + 3, cursorY);

  doc.setFont("helvetica", "bold");
  doc.text("Vendor: ", column2X, cursorY);
  doc.setFont("helvetica", "normal");
  doc.text(vendor_name, column2X + doc.getTextWidth("Vendor: ") + 3, cursorY);
  cursorY += 10;

  // Draw Invoice Currency and Exchange Rate parallel
  doc.setFont("helvetica", "bold");
  doc.text("Invoice Currency: ", margin, cursorY);
  doc.setFont("helvetica", "normal");
  doc.text(
    invoicing_currency,
    margin + doc.getTextWidth("Invoice Currency: ") + 3,
    cursorY
  );

  doc.setFont("helvetica", "bold");
  doc.text("Exchange Rate: ", column2X, cursorY);
  doc.setFont("helvetica", "normal");
  doc.text(exchange_rate, column2X + doc.getTextWidth("Exchange Rate: ") + 3, cursorY);
  cursorY += 15;

  // Create product table
  const productTableHeaders = [
    { header: "Product", dataKey: "product_name" },
    { header: "Quantity", dataKey: "quantity" },
    { header: "Price", dataKey: "price" },
    { header: "Total", dataKey: "total" },
    { header: "Exchange Price", dataKey: "exchange_price" },
    { header: "Exchange Total", dataKey: "exchange_total" }
  ];

  const productTableData = products.map(product => ({
    product_name: product.product_name,
    quantity: product.quantity,
    price: product.price,
    total: product.total,
    exchange_price: product.exchange_price,
    exchange_total: product.exchange_total
  }));

  autoTable(doc, {
    startY: cursorY,
    head: [productTableHeaders.map(header => header.header)],
    body: productTableData.map(row =>
      productTableHeaders.map(header => row[header.dataKey as keyof typeof row])
    ),
    theme: "striped",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [12, 7.69, 12.75] },
    alternateRowStyles: { fillColor: [242, 242, 242] },
    columnStyles: { 0: { fontStyle: "bold" } },
    margin: { top: 20 },
    tableWidth: "auto",
    didDrawCell: data => {
      doc.setDrawColor(0);
      doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "S"); // 'S' option for stroke
    }
  });
  interface DocWithAutoTable extends jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
  cursorY = (doc as unknown as DocWithAutoTable)?.lastAutoTable?.finalY + 20;

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Receiving History", margin, cursorY);
  cursorY += 10;

  // Create receiving table
  const receivingTableHeaders = [
    { header: "Product", dataKey: "product_name" },
    { header: "Batch", dataKey: "batch_number" },
    { header: "Expiry", dataKey: "expiry_date" },
    { header: "Received amount", dataKey: "received_quantity" }
  ];

  const receivingTableData = receivings.map(receiving => ({
    product_name: receiving.product_name,
    batch_number: receiving.batch_number,
    expiry_date: receiving.expiry_date,
    received_quantity: receiving.received_quantity
  }));

  autoTable(doc, {
    startY: cursorY,
    head: [receivingTableHeaders.map(header => header.header)],
    body: receivingTableData.map(row =>
      receivingTableHeaders.map(header => row[header.dataKey as keyof typeof row])
    ),
    theme: "striped",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [12, 7.69, 12.75] },
    alternateRowStyles: { fillColor: [242, 242, 242] },
    columnStyles: { 0: { fontStyle: "bold" } },
    margin: { top: 20 },
    tableWidth: "auto",
    didDrawCell: data => {
      doc.setDrawColor(0);
      doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "S");
    }
  });

  const footerY = pageHeight - headerHeight;
  doc.addImage("/assets/gradient.png", "PNG", 0, footerY + 4, pageWidth, headerHeight);

  window.open(doc.output("bloburl"), "_blank");
};

export {
  externalPDFLinksOrder,
  splitLabels,
  handleLabelsExport,
  externalPDFLinksOrders,
  generatePurchaserOrderPDF
};
