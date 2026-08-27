import { ProductTransaction } from "../Interfaces/Company";
import { ukDateFormat } from "../Utils/datesFormat";
import { TableColumn } from "react-data-table-component";

type Columns<T> = TableColumn<T>[];

const ProductTransactionColumn = (): Columns<ProductTransaction> => {
  return [
    {
      name: "Ordered Date",
      selector: row => `${row.ordered ? row.ordered : "---"}`,
      sortable: true
    },
    {
      name: "Product Name",
      selector: row => row?.name,
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Sale/PO #",
      selector: row => row.number,
      sortable: true
    },
    {
      name: "Batch #",
      selector: row => row.batch_number,
      sortable: true
    },
    {
      name: "Expiry Date",
      selector: row => ukDateFormat(row.expiry_date, false),
      sortable: true
    },
    {
      name: "Quantity",
      selector: row => row.quantity,
      sortable: true
    },
    {
      name: "Running Tool",
      selector: row => row.running_total,
      sortable: true
    },
    {
      name: "Type",
      selector: row => row.type_t,
      sortable: true
    },
    {
      name: "Is Adjustment",
      selector: row => row.is_adjustment,
      cell: row =>
        Boolean(row.is_adjustment) === true
          ? "Yes"
          : Boolean(row.is_adjustment) === false
            ? ""
            : "---",
      sortable: true
    }
  ];
};

export { ProductTransactionColumn };
