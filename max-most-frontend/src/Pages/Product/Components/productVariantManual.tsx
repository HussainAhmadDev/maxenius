import { useEffect, useMemo, useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  TextField,
  Typography
} from "@mui/material";
import { AttributeItem, Errors } from "@interfaces/Products";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import DialogTitle from "@mui/material/DialogTitle";
import {
  useAddProductVariant,
  useVerfiyBarcode,
  useVerifySku
} from "../../../Hooks/useProducts";
import { useParams } from "react-router-dom";
import { validateSku } from "./validateUpdateDataForm";
import { getBrandId } from "../../../Hooks/api";

interface Props {
  open: boolean;
  cost_price: string;
  onClose(): void;
  errors?: Errors;
  setErrors?: React.Dispatch<React.SetStateAction<Errors>>;
  variants: AttributeItem[];
  handleVariantChange: (
    variantIndex: number,
    attributeKey: string,
    value: string
  ) => void;
  deleteVariant: (index: number) => void;
  attributes: { name: string; values: string[] }[];
}

const AddProductVariantManual: React.FC<Props> = props => {
  const { onClose, open, variants: prodochtVariants, attributes, cost_price } = props;
  const { mutateAsync: addVariant, isLoading } = useAddProductVariant();
  const { sku } = useParams();
  const [variants, setVariants] = useState<AttributeItem[] | []>([]);
  const { mutateAsync: verifySku } = useVerifySku();
  const { mutateAsync: verifyBarcode } = useVerfiyBarcode();
  const [formState, setFormState] = useState<AttributeItem>({});
  const [fieldValidate, setFieldValidation] = useState<{
    [key: string]: {
      message: string;
      isError: boolean;
    };
  }>({
    sku: { message: "", isError: false },
    barcode: { message: "", isError: false }
  });

  const handleVariantChange = (
    variantIndex: number,
    attributeKey: string,
    value: string
  ) => {
    const updatedVariants = variants.map((variant, index) =>
      index === variantIndex
        ? { ...variant, attributes: { ...variant.attributes, [attributeKey]: value } }
        : variant
    );
    setVariants(updatedVariants);
  };

  const handleInputChange = (
    field: keyof AttributeItem,
    value: string | boolean | number
  ) => {
    setFormState(prevState => ({ ...prevState, [field]: value }));
  };

  // Validate sku and barcode
  const validateFields = (fieldName: string, value: string | undefined): boolean => {
    let isValid: { message: string; isError: boolean } = {
      message: "",
      isError: false
    };

    switch (fieldName) {
      case "sku":
        isValid = validateSku(value);
        break;
      default:
        return true;
    }
    setErrorMessage(fieldName, isValid.message, isValid.isError);

    if (!isValid.isError) {
      isUniqueFields(fieldName, value as string);
    }
    return !isValid.isError;
  };
  // Validate Unique Sku and barcode
  const isUniqueFields = async (field: string, value: string) => {
    const id = getBrandId()?.brand_id;
    if (field === "sku") {
      try {
        if (id) {
          const id = getBrandId()?.brand_id;
          const response = await verifySku({ sku: value, brand_id: id });
          if (response === null) {
            setErrorMessage(field, "", false);
          } else if (response.is_exists) {
            setErrorMessage(field, "Sku already exists.", true);
          }
        }
      } catch (error) {
        console.log("Something went wrong in verifying sku: ", error);
      }
    } else if (field === "barcode") {
      if (value.trim() === "" || !value || value === "None") {
        return;
      }
      try {
        if (id) {
          const response = await verifyBarcode({ barcode: value, brand_id: id });
          if (response === null) {
            setErrorMessage(field, "", false);
          } else if (response.is_exists) {
            setErrorMessage(field, "Barcode already exists.", true);
            return;
          }
        }
      } catch (error) {
        console.log("Something went wrong in verifying barcode: ", error);
      }
    }
  };

  const handleSubmit = async () => {
    const { retail_price, barcode } = formState;
    const isSkuValid = validateFields("sku", formState.sku);
    const isBarcodeValid = validateFields("barcode", barcode);
    if (
      !isSkuValid ||
      !isBarcodeValid ||
      fieldValidate.sku.isError ||
      fieldValidate.barcode.isError
    ) {
      return;
    }
    const obj: AttributeItem = {
      retail_price: retail_price || 0,
      barcode,
      cost_price,
      id: sku ?? "",
      sku: formState.sku,
      variants:
        Array.isArray(variants) && variants.length > 0
          ? variants[0].attributes
            ? [variants[0].attributes]
            : []
          : []
    };
    await addVariant(obj);
    onClose();
  };

  // Update error message state
  const setErrorMessage = (field: string, message: string, isError: boolean) => {
    return setFieldValidation(prevErrors => ({
      ...prevErrors,
      [field]: {
        message: message,
        isError: isError
      }
    }));
  };
  useEffect(() => {
    setFieldValidation({
      sku: { message: "", isError: false },
      barcode: { message: "", isError: false }
    });
  }, []);

  useMemo(() => {
    setVariants(prodochtVariants.slice(0, 1));
  }, [prodochtVariants]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-describedby="alert-dialog-slide-description"
    >
      <IconButton
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500]
        }}
        onClick={onClose}
      >
        <Close />
      </IconButton>
      <DialogTitle variant="h6" fontWeight={"bold"}>
        Add Variant
      </DialogTitle>

      <Grid item xs={12} style={{ padding: 20 }}>
        <Grid container spacing={2}>
          {variants?.map((variant, index) => (
            <Grid key={index} item container spacing={2}>
              {variant?.attributes &&
                Object.entries(variant.attributes).map(([key, value]) => (
                  <Grid item lg={4} md={6} sm={12} xs={12} key={`${key}-${value}`}>
                    <FormControl fullWidth sx={{ minWidth: 120 }}>
                      <InputLabel>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </InputLabel>
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
            </Grid>
          ))}

          <Grid item xs={12} sm={6}>
            <TextField
              label="SKU"
              fullWidth
              variant="outlined"
              value={formState?.sku || ""}
              name="sku"
              onBlur={e => validateFields("sku", e.target.value)}
              onChange={e => handleInputChange("sku", e.target.value)}
            />
            {fieldValidate.sku.isError && (
              <Typography color="error" variant="body2">
                {fieldValidate.sku.message}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Barcode"
              fullWidth
              variant="outlined"
              name="Barcode"
              value={formState?.barcode || ""}
              onBlur={e => isUniqueFields("barcode", e.target.value)}
              onChange={e => handleInputChange("barcode", e.target.value)}
            />
            {fieldValidate.barcode.isError && (
              <Typography color="error" variant="body2">
                {fieldValidate.barcode.message}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Retail Price"
              type="number"
              fullWidth
              variant="outlined"
              name="retail_price"
              value={formState?.retail_price || 0}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={e => handleInputChange("retail_price", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dimension Width"
              fullWidth
              variant="outlined"
              value={formState?.dimension_width || 0}
              onChange={e => handleInputChange("dimension_width", e.target.value)}
              name="dimension_width"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dimension Height"
              fullWidth
              variant="outlined"
              value={formState?.dimension_height || 0}
              onChange={e => handleInputChange("dimension_height", e.target.value)}
              name="dimension_height"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dimension Length"
              fullWidth
              variant="outlined"
              value={formState?.dimension_length || 0}
              onChange={e => handleInputChange("dimension_length", e.target.value)}
              type="number"
              name="dimension_length"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formState?.status || ""}
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
                  onChange={e => handleInputChange("is_back_order", e.target.checked)}
                />
              }
              label="Back Order"
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: 10 }}
          disabled={isLoading}
        >
          Add Variant
        </Button>
      </Grid>
    </Dialog>
  );
};
export default AddProductVariantManual;
