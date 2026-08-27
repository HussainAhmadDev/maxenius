import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import DataTables from "../../../Components/DataTable";
import { ProductsActivityLogConst } from "../../../Constants/ProductsActivityLogConst";
import {
  ProductActiveLogResponse,
  ProductDetails,
  ProductRequest
} from "@interfaces/productActiveLogType";

interface UserTableProps {
  data: ProductActiveLogResponse | undefined;
  isLoading: boolean;
  setAction: React.Dispatch<
    React.SetStateAction<{
      type: "del" | "view" | "edit" | "payload-send" | "response-send" | "restore" | null;
      row: ProductRequest | ProductActiveLogResponse | ProductDetails | null;
    }>
  >;
  isTrash?: boolean;
}

function ProductsActivityLogTable({ data, isLoading, setAction }: UserTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
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

  const handleView = (row: ProductDetails) => {
    setAction({ type: "view", row });
  };
  const HandleSendPayload = (row: ProductDetails) => {
    setAction({ type: "payload-send", row });
  };

  const HandleSendResponse = (row: ProductDetails) => {
    setAction({ type: "response-send", row });
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
              {data?.total} Results{" "}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <DataTables
        columns={ProductsActivityLogConst({
          HandleSendPayload,
          HandleSendResponse
        })}
        data={data?.results?.length ? data?.results : []}
        loading={isLoading}
        pagination={pagination}
        onRowChange={handleRowChange}
        onPageChange={handlePageChange}
        onRowClicked={handleView}
      />
    </Card>
  );
}
export default ProductsActivityLogTable;
