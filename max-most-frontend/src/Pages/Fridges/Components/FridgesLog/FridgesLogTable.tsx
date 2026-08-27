import { CardContent, Divider, Stack, Card, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import SeeDocumentation from "../../../../Components/SeeDocumentation";

import DataTable from "../../../../Components/DataTable";
import { Dispatch, SetStateAction } from "react";
import { fidgeLogColumns } from "../../../../Constants/fridgesLog";
import { FridgeLogs, FridgeLogsResponse } from "@interfaces/Fridges";
import { User } from "@interfaces/usersType";

interface FridgeLogsTableProps {
  data: FridgeLogsResponse | undefined;
  isLoading: boolean;
  isTrash?: boolean;
  setAction: Dispatch<
    SetStateAction<{
      type: "view" | "del" | "restore" | null;
      row: FridgeLogs | null;
    }>
  >;
  onUpdate: (row: FridgeLogs) => void;
  user: User | null;
}
const FridgesLogTable: React.FC<FridgeLogsTableProps> = ({
  data,
  isLoading,
  setAction,
  isTrash,
  user,
  onUpdate
}: FridgeLogsTableProps) => {
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
  // const handleView = (row: Fridge) => {
  //   onUpdate(row);
  //   setAction({ type: "view", row });
  // };
  const handleDelete = (row: FridgeLogs) => {
    setAction({ type: "del", row });
  };
  const handleRestore = (row: FridgeLogs) => {
    setAction({ type: "restore", row });
  };

  return (
    <>
      <Card>
        <CardContent>
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.total} Results{" "}
            </Typography>
            <SeeDocumentation
              title="See Documentation"
              fileName="useOutOfStockProducts"
            />
          </Stack>
        </CardContent>
        <Divider />
        <DataTable
          columns={fidgeLogColumns({
            handleDelete,
            isTrash,
            handleRestore,
            onUpdate,
            user
          })}
          data={data?.results?.length ? data?.results : []}
          loading={isLoading}
          pagination={pagination}
          onRowChange={handleRowChange}
          onPageChange={handlePageChange}
          // onRowClicked={handleView}
        />
      </Card>
    </>
  );
};

export default FridgesLogTable;
