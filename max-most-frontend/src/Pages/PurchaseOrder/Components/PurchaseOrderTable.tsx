import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";

import { useSearchParams } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

import {
  PurchaseOrderData,
  PurchaseOrderResponse
} from "../../../Interfaces/PurchaseOrder";
import { PurchaseOrderColumns } from "../../../Constants/PurchaseOrders";
import DataTable from "../../../Components/DataTable";
import SeeDocumentation from "../../../Components/SeeDocumentation";

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrderResponse | undefined;
  isLoading: boolean;
  isTrash?: boolean;
  setAction: Dispatch<
    SetStateAction<{
      type: "view" | "del" | "restore" | null;
      row: PurchaseOrderData | null;
    }>
  >;
}

function PurchaseOrderTable({
  purchaseOrders,
  isLoading,
  isTrash,
  setAction
}: PurchaseOrderTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  // const [selectedRows, setSelectedRow] = useState<PurchaseOrderData[]>([]);

  const pagination = {
    page: (purchaseOrders?.page || 1).toString(),
    rowsPerPage: (purchaseOrders?.count || 100).toString(),
    pages: (purchaseOrders?.pages || 1).toString(),
    total: (purchaseOrders?.total || 0).toString()
  };

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  // const handleRowSelection = (rows: PurchaseOrderData[]) => {
  //   setSelectedRow(rows);
  // };

  const handlePageChange = (p: number) => {
    handleChange("page", `${p}`);
  };

  const handleRowChange = (c: number) => {
    handleChange("count", `${c}`);
  };
  const handleDelete = (row: PurchaseOrderData) => {
    setAction({ type: "del", row });
  };
  const handleView = (row: PurchaseOrderData) => {
    setAction({ type: "view", row });
  };
  const handleRestore = (row: PurchaseOrderData) => {
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
              {purchaseOrders?.total} Results{" "}
            </Typography>
          </Stack>
          <SeeDocumentation
            title="Purchase Order Listing API Documentation"
            fileName={"usePurchaseOrders"}
          />
        </Stack>
      </CardContent>
      <Divider />
      <DataTable
        columns={PurchaseOrderColumns({
          handleDelete,
          handleView,
          isTrash,
          handleRestore
        })}
        data={purchaseOrders?.results?.length ? purchaseOrders?.results : []}
        loading={isLoading}
        pagination={pagination}
        onRowChange={handleRowChange}
        onPageChange={handlePageChange}
        // onRowSelection={handleRowSelection}
        onRowClicked={handleView}
      />
    </Card>
  );
}
export default PurchaseOrderTable;
