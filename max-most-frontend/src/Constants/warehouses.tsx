import { TableColumn } from "react-data-table-component";
import { Warehouse } from "../Interfaces/warehouseType";
import { Box, Button, IconButton, Radio } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import { ukDateFormat } from "../Utils/datesFormat";

type Columns = TableColumn<Warehouse>[];
type Props = {
  handleDelete(row: Warehouse): void;
  handleView(row: Warehouse): void;
  handleRestore?(row: Warehouse): void;
  isTrash?: boolean;
};
const WarehousesColumns = (props: Props): Columns => {
  const { handleDelete, handleView, handleRestore, isTrash } = props;
  return [
    {
      name: "Name",
      selector: row => row.name,
      sortable: true,
      cell: row => {
        return (
          <Button
            variant="text"
            color="primary"
            onClick={() => handleView(row)}
            sx={{
              justifyContent: "start !important",
              textAlign: "left !important"
            }}
            size="small"
            id="cy__WarehouseTbName"
          >
            {row.name}
          </Button>
        );
      },
      minWidth: "160px"
    },
    {
      name: "Address Line1",
      selector: row => row.address_line_1 || "---",
      sortable: true,
      minWidth: "160px"
    },
    {
      name: "City/Town",
      selector: row => row.city || "---",
      sortable: true,
      minWidth: "160px"
    },
    {
      name: "Region",
      selector: row => row.region || "---",
      sortable: true,
      minWidth: "160px"
    },
    {
      name: "Post Code",
      selector: row => row.post_code || "---",
      sortable: true,
      minWidth: "160px"
    },
    {
      name: "Country",
      selector: row => row.country || "---",
      sortable: true,
      minWidth: "160px"
    },
    {
      name: "Date Created",
      selector: row => row.created || "---",
      minWidth: "120px",
      cell: row => ukDateFormat(row.created, false)
    },
    {
      name: "Active",
      cell({ is_active }) {
        return (
          <Radio
            checked={
              typeof is_active === "boolean"
                ? !!is_active
                : JSON.parse(is_active?.toString()?.toLowerCase() ?? "false")
            }
            size="medium"
          />
        );
      },
      button: true
    },
    {
      name: "Action",
      cell: row => {
        return isTrash && handleRestore ? (
          <IconButton onClick={() => handleRestore(row)}>
            <Box component={"img"} src={"/assets/icons/restore-icon.svg"} />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleDelete(row)}>
            <DeleteForever sx={{ color: "error.main" }} />
          </IconButton>
        );
      },
      button: true
    }
  ];
};

export { WarehousesColumns };
