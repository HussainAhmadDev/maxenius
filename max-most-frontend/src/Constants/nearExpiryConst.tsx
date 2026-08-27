import { TableColumn } from "react-data-table-component";
import { nearExpiry } from "../Interfaces/nearExpiry";
import { Typography } from "@mui/material";
import { ukDateFormat } from "../Utils/datesFormat";

type Columns<T> = TableColumn<T>[];

const NearExpiryColumns = (): Columns<nearExpiry> => {
  return [
    {
      name: "Product#/SKU",
      selector: row => `${row?.product_sku}`,
      sortable: true,
      cell: row => <Typography color={"primary.main"}>{row.product_sku}</Typography>,
      maxWidth: "200px"
    },
    {
      name: "Product Name",
      selector: row => row?.product_name,
      sortable: true,
      cell: row => <Typography id="cy__ProductName">{row?.product_name}</Typography>
    },
    {
      name: "Batch Number",
      selector: row => row?.batch_number || 0,
      sortable: true,
      cell: row => <Typography id="cy__StockQuantity">{row?.batch_number}</Typography>
    },
    {
      name: "Available Quantity",
      selector: row => row?.available_quantity || 0,
      sortable: true,
      cell: row => (
        <Typography id="cy__StockQuantity">{row?.available_quantity}</Typography>
      )
    },
    {
      name: "Expiry Date",
      selector: row => row?.expiry_date || 0,
      sortable: true,
      cell: row => ukDateFormat(row?.expiry_date, false)
    },
    {
      name: "Number",
      selector: row => row?.number || 0,
      sortable: true,
      cell: row => <Typography id="cy__StockQuantity">{row?.number}</Typography>
    }
  ];
};

export { NearExpiryColumns };
