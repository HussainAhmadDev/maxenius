import * as React from "react";
import { useSearchParams } from "react-router-dom";
import DataTable from "Components/DataTable/Table";
import {
  CompanyData,
  ProductTransactionResponse,
  ProductTransaction
} from "Interfaces/Company";
import Grid from "@mui/material/Grid";
import { ukDateFormat } from "Utils/datesFormat";

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  cell?: (row: ProductTransaction) => JSX.Element;
  readonly selector?: (row: ProductTransaction) => string | React.ReactNode | undefined;
}

interface Props {
  transactionProduct?: ProductTransactionResponse | undefined;
  isLoading: boolean;
}

export const TransactionProductTable: React.FC<Props> = ({
  isLoading,
  transactionProduct
}) => {
  const [, setSelectedRows] = React.useState<CompanyData[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const pagination = {
    page: (transactionProduct?.page || 1).toString(),
    rowsPerPage: (transactionProduct?.count || 100).toString(),
    pages: (transactionProduct?.pages || 1).toString(),
    total: (transactionProduct?.total || 0).toString()
  };

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  const handleRowSelect = (data: { selectedRows: CompanyData[] }) => {
    setSelectedRows(data.selectedRows);
  };

  const columns: ColumnsProps[] = [
    {
      name: "Ordered Date",
      selector: row => <p> {ukDateFormat(row.ordered, true)}</p>,
      sortable: true
    },
    {
      name: "Product Name",
      selector: row => `${row?.name}`,
      cell: row => <p>{row?.name}</p>,
      sortable: true
    },
    {
      name: "Sale/Po #",
      cell: row => <p>{row?.number}</p>,
      sortable: true
    },
    {
      name: "Batch #",
      selector: row => `${row?.batch_number}`,
      cell: row => <p>{row?.batch_number}</p>,
      sortable: true
    },
    {
      name: "Expiry Date",
      selector: row => row.expiry_date,
      cell: row => <p>{ukDateFormat(row.expiry_date, false)}</p>,
      sortable: true
    },
    {
      name: "Quantity",
      selector: row => row.quantity,
      cell: row => <p>{row.quantity}</p>,
      sortable: true
    },
    {
      name: "Running Total",
      selector: row => row.running_total,
      cell: row => <p>{row.running_total}</p>,
      sortable: true
    },
    {
      name: "Type",
      selector: row => row.type_t,
      cell: row => <p>{row.type_t}</p>,
      sortable: true
    },
    {
      name: "Is Adjustment",
      selector: row => row.is_adjustment,
      cell: row => <p>{row.is_adjustment ? "Yes" : " "}</p>,
      sortable: true
    }
  ];

  const pageNumberInUrl = Number.parseInt(searchParams.get("page") || "1");

  React.useEffect(() => {
    if (transactionProduct?.pages && transactionProduct?.pages < pageNumberInUrl) {
      const params = new URLSearchParams(searchParams);
      params.set("page", `${transactionProduct?.pages}`);
      setSearchParams(params);
    }
  }, [transactionProduct?.pages, pageNumberInUrl, searchParams, setSearchParams]);

  return (
    <div>
      <Grid item xs={12} lg={4} mb={2}>
        <span>{transactionProduct?.total} results </span>
      </Grid>
      <DataTable
        selectableRows={false}
        columns={columns}
        data={transactionProduct?.results}
        showPagination
        loading={isLoading}
        pagination={pagination}
        onPageChange={page => handleChange("page", `${page}`)}
        onRowChange={count => handleChange("count", `${count}`)}
        onRowSelection={handleRowSelect}
        // onRowClicked={({ id }) => handleRowClick(id)}
      />
    </div>
  );
};

export default TransactionProductTable;
