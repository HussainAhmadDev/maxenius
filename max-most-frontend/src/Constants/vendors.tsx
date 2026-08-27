import { TableColumn } from "react-data-table-component";
import { Button, IconButton, Radio, Box } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import { ukDateFormat } from "../Utils/datesFormat";
import { Vendor } from "../Interfaces/vendorsType";

type Columns = TableColumn<Vendor>[];
type Props = {
  handleDelete(row: Vendor): void;
  handleView(row: Vendor): void;
  handleRestore(row: Vendor): void;
  isTrash?: boolean;
};

const VendorsColumns = (props: Props): Columns => {
  const { handleDelete, handleView, isTrash, handleRestore } = props;
  return [
    {
      name: `Name`,
      selector: row => row?.name,
      sortable: true,
      cell: row => {
        return (
          <Button
            variant="text"
            color="primary"
            onClick={() => handleView(row)}
            id="cy__VendorTableName"
            sx={{
              justifyContent: "start !important",
              textAlign: "left !important"
            }}
            size="small"
          >
            {row?.name}
          </Button>
        );
      },
      minWidth: "160px"
    },
    {
      name: "Contact Name",
      selector: row => row?.contact_name || "---",
      sortable: true,
      minWidth: "160px"
    },
    {
      name: "Address",
      selector: row => row?.country || "---",
      sortable: true,
      minWidth: "160px"
    },
    {
      name: "City/Town",
      selector: row => row?.city || "---",
      sortable: true,
      minWidth: "160px"
    },
    {
      name: "Contact#",
      selector: row => row?.contact_phone || "---",
      minWidth: "160px"
    },
    {
      name: "Email",
      selector: row => row?.email || "---",
      sortable: true,
      minWidth: "160px"
    },
    {
      name: "Website",
      selector: row => row?.webpage || "---",
      minWidth: "160px"
    },
    {
      name: "Created At",
      minWidth: "140px",
      sortable: true,
      cell: row => (row?.created ? ukDateFormat(row?.created, false) : "---")
    },
    {
      name: "Active",
      cell: ({ is_active }) => <Radio checked={!!is_active} />,
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

export { VendorsColumns };
