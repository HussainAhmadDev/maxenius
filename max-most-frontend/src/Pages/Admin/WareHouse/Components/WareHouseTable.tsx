import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
// import Button from "@mui/material/Button";
import { useSearchParams } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import DataTables from "../../../../Components/DataTable";
// import { DeleteForever } from "@mui/icons-material";
import { Warehouse, WarehouseResponse } from "../../../../Interfaces/warehouseType";
import { WarehousesColumns } from "../../../../Constants/warehouses";

interface IWarehousesProps {
  warehouses: WarehouseResponse | undefined;
  isLoading: boolean;
  setAction: Dispatch<
    SetStateAction<{
      type: "del" | "view" | "edit" | "restore" | null;
      row: Warehouse | null;
    }>
  >;
  isTrash?: boolean;
}

function WareHouseTable({ warehouses, isLoading, setAction, isTrash }: IWarehousesProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  // const [selectedRows, setSelectedRow] = useState<Warehouse[]>([]);

  const pagination = {
    page: (warehouses?.page || 1).toString(),
    rowsPerPage: (warehouses?.count || 100).toString(),
    pages: (warehouses?.pages || 1).toString(),
    total: (warehouses?.total || 0).toString()
  };

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  // const handleRowSelection = (rows: Warehouse[]) => {
  //   setSelectedRow(rows);
  // };

  const handlePageChange = (p: number) => {
    handleChange("page", `${p}`);
  };

  const handleRowChange = (c: number) => {
    handleChange("count", `${c}`);
  };
  const handleDelete = (row: Warehouse) => {
    setAction({ type: "del", row });
  };
  const handleView = (row: Warehouse) => {
    setAction({ type: "view", row });
  };
  const handleRestore = (row: Warehouse) => {
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
              {warehouses?.total} Results{" "}
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
        columns={WarehousesColumns({ handleDelete, handleView, handleRestore, isTrash })}
        data={warehouses?.results?.length ? warehouses?.results : []}
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
export default WareHouseTable;
