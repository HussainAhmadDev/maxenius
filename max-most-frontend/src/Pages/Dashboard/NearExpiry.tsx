import { useNearExpiry } from "../../Hooks/useDashboard";
import { CardContent, Divider, Stack, Card, Typography } from "@mui/material";
import SeeDocumentation from "../../Components/SeeDocumentation";
import DataTable from "../../Components/DataTable";
import { useState } from "react";
import { NearExpiryColumns } from "../../Constants/nearExpiryConst";
import { nearExpiry } from "@interfaces/nearExpiry";
import { getBrandId } from "../../Hooks/api";

const NearExpiry: React.FC = () => {
  const [pagination, setPagination] = useState({
    page: "1",
    rowsPerPage: "10",
    pages: "1",
    total: "0",
    count: "10"
  });

  const brand = getBrandId();

  const { data, isLoading } = useNearExpiry(brand?.brand_id, pagination);

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

  const handleView = (row: nearExpiry) => {
    setAction({ type: "view", row });
  };

  const paginationData = {
    page: pagination.page.toString(),
    rowsPerPage: pagination.rowsPerPage.toString(),
    pages: (data?.pages || 1).toString(),
    total: (data?.total || 0).toString()
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
              Near Expiry
            </Typography>
            <SeeDocumentation title="See Documentation" fileName={"useNearExpiry"} />
          </Stack>
        </CardContent>
        <Divider />
        <DataTable
          columns={NearExpiryColumns()}
          data={data?.results?.length ? data?.results : []}
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

export default NearExpiry;
function setAction(action: { type: string; row: nearExpiry }) {
  throw new Error(`Action type: ${action.type}- Row data: ${action.row}`);
}
