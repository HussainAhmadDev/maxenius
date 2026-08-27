import { TableColumn } from "react-data-table-component";
import { outOfStockProducts } from "../Interfaces/nearExpiry";
import { Typography } from "@mui/material";
type Columns<T> = TableColumn<T>[];
const OutOfStockColumns = (): Columns<outOfStockProducts> => {
  return [
    {
      name: "Product#/SKU",
      selector: row => `${row?.sku}`,
      sortable: true,
      cell: row => <Typography color={"primary.main"}>{row.sku}</Typography>,
      maxWidth: "200px"
    },
    {
      name: "Product Name",
      selector: row => row?.name,
      sortable: true,
      cell: row => <Typography id="cy__ProductName">{row?.name}</Typography>
    }
  ];
};

export { OutOfStockColumns };
