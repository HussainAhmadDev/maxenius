import DataTables from "../../../Components/DataTable";
import { ProductExpiryColumn } from "../../../Constants/ProductExpiryConst";
import { ProductExpiryResponse } from "../../../Interfaces/productExpiryType";
import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

interface IOrderProps {
  productExpiry: ProductExpiryResponse | undefined;
  isLoading: boolean;
}
function ProductExpiryTable({ productExpiry, isLoading }: IOrderProps) {
  const pagination = {
    page: (productExpiry?.page || 1).toString(),
    rowsPerPage: (productExpiry?.count || 100).toString(),
    pages: (productExpiry?.pages || 1).toString(),
    total: (productExpiry?.total || 0).toString()
  };
  const [searchParams, setSearchParams] = useSearchParams();
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

  return (
    <Card>
      <CardContent>
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} gap={1} alignItems={"center"} justifyContent={"start"}>
            <Typography variant="body2" fontWeight={"bold"}>
              {productExpiry?.total} Results{" "}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <DataTables
        columns={ProductExpiryColumn()}
        data={productExpiry?.results?.length ? productExpiry?.results : []}
        onPageChange={handlePageChange}
        onRowChange={handleRowChange}
        loading={isLoading}
        pagination={pagination}
      />
    </Card>
  );
}

export default ProductExpiryTable;
