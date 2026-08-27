import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardContent, Divider, Stack, Card, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import DataTable from "../../../../../Components/DataTable";
import { MetaFieldDetail, MetaFieldListResponse } from "@interfaces/metaFieldTypes";
import { MetaFieldLogColumns } from "./MetaFieldLogColumns";

interface MetaFieldTableProps {
  data: MetaFieldListResponse | undefined;
  isLoading: boolean;
  setAction: Dispatch<
    SetStateAction<{
      type: "view" | "del" | "restore" | null;
      row: MetaFieldDetail | null;
    }>
  >;
}
const MetaFieldTable: React.FC<MetaFieldTableProps> = ({
  data,
  isLoading,
  setAction
}: MetaFieldTableProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRows, setSelectedRows] = useState<MetaFieldDetail[]>([]);
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

  console.log("data: ", data);
  // !!
  const handleSelctedChange = (rows: MetaFieldDetail[]) => {
    setSelectedRows(rows);
  };
  const handlePageChange = (p: number) => {
    console.log("Page Change: ", p);
    handleChange("page", `${p}`);
  };
  const handleRowChange = (c: number) => {
    console.log("Row count: ", c);
    handleChange("count", `${c}`);
  };
  const handleDelete = (row: MetaFieldDetail) => {
    setAction({ type: "del", row });
  };

  const handleView = (row: MetaFieldDetail) => {
    setAction({ type: "view", row });
    if (row?.id) {
      navigate(`/admin/meta-fields/products/edit/${row?.id}`);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Stack direction="row" gap={1} alignItems="center" justifyContent="start">
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.total} Results
            </Typography>
            <Typography variant="body2" color={"primary.main"} fontWeight={"bold"}>
              ({selectedRows?.length} selected)
            </Typography>
          </Stack>
        </CardContent>
        <Divider />
        <DataTable
          columns={MetaFieldLogColumns({ handleDelete })}
          data={data?.results?.length ? data?.results : []}
          loading={isLoading}
          pagination={pagination}
          onRowChange={handleRowChange}
          onPageChange={handlePageChange}
          onRowSelection={handleSelctedChange}
          onRowClicked={handleView}
          selectable
        />
      </Card>
    </>
  );
};

export default MetaFieldTable;
