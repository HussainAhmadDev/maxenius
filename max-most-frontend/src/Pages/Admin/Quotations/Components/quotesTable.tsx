import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";

import { useNavigate, useSearchParams } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import DataTable from "../../../../Components/DataTable";
import { QuoteData, QuotesResponse } from "../../../../Interfaces/quotatonsTypes";
import { QuotesColumns } from "../../../../Constants/quotesConst";

interface QuotesTableProps {
  quotes: QuotesResponse | undefined;
  isLoading: boolean;
  isTrash?: boolean;
  setAction: Dispatch<
    SetStateAction<{
      type: "del" | "restore" | null;
      row: QuoteData | null;
    }>
  >;
}

function QuotesTable({ quotes, isLoading, isTrash, setAction }: QuotesTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const pagination = {
    page: (quotes?.page || 1).toString(),
    rowsPerPage: (quotes?.count || 100).toString(),
    pages: (quotes?.pages || 1).toString(),
    total: (quotes?.total || 0).toString()
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
  const handleDelete = (row: QuoteData) => {
    setAction({ type: "del", row });
  };
  const handleEdit = (row: QuoteData) => {
    navigate(`/admin/edit-quote/${row.id}`);
  };
  const handleRestore = (row: QuoteData) => {
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
              {quotes?.total} Results{" "}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <DataTable
        columns={QuotesColumns({
          handleDelete,
          handleEdit,
          isTrash,
          handleRestore
        })}
        data={quotes?.results?.length ? quotes?.results : []}
        loading={isLoading}
        pagination={pagination}
        onRowChange={handleRowChange}
        onPageChange={handlePageChange}
        onRowClicked={handleEdit}
      />
    </Card>
  );
}
export default QuotesTable;
