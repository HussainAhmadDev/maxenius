import { Typography } from "@mui/material";
import { ProductExpiry } from "../Interfaces/productExpiryType";
import { ukDateFormat } from "../Utils/datesFormat";
import { TableColumn } from "react-data-table-component";

type Columns<T> = TableColumn<T>[];

const ProductExpiryColumn = (): Columns<ProductExpiry> => {
  return [
    {
      name: "Product Name",
      selector: row => row?.product_name,
      sortable: true,
      minWidth: "150px",
      cell: row => {
        return (
          <Typography id="cy__ProductName" variant="body2">
            {row?.product_name}
          </Typography>
        );
      }
    },
    {
      name: "SKU",
      selector: row => row?.product_sku,
      sortable: true
    },
    {
      name: "Purchase #",
      selector: row => row?.number,
      sortable: true
    },
    {
      name: "Batch Number",
      selector: row => row?.batch_number,
      sortable: true
    },
    {
      name: "Expiry Date",
      selector: row => ukDateFormat(row?.expiry_date, false),
      sortable: true
    },
    {
      name: "Available Quantity",
      selector: row => row?.available_quantity,
      sortable: true
    }
  ];
};

export { ProductExpiryColumn };
