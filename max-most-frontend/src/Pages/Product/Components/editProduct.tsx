import {
  // ContentPasteSearchSharp,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Language
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ReactSelect, { MultiValue } from "react-select";
import { toast } from "react-toastify";
import Input from "../../../Components/Input";
import LoadingButton from "../../../Components/LoadingButton";
import SeeDocumentation from "../../../Components/SeeDocumentation";
import SelectField from "../../../Components/SelectField";
import Switch from "../../../Components/Switch";
import TextArea from "../../../Components/Textarea";
import { getBrandDetails } from "../../../Hooks/api";
import { useGetMetaFields } from "../../../Hooks/useMetaFields";
import {
  useProductCustomFields,
  useProductWebsites,
  useSingleProduct,
  useTrashProductVariant,
  useUpdateProduct
} from "../../../Hooks/useProducts";
import useScrollPosition from "../../../Hooks/useScrollPosition";
import { useWarnings } from "../../../Hooks/useWarning";
import {
  AttributeItem,
  Errors,
  ProductData,
  ProductDataMadeIn,
  updateProductFixed,
  updateProductVariable,
  VariantT
} from "../../../Interfaces/Products";
import { InputValueAndLabel } from "../../../Interfaces/global";
import {
  MetaFieldDetail,
  MetaOption,
  ProductMetaFieldErrors,
  ProductMetaFieldInputState,
  ProductMetaFieldState
} from "../../../Interfaces/metaFieldTypes";
import ProductAttributes from "./productAttributes";
import AddProductVariantManual from "./productVariantManual";
import ProductVariants from "./productVariants";
interface OptionType {
  value: string;
  label: string;
}
const EditProduct = () => {
  const { sku } = useParams();
  const { data: productData, isLoading: productLoading } = useSingleProduct(sku || "");
  // const [productData, setProductData] = useState<ProductData | null>();

  // const singleProductRef = useRef(singleProduct);
  // useEffect(() => {
  //   if (singleProductRef.current) {
  //     setProductData(singleProductRef.current);
  //   }
  // }, [singleProductRef.current]);

  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);

  const { mutateAsync: updateProduct } = useUpdateProduct();
  const brand = getBrandDetails();
  const currency = brand?.currency_symbol;
  const [product, setProduct] = useState<Partial<ProductData>>({
    name: productData?.name,
    retail_price: productData?.retail_price,
    sku: productData?.sku,
    barcode: productData?.barcode,
    cost_price: productData?.cost_price,
    warning_message: productData?.warning_message
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [, setProduct_id] = useState<string>("");
  const { data: productMetaFields } = useGetMetaFields(sku || "");
  const [productMetaFieldState, setProductMetaFieldState] =
    useState<ProductMetaFieldState>({});
  const [metaFieldErrors, setMetaFieldErrors] = useState<ProductMetaFieldErrors>({});

  const [productMetaFieldsPayload, setProductMetaFieldsPayload] = useState<
    MetaFieldDetail[]
  >([]);
  const [metaInputValue, setmetaInputValue] = useState<ProductMetaFieldInputState>({});

  useEffect(() => {
    if (productData?.id_hashed) {
      setProduct_id(productData.id_hashed);
    }
  }, [productData]);

  useEffect(() => {
    setProductMetaFieldsPayload(productMetaFields?.results as MetaFieldDetail[]);
  }, [productMetaFields]);
  const { mutateAsync, isLoading: saveLoading } = useProductCustomFields();
  const [openWebsites, setOpenWebsites] = useState(true);
  const { data: websitesData, isLoading: websitesLoading } = useProductWebsites(
    product.sku || ""
  );
  const { data: warningsData, isLoading } = useWarnings();
  const warnings: OptionType[] = useMemo(
    () =>
      warningsData?.length
        ? warningsData.map(r => ({
            label: `${r?.warningNumber !== "None" ? r?.warningNumber : ""} - ${
              r?.message?.length > 100 ? r?.message?.slice(0, 100) + "..." : r?.message
            }`,
            value: r?.id
          }))
        : [],
    [warningsData]
  );
  const { y } = useScrollPosition();

  // const handleKeyDown = (
  //   e: React.KeyboardEvent<HTMLDivElement>,
  //   item: MetaFieldItmes
  // ) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     const inputElement = e.target as HTMLInputElement;
  //     const newTag = inputElement.value.trim();

  //     if (newTag) {
  //       if (item.types === "text_field" && item.is_multi === "True") {
  //         setProductMetaFieldsPayload(prevMetafields =>
  //           prevMetafields?.map(field =>
  //             field.id === item.id
  //               ? {
  //                   ...field,
  //                   value: [...(Array.isArray(field.value) ? field.value : []), newTag]
  //                 }
  //               : field
  //           )
  //         );
  //         inputElement.value = "";
  //       }
  //     }
  //   }
  // };

  // const handleDelete = (valueToDelete: string | number, field: MetaFieldItmes) => () => {
  //   const updatedValues = Array.isArray(field.value)
  //     ? field.value.filter(
  //         (val: string | number) => typeof val === "string" && val !== valueToDelete
  //       )
  //     : [];
  //   setProductMetaFieldsPayload(prevMetafields =>
  //     prevMetafields?.map(metaField =>
  //       metaField.id === field.id ? { ...metaField, value: updatedValues } : metaField
  //     )
  //   );
  // };

  // const handleChangeInput = (
  //   event:
  //     | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  //     | SelectChangeEvent<string | number | string[]>
  //     | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  //   item: MetaFieldDetail
  // ) => {
  //   const { types, id } = item;
  //   const newValue = event.target.value;

  //   if (
  //     ["text_field", "multi_line", "numeric"].includes(types) &&
  //     (types !== "text_field" || item?.is_multi === "False")
  //   ) {
  //     setProductMetaFieldsPayload(prevMetafields =>
  //       prevMetafields?.map(field =>
  //         field.id === id ? { ...field, value: newValue } : field
  //       )
  //     );
  //   } else if (item.types === "drop_down" && item?.is_multi === "True") {
  //     const value = event.target.value;
  //     setDropdowns(prev => ({ ...prev, [item.id]: value }));
  //   } else if (item.types === "drop_down" && item?.is_multi === "False") {
  //     const value = event.target.value;
  //     setProductMetaFieldsPayload((prevMetafields: MetaFieldDetail[]) =>
  //       prevMetafields?.map(field =>
  //         field.id === item?.id
  //           ? {
  //               ...field,
  //               options_id:
  //                 typeof value === "string" || typeof value === "number"
  //                   ? [value]
  //                   : (value as (string | number)[])
  //             }
  //           : field
  //       )
  //     );
  //   } else if (["date_and_time", "date"].includes(types) && newValue) {
  //     setProductMetaFieldsPayload((prevMetafields: MetaFieldDetail[]) =>
  //       prevMetafields.map(metafield =>
  //         metafield.field_name === item.field_name
  //           ? {
  //               ...metafield,
  //               value: Array.isArray(newValue) ? newValue : [newValue]
  //             }
  //           : metafield
  //       )
  //     );
  //   }
  // };

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

  // const saveMetaFieldHandler = async (field: MetaFieldDetail) => {
  //   setLoadingStates(prevState => ({ ...prevState, [field?.id]: true }));
  //   try {
  //     const matchField = productMetaFieldsPayload?.find(({ id }) => field?.id === id);
  //     if (!matchField) {
  //       toast.error("Field not found");
  //       return;
  //     }
  //     const filteredProduct = Object.fromEntries(
  //       Object.entries(product).filter(([, value]) => value !== null)
  //     );
  //     if (
  //       (typeof field?.value === "string" && field?.value.length > 0) ||
  //       (Array.isArray(field?.value) && field?.value?.length > 0) ||
  //       (Array.isArray(field?.options_id) && field?.options_id?.length > 0)
  //     ) {
  //       const data: Partial<ProductDataMadeIn> = {
  //         product_id: product_id as string,
  //         product_field_definition_id: matchField?.id as string,
  //         ...(field?.types === "drop_down"
  //           ? {
  //               option_id:
  //                 field?.is_multi === "False"
  //                   ? Array.isArray(matchField?.options_id)
  //                     ? (matchField?.options_id as unknown as string | number)
  //                     : [matchField?.options_id as string | number]
  //                   : field?.is_multi === "True"
  //                     ? ((dropdowns[field?.id] || []) as (string | number)[])
  //                     : undefined
  //             }
  //           : {
  //               value:
  //                 matchField?.value !== undefined
  //                   ? Array.isArray(matchField?.value)
  //                     ? (matchField?.value as unknown as string | number)
  //                     : [matchField?.value as string | number]
  //                   : undefined
  //             })
  //       };
  //       //eslint-disable-next-line
  //       //@ts-ignore
  //       await mutateAsync(data);
  //     } else if (matchField?.id && matchField?.id in dropdowns) {
  //       const arrayForId = dropdowns[matchField?.id];
  //       if (Array.isArray(arrayForId) && arrayForId?.length > 0) {
  //         const data: Partial<ProductDataMadeIn> = {
  //           product_id: filteredProduct?.id as string,
  //           product_field_definition_id: matchField?.id as string,
  //           ...(field?.types === "drop_down"
  //             ? {
  //                 option_id:
  //                   field?.is_multi === "False"
  //                     ? [matchField?.options_id as unknown as string]
  //                     : field?.is_multi === "True"
  //                       ? ((dropdowns[field?.id] || []) as (string | number)[])
  //                       : undefined
  //               }
  //             : {
  //                 value:
  //                   matchField?.value !== undefined
  //                     ? Array.isArray(matchField?.value)
  //                       ? (matchField?.value as unknown as string | number)
  //                       : [matchField?.value as string | number]
  //                     : undefined
  //               })
  //         };
  //         //eslint-disable-next-line
  //         //@ts-ignore
  //         await mutateAsync(data);
  //       } else {
  //         alert("Array is empty or not present.");
  //       }
  //     } else {
  //       toast.error("The field value cannot be empty.");
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   } finally {
  //     setLoadingStates(prevState => ({ ...prevState, [field?.id]: false }));
  //   }
  // };

  const [attributes, setAttributes] = useState<{ name: string; values: string[] }[]>([]);
  const [variants, setVariants] = useState<AttributeItem[]>([]);
  const [attributesForm, setAttributeForm] = useState<AttributeItem | null>(null);

  // useEffect(() => {
  //   if (attributesForm && productData) {

  //     const updatedVariations = productData.variations.map(variation =>
  //       variation.id === attributesForm.id
  //         ? { ...variation, ...attributesForm }
  //         : variation
  //     );

  //     const updatedProductData = {
  //       ...productData,
  //       variations: updatedVariations
  //     };

  //     setProductData(updatedProductData);
  //   }
  // }, [attributesForm]);

  useEffect(() => {
    if (productData?.variations) setVariants(productData?.variations);
  }, [productData?.variations]);

  function transformAttributes(newAttributes: string) {
    // Parse the string to get the array of objects
    const parsedAttributes = JSON.parse(newAttributes);

    // Use a map to group values by their keys
    const attributesMap: Record<string, string[]> = {};

    parsedAttributes.forEach((attr: Record<string, string>) => {
      for (const [key, value] of Object.entries(attr)) {
        // If the key already exists, append the value, otherwise create a new array
        if (attributesMap[key]) {
          attributesMap[key].push(value);
        } else {
          attributesMap[key] = [value];
        }
      }
    });

    // Convert the map back into the desired array format
    const attributes = Object.entries(attributesMap).map(([key, values]) => {
      return {
        [key]: values.join("|") // Join the values with '|'
      };
    });

    return attributes;
  }

  const handleSave = async () => {
    try {
      validateName();

      const filteredProduct = Object.fromEntries(
        Object.entries(product).filter(([, value]) => value !== null)
      );
      delete filteredProduct.warning_number;
      delete filteredProduct.images;

      if (productData && productData.type === "f") {
        const { id_hashed, barcode } = productData;
        const { name, cost_price, warning_message } = product;

        const payload: updateProductFixed = {
          name: name || "",
          retail_price: 0,
          id_hashed,
          barcode: barcode || "",
          cost_price: cost_price || 0,
          warning_message: warning_message || ""
        };
        await updateProduct(payload);
      } else {
        if (productData) {
          const payload: updateProductVariable = {
            id_hashed: productData.id_hashed,
            sku: sku || "",
            barcode: productData.barcode || "",
            name: product.name || "",
            description: productData.description || "",
            retail_price: parseInt(attributesForm?.dimension_width?.toString() || "0", 0),
            type: productData.type || "",
            attributes: isAttributeUpdated
              ? attributes.map(attribute => ({
                  [attribute.name]: attribute.values.join("|")
                }))
              : transformAttributes(productData.new_attributes as string),
            is_new_variant_pairs: isAttributeUpdated,

            variants: isAttributeUpdated
              ? (variants as unknown as VariantT[]) || []
              : (productData.variations as unknown as VariantT[]) || [],
            brand_id: product.brand_id,
            generate_variation: !generateVariation
          };
          await updateProduct(payload);
        }
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : "An error occurred");
    }
  };
  const validateName = () => {
    if (!product.name) {
      setErrors(prevErrors => ({
        ...prevErrors,
        product_name: "Product name is required.",
        isError: true
      }));
      throw new Error("Product name is required");
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        product_name: "",
        isError: true
      }));
    }
  };
  const handleInpChange = (vals: InputValueAndLabel) => {
    if (vals.label) {
      setProduct({ ...product, [vals.label]: vals.value });
    }
  };
  const mergeAttributes = (attributes: { name: string; values: string[] }[]) => {
    const merged = attributes.reduce(
      (acc, attribute) => {
        // Check if the name already exists in the accumulator
        const existing = acc.find(item => item.name === attribute.name);

        if (existing) {
          // If it exists, merge the values without duplicates
          existing.values = [...new Set([...existing.values, ...attribute.values])];
        } else {
          // If it doesn't exist, add it to the accumulator
          acc.push({ ...attribute });
        }

        return acc;
      },
      [] as { name: string; values: string[] }[]
    );

    return merged;
  };

  useMemo(async () => {
    if (productData) {
      const parsedData = await JSON.parse(String(productData?.new_attributes));

      const formattedAttributes = Array.isArray(parsedData)
        ? parsedData.map(attribute => {
            const name = Object.keys(attribute)[0];
            const values = attribute[name].split("|");
            return { ...attribute, name, values };
          })
        : [];

      const mergedAttributes = mergeAttributes(formattedAttributes);

      setAttributes(mergedAttributes);
      setVariants(productData?.variations);
      setProduct(productData);
    }
  }, [productData, setProduct]);

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

  const [isAttributeUpdated, setIsAttributeUpdated] = useState<boolean>(false);

  const handleAttributeChange = (
    index: number,
    key: string,
    value: string | number | string[]
  ) => {
    const updatedAttributes = attributes.map((attribute, i) =>
      i === index ? { ...attribute, [key]: value } : attribute
    );

    setAttributes([...updatedAttributes]);

    const variantsList: AttributeItem[] = [];
    const attributeCombinations = getCombinations(
      updatedAttributes.map(attr => attr.values)
    );
    attributeCombinations.forEach(combination => {
      const variant: { attributes: { [key: string]: string } } = { attributes: {} };
      combination.forEach((value, index) => {
        variant.attributes[attributes[index].name] = value.toString();
      });
      variantsList.push(variant);
    });
    setIsAttributeUpdated(true);
    setVariants(variantsList);
  };
  const addNewAttribute = () => {
    setAttributes(prevState => [...prevState, { name: "", values: [] }]);
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
  const { mutate: deleteProductVariant } = useTrashProductVariant();
  // const deleteVariant = (index: number) => {
  //   const productFound = variants[index];
  //   deleteProductVariant({
  //     id: productFound.id as string
  //   });
  // };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);
  const deleteVariant = (index: number) => {
    setPendingDeleteIndex(index);
    setSnackbarOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteIndex !== null) {
      const productFound = variants[pendingDeleteIndex];
      deleteProductVariant({
        id: productFound.id as string
      });
    }
    setSnackbarOpen(false);
    setPendingDeleteIndex(null);
  };

  const handleCancelDelete = () => {
    setSnackbarOpen(false);
    setPendingDeleteIndex(null);
  };

  const [generateVariation, setGenerateVariation] = useState(true);

  const [openVariatnAddModal, setOpenVariatnAddModal] = useState(false);

  const handleOpen = () => setOpenVariatnAddModal(true);
  const handleClose = () => setOpenVariatnAddModal(false);

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

  useEffect(() => {
    if (generateVariation) {
      generateVariants();
    }
    //eslint-disable-next-line
  }, [attributes, generateVariation]);
  const handleWarningChange = (newValue: MultiValue<OptionType>) => {
    const selectedLabels = newValue.map(option => option.label).join(" | ");
    setProduct(prevProduct => ({
      ...prevProduct,
      warning_message: selectedLabels
    }));
    setSelectedOptions(newValue as OptionType[]);
  };
  useEffect(() => {
    if (product.warning_message) {
      const selectedLabels = product.warning_message
        .split(" | ")
        .map(label => label.trim());
      const initialOptions = warnings.filter(option =>
        selectedLabels.includes(option.label)
      );
      setSelectedOptions(initialOptions);
    }
  }, [product.warning_message, warnings]);

  // !!! META FIELD HANDLERS
  const metaFieldChange = (
    id: string,
    value: string | number,
    is_multi: "False" | "True",
    type: string
  ) => {
    setProductMetaFieldState(prevState => {
      const existingField = prevState[id];
      let newValue: (string | number)[] =
        is_multi === "True"
          ? Array.isArray(existingField?.value)
            ? existingField.value.flat()
            : []
          : [];
      if (is_multi === "True") {
        if (!newValue.includes(value)) {
          newValue = [
            ...new Set([...newValue, ...(Array.isArray(value) ? value : [value])])
          ];
        }
      } else {
        newValue = [value];
      }
      const finalValue = type === "dropdown" ? value : newValue;
      return {
        ...prevState,
        [id]: { value: finalValue }
      };
    });
  };

  const handleMetaInputChange = (
    id: string,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    setmetaInputValue(prevState => ({
      ...prevState,
      [id]: { value: target.value }
    }));
  };

  // On enter press - chips
  const multiMetaFieldKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    id: string,
    is_multi: "False" | "True",
    type: string,
    field: MetaFieldDetail
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = metaInputValue[id]?.value.trim();
      const isValid = validateValue(id, value, field);
      if (isValid) {
        metaFieldChange(id, value, is_multi, type);
        setmetaInputValue(prevState => ({
          ...prevState,
          [id]: { value: "" }
        }));
      }
    }
  };

  // Multi Fields Chip Delete
  const handleMultiChipDelete = (id: string | number, field: number | string) => () => {
    setProductMetaFieldState(prevState => {
      const existingField = prevState[id];
      if (!existingField) return prevState;

      const newValue = Array.isArray(existingField.value)
        ? existingField.value.filter(v => v !== field)
        : [];

      return {
        ...prevState,
        [id]: { value: newValue }
      };
    });
  };

  // Craete/Edit
  const saveMetaField = async (field: MetaFieldDetail) => {
    setLoadingStates(prevState => ({ ...prevState, [field?.id]: true }));
    let isEdit: boolean = false;
    try {
      const matchField = productMetaFieldsPayload?.find(({ id }) => field?.id === id);
      if (!matchField) {
        toast.error("Field not found");
        return;
      }
      const obj = productMetaFieldState[field.id];

      if (!obj?.value || !Array.isArray(obj.value) || obj.value.length === 0) {
        toast.error("Field value cannot be empty.");
        return;
      }
      const data: Partial<ProductDataMadeIn> = {
        product_id: `${productData?.id_hashed}`,
        product_field_definition_id: matchField?.id as string,
        custom_fields: []
      };

      if (field.custom_fields) {
        if (field.custom_fields?.length === 0) {
          if (field.types === "drop_down" && field.is_multi === "True") {
            data.custom_fields = obj.value.map(element => ({
              option_id: [element]
            }));
          } else if (field.types === "drop_down" && field.is_multi === "False") {
            data.custom_fields = obj.value.map(element => ({
              option_id: [element]
            }));
          } else {
            data.custom_fields = obj.value.map(element => ({
              value: [element]
            }));
          }
          isEdit = false;
        } else {
          isEdit = true;
          if (field.types === "drop_down" && field.is_multi === "True") {
            data.custom_fields = obj.value.map(element => {
              const matchedField = field?.custom_fields?.find(customField =>
                customField.option_id?.includes(element)
              );
              if (matchedField) {
                return {
                  id: matchedField?.id,
                  option_id: [element]
                };
              } else {
                return {
                  option_id: [element]
                };
              }
            });
          } else if (field.types === "drop_down" && field.is_multi === "False") {
            data.custom_fields = [
              {
                id: field?.custom_fields?.[0].id,
                option_id: [obj.value[0]]
              }
            ];
          } else if (
            (field.types === "text_field" ||
              field.types === "date" ||
              field.types === "multi-line" ||
              field.types === "date_and_time") &&
            field.is_multi === "False"
          ) {
            data.custom_fields = [
              {
                id: field?.custom_fields?.[0].id,
                value: [obj.value[0]]
              }
            ];
          }

          if (
            (field.types === "text_field" || field.types === "numeric") &&
            field.is_multi === "True"
          ) {
            data.custom_fields = obj.value.map(element => {
              const matchedField = field?.custom_fields?.find(customField =>
                customField.value?.includes(element)
              );
              if (matchedField) {
                return {
                  id: matchedField?.id,
                  value: [element]
                };
              } else {
                return {
                  value: [element]
                };
              }
            });
          }
        }
      }
      if (metaFieldErrors[field.id]?.error) {
        return;
      } else {
        await mutateAsync({ data: data, isEdit: isEdit });
      }
    } catch (error) {
      console.log("Error occurred during save: ", error);
    } finally {
      setLoadingStates(prevState => ({ ...prevState, [field?.id]: false }));
    }
  };

  // Multi - chips display
  const renderMetaChips = (id: string) => {
    const field = productMetaFieldState[id]?.value;
    if (Array.isArray(field)) {
      return (
        <Box
          sx={{
            paddingTop: "10px",
            paddingRight: "20px",
            marginBottom: "10px"
          }}
        >
          {field.map((item, index) => (
            <Chip
              key={index}
              label={String(item)}
              onDelete={handleMultiChipDelete(id, item)}
              sx={{ marginRight: "4px", marginBottom: "4px" }}
            />
          ))}
        </Box>
      );
    }
    return null;
  };

  // Validate min/max
  const validateValue = (id: string, value: string, field: MetaFieldDetail) => {
    const min = parseInt(field.min_characters);
    const max =
      field.max_characters.toLowerCase() === "none"
        ? Infinity
        : parseInt(field.max_characters, 10);

    const errorMessage =
      value.length < min
        ? `Value must be at least ${min} characters long.`
        : value.length > max
          ? `Value must be no more than ${max} characters long.`
          : "";

    setMetaFieldErrors(prev => ({
      ...prev,
      [id]: { error: errorMessage }
    }));

    return !errorMessage;
  };

  // Update the state whenever productmetaField changes
  useEffect(() => {
    if (productMetaFields?.results) {
      const newState = productMetaFields.results.reduce((state, field) => {
        const fieldValues =
          field.custom_fields?.flatMap(cf => {
            if (cf.value) {
              return cf.value;
            } else if (cf.option_id && cf.option_value) {
              return cf.option_id;
            }
            return [];
          }) ?? [];

        state[field.id] = { value: fieldValues.length ? fieldValues : "" };
        return state;
      }, {} as ProductMetaFieldState);

      setProductMetaFieldState(newState);
    }
  }, [productMetaFields]);

  return (
    <Card>
      <Snackbar
        open={snackbarOpen}
        message="Are you sure you want to delete this variant?"
        action={
          <>
            <Button color="primary" size="small" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button color="primary" size="small" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </>
        }
      />
      <AddProductVariantManual
        variants={variants}
        handleVariantChange={handleVariantChange}
        attributes={attributes}
        deleteVariant={deleteVariant}
        onClose={handleClose}
        open={openVariatnAddModal}
        cost_price={
          productData?.cost_price?.toString() || product?.cost_price?.toString() || ""
        }
      />

      <CardHeader
        avatar={<Box component={"img"} src="/assets/icons/edit-product-icon.svg" />}
        title={"Edit Product"}
        titleTypographyProps={{
          fontSize: 20,
          fontWeight: "bold"
        }}
        action={
          <LoadingButton variant="contained" onClick={handleSave} loading={saveLoading}>
            Save
          </LoadingButton>
        }
      />

      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item lg={8} xs={12}>
            <SeeDocumentation
              title="Edit Product API Documentation"
              fileName={"useEditProduct"}
            />
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12}>
                <Input
                  disabled
                  value={productData?.sku}
                  name="sku"
                  type="text"
                  label="Product Number :"
                  loading={productLoading}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Input
                  disabled
                  value={productData?.barcode}
                  name="barcode"
                  type="text"
                  label="Barcode :"
                  loading={productLoading}
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Input
                  value={product?.name}
                  name="name"
                  type="text"
                  label="Product Name :"
                  loading={productLoading}
                  handleChange={handleInpChange}
                  onBlur={validateName}
                />
                {errors?.product_name && (
                  <Typography color="error" variant="body2">
                    {errors?.product_name}
                  </Typography>
                )}
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextArea
                  disable
                  value={productData?.description || ""}
                  name="description"
                  label="Description :"
                  loading={productLoading}
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <ReactSelect
                  options={warnings}
                  isMulti
                  value={selectedOptions}
                  isLoading={productLoading || isLoading}
                  onChange={handleWarningChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={"bold"} variant="h6">
                  Pricing
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Input
                  disabled
                  placeholder={`${currency}0.00`}
                  value={product?.retail_price || 0}
                  name="retail_price"
                  type="number"
                  label={`Retail Price ${currency}`}
                  loading={productLoading}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Input
                  placeholder={`${currency}0.00`}
                  value={product?.cost_price || "0"}
                  name="cost_price"
                  label={`Cost Price ${currency}`}
                  loading={productLoading}
                  type="number"
                  min={0}
                  handleChange={handleInpChange}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Input
                  disabled
                  value={productData?.shipping_rate || 0}
                  name="shipping_rate"
                  type="number"
                  placeholder="shipping Price"
                  label={`Shipping Price ${currency}`}
                  loading={productLoading}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Input
                  disable
                  placeholder={`${currency}0.00`}
                  label="Quantity Per Pack"
                  value={productData?.quantity_per_pack || 0}
                  name="quantity_per_pack"
                  type="number"
                  loading={productLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction={"row"}
                  gap={2}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  flexWrap={"wrap"}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={"bold"}>
                      Backorder
                    </Typography>
                    <Typography variant="body2">
                      Short description explaining Back Order
                    </Typography>
                  </Box>
                  <Switch
                    onChange={() =>
                      handleInpChange({
                        label: "is_back_order",
                        value: !product.is_back_order,
                        target: undefined
                      })
                    }
                    disabled={productLoading}
                    checked={product.is_back_order || false}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <SelectField
                  name="taxClass"
                  options={[]}
                  placeholder="Select Tax Class"
                  label="Tax Class :"
                  disable={true}
                  loading={productLoading}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <SelectField
                  name="taxStatuses"
                  options={[]}
                  placeholder="Select Tax Satus"
                  disable={true}
                  label="Tax Status :"
                  loading={productLoading}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography fontWeight={"bold"} variant="h6">
                Meta Fields
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {productMetaFieldsPayload?.map(field => {
              if (field.types === "text_field" && field?.is_multi === "False") {
                return (
                  <>
                    <Grid
                      key={field.id}
                      item
                      container
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      gap={1}
                      position={"relative"}
                    >
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box>
                          <InputLabel sx={{ color: "#262627", mt: 0.5 }}>
                            {field.field_name.replace(/_/g, " ")}
                          </InputLabel>
                          <TextField
                            sx={{
                              "& .MuiOutlinedInput-input": {
                                padding: "8.1px 8px"
                              }
                            }}
                            fullWidth
                            variant="outlined"
                            value={productMetaFieldState[field.id].value}
                            name={field.field_name}
                            onBlur={event =>
                              validateValue(field.id, event.target.value, field)
                            }
                            onChange={event =>
                              metaFieldChange(
                                field.id,
                                event.target.value,
                                field.is_multi,
                                field.types
                              )
                            }
                            disabled={productLoading}
                            required
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        lg={3}
                        md={3}
                        sm={12}
                        xs={12}
                        right={0}
                        bottom={2}
                        position={"absolute"}
                      >
                        <LoadingButton
                          variant="contained"
                          onClick={() => saveMetaField(field)}
                          loading={loadingStates[field?.id as string] && saveLoading}
                        >
                          Save
                        </LoadingButton>
                      </Grid>
                    </Grid>
                    {metaFieldErrors[field.id]?.error && (
                      <Typography color="error" variant="body2">
                        {metaFieldErrors[field.id].error}
                      </Typography>
                    )}
                  </>
                );
              } else if (field.types === "text_field" && field?.is_multi === "True") {
                return (
                  <>
                    <Grid
                      key={field.id}
                      item
                      container
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      gap={1}
                      position={"relative"}
                      sx={{ overflow: "hidden", width: "100%" }}
                    >
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <InputLabel sx={{ color: "#262627", mt: 0.5 }}>
                          {field.field_name.replace(/_/g, " ")}
                        </InputLabel>
                        <TextField
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap"
                            },
                            "& .MuiInputAdornment-root": {
                              flexWrap: "wrap"
                            }
                          }}
                          fullWidth
                          variant="outlined"
                          value={metaInputValue[field.id]?.value || ""}
                          name={field.field_name}
                          placeholder="Type here..."
                          onChange={event => handleMetaInputChange(field.id, event)}
                          onKeyDown={event =>
                            multiMetaFieldKeyDown(
                              event,
                              field.id,
                              field.is_multi,
                              field.types,
                              field
                            )
                          }
                          disabled={productLoading}
                          InputProps={{
                            startAdornment: renderMetaChips(field.id)
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        lg={3}
                        md={3}
                        sm={12}
                        xs={12}
                        right={-9}
                        bottom={2}
                        position={"absolute"}
                        sx={{ paddingRight: "10px" }}
                      >
                        <LoadingButton
                          variant="contained"
                          onClick={() => saveMetaField(field)}
                          loading={loadingStates[field?.id as string] && saveLoading}
                        >
                          Save
                        </LoadingButton>
                      </Grid>
                    </Grid>
                    {metaFieldErrors[field.id]?.error && (
                      <Typography color="error" variant="body2">
                        {metaFieldErrors[field.id].error}
                      </Typography>
                    )}
                  </>
                );
              } else if (field.types === "multi-line") {
                return (
                  <>
                    <Grid
                      key={field.id}
                      item
                      container
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      gap={1}
                      position={"relative"}
                    >
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box>
                          <InputLabel sx={{ color: "#262627", mt: 0.5 }}>
                            {field.field_name.replace(/_/g, " ")}
                          </InputLabel>
                          <TextField
                            sx={{
                              "& .MuiOutlinedInput-input": {
                                padding: "2px 2px"
                              }
                            }}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={2}
                            name={field.field_name}
                            placeholder="Type here..."
                            value={productMetaFieldState[field.id]?.value || ""}
                            onBlur={event =>
                              validateValue(field.id, event.target.value, field)
                            }
                            onChange={event =>
                              metaFieldChange(
                                field.id,
                                event.target.value,
                                field.is_multi,
                                field.types
                              )
                            }
                            disabled={productLoading}
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        lg={3}
                        md={3}
                        sm={12}
                        xs={12}
                        right={0}
                        bottom={2}
                        position={"absolute"}
                      >
                        <LoadingButton
                          variant="contained"
                          onClick={() => saveMetaField(field)}
                          loading={loadingStates[field?.id as string] && saveLoading}
                        >
                          Save
                        </LoadingButton>
                      </Grid>
                    </Grid>
                    {metaFieldErrors[field.id]?.error && (
                      <Typography color="error" variant="body2">
                        {metaFieldErrors[field.id].error}
                      </Typography>
                    )}
                  </>
                );
              } else if (field.types === "numeric" && field.is_multi === "False") {
                return (
                  <>
                    <Grid
                      key={field.id}
                      item
                      container
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      gap={1}
                      position={"relative"}
                    >
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box>
                          <InputLabel sx={{ color: "#262627", mt: 0.5 }}>
                            {field.field_name.replace(/_/g, " ")}
                          </InputLabel>
                          <TextField
                            sx={{
                              "& .MuiOutlinedInput-input": {
                                padding: "8.1px 8px"
                              }
                            }}
                            fullWidth
                            variant="outlined"
                            type="number"
                            name={field.field_name}
                            value={productMetaFieldState[field.id]?.value || ""}
                            onBlur={event =>
                              validateValue(field.id, event.target.value, field)
                            }
                            onChange={event =>
                              metaFieldChange(
                                field.id,
                                event.target.value,
                                field.is_multi,
                                field.types
                              )
                            }
                            disabled={productLoading}
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        lg={3}
                        md={3}
                        sm={12}
                        xs={12}
                        right={0}
                        bottom={2}
                        position={"absolute"}
                      >
                        <LoadingButton
                          variant="contained"
                          onClick={() => saveMetaField(field)}
                          loading={loadingStates[field?.id as string] && saveLoading}
                        >
                          Save
                        </LoadingButton>
                      </Grid>
                    </Grid>
                    {metaFieldErrors[field.id]?.error && (
                      <Typography color="error" variant="body2">
                        {metaFieldErrors[field.id].error}
                      </Typography>
                    )}
                  </>
                );
              } else if (field.types === "numeric" && field.is_multi === "True") {
                return (
                  <>
                    <Grid
                      key={field.id}
                      item
                      container
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      gap={1}
                      position={"relative"}
                      sx={{ overflow: "hidden", width: "100%" }}
                    >
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box>
                          <InputLabel sx={{ color: "#262627", mt: 0.5 }}>
                            {field.field_name.replace(/_/g, " ")}
                          </InputLabel>
                          <TextField
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap"
                              },
                              "& .MuiInputAdornment-root": {
                                flexWrap: "wrap"
                              }
                            }}
                            fullWidth
                            variant="outlined"
                            type="number"
                            value={metaInputValue[field.id]?.value || ""}
                            name={field.field_name}
                            placeholder="Type here..."
                            onChange={event => handleMetaInputChange(field.id, event)}
                            onKeyDown={event =>
                              multiMetaFieldKeyDown(
                                event,
                                field.id,
                                field.is_multi,
                                field.types,
                                field
                              )
                            }
                            disabled={productLoading}
                            InputProps={{
                              startAdornment: renderMetaChips(field.id)
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        lg={3}
                        md={3}
                        sm={12}
                        xs={12}
                        right={-9}
                        bottom={2}
                        position={"absolute"}
                        sx={{ paddingRight: "10px" }}
                      >
                        <LoadingButton
                          variant="contained"
                          onClick={() => saveMetaField(field)}
                          loading={loadingStates[field?.id as string] && saveLoading}
                        >
                          Save
                        </LoadingButton>
                      </Grid>
                    </Grid>
                    {metaFieldErrors[field.id]?.error && (
                      <Typography color="error" variant="body2">
                        {metaFieldErrors[field.id].error}
                      </Typography>
                    )}
                  </>
                );
              } else if (field.types === "drop_down" && field?.is_multi === "False") {
                return (
                  <Grid
                    key={field.id}
                    item
                    container
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    gap={1}
                    position={"relative"}
                  >
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <>
                        <Box>
                          <InputLabel sx={{ color: "#262627", mt: 0.5 }}>
                            {field.field_name.replace(/_/g, " ")}
                          </InputLabel>
                          <FormControl
                            sx={{
                              "& .MuiSelect-select.MuiSelect-select.MuiSelect-select": {
                                padding: "7.1px 0px",
                                display: "flex",
                                flexWrap: "wrap",
                                mt: 0.5,
                                px: 2
                              }
                            }}
                            fullWidth
                          >
                            <Select
                              value={
                                Array.isArray(productMetaFieldState[field.id]?.value)
                                  ? productMetaFieldState[field.id].value
                                  : []
                              }
                              onChange={event => {
                                const newValue = event.target.value as string;
                                metaFieldChange(
                                  field.id,
                                  newValue,
                                  field.is_multi,
                                  field.types
                                );
                              }}
                              disabled={productLoading}
                              renderValue={selected => {
                                const selectedArray = Array.isArray(selected)
                                  ? selected
                                  : [selected];
                                const selectedOption = field.options?.find(option => {
                                  if (option.option_id === selectedArray[0]) {
                                    return option;
                                  }
                                });
                                return (
                                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                                    {selectedOption ? selectedOption.value : ""}
                                  </Box>
                                );
                              }}
                            >
                              {field?.options?.map((item, index) => {
                                return (
                                  <MenuItem key={index} value={item?.option_id}>
                                    {item?.value}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Box>
                      </>
                    </Grid>

                    <Grid
                      item
                      lg={3}
                      md={3}
                      sm={12}
                      xs={12}
                      right={0}
                      bottom={2}
                      position={"absolute"}
                    >
                      <LoadingButton
                        variant="contained"
                        onClick={() => saveMetaField(field)}
                        loading={loadingStates[field?.id as string] && saveLoading}
                      >
                        Save
                      </LoadingButton>
                    </Grid>
                  </Grid>
                );
              } else if (field.types === "drop_down" && field?.is_multi === "True") {
                return (
                  <Grid
                    key={field.id}
                    item
                    container
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    gap={1}
                    position={"relative"}
                  >
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <InputLabel sx={{ color: "#262627", mt: 0.5 }}>
                        {field.field_name.replace(/_/g, " ")}
                      </InputLabel>
                      <FormControl
                        sx={{
                          "& .MuiSelect-select.MuiSelect-select.MuiSelect-select": {
                            padding: "7.1px 0px",
                            display: "flex",
                            flexWrap: "wrap",
                            mt: 0.5,
                            px: 2
                          }
                        }}
                        fullWidth
                      >
                        <ReactSelect
                          isMulti
                          value={
                            Array.isArray(productMetaFieldState[field.id]?.value)
                              ? (
                                  productMetaFieldState[field.id]?.value as (
                                    | string
                                    | number
                                  )[]
                                ).map((optionId: string | number) => {
                                  const option = field.options?.find(
                                    item => item.option_id === optionId
                                  );
                                  return {
                                    value: option?.option_id as string | undefined,
                                    label: option?.value as string | undefined
                                  };
                                })
                              : []
                          }
                          options={field?.options?.map((item: MetaOption) => ({
                            value: item.option_id as string | undefined,
                            label: item.value as string | undefined
                          }))}
                          onChange={selectedOptions => {
                            const selectedIds = selectedOptions.map(
                              option => option.value as string
                            );
                            const currentValue = Array.isArray(
                              productMetaFieldState[field.id]?.value
                            )
                              ? (productMetaFieldState[field.id]?.value as (
                                  | string
                                  | number
                                )[])
                              : [];
                            const removedItems = currentValue.filter(
                              item => !selectedIds.includes(item as string)
                            );
                            const addedItems = selectedIds.filter(
                              item => !currentValue.includes(item as string)
                            );
                            if (removedItems.length > 0) {
                              // Remove selected
                              setProductMetaFieldState(prev => ({
                                ...prev,
                                [field.id]: {
                                  value: currentValue.filter(
                                    item => !removedItems.includes(item)
                                  )
                                }
                              }));
                            }
                            if (addedItems.length > 0) {
                              metaFieldChange(
                                field.id,
                                addedItems[0],
                                field.is_multi,
                                field.types
                              );
                            }
                          }}
                          isDisabled={productLoading}
                        />
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                      right={0}
                      bottom={2}
                      position={"absolute"}
                    >
                      <LoadingButton
                        variant="contained"
                        onClick={() => saveMetaField(field)}
                        loading={loadingStates[field?.id as string] && saveLoading}
                      >
                        Save
                      </LoadingButton>
                    </Grid>
                  </Grid>
                );
              } else if (field.types === "date_and_time") {
                return (
                  <Grid
                    key={field.id}
                    item
                    container
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    gap={1}
                    position={"relative"}
                  >
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Box>
                        <InputLabel sx={{ color: "#262627", mt: 0.5 }}>
                          {field.field_name.replace(/_/g, " ")}
                        </InputLabel>

                        <TextField
                          type="datetime-local"
                          fullWidth
                          variant="outlined"
                          name={field.field_name}
                          value={productMetaFieldState[field.id]?.value || ""}
                          onChange={event =>
                            metaFieldChange(
                              field.id,
                              event.target.value,
                              field.is_multi,
                              field.types
                            )
                          }
                          InputLabelProps={{
                            shrink: true
                          }}
                          inputProps={{
                            step: 300
                          }}
                          sx={{
                            "& .MuiOutlinedInput-input": {
                              padding: "8.1px 8px"
                            },
                            width: "200px"
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      lg={3}
                      md={3}
                      sm={12}
                      xs={12}
                      right={0}
                      bottom={2}
                      position={"absolute"}
                    >
                      <LoadingButton
                        variant="contained"
                        onClick={() => saveMetaField(field)}
                        loading={loadingStates[field?.id as string] && saveLoading}
                      >
                        Save
                      </LoadingButton>
                    </Grid>
                  </Grid>
                );
              } else if (field.types === "date") {
                return (
                  <Grid
                    key={field.id}
                    item
                    container
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    gap={1}
                    position={"relative"}
                  >
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <InputLabel sx={{ color: "#262627", mt: 0.5 }}>
                        {field.field_name.replace(/_/g, " ")}
                      </InputLabel>
                      <TextField
                        type="date"
                        fullWidth
                        variant="outlined"
                        name={field.field_name}
                        value={productMetaFieldState[field.id]?.value || ""}
                        onChange={event =>
                          metaFieldChange(
                            field.id,
                            event.target.value,
                            field.is_multi,
                            field.types
                          )
                        }
                        InputLabelProps={{
                          shrink: true
                        }}
                        sx={{
                          "& .MuiOutlinedInput-input": {
                            padding: "8.1px 8px"
                          },
                          width: "200px"
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      lg={3}
                      md={3}
                      sm={12}
                      xs={12}
                      right={0}
                      bottom={2}
                      position={"absolute"}
                    >
                      <LoadingButton
                        variant="contained"
                        onClick={() => saveMetaField(field)}
                        loading={loadingStates[field?.id as string] && saveLoading}
                      >
                        Save
                      </LoadingButton>
                    </Grid>
                  </Grid>
                );
              }
              return null;
            })}
            {productData?.type === "f" ? (
              <Grid item xs={12}>
                <Typography variant="body1">
                  This is a fixed product, so no variations are available.
                </Typography>
              </Grid>
            ) : (
              <>
                {/* Product Attributes */}
                <Grid item container spacing={2}>
                  <Grid item xs={12}>
                    <Typography fontWeight={"bold"} variant="h6">
                      Product Attributes
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
                </Grid>
                {/* Product Variations */}
                <Grid item container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={generateVariation}
                          onChange={() => setGenerateVariation(!generateVariation)}
                        />
                      }
                      label="Turn off Auto Generate Variations"
                    />
                    <Button onClick={handleOpen} variant="contained">
                      Add Variant
                    </Button>
                  </Grid>

                  <Grid item xs={12} mt={2} mb={2}>
                    <Typography fontWeight={"bold"} variant="h6">
                      Product Variants
                    </Typography>
                  </Grid>
                  {generateVariation && variants.length > 0 && (
                    <ProductVariants
                      formState={attributesForm}
                      setFormState={setAttributeForm}
                      isEdit={true}
                      variants={variants}
                      handleVariantChange={handleVariantChange}
                      attributes={attributes}
                      deleteVariant={deleteVariant}
                      errors={errors}
                      setErrors={setErrors}
                      product={product}
                      isAttributeUpdated={isAttributeUpdated}
                      setIsSkuValid={setIsSkuValid}
                      isSkuValid={isSkuValid}
                      editIndex={editIndex}
                      setEditIndex={setEditIndex}
                    />
                  )}
                </Grid>
              </>
            )}
          </Grid>

          <Grid item lg={4} xs={12}>
            <Box position={"sticky"} top={y} sx={{ transition: "all .5s ease-in-out" }}>
              {productLoading || websitesLoading ? (
                <Skeleton height={80} width={"100%"} animation="wave" variant="rounded" />
              ) : (
                <Card>
                  <CardHeader
                    avatar={<Language color="primary" />}
                    title={"Connected Websites"}
                    titleTypographyProps={{
                      fontWeight: "bold",
                      fontSize: 16
                    }}
                    action={
                      <IconButton onClick={() => setOpenWebsites(!openWebsites)}>
                        {!openWebsites ? (
                          <KeyboardArrowDown color="primary" />
                        ) : (
                          <KeyboardArrowUp color="primary" />
                        )}
                      </IconButton>
                    }
                  />
                  <Collapse in={openWebsites}>
                    <Divider />
                    {websitesData?.Websites?.length ? (
                      <List>
                        {websitesData?.Websites?.map((item: string, index: number) => (
                          <ListItem key={index}>
                            <ListItemText primary={`${item}`} />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography p={2}>No Data Found</Typography>
                    )}
                  </Collapse>
                </Card>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EditProduct;
