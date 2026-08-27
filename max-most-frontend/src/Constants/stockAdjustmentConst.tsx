// stockColumns.ts

import { TableColumn } from "react-data-table-component";
import { Typography, IconButton } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import {
  StockHistory,
  IncreaseStockFormProduct,
  DecreaseStockFormProduct
} from "../Interfaces/stocksAdjustmentTypes"; // Assuming interface definitions

// Utility function for date formatting
import { ukDateFormat } from "../Utils/datesFormat";

// Define Props type if not imported from elsewhere
type Props = {
  handleDelete: (row: IncreaseStockFormProduct | DecreaseStockFormProduct) => void;
};
type DecreaseProps = {
  handleDelete: (row: DecreaseStockFormProduct) => void;
};

// Define Columns type for reusability
type Columns<T> = TableColumn<T>[];

// Stock Adjustment History Columns
const StockAdjustmentHistoryColumns: Columns<StockHistory> = [
  {
    name: "Action Name",
    selector: row => row?.action_name,
    sortable: false
  },
  {
    name: "Ordered Product",
    selector: row => row?.ordered_product,
    sortable: false
  },
  {
    name: "Ordered Quantity",
    selector: row => row?.ordered_quantity?.toString(),
    sortable: false
  },
  {
    name: "Reason",
    selector: row => row?.reason,
    sortable: false
  },
  {
    name: "User Name",
    selector: row => row?.created_by,
    sortable: false
  },
  {
    name: "Date",
    selector: row => ukDateFormat(row?.created, false),
    sortable: false
  }
];

// Increase Stock Columns
const IncreaseStockColumns = (props: Props): Columns<IncreaseStockFormProduct> => {
  const { handleDelete } = props;

  return [
    {
      name: "Product#/SKU",
      selector: row => `${row?.sku}`,
      sortable: true,
      cell: row => <Typography color={"primary.main"}>{row?.sku}</Typography>,
      maxWidth: "200px"
    },
    {
      name: "Product Name",
      selector: row => row?.product_name,
      sortable: true
    },
    {
      name: "Quantity",
      selector: row => row?.stock_quantity || 0,
      sortable: true
    },
    {
      name: "Adjustment Quantity",
      selector: row => row?.quantity || 0,
      sortable: true
    },
    {
      name: "After Adjustment Quantity",
      cell: row => Number(row?.stock_quantity || 0) + Number(row?.quantity || 0),
      sortable: true
    },
    {
      name: "Batch",
      selector: row => row?.batch_number || 0,
      sortable: true
    },
    {
      name: "Expiry Date",
      selector: row => row?.expiry_date || 0,
      sortable: true
    },

    {
      name: "Action",
      cell: row => (
        <IconButton
          onClick={() => {
            handleDelete(row);
          }}
        >
          <DeleteForever color="error" />
        </IconButton>
      ),
      button: true
    }
  ];
};

// Decrease Stock Columns
const DecreaseStockColumns = (
  props: DecreaseProps
): Columns<DecreaseStockFormProduct> => {
  const { handleDelete } = props;

  return [
    {
      name: "Product#/SKU",
      selector: row => `${row?.sku}`,
      sortable: true,
      maxWidth: "200px",
      cell: row => <Typography color="primary">{row?.sku}</Typography>
    },
    {
      name: "Product Name",
      selector: row => row?.product?.label,
      sortable: true
    },
    {
      name: "Batch",
      selector: row => row?.batchNumber,
      sortable: true
    },
    {
      name: "Expiry Date",
      selector: row => row?.expiry_date,
      sortable: true
    },
    {
      name: "Total Quantity",
      selector: row => Number(row?.stock_quantity) + Number(row?.less_quantity),
      sortable: true
    },
    {
      name: "Less Quantity",
      selector: row => row?.less_quantity,
      sortable: true
    },
    {
      name: "After Adjustment Qty",
      selector: row => row?.after_adjustment_qty,
      sortable: true
    },
    {
      name: "Action",
      cell: row => (
        <IconButton
          onClick={() => {
            handleDelete(row);
          }}
        >
          <DeleteForever color="error" />
        </IconButton>
      ),
      button: true,
      maxWidth: "100px"
    }
  ];
};
export { StockAdjustmentHistoryColumns, IncreaseStockColumns, DecreaseStockColumns };
