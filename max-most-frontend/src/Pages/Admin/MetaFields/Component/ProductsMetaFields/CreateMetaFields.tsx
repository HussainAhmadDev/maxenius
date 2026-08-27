import React, { useState } from "react";
import { MenuItem, Button, Box, Card, TextField } from "@mui/material";
import {
  fieldTypes,
  MetaFieldTypes,
  FieldOptions
} from "../../../../../Interfaces/metaFieldTypes";
import { useCreateMetaField } from "../../../../../Hooks/useMetaFields";
import { getBrandId } from "../../../../../Hooks/api";
import { Stack } from "@mui/system";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
const CreateMetaFields: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [formData, setFormData] = useState<MetaFieldTypes>({
    field_name: "",
    field_description: "",
    min_characters: "",
    max_characters: "",
    file_specific: "",
    date_specific: "",
    brand_id: getBrandId().brand_id,
    options: [""],
    types: "",
    is_multi: false
  });
  const { mutate, isLoading } = useCreateMetaField("product_field_definition");

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(e.target.value);
    setFormData(prev => ({
      ...prev,
      min_characters: "",
      max_characters: "",
      file_specific: "",
      date_specific: "",
      is_multi: false,
      brand_id: getBrandId().brand_id,
      options: [""]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;

    if (name === "is_multi") {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: checked // Update with the boolean value directly
      }));
    } else {
      setFormData((prev: MetaFieldTypes) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formData.types = selectedType;
    formData.types = formData.types.toLowerCase().replace(/\s+/g, "_");
    if (formData.types === "drop_down") {
      formData.list_of_values = true;
      formData.one_value = false;
    } else {
      formData.list_of_values = false;
      formData.one_value = true;
    }
    mutate(formData);
  };

  const handleListOfValuesChange = (index: number, value: string) => {
    const newList = [...formData.options];
    newList[index] = value;
    setFormData(
      (prev: MetaFieldTypes) =>
        ({
          ...prev,
          options: newList
        }) as MetaFieldTypes
    );
  };

  const addListItem = () => {
    setFormData(
      (prev: MetaFieldTypes) =>
        ({
          ...prev,
          options: [...prev.options, ""]
        }) as unknown as MetaFieldTypes
    );
  };

  const renderFields = (options: FieldOptions, selectedType: string) => {
    if (
      selectedType !== "Date" &&
      selectedType !== "Date and time" &&
      selectedType !== "Multi-line"
    )
      return (
        <>
          {options.min_characters && (
            <TextField
              label="Minimum character count"
              name="min_characters"
              type="number"
              value={formData.min_characters}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
          )}
          {options.max_characters && (
            <TextField
              label="Maximum character count"
              name="max_characters"
              type="number"
              value={formData.max_characters}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
          )}
          {options.is_multi && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.is_multi}
                  onChange={handleChange}
                  name="is_multi"
                />
              }
              label="Allow Multi Section"
            />
          )}
          {options.options && (
            <>
              {formData.options.map((value: string, index: number) => (
                <TextField
                  key={index}
                  label={`Option ${index + 1}`}
                  value={value}
                  onChange={e => handleListOfValuesChange(index, e.target.value)}
                />
              ))}
              <Button onClick={addListItem}>Add Option</Button>
            </>
          )}
        </>
      );
  };

  return (
    <>
      <Card>
        <Stack>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, padding: "20px" }}
          >
            <TextField
              label="Name"
              name="field_name"
              value={formData.field_name}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Description"
              name="field_description"
              value={formData.field_description}
              onChange={handleChange}
              multiline
              rows={4}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Field Type"
              value={selectedType}
              onChange={handleTypeChange}
              required
              name="types"
            >
              {Object.keys(fieldTypes).map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            {selectedType && renderFields(fieldTypes[selectedType], selectedType)}
            <Button
              disabled={isLoading}
              type="submit"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </Box>
        </Stack>
      </Card>
    </>
  );
};

export default CreateMetaFields;
