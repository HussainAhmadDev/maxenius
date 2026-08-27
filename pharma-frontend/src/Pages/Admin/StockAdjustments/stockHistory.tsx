import { useBrand } from "Context/BrandContext";
import { useStockHistory } from "Hooks/useAdjustment";
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import DataTable from "Components/DataTable/Table";
import { QueryPagination } from "Interfaces/QueryFilters";
import { ukDateFormat } from "Utils/datesFormat";

interface HistoryData {
  id: string;
  created: string;
  updated: string;
  brand_id: string;
  reason: string;
  action_id: string;
  action_name: string;
  ordered_quantity: number;
  ordered_product: string;
  created_by: string;
}

interface ColumnsProps {
  readonly name: string;
  readonly selector?: (row: HistoryData) => string | React.ReactNode | undefined;
  readonly sortable?: boolean;
  readonly cell?: (row: HistoryData) => JSX.Element;
  readonly width?: string;
}

const StockHistory = () => {
  const { activeBrand: brand_id } = useBrand();
  const [pageDetail, setPageDetail] = useState<QueryPagination>({
    count: "50",
    page: "1",
    pages: "",
    rowsPerPage: "",
    total: ""
  });

  const { data: stockHistory, isLoading } = useStockHistory(brand_id, pageDetail);

  //eslint-disable-next-line
  const [selectedRows, setSelectedRows] = React.useState<HistoryData[]>([]);

  const columns: ColumnsProps[] = [
    {
      name: "Action Name",
      selector: row => `${row?.id}`,
      cell: row => <p>{row?.action_name}</p>,
      sortable: false
    },
    {
      name: "Ordered Product",
      selector: row => `${row?.id}`,
      cell: row => <p>{row?.ordered_product}</p>,
      sortable: false
    },
    {
      name: "Ordered Quantity",
      cell: row => <p>{row?.ordered_quantity}</p>,
      sortable: false
    },

    {
      name: "Reason",
      selector: row => row?.reason,
      cell: row => <p>{row.reason}</p>,
      sortable: false
    },
    {
      name: "User Name",
      selector: row => `${row?.id}`,
      cell: row => <p>{row?.created_by}</p>,
      sortable: false
    },
    {
      name: "Date",
      selector: row => `${row?.id}`,
      cell: row => <p> {ukDateFormat(row?.created, true)} </p>,
      sortable: false
    }
  ];

  const pagination = {
    page: (stockHistory?.page || 1).toString(),
    rowsPerPage: (stockHistory?.count || 100).toString(),
    pages: (stockHistory?.pages || 1).toString(),
    total: (stockHistory?.total || 0).toString()
  };
  const handleRowSelection = ({
    selectedRows
  }: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: HistoryData[];
  }) => {
    setSelectedRows(selectedRows);
  };
  const handlePageChange = (p: number) => {
    setPageDetail(prev => ({
      ...prev,
      page: p.toString()
    }));
  };
  const handleRowChange = (c: number) => {
    setPageDetail(prev => ({
      ...prev,
      count: c.toString()
    }));
  };

  return (
    <>
      <h2>Adjustment History</h2>

      <Grid item xs={12} lg={4}>
        <span>{stockHistory?.total} results </span>
      </Grid>
      <br />
      <DataTable
        columns={columns}
        data={stockHistory?.results}
        showPagination
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowChange={handleRowChange}
        onRowSelection={handleRowSelection}
      />
    </>
  );
};

export default StockHistory;
