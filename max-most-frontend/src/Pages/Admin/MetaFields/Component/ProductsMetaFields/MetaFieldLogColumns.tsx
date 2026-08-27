import { TableColumn } from "react-data-table-component";
import { Typography, Box, IconButton } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import { MetaFieldDetail } from "@interfaces/metaFieldTypes";

type Columns<T> = TableColumn<T>[];

const MetaFieldLogColumns = ({
  handleDelete
}: {
  handleDelete: (row: MetaFieldDetail) => void;
}): Columns<MetaFieldDetail> => {
  return [
    {
      name: "Field Name",
      selector: row => row.field_name || "",
      sortable: true,
      cell: row => <Typography color={"primary.main"}>{row.field_name}</Typography>,
      maxWidth: "200px"
    },
    {
      name: "Description",
      selector: row => row.field_description || "",
      sortable: true,
      cell: row => (
        <Typography id="cy__MetaFieldDescription">{row.field_description}</Typography>
      )
    },
    {
      name: "Field Type",
      selector: row => row.types || "",
      sortable: true,
      cell: row => <Typography id="cy__MetaFieldType">{row.types}</Typography>
    },
    {
      name: "Options",
      selector: row =>
        row.options && row.options.length > 0 ? "Has Options" : "No Options",
      sortable: true,
      cell: row => renderOptions(row)
    },
    {
      name: "Action",
      cell: row => (
        <>
          <IconButton onClick={() => handleDelete(row)}>
            <DeleteForever color="error" />
          </IconButton>
        </>
      ),
      button: true
    }
  ];
};

const renderOptions = (row: MetaFieldDetail) => {
  const options = row.options;
  return options && options.length > 0 ? (
    <Box>
      {options.map((option, index) => (
        <Typography key={index} id="cy__MetaFieldOption">
          {option.value.charAt(0).toUpperCase() + option.value.slice(1).toLowerCase()}{" "}
        </Typography>
      ))}
    </Box>
  ) : (
    <Typography id="cy__MetaFieldOption">N/A</Typography>
  );
};

export { MetaFieldLogColumns };
