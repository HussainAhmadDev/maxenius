import {
  Divider,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  TextField,
  Grid,
  Switch,
  Button,
  FormControlLabel
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { memo, useCallback, useEffect, useState } from "react";
import { useEditProductVariant } from "../../../Hooks/useProducts";
import { Errors, AttributeItem, ProductData } from "../../../Interfaces/Products";
import { useVerifySku, useVerfiyBarcode } from "../../../Hooks/useProducts";
import { getBrandId } from "../../../Hooks/api";
import { useParams } from "react-router-dom";

interface AttributeValues {
  [key: string]: string;
}
interface formStateT {
  attributes: AttributeValues;
}

interface SkuValidationState {
  sku: string;
  index: number;
  barcode: string;
  isError: boolean;
}

interface IProps {
  isEdit?: boolean;
  variants: AttributeItem[];
  formState?: Partial<AttributeItem> | null;
  errors?: Errors;
  setErrors?: React.Dispatch<React.SetStateAction<Errors>>;
  setFormState?: React.Dispatch<React.SetStateAction<AttributeItem | formStateT | null>>;
  handleVariantChange: (
    variantIndex: number,
    attributeKey: string,
    value: string
  ) => void;
  deleteVariant: (index: number) => void;
  attributes: { name: string; values: string[] }[];
  mode?: string;
  product?: Partial<ProductData>;
  attributeDetailsList?: AttributeDetailsT[];
  setAttributeDetailsList?: React.Dispatch<React.SetStateAction<AttributeDetailsT[]>>;
  setIsSkuValid?: React.Dispatch<React.SetStateAction<SkuValidationState>>;
  isSkuValid?: SkuValidationState;
  editIndex?: number | null;
  setEditIndex?: React.Dispatch<React.SetStateAction<number | null>>;
  isAttributeUpdated?: boolean;
}

interface AttributeDetailsT {
  attributes: { [key: string]: string };
  barcode: string;
  dimension_height: string;
  dimension_length: string;
  dimension_width: string;
  retail_price: string;
  cost_price: string;
  sku: string;
  status: string;
}
const ProductVariants: React.FC<IProps> = ({
  isEdit,
  formState,
  errors,
  product,
  setFormState,
  variants,
  deleteVariant,
  attributes,
  handleVariantChange,
  mode,
  attributeDetailsList,
  setAttributeDetailsList,
  editIndex,
  setEditIndex,
  setIsSkuValid,
  isAttributeUpdated
}) => {
  const { mutateAsync: verifySku } = useVerifySku();
  const { mutateAsync: verifyBarcode } = useVerfiyBarcode();
  const { sku: editProduct } = useParams();
  const [fieldValidate, setFieldValidation] = useState<{
    [index: number]: {
      [key: string]: {
        message: string;
        isError: boolean;
      };
    };
  }>({});

  const handleEditClick = (index: number) => {
    if (!setEditIndex) {
      return;
    }
    setEditIndex(editIndex === index ? null : index);

    if (editIndex !== index && setFormState) {
      setFormState(variants[index]);
    }
  };

  useEffect(() => {
    if (
      editIndex !== null &&
      editIndex !== undefined &&
      formState &&
      attributeDetailsList &&
      setAttributeDetailsList
    ) {
      console.log("Edit Index: Change: ");
      const updatedList = [...attributeDetailsList];

      const currentItem = updatedList[editIndex];
      const updatedItem = {
        ...currentItem,
        ...formState
      };
      updatedList[editIndex] = updatedItem as unknown as AttributeDetailsT;
      setAttributeDetailsList(updatedList);
    }
  }, [attributeDetailsList, editIndex, formState, setAttributeDetailsList]);

  const handleInputChange = (field: keyof AttributeItem, value: string | boolean) => {
    if (setFormState) {
      setFormState(prevState => (prevState ? { ...prevState, [field]: value } : null));
    }
  };
  const { mutateAsync: updateVariant, isLoading } = useEditProductVariant();

  const handleSaveClick = async () => {
    if (errors?.isError) {
      return;
    }
    if (editIndex !== null && formState && setEditIndex) {
      // Extract the necessary fields from formState
      const updatedVariant = {
        id: formState?.id,
        retail_price: formState.retail_price,
        sku: formState.sku,
        barcode: formState.barcode,
        cost_price: formState.cost_price,
        variants: formState.attributes ? [formState.attributes] : [],
        status: formState.status,
        is_back_order:
          typeof formState?.is_back_order === "string"
            ? formState?.is_back_order === "False"
              ? false
              : true
            : formState?.is_back_order,
        dimension_width: formState?.dimension_width,
        dimension_height: formState?.dimension_height,
        dimension_length: formState?.dimension_length
      };

      // Remove keys with 'None' values
      removeIfNone(updatedVariant as unknown as { [key: string]: string }, [
        "dimension_width",
        "dimension_height",
        "dimension_length",
        "status",
        "cost_price",
        "barcode",
        "sku"
      ]);

      await updateVariant(updatedVariant);

      // Reset the edit index
      setEditIndex(null);
    }
    return;
  };

  // Helper function to remove keys with 'None' values
  const removeIfNone = (obj: { [key: string]: string }, keys: string[]) => {
    keys.forEach(key => {
      if (obj[key] === "None" || obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    });
  };

  const verify_Sku = async (skuValue: string) => {
    try {
      if (getBrandId()?.brand_id) {
        const id = getBrandId()?.brand_id;
        const response = await verifySku({ sku: skuValue, brand_id: id });
        if (response === null && setIsSkuValid) {
          setIsSkuValid(prevState => ({
            ...prevState,
            sku: "",
            isError: false
          }));
        } else if (response.is_exists && setIsSkuValid) {
          setIsSkuValid(prevState => ({
            ...prevState,
            sku: "Sku already exists.",
            isError: true
          }));
        }
      }
    } catch (error) {
      console.log("Something went wrong in verifying sku: ", error);
    }
  };

  const verify_barcode = async (barcodeValue: string) => {
    try {
      if (getBrandId()?.brand_id) {
        const id = getBrandId()?.brand_id;
        const response = await verifyBarcode({ barcode: barcodeValue, brand_id: id });
        if (response === null && setIsSkuValid) {
          setIsSkuValid(prevState => ({
            ...prevState,
            barcode: "",
            isError: false
          }));
        } else if (response.is_exists && setIsSkuValid) {
          setIsSkuValid(prevState => ({
            ...prevState,
            barcode: "Barcode already exists.",
            isError: true
          }));
        }
      }
    } catch (error) {
      console.log("Something went wrong in verifying barcode: ", error);
    }
  };

  const verify_skuBarcode = async (name: string, value: string) => {
    if (attributeDetailsList) {
      if (attributeDetailsList?.length <= 1) {
        if (name === "sku") {
          await verify_Sku(value);
        } else {
          await verify_barcode(value);
        }
      } else if (attributeDetailsList?.length >= 1) {
        if (name === "sku") {
          const skuList = attributeDetailsList
            .map(item => item.sku)
            .filter(sku => typeof sku === "string");
          if (product?.sku) {
            skuList.push(product.sku);
          }
          const result = skuList.reduce(
            (acc, sku, index) => {
              if (!acc.hasDuplicates && skuList.indexOf(sku) !== index) {
                return { hasDuplicates: true, index };
              }
              return acc;
            },
            { hasDuplicates: false, index: -1 }
          );
          if (result.hasDuplicates && setIsSkuValid) {
            setIsSkuValid(prevState => ({
              ...prevState,
              sku: "Sku already exist.",
              index: result.index,
              isError: true
            }));
          } else {
            await verify_Sku(value);
          }
        } else {
          const barcodeList = attributeDetailsList
            .map(item => item.barcode)
            .filter(barcode => typeof barcode === "string");
          if (product?.barcode) {
            barcodeList.push(product.barcode);
          }
          const result = barcodeList.reduce(
            (acc, barcode, index) => {
              if (!acc.hasDuplicates && barcodeList.indexOf(barcode) !== index) {
                return { hasDuplicates: true, index };
              }
              return acc;
            },
            { hasDuplicates: false, index: -1 }
          );
          if (result.hasDuplicates && setIsSkuValid) {
            setIsSkuValid(prevState => ({
              ...prevState,
              barcode: "Barcode already exist.",
              index: result.index,
              isError: true
            }));
          } else {
            await verify_barcode(value);
          }
        }
      }
    }
  };

  const updatedAttributes = useCallback(() => {
    if (setAttributeDetailsList && variants) {
      setAttributeDetailsList(variants as unknown as AttributeDetailsT[]);
    }
    setFieldValidation({});
  }, [setAttributeDetailsList, variants]);

  useEffect(() => {
    updatedAttributes;
  }, [updatedAttributes]);

  const { mutateAsync: editProductVariants } = useEditProductVariant();
  const saveEditHandler = async () => {
    // Check if there are no variations or if the edit index is invalid

    if (
      !product ||
      !product.variations ||
      product.variations.length < 0 ||
      editIndex === -1 ||
      editIndex == null ||
      editIndex == undefined
    ) {
      return;
    }
    const variantId = product.variations[editIndex]?.id; // Get the variant ID

    const payload = {
      ...formState,
      id: variantId,
      variants: [formState?.attributes]
    };

    await editProductVariants(payload as AttributeItem);
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography fontWeight={"bold"} variant="h6">
          Variants
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      {variants?.map((variant, index) => (
        <Grid key={index} item container spacing={2}>
          {variants.length > 0 &&
            variant?.attributes &&
            Object.entries(variant.attributes).map(([key, value]) => (
              <Grid item lg={4} md={6} sm={12} xs={12} key={`${key}-${value}`}>
                <FormControl fullWidth sx={{ minWidth: 120 }}>
                  <InputLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</InputLabel>
                  <Select
                    value={value || ""}
                    onChange={e => {
                      handleVariantChange(index, key, e.target.value);
                    }}
                    label={key}
                  >
                    {attributes
                      .find(attr => attr.name === key)
                      ?.values.map((val, idx) => (
                        <MenuItem key={idx} value={val}>
                          {val}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          {mode && mode !== "Create" && (
            <Grid
              item
              xs={12}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"flex-end"}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveClick}
                disabled={formState?.id == variant.id && isLoading}
              >
                Save Changes
              </Button>
            </Grid>
          )}

          <Grid item lg={2} md={2} sm={12} xs={12}>
            <IconButton
              aria-label="delete"
              color="secondary"
              onClick={() => deleteVariant(index)}
            >
              <DeleteIcon />
            </IconButton>
            {isEdit && (
              <IconButton
                aria-label="edit"
                color="primary"
                onClick={() => handleEditClick(index)}
              >
                <EditIcon />
              </IconButton>
            )}
          </Grid>
          {editIndex === index && isEdit && formState && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="SKU"
                    fullWidth
                    variant="outlined"
                    // value={formState.sku || attributeDetailsList?.[editIndex]?.sku || ""}
                    // onBlur={e => verify_skuBarcode("sku", e.target.value, editIndex)}
                    value={
                      formState.sku ||
                      (attributeDetailsList && attributeDetailsList[editIndex]?.sku)
                    }
                    onBlur={e => verify_skuBarcode("sku", e.target.value)}
                    onChange={e => handleInputChange("sku", e.target.value)}
                  />

                  {fieldValidate[editIndex]?.sku?.isError && (
                    <Typography color="error" variant="body2">
                      {fieldValidate[editIndex].sku.message}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Barcode"
                    fullWidth
                    variant="outlined"
                    value={
                      formState.barcode ||
                      attributeDetailsList?.[editIndex]?.barcode ||
                      ""
                    }
                    onBlur={e => verify_skuBarcode("barcode", e.target.value)}
                    onChange={e => handleInputChange("barcode", e.target.value)}
                  />
                  {fieldValidate[editIndex]?.barcode?.isError && (
                    <Typography color="error" variant="body2">
                      {fieldValidate[editIndex].barcode.message}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Retail Price"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={
                      formState.retail_price ||
                      (attributeDetailsList &&
                        attributeDetailsList[editIndex]?.retail_price)
                    }
                    InputProps={{ inputProps: { min: 0 } }}
                    onChange={e => handleInputChange("retail_price", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Dimension Width"
                    fullWidth
                    variant="outlined"
                    value={
                      formState.dimension_width ||
                      (attributeDetailsList &&
                        attributeDetailsList[editIndex]?.dimension_width)
                    }
                    onChange={e => handleInputChange("dimension_width", e.target.value)}
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Dimension Height"
                    fullWidth
                    variant="outlined"
                    value={
                      formState.dimension_height ||
                      (attributeDetailsList &&
                        attributeDetailsList[editIndex]?.dimension_height)
                    }
                    onChange={e => handleInputChange("dimension_height", e.target.value)}
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Dimension Length"
                    fullWidth
                    variant="outlined"
                    value={
                      formState.dimension_length ||
                      (attributeDetailsList &&
                        attributeDetailsList[editIndex]?.dimension_length)
                    }
                    onChange={e => handleInputChange("dimension_length", e.target.value)}
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={
                        formState.status ||
                        (attributeDetailsList &&
                          attributeDetailsList[editIndex]?.status) ||
                        ""
                      }
                      label="Status"
                      onChange={e => handleInputChange("status", e.target.value)}
                    >
                      <MenuItem value="i">In Stock</MenuItem>
                      <MenuItem value="o">Out of Stock</MenuItem>
                      <MenuItem value="b">On Back Order</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          typeof formState?.is_back_order === "string"
                            ? formState?.is_back_order == "False"
                              ? false
                              : true
                            : formState?.is_back_order
                        }
                        onChange={e =>
                          handleInputChange("is_back_order", e.target.checked)
                        }
                      />
                    }
                    label="Back Order"
                  />
                </Grid>
                {editProduct && !isAttributeUpdated ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={saveEditHandler}
                    sx={{ marginLeft: "15px", marginTop: "10px" }}
                  >
                    Save
                  </Button>
                ) : null}
              </Grid>
            </Grid>
          )}
        </Grid>
      ))}
    </>
  );
};

export default memo(ProductVariants);
