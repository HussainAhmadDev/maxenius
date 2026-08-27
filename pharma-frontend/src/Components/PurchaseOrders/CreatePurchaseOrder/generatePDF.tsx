import jsPDF from "jspdf";
import logoUrl from "../../../Assets/images/refine-group-logo.jpeg";
import gradientBgUrl from "../../../Assets/images/svg.png"; // Import the converted PNG image
import { StaticData } from "./data";
import autoTable from "jspdf-autotable";

export const generatePDF = (purchaseOrder: StaticData) => {
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
  doc.addImage(gradientBgUrl, "PNG", 0, 0, pageWidth, headerHeight);
  cursorY += headerHeight;

  // Add logo at top right corner
  const imgWidth = 50;
  const imgHeight = 5;
  doc.addImage(
    logoUrl,
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
    body: productTableData.map((row: any) =>
      productTableHeaders.map(header => row[header.dataKey])
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
  cursorY = (doc as any).lastAutoTable.finalY + 20;

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
    body: receivingTableData.map((row: any) =>
      receivingTableHeaders.map(header => row[header.dataKey])
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
  doc.addImage(gradientBgUrl, "PNG", 0, footerY + 4, pageWidth, headerHeight);

  window.open(doc.output("bloburl"), "_blank");
};
