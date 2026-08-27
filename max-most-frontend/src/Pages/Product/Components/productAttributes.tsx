import React, { Dispatch, SetStateAction, useEffect } from "react";
import Input from "../../../Components/Input";
import LoadingButton from "../../../Components/LoadingButton";
import { memo } from "react";
import { IconButton, Grid, Box } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import { AttributeDetailsT, AttributeItem } from "@interfaces/Products";

type Attribute = { name: string; values: string[] };
interface IProps {
  attributes: { name: string; values: string[] }[];
  handleAttributeChange: (index: number, key: string, value: string | string[]) => void;
  addNewAttribute: () => void;
  setAttributes?: Dispatch<SetStateAction<Attribute[]>>;
  setVariants?: Dispatch<SetStateAction<AttributeItem[]>>;
  attributeDetailsList?: AttributeDetailsT[];
  // setAttributeDetailsList?: Dispatch<SetStateAction<AttributeItem[]>>;
  variants?: AttributeItem[];
}
const ProductAttributes: React.FC<IProps> = ({
  attributes,
  setVariants,
  handleAttributeChange,
  addNewAttribute,
  setAttributes
}) => {
  const deleteAttributeField = (index: number) => {
    if (setAttributes) {
      const updatedAttributes = attributes.filter((_, i) => i !== index);
      setAttributes(updatedAttributes);
    }
  };
  const handleAttributeBlur = (index: number, key: string, value: string) => {
    if (setAttributes) {
      const filteredValue = value
        .split("|")
        .map(item => item.trim())
        .filter(item => item);

      const updatedAttributes = attributes.map((attribute, i) =>
        i === index ? { ...attribute, [key]: filteredValue } : attribute
      );

      setAttributes([...updatedAttributes]);
    }
  };

  useEffect(() => {
    if (setVariants && attributes.length === 0) {
      setVariants([]);
    }
  }, [attributes, setVariants]);
  return (
    <>
      {attributes?.map((attribute, index) => (
        <Grid item container key={index} spacing={2}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Input
              value={attribute.name}
              name={`attribute_name_${index}`}
              type="text"
              label="Attribute Name"
              handleChange={e => {
                handleAttributeChange(index, "name", e.value.toString());
              }}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Input
                value={attribute?.values?.join("|")}
                name={`attribute_values_${index}`}
                type="text"
                label="Attribute Values (separated by | )"
                onBlur={e => handleAttributeBlur(index, "values", e.target.value)}
                handleChange={e => {
                  const val = e.value as string;
                  handleAttributeChange(index, "values", val.split("|"));
                }}
                disabled={!attribute.name}
              />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteAttributeField(index)}
                sx={{ marginTop: { md: 3, sm: 3, xs: 4 } }}
              >
                <DeleteForever color="error" sx={{ fontSize: 32 }} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      ))}

      {!attributes.some(attr => attr.values.length === 0) && (
        <Grid item xs={12}>
          <LoadingButton variant="outlined" onClick={addNewAttribute}>
            Add New Attribute
          </LoadingButton>
        </Grid>
      )}
    </>
  );
};
export default memo(ProductAttributes);
