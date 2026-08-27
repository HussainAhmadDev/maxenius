import { useOutOfStockProducts } from "../../Hooks/useDashboard";
import { CardContent, Divider, Stack, Card, Typography } from "@mui/material";
import SeeDocumentation from "../../Components/SeeDocumentation";
import DataTable from "../../Components/DataTable";
import { useSearchParams } from "react-router-dom";
import { outOfStockProducts } from "@interfaces/nearExpiry";
import { OutOfStockColumns } from "../../Constants/outOfStockConst";
import { getBrandId } from "../../Hooks/api";

const OutOfStockProducts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const brand = getBrandId();
  const { data, isLoading } = useOutOfStockProducts(brand?.brand_id, searchParams);

  const pagination = {
    page: (data?.page || 1).toString(),
    rowsPerPage: (data?.count || 100).toString(),
    pages: (data?.pages || 1).toString(),
    total: (data?.total || 0).toString()
  };

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  const handlePageChange = (p: number) => {
    handleChange("page", `${p}`);
  };

  const handleRowChange = (c: number) => {
    handleChange("count", `${c}`);
  };

  const handleView = (row: outOfStockProducts) => {
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
              Out of Stock Products
            </Typography>
            <SeeDocumentation
              title="See Documentation"
              fileName={"useOutOfStockProducts"}
            />
          </Stack>
        </CardContent>
        <Divider />
        <DataTable
          columns={OutOfStockColumns()}
          data={data?.results?.length ? data?.results : []}
          loading={isLoading}
          pagination={pagination}
          onRowChange={handleRowChange}
          onPageChange={handlePageChange}
          onRowClicked={handleView}
        />
      </Card>
    </>
  );
};

export default OutOfStockProducts;
function setAction(action: { type: string; row: outOfStockProducts }) {
  throw new Error(`Action type: ${action.type}- Row data: ${action.row}`);
}
