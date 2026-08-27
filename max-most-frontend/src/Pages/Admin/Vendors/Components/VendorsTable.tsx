import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
// import Button from "@mui/material/Button";
import { useSearchParams } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import DataTables from "../../../../Components/DataTable";
// import { DeleteForever } from "@mui/icons-material";
import { Vendor, VendorResponse } from "../../../../Interfaces/vendorsType";
import { VendorsColumns } from "../../../../Constants/vendors";
import SeeDocumentation from "../../../../Components/SeeDocumentation";

interface VendorTableProps {
  vendors: VendorResponse | undefined;
  isLoading: boolean;
  isTrash?: boolean;
  setAction: Dispatch<
    SetStateAction<{
      type: "del" | "view" | "edit" | "restore" | null;
      row: Vendor | null;
    }>
  >;
}

function VendorTable({ vendors, isLoading, setAction, isTrash }: VendorTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  // const [selectedRows, setSelectedRow] = useState<Vendor[]>([]);

  const pagination = {
    page: (vendors?.page || 1).toString(),
    rowsPerPage: (vendors?.count || 100).toString(),
    pages: (vendors?.pages || 1).toString(),
    total: (vendors?.total || 0).toString()
  };

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  // const handleRowSelection = (rows: Vendor[]) => {
  //   setSelectedRow(rows);
  // };

  const handlePageChange = (p: number) => {
    handleChange("page", `${p}`);
  };

  const handleRowChange = (c: number) => {
    handleChange("count", `${c}`);
  };
  const handleDelete = (row: Vendor) => {
    setAction({ type: "del", row });
  };
  const handleView = (row: Vendor) => {
    setAction({ type: "view", row });
  };
  const handleRestore = (row: Vendor) => {
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
              {vendors?.total} Results{" "}
            </Typography>
            {/* <Typography variant="body2" color={"primary.main"} fontWeight={"bold"}>
              ({selectedRows?.length} selected)
            </Typography> */}
          </Stack>
          <SeeDocumentation fileName={"useVendors"} title={"See Documentation"} />
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
        columns={VendorsColumns({ handleDelete, handleView, handleRestore, isTrash })}
        data={vendors?.results?.length ? vendors?.results : []}
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
export default VendorTable;
