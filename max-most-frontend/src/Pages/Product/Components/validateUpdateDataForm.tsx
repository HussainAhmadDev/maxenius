import { Errors } from "../../../Interfaces/Products";

type setErrorsT = React.Dispatch<React.SetStateAction<Errors>> | undefined;
// Validate the SKU
export const validateSku = (
  sku: string | undefined
): { message: string; isError: boolean; field: string } => {
  if (!sku || sku.trim() === "" || sku === "None") {
    return { message: "Sku is required.", isError: true, field: "sku" };
  }
  return { message: "", isError: false, field: "sku" };
};

// Validate the Barcode
// export const validateBarcode = (
//   barcode: string | undefined
// ): { message: string; isError: boolean; field: string } => {
//   if (!barcode || barcode.trim() === "" || barcode === "None") {
//     return { message: "Barcode is required.", isError: true, field: "barcode" };
//   }
//   return { message: "", isError: false, field: "barcode" };
// };

// Validate the Product Name
export const validateProductName = (
  value: string | undefined,
  setErrors: setErrorsT
): boolean => {
  if (setErrors) {
    if (!value || value.trim() === "" || value === "None") {
      setErrors(prev => ({
        ...prev,
        product_name: "Product name is required"
      }));
      return false;
    } else {
      setErrors(prev => ({
        ...prev,
        product_name: ""
      }));
      return true;
    }
  }
  return true;
};

// Validate the ProductNumber
export const validateProductNumber = (
  value: string | undefined | number,
  setErrors: React.Dispatch<React.SetStateAction<Errors>> | undefined
): boolean => {
  if (setErrors) {
    if (!value || value === "None" || value === "") {
      setErrors(prev => ({
        ...prev,
        product_number: "Product number is required"
      }));
      return false;
    } else {
      setErrors(prev => ({
        ...prev,
        product_number: "s"
      }));
      return true;
    }
  }
  return true;
};

export const validateProductname = (
  value: string | undefined
): { message: string; isError: boolean; field: string } => {
  if (!value || value.trim() === "" || value === "None") {
    return {
      message: "Product Number is required.",
      isError: true,
      field: "productNumber"
    };
  }
  return { message: "", isError: false, field: "productNumber" };
};
// Validate ProductBarcode
export const validateProductBarcode = (
  value: string | undefined,
  setErrors: React.Dispatch<React.SetStateAction<Errors>> | undefined
): boolean => {
  if (setErrors) {
    if (!value || value.trim() === "" || value === "None") {
      setErrors(prev => ({
        ...prev,
        product_barcode: "Product barcode is required"
      }));
      return false;
    } else {
      setErrors(prev => ({
        ...prev,
        product_barcode: ""
      }));
      return true;
    }
  }
  return true;
};
