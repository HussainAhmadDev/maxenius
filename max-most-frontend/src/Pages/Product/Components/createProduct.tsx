import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Input from "../../../Components/Input";
import { toast } from "react-toastify";
import TextArea from "../../../Components/Textarea";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import LoadingButton from "../../../Components/LoadingButton";
import {
  ProductData,
  CreateProductResponse,
  Errors,
  AttributeItem,
  AttributeDetailsT
} from "../../../Interfaces/Products";

import { getBrandDetails, getBrandId } from "../../../Hooks/api";
import {
  useCreateProduct,
  useVerfiyBarcode,
  useVerifySku
} from "../../../Hooks/useProducts";
import ProductVariants from "./productVariants";
import ProductAttributes from "./productAttributes";
import {
  // validateProductBarcode,
  validateProductName
  // validateProductNumber
} from "./validateUpdateDataForm";
import DataTable from "../../../Components/DataTable";
import { PrivatePrescriptionColumns } from "../../../Constants/privatePrescriptionConst";
import { Website as WebsiteType } from "@interfaces/webstiteType";
import { useWebsites } from "../../../Hooks/usePatients";

interface AttributeValues {
  [key: string]: string;
}
interface formStateT {
  attributes: AttributeValues;
}

const CreateProduct = () => {
  const { mutate, isLoading: creationLoading } = useCreateProduct();
  const { mutateAsync: verifySku } = useVerifySku();
  const { mutateAsync: verifyBarcode } = useVerfiyBarcode();

  const brand = getBrandDetails();
  const currency = brand?.currency_symbol;

  const [product, setProduct] = useState<Partial<ProductData>>({
    sku: "",
    barcode: "",
    name: "",
    description: "",
    is_pom: false
  });

  const [errors, setErrors] = useState<Errors>({});
  const [generateVariation, setGenerateVariation] = useState(true);
  const [variants, setVariants] = useState<AttributeItem[]>([]);
  const [attributes, setAttributes] = useState<{ name: string; values: string[] }[]>([]);
  const [attributesForm, setAttributeForm] = useState<formStateT | null | AttributeItem>(
    null
  );
  const [attributeDetailsList, setAttributeDetailsList] = useState<AttributeDetailsT[]>(
    []
  );

  useEffect(() => {
    if (generateVariation) {
      generateVariants();
    }
    //eslint-disable-next-line
  }, [attributes, generateVariation]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isSkuValid, setIsSkuValid] = useState<{
    sku: string;
    index: number;
    barcode: string;
    isError: boolean;
  }>({
    sku: "",
    index: -1,
    barcode: "",
    isError: false
  });
  const { data: website, isLoading } = useWebsites();

  const [selectedWebsites, setSelectedWebsites] = useState<{ websites: string[] }>({
    websites: []
  });

  const handleSave = async () => {
    try {
      if (!product.name) {
        if (
          validateProductName(product.name, setErrors)
          // || validateProductNumber(product.sku, setErrors) ||
          // validateProductBarcode(product.barcode, setErrors)
        ) {
          return;
        }
      }
      if (verifyAttributeUniqueValsList() || errors.isError) {
        return;
      }

      const filteredProduct = {
        ...product,
        attributes: attributes.map(attribute => ({
          [attribute.name]: attribute.values.join("|")
        })),
        variants: generateVariation ? attributeDetailsList.slice(0, variants.length) : [],
        type: product.type ?? "fixed",
        brand_id: brand?.id,
        generate_variation: !generateVariation,
        websites: selectedWebsites.websites
      };

      mutate(filteredProduct as CreateProductResponse);
    } catch (error) {
      console.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleInpChange = (vals: { label: string; value: string }) => {
    if (vals.label) {
      setProduct({ ...product, [vals.label]: vals.value });
    }
  };

  const handleAttributeChange = (
    index: number,
    key: string,
    value: string | string[]
  ) => {
    const updatedAttributes = attributes.map((attribute, i) =>
      i === index ? { ...attribute, [key]: value } : attribute
    );

    setAttributes([...updatedAttributes]);
  };

  const addNewAttribute = () => {
    setAttributes(prevState => [...prevState, { name: "", values: [] }]);
  };
  const generateVariants = () => {
    if (attributes.length === 0 || attributes.some(attr => attr.values.length === 0)) {
      return;
    }
    const variantsList: AttributeItem[] = [];
    const attributeCombinations = getCombinations(attributes.map(attr => attr.values));
    attributeCombinations.forEach(combination => {
      const variant: { attributes: { [key: string]: string } } = { attributes: {} };
      combination.forEach((value, index) => {
        variant.attributes[attributes[index].name] = value.toString();
      });
      variantsList.push(variant);
    });

    setVariants(variantsList);
  };

  const getCombinations = (arrays: Array<Array<string | number>>) => {
    const result: Array<Array<string | number>> = [[]];
    arrays.forEach((array: Array<string | number>) => {
      const temp: Array<Array<string | number>> = [];
      result.forEach((res: Array<string | number>) => {
        array.forEach(value => {
          temp.push([...res, value]);
        });
      });
      result.splice(0, result.length, ...temp);
    });
    return result;
  };

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

  const deleteVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const verifyAttributeUniqueValsList = () => {
    const slicedList = attributeDetailsList.slice(0, variants.length);
    setAttributeDetailsList(slicedList);
    // Sku
    const skuErrorIndex = slicedList.findIndex(
      item => !item.sku || item.sku.trim() === ""
    );
    if (skuErrorIndex !== -1) {
      toast.error("The SKU is required for product attributes.");
      return true;
    }
    return false;
  };

  const isBarcodeUnique = async (barcode: string) => {
    if (!barcode || barcode.trim() === "" || barcode === "None") {
      return;
    }
    const barcodeExists = attributeDetailsList.some(
      item => item.barcode === product.barcode
    );
    if (barcodeExists) {
      updateErrors("product_barcode", "Barcode already exists.", true);
      return;
    } else {
      updateErrors("product_barcode", "", false);
      try {
        if (getBrandId().brand_id) {
          const id = getBrandId()?.brand_id;
          const response = await verifyBarcode({ barcode: barcode, brand_id: id });
          if (response === null) {
            updateErrors("product_barcode", "", false);
          } else if (response.is_exists) {
            updateErrors("product_barcode", "Barcode already exists.", true);
          }
        }
      } catch (error) {
        console.log("Something went wrong in verifying sku: ", error);
      }
    }
  };

  const isProductNumberUnique = async (skuVal: string) => {
    const skuExists = attributeDetailsList.some(item => item.sku === product.sku);
    if (skuExists) {
      updateErrors("product_number", "Product Number already exists.", true);
      return;
    } else {
      updateErrors("product_number", "", false);
      try {
        if (getBrandId().brand_id) {
          const id = getBrandId()?.brand_id;
          const response = await verifySku({ sku: skuVal, brand_id: id });
          if (response === null) {
            updateErrors("product_number", "", false);
          } else if (response.is_exists) {
            updateErrors("product_number", "Product Number already exists.", true);
          }
        }
      } catch (error) {
        console.log("Something went wrong in verifying sku: ", error);
      }
    }
  };

  const updateErrors = (field: string, message: string | null, isError: boolean) => {
    setErrors(
      prevState =>
        ({
          ...prevState,
          [field]: message,
          isError
        }) as Errors
    );
  };

  const handleRowSelection = (rows: WebsiteType[]) => {
    setSelectedWebsites({ websites: rows?.map(itm => itm.id) });
  };

  return (
    <Card>
      <CardHeader
        avatar={<Box component={"img"} src="/assets/icons/edit-product-icon.svg" />}
        title={"Create Product"}
        titleTypographyProps={{
          fontSize: 20,
          fontWeight: "bold"
        }}
        action={
          <LoadingButton
            loading={creationLoading}
            disabled={creationLoading}
            variant="contained"
            onClick={handleSave}
          >
            Save
          </LoadingButton>
        }
      />

      <Divider />
      <CardContent>
        <Grid item container spacing={2}>
          <Grid item lg={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12}>
                <Input
                  value={product?.sku || ""}
                  name="sku"
                  type="text"
                  label="Product Number :"
                  onBlur={() => {
                    if (product.sku) {
                      isProductNumberUnique(product.sku);
                    }
                  }}
                  handleChange={(vals: { value: string | number; label: string }) =>
                    handleInpChange({ label: vals.label, value: vals.value.toString() })
                  }
                />
                {errors?.product_number && (
                  <Typography color="error" variant="body2">
                    {errors?.product_number}
                  </Typography>
                )}
              </Grid>
              <Grid item sm={6} xs={12}>
                <Input
                  value={product?.barcode || ""}
                  name="barcode"
                  type="text"
                  label="Barcode :"
                  onBlur={() => isBarcodeUnique(product?.barcode || "")}
                  handleChange={(vals: { value: string | number; label: string }) =>
                    handleInpChange({ label: vals.label, value: vals.value.toString() })
                  }
                />
                {errors?.product_barcode && (
                  <Typography color="error" variant="body2">
                    {errors?.product_barcode}
                  </Typography>
                )}
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Input
                  value={product?.name || ""}
                  name="name"
                  type="text"
                  label="Product Name :"
                  onBlur={e => validateProductName(e.target.value, setErrors)}
                  handleChange={(vals: { value: string | number; label: string }) =>
                    handleInpChange({ label: vals.label, value: vals.value.toString() })
                  }
                />
                {errors?.product_name && (
                  <Typography color="error" variant="body2">
                    {errors?.product_name}
                  </Typography>
                )}
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextArea
                  value={product?.description || ""}
                  name="description"
                  label="Description :"
                  handleChange={handleInpChange}
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Input
                  placeholder={`${currency}0.00`}
                  value={product?.retail_price || 0}
                  name="retail_price"
                  type="number"
                  label={`Retail Price ${currency}`}
                  handleChange={val =>
                    setProduct({ ...product, retail_price: Number(val.value) })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={product?.is_pom}
                      onChange={val =>
                        setProduct({ ...product, is_pom: val.target.checked })
                      }
                    />
                  }
                  label="POM"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">Select Website:</Typography>
                <Grid
                  item
                  xs={12}
                  height={200}
                  position={"relative"}
                  overflow={"auto"}
                  my={2}
                >
                  <DataTable
                    columns={PrivatePrescriptionColumns}
                    data={
                      website?.results?.length ? (website.results as WebsiteType[]) : []
                    }
                    loading={isLoading}
                    onRowSelection={handleRowSelection}
                    selectable={true}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Product Type</InputLabel>
                  <Select
                    value={product?.type || "fixed"}
                    onChange={e => {
                      setAttributes([
                        {
                          name: "",
                          values: []
                        }
                      ]);
                      setVariants([]);
                      setProduct({ ...product, type: e.target.value });
                    }}
                    label="Product Type"
                  >
                    <MenuItem value="fixed">Fixed</MenuItem>
                    <MenuItem value="variable">Variable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {product.type === "variable" && (
                <>
                  <Grid item xs={12}>
                    <Typography fontWeight={"bold"} variant="h6">
                      Attributes
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <ProductAttributes
                    attributes={attributes}
                    handleAttributeChange={handleAttributeChange}
                    addNewAttribute={addNewAttribute}
                    setAttributes={setAttributes}
                    setVariants={setVariants}
                  />

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={generateVariation}
                          onChange={() => setGenerateVariation(!generateVariation)}
                        />
                      }
                      label="Turn off Auto Generate Variations"
                    />
                  </Grid>

                  {generateVariation && variants.length > 0 && (
                    <ProductVariants
                      variants={variants}
                      formState={attributesForm}
                      setFormState={setAttributeForm}
                      handleVariantChange={handleVariantChange}
                      attributes={attributes}
                      deleteVariant={deleteVariant}
                      isEdit={true}
                      mode="Create"
                      attributeDetailsList={attributeDetailsList}
                      setAttributeDetailsList={setAttributeDetailsList}
                      errors={errors}
                      product={product}
                      setIsSkuValid={setIsSkuValid}
                      isSkuValid={isSkuValid}
                      editIndex={editIndex}
                      setEditIndex={setEditIndex}
                    />
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CreateProduct;
