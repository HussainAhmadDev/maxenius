import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { Print } from "@mui/icons-material";
import { ProductData, ProductsResponse } from "../../../Interfaces/Products";
import DataTable from "../../../Components/DataTable";
import { Dispatch, SetStateAction, useState } from "react";
import { ProductsColumns } from "../../../Constants/productConst";
import { useGenerateBarcodeBySKU } from "../../../Hooks/useProducts";
import LoadingButton from "../../../Components/LoadingButton";
import SeeDocumentation from "../../../Components/SeeDocumentation";

interface ProductTableProps {
  products: ProductsResponse | undefined;
  isLoading: boolean;
  isTrash?: boolean;
  setAction: Dispatch<
    SetStateAction<{ type: "view" | "del" | "restore" | null; row: ProductData | null }>
  >;
}

function ProductTable({ products, isLoading, setAction, isTrash }: ProductTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRows, setSelectedRows] = useState<ProductData[]>([]);
  const pagination = {
    page: (products?.page || 1).toString(),
    rowsPerPage: (products?.count || 100).toString(),
    pages: (products?.pages || 1).toString(),
    total: (products?.total || 0).toString()
  };
  const { mutateAsync, isLoading: barcodesLoading } = useGenerateBarcodeBySKU();
  const handleGenerateBarcodes = () => {
    mutateAsync({ data: selectedRows.map(el => el.sku) });
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
  const handleDelete = (row: ProductData) => {
    setAction({ type: "del", row });
  };
  const handleView = (row: ProductData) => {
    setAction({ type: "view", row });
  };
  const handleSelctedChange = (rows: ProductData[]) => {
    setSelectedRows(rows);
  };
  const handleRestore = (row: ProductData) => {
    setAction({ type: "restore", row });
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
              {products?.total} Results{" "}
            </Typography>
            <Typography variant="body2" color={"primary.main"} fontWeight={"bold"}>
              ({selectedRows?.length} selected)
            </Typography>
          </Stack>

          <SeeDocumentation
            title="Product Listing API Documentation"
            fileName={"useProducts"}
          />

          <LoadingButton
            startIcon={<Print />}
            color="info"
            size="small"
            variant="outlined"
            disabled={!selectedRows?.length}
            onClick={handleGenerateBarcodes}
            loading={barcodesLoading}
          >
            Generate Barcodes
          </LoadingButton>
        </Stack>
      </CardContent>
      <Divider />
      <DataTable
        columns={ProductsColumns({ handleDelete, isTrash, handleRestore })}
        data={products?.results?.length ? products?.results : []}
        loading={isLoading}
        pagination={pagination}
        onRowChange={handleRowChange}
        onPageChange={handlePageChange}
        onRowSelection={handleSelctedChange}
        onRowClicked={handleView}
        selectable
      />
    </Card>
  );
}
export default ProductTable;
