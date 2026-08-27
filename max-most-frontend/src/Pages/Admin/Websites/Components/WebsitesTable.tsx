import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
// import Button from "@mui/material/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import DataTables from "../../../../Components/DataTable";
// import { DeleteForever } from "@mui/icons-material";
import { Website, WebsiteResponse } from "../../../../Interfaces/webstiteType";
import { WebsiteColumn } from "../../../../Constants/WebsitesConst";

interface WebsiteTableProps {
  websites: WebsiteResponse | undefined;
  isLoading: boolean;
  setAction: Dispatch<
    SetStateAction<{
      type: "del" | "view" | "edit" | "restore" | null;
      row: Website | null;
    }>
  >;
  isTrash?: boolean;
}

function WebsitesTable({ websites, isLoading, setAction, isTrash }: WebsiteTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  // const [selectedRows, setSelectedRow] = useState<Website[]>([]);
  const navigate = useNavigate();
  const pagination = {
    page: (websites?.page || 1).toString(),
    rowsPerPage: (websites?.count || 100).toString(),
    pages: (websites?.pages || 1).toString(),
    total: (websites?.total || 0).toString()
  };

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  // const handleRowSelection = (rows: Website[]) => {
  //   setSelectedRow(rows);
  // };

  const handlePageChange = (p: number) => {
    handleChange("page", `${p}`);
  };

  const handleRowChange = (c: number) => {
    handleChange("count", `${c}`);
  };
  // const handleDelete = (row: Website) => {
  //   setAction({ type: "del", row });
  // };
  const handleEdit = (row: Website) => {
    setAction({ type: "edit", row });
    navigate(`/admin/update-website/${row?.id}`);
  };
  const handleView = (row: Website) => {
    setAction({ type: "view", row });
  };

  const handleRestore = (row: Website) => {
    setAction({ row, type: "restore" });
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
              {websites?.total} Results{" "}
            </Typography>
            {/* <Typography variant="body2" color={"primary.main"} fontWeight={"bold"}>
              ({selectedRows?.length} selected)
            </Typography> */}
          </Stack>
          {/* {!isTrash && (
            <Button
              startIcon={<DeleteForever />}
              color="info"
              size="small"
              variant="outlined"
              disabled={!selectedRows?.length}
            >
              Bulk Delete
            </Button>
          )} */}
        </Stack>
      </CardContent>
      <Divider />
      <DataTables
        columns={WebsiteColumn({
          // handleDelete,
          handleView,
          handleEdit,
          handleRestore,
          isTrash
        })}
        data={websites?.results?.length ? websites?.results : []}
        loading={isLoading}
        pagination={pagination}
        onRowChange={handleRowChange}
        onPageChange={handlePageChange}
        // onRowSelection={handleRowSelection}
        onRowClicked={handleEdit}
        // selectable={!isTrash}
      />
    </Card>
  );
}
export default WebsitesTable;
