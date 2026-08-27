import { CardContent, Divider, Stack, Card, Typography } from "@mui/material";
import SeeDocumentation from "../../Components/SeeDocumentation";
import DataTable from "../../Components/DataTable";
import { useState } from "react";
import { useLowStockProducts } from "../../Hooks/useDashboard";
import { lowStockProducts } from "@interfaces/nearExpiry";
import { LowStockProductsColumns } from "../../Constants/lowStockProductsConst";
import { getBrandId } from "../../Hooks/api";

const LowStockProducts: React.FC = () => {
  const [pagination, setPagination] = useState({
    page: "1",
    rowsPerPage: "10",
    pages: "1",
    total: "0",
    count: "10"
  });

  const brand = getBrandId();
  const { data, isLoading } = useLowStockProducts(brand?.brand_id, pagination);
  const paginationData = {
    page: pagination.page.toString(),
    rowsPerPage: pagination.rowsPerPage.toString(),
    pages: (data?.pages || 1).toString(),
    total: (data?.total || 0).toString()
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page: page.toString() }));
  };

  const handleRowChange = (rowsPerPage: number) => {
    setPagination(prev => ({
      ...prev,
      rowsPerPage: rowsPerPage.toString(),
      count: rowsPerPage.toString()
    }));
  };

  const handleView = (row: lowStockProducts) => {
    setAction({ type: "view", row });
  };

  return (
    <>
      <Card>
        <CardContent>
          <Stack
            direction={"row"}
            gap={1}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h4" fontWeight={"600"}>
              Low Stock Products
            </Typography>
            <SeeDocumentation
              title="See Documentation"
              fileName={"useLowStockProducts"}
            />
          </Stack>
        </CardContent>
        <Divider />
        <DataTable
          columns={LowStockProductsColumns()}
          data={data?.products?.length ? data?.products : []}
          loading={isLoading}
          pagination={paginationData}
          onRowChange={handleRowChange}
          onPageChange={handlePageChange}
          onRowClicked={handleView}
        />
      </Card>
    </>
  );
};

export default LowStockProducts;

function setAction(action: { type: string; row: lowStockProducts }) {
  throw new Error(`Action type: ${action.type}- Row data: ${action.row}`);
}
