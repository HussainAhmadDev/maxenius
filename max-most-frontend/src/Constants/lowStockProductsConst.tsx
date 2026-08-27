import { TableColumn } from "react-data-table-component";
import { lowStockProducts } from "../Interfaces/nearExpiry";
import { Typography } from "@mui/material";

type Columns<T> = TableColumn<T>[];

const LowStockProductsColumns = (): Columns<lowStockProducts> => {
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
    },
    {
      name: "Minimum Stock",
      selector: row => row?.minimum_stock || 0,
      sortable: true,
      cell: row => <Typography id="cy__StockQuantity">{row?.minimum_stock}</Typography>
    },
    {
      name: "Stock Quantity",
      selector: row => row?.stock_quantity || 0,
      sortable: true,
      cell: row => <Typography id="cy__StockQuantity">{row?.stock_quantity}</Typography>
    }
  ];
};

export { LowStockProductsColumns };
