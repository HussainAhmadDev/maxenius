import { CardContent, Divider, Stack, Card, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import SeeDocumentation from "../../../../Components/SeeDocumentation";
import { Fridge, FridgeResponse } from "@interfaces/Fridges";
import { fidgeListColumns } from "../../../../Constants/fridgesList";
import DataTable from "../../../../Components/DataTable";
import { Dispatch, SetStateAction } from "react";

interface FridgeListTableProps {
  data: FridgeResponse | undefined;
  isLoading: boolean;
  isTrash?: boolean;
  setAction: Dispatch<
    SetStateAction<{
      type: "view" | "del" | "restore" | null;
      row: Fridge | null;
    }>
  >;
  onUpdate: (row: Fridge) => void;
}
const FridgesListTable: React.FC<FridgeListTableProps> = ({
  data,
  isLoading,
  setAction,
  isTrash,
  onUpdate
}: FridgeListTableProps) => {
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
  const handleDelete = (row: Fridge) => {
    setAction({ type: "del", row });
  };
  const handleRestore = (row: Fridge) => {
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
          columns={fidgeListColumns({ handleDelete, isTrash, handleRestore, onUpdate })}
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

export default FridgesListTable;
