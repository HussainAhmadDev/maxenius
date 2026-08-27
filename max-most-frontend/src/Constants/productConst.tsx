import { TableColumn } from "react-data-table-component";
import { ProductData } from "../Interfaces/Products";
// import { getBrandDetails } from "../Hooks/api";
import { IconButton, Typography, Box } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";

type Columns<T> = TableColumn<T>[];
type Props = {
  handleDelete(row: ProductData): void;
  handleRestore?(row: ProductData): void;
  isTrash?: boolean;
};

const ProductsColumns = (props: Props): Columns<ProductData> => {
  const { handleDelete, isTrash, handleRestore } = props;
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
      name: "Stock Quantity",
      selector: row => row?.stock_quantity || 0,
      sortable: true,
      cell: row => <Typography id="cy__StockQuantity">{row?.stock_quantity}</Typography>
    },
    // {
    //   name: "Cost Price",
    //   cell: row => {
    //     const brand = getBrandDetails();
    //     return `${brand?.currency_symbol} ${row?.cost_price}`;
    //   },
    //   sortable: true
    // },
    // {
    //   name: "VAT %",
    //   cell: row => {
    //     const brand = getBrandDetails();
    //     return `${brand?.currency_symbol} ${row?.vat_percent}`;
    //   },
    //   sortable: true
    // },
    {
      name: "Action",
      cell: row => {
        return isTrash && handleRestore ? (
          <IconButton onClick={() => handleRestore(row)}>
            <Box component={"img"} src={"/assets/icons/restore-icon.svg"} />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleDelete(row)}>
            <DeleteForever color="error" />
          </IconButton>
        );
      },
      button: true
    }
  ];
};

export { ProductsColumns };
