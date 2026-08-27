import DataTables from "../../../Components/DataTable";
import { ProductTransactionColumn } from "../../../Constants/ProductTransactionConst";
import { ProductTransactionResponse } from "../../../Interfaces/productTransactionType";
import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

interface IOrderProps {
  productTransaction: ProductTransactionResponse | undefined;
  isLoading: boolean;
}
function ProductTransactionTable({ productTransaction, isLoading }: IOrderProps) {
  const pagination = {
    page: (productTransaction?.page || 1).toString(),
    rowsPerPage: (productTransaction?.count || 100).toString(),
    pages: (productTransaction?.pages || 1).toString(),
    total: (productTransaction?.total || 0).toString()
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
              {productTransaction?.total} Results{" "}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <DataTables
        columns={ProductTransactionColumn()}
        data={productTransaction?.results?.length ? productTransaction?.results : []}
        onPageChange={handlePageChange}
        onRowChange={handleRowChange}
        loading={isLoading}
        pagination={pagination}
      />
    </Card>
  );
}

export default ProductTransactionTable;
