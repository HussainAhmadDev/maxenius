import React, { useState, useEffect, FormEvent } from "react";
import { Button, Box, Card, TextField } from "@mui/material";
import {
  useSingleMetaField,
  useUpdateMetaField
} from "../../../../../Hooks/useMetaFields";
import { Stack } from "@mui/system";
import { useParams } from "react-router-dom";

const EditMetaField: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading } = useSingleMetaField(id || "");
  const { mutateAsync: updateMetaField } = useUpdateMetaField();

  const [formData, setFormData] = useState<{
    field_name: string;
    field_description: string;
  }>({ field_name: "", field_description: "" });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (data && data.results.length > 0) {
      setFormData({
        field_name: data.results[0].field_name,
        field_description: data.results[0].field_description || ""
      });
    }
  }, [data]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fieldId = data?.results[0]?.id;
    if (fieldId) {
      updateMetaField({ id: fieldId, payload: formData });
    }
  };

  return (
    <>
      <Card>
        <Stack>
          <Box
            component="form"
            onSubmit={e => handleSubmit(e)}
            sx={{ display: "flex", flexDirection: "column", gap: 2, padding: "20px" }}
          >
            <TextField
              label="Name"
              name="field_name"
              value={formData.field_name}
              placeholder="Enter field name here"
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Description"
              name="field_description"
              value={formData.field_description}
              placeholder="Enter description here"
              onChange={handleChange}
              multiline
              rows={4}
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Description"
              name="description"
              value={data?.results[0]?.types}
              required
              InputLabelProps={{ shrink: true }}
              disabled={true}
            />

            <Button
              disabled={isLoading}
              type="submit"
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </Box>
        </Stack>
      </Card>
    </>
  );
};

export default EditMetaField;
