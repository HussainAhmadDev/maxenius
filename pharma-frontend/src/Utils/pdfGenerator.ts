import { OrderData } from "Interfaces/Order";

import NimbusSanL from "../Assets/fonts/NimbusSanL-Bol.otf";

export const Label1 = async (order: OrderData) => {
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
        // console.log(item);
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

    const firstLabelObject: any = {
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

      const warningObject: any = {
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
export const splitLabels = async (order: OrderData) => {
  // const filterPrescriptionId = order?.products?.filter(item => item.prescription_id);

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
      quantity && quantity_per_pack && Math.ceil(quantity / quantity_per_pack); // Calculate the number of labels needed

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

export const pdfTemplate = async (lineItem: any) => {
  const truncatedDirection = lineItem.direction;

  const content = `
    <style>
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding-left: 3%;
      padding-right: 3%;
    }

    .row {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .left {
      flex: 1;
    }

    .right {
      flex: 0;
      text-align: right;
    }
    .boxes {
    font-family: ${NimbusSanL};
      display: flex;
      justify-content: center;
      align-items: right;
      margin-top: 20px;
      gap: 0
    }

    .box {
    font-family: ${NimbusSanL};
      width: 130px;
      height: 130px;
      border: 1px solid green;
      margin-left: 10px;
      font-size: 26px;
      text-align: center;
      font-weight: bolder;
    }
    .box2 {
    font-family: ${NimbusSanL};
      width: 130px;
      height: 130px;
      border: 1px solid green;
      font-size: 26px;
      text-align: center;
      font-weight: bolder;
    }
    .bottomRow {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      margin-left: 10%;
      gap: 0
    }
    .divider {
      width: 100%;
      height: 10px;
      backgroundColor: black;
    }
    .center{
      margin-left: 10%;
    }
    .imgStyle{
      object-fit: cover;
      margin-top: 10px;
      width: 180px;
      
    }
    .pdf_keep_out{
      font-size: 36px;
      font-weight: bolder;
      font-stretch: 100%;
      font-family: ${NimbusSanL};
    }

    .product_name {
      font-size: 50px;
      width: 100%;
      font-weight: bolder;
      letter-spacing: 1px;
      font-stretch: 100%;

      font-family: ${NimbusSanL};
    }
  .pdf_direction{
    width: 100%;
    white-space: pre-wrap; 
    word-wrap: break-word; 
    word-break: break-word; 
    font-size: 36px;
    font-weight: bolder;
    overflow: visible;
    font-family: ${NimbusSanL};
    text-overflow: ellipsis;
    font-stretch: 100%;

  }
  .pdf_pt_name{
    font-stretch: 100%;

    font-size: 42px;
    font-weight: bolder; 
    font-family: ${NimbusSanL};
    margin-left: 3%;
  }
  .pdf_pt_date{
    font-size: 42px;
    font-weight: bolder;
    font-family: ${NimbusSanL};
    float: right;
  }
  .bottom_center_address{
    font-size: 42px;
    font-weight: bolder;
 
    font-family: ${NimbusSanL};
  }
  .address_heading{
    width: 100%;
    text-align: center;
    font-family: ${NimbusSanL};
    line-height: normal;
    font-size: 40px;
    font-weight: bolder;
  }
  .address_line2{
    font-family: ${NimbusSanL};
    width: 90%;
    text-align:left;
    line-height: normal;
    font-size: 36px;
    font-weight: bolder;
  }
  .bottom_container{
    margin-bottom : 10px;
  }
  </style>

  <div class="container">
    <p class="pdf_keep_out">KEEP OUT OF REACH & SIGHT OF CHILDREN</p>
    <h1 class="product_name">${lineItem.quantity} X ${lineItem.product_name}</h1>

    
    <p class="pdf_direction">${truncatedDirection ? truncatedDirection : ""}</p>
    <p class="pdf_direction">${lineItem?.warning_message}</p>
  

    <div class="row">
      <div class="pdf_pt_name">
        <h4>${lineItem?.patient_name?.toUpperCase()}</h4>
      </div>
      <div class="pdf_pt_date">
        <h4>${new Date().toLocaleDateString()}</h4>
      </div>
    </div>

    <div class="row bottom_container">
           

        <div class="bottom_center_address">
            <h4 class="address_heading">The Healthcare + Aesthetic Pharmacy</h4>
            <p class="address_line2"> 1 Guest Street, Leigh, WN7 2RP</p>
        </div>

      <div class="right">
          <div class="boxes">
            <div class="box">Disp.By</div>
            <div class="box2">Chkd.By</div>
        </div>
      </div>

    </div>

  </div>
    `;
  return content;
};
