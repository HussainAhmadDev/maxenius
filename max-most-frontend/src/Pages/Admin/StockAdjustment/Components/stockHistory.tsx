import { useStockHistory } from "../../../../Hooks/usestocksAdjustment";
import React from "react";
import DataTable from "../../../../Components/DataTable";
import { StockAdjustmentHistoryColumns } from "../../../../Constants/stockAdjustmentConst";
import { useSearchParams } from "react-router-dom";
import { CardContent, CardHeader, Divider } from "@mui/material";
import { Typography } from "@mui/material";

const StockHistory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: stockHistory, isLoading } = useStockHistory(searchParams);
  const pagination = {
    page: (stockHistory?.page || 1).toString(),
    rowsPerPage: (stockHistory?.count || 100).toString(),
    pages: (stockHistory?.pages || 1).toString(),
    total: (stockHistory?.total || 0).toString()
  };
  const handleChange = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };
  const handlePageChange = (p: number) => {
    handleChange("page", p?.toString());
  };

  const handleRowChange = (c: number) => {
    handleChange("count", c?.toString());
  };

  return (
    <CardContent>
      <CardHeader
        title="Adjustment History"
        titleTypographyProps={{
          fontWeight: "bold",
          fontSize: 20
        }}
      />
      <Divider />
      <Typography m={2} variant="body2" fontWeight={"bold"}>
        {stockHistory?.total} Results{" "}
      </Typography>
      <DataTable
        columns={StockAdjustmentHistoryColumns}
        data={stockHistory?.results || []}
        loading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowChange={handleRowChange}
      />
    </CardContent>
  );
};

export default StockHistory;
