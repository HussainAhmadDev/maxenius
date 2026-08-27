import { Card, CardContent, Divider, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { BrandData, BrandResponse } from "../../../../Interfaces/brandType";
import DataTable from "../../../../Components/DataTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BrandsColumns } from "../../../../Constants/brandsConst";
interface BrandsTableProps {
  brands?: BrandResponse;
  loading: boolean;
  isTrash?: boolean;
  setAction: Dispatch<
    SetStateAction<{
      type: "view" | "del" | "restore" | null;
      row: BrandData | null;
    }>
  >;
}
const BrandsTable: React.FC<BrandsTableProps> = ({
  brands,
  loading,
  isTrash,
  setAction
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pagination = {
    page: (brands?.page || 1).toString(),
    rowsPerPage: (brands?.count || 100).toString(),
    pages: (brands?.pages || 1).toString(),
    total: (brands?.total || 0).toString()
  };
  const navigate = useNavigate();

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
  const handleEdit = (row: BrandData) => {
    navigate(`/admin/edit-brand/${row?.id}`);
  };
  const handleRestore = (row: BrandData) => {
    setAction({ type: "restore", row });
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" fontWeight={"bold"}>
          {brands?.total} Results{" "}
        </Typography>
      </CardContent>
      <Divider />
      <DataTable
        columns={BrandsColumns({ handleEdit, isTrash, handleRestore })}
        data={brands?.results?.length ? brands?.results : []}
        loading={loading}
        pagination={pagination}
        onRowChange={handleRowChange}
        onPageChange={handlePageChange}
      />
    </Card>
  );
};

export default BrandsTable;
