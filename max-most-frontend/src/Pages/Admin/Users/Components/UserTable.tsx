import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
// import Button from "@mui/material/Button";
import { useSearchParams } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import DataTables from "../../../../Components/DataTable";
// import { DeleteForever } from "@mui/icons-material";
import { User, UserResponse } from "../../../../Interfaces/usersType";
import { UsersColumns } from "../../../../Constants/users";

interface UserTableProps {
  users: UserResponse | undefined;
  isLoading: boolean;
  setAction: Dispatch<
    SetStateAction<{
      type: "del" | "view" | "edit" | "password-reset" | "restore" | null;
      row: User | null;
    }>
  >;
  isTrash?: boolean;
}

function UserTable({ users, isLoading, setAction, isTrash }: UserTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  // const [selectedRows, setSelectedRow] = useState<User[]>([]);

  const pagination = {
    page: (users?.page || 1).toString(),
    rowsPerPage: (users?.count || 100).toString(),
    pages: (users?.pages || 1).toString(),
    total: (users?.total || 0).toString()
  };

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  // const handleRowSelection = (rows: User[]) => {
  //   setSelectedRow(rows);
  // };

  const handlePageChange = (p: number) => {
    handleChange("page", `${p}`);
  };

  const handleRowChange = (c: number) => {
    handleChange("count", `${c}`);
  };
  const handleDelete = (row: User) => {
    setAction({ type: "del", row });
  };
  const handleView = (row: User) => {
    setAction({ type: "view", row });
  };
  const handleResetPassword = (row: User) => {
    setAction({ type: "password-reset", row });
  };
  const handleRestore = (row: User) => {
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
              {users?.total} Results{" "}
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
        columns={UsersColumns({
          handleDelete,
          handleView,
          handleResetPassword,
          handleRestore,
          isTrash
        })}
        data={users?.results?.length ? users?.results : []}
        loading={isLoading}
        pagination={pagination}
        onRowChange={handleRowChange}
        onPageChange={handlePageChange}
        // onRowSelection={handleRowSelection}
        onRowClicked={handleView}
        // selectable={!isTrash}
      />
    </Card>
  );
}
export default UserTable;
