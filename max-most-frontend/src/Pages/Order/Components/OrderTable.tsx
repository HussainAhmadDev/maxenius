import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { Dispatch, SetStateAction, useState } from "react";
import { Print } from "@mui/icons-material";
import DataTables from "../../../Components/DataTable";
import { OrderData, OrderResponse } from "../../../Interfaces/Orders";
import { OrdersColumns } from "../../../Constants/Orders";
import LoadingButton from "../../../Components/LoadingButton";
import { externalPDFLinksOrders } from "../../../Utils/PDF";
import { toast } from "react-toastify";

interface UserTableProps {
  orders: OrderResponse | undefined;
  isLoading: boolean;
  isTrash?: boolean;
  setAction: Dispatch<
    SetStateAction<{
      type: "del" | "view" | "edit" | "restore" | null;
      row: OrderData | null;
    }>
  >;
}

function UserTable({ orders, isLoading, setAction, isTrash }: UserTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRows, setSelectedRow] = useState<OrderData[]>([]);
  const [exportMode, setExportMode] = useState<
    "packing-slip" | "invoices" | "view_bulk_prescription_pdf" | null
  >(null);

  const pagination = {
    page: (orders?.page || 1).toString(),
    rowsPerPage: (orders?.count || 100).toString(),
    pages: (orders?.pages || 1).toString(),
    total: (orders?.total || 0).toString()
  };

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
  };

  const handleRowSelection = (rows: OrderData[]) => {
    setSelectedRow(rows);
  };

  const handlePageChange = (p: number) => {
    handleChange("page", `${p}`);
  };

  const handleRowChange = (c: number) => {
    handleChange("count", `${c}`);
  };

  const handleDelete = (row: OrderData) => {
    setAction({ type: "del", row });
  };

  const handleView = (row: OrderData) => {
    setAction({ type: "view", row });
  };
  const handleRestore = (row: OrderData) => {
    setAction({ type: "restore", row });
  };
  const handleResetExportMode = () => setExportMode(null);

  const handleExport = (mode: typeof exportMode) => () => {
    setExportMode(mode);
    if (mode === "invoices") {
      externalPDFLinksOrders(
        "/wp-json/inventory/v1/view_order_pdf?document_type=invoice&order_ids=",
        selectedRows,
        handleResetExportMode
      );
    }
    if (mode === "view_bulk_prescription_pdf") {
      externalPDFLinksOrders(
        "/wp-json/inventory/v1/view_bulk_prescription_pdf?order_ids=",
        selectedRows,
        handleResetExportMode
      );
    } else if (mode === "packing-slip") {
      externalPDFLinksOrders(
        "/wp-json/inventory/v1/view_order_pdf?document_type=packing-slip&order_ids=",
        selectedRows,
        handleResetExportMode
      );
    } else {
      toast.error("Invalid action");
    }
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
              {orders?.total} Results{" "}
            </Typography>
            <Typography variant="body2" color={"primary.main"} fontWeight={"bold"}>
              ({selectedRows?.length} selected)
            </Typography>
          </Stack>

          <Stack direction={"row"} gap={1} alignItems={"center"} justifyContent={"start"}>
            <LoadingButton
              startIcon={<Print />}
              variant="contained"
              size="small"
              disabled={!selectedRows.length || !!exportMode}
              loading={exportMode === "packing-slip"}
              onClick={handleExport("packing-slip")}
            >
              Bulk Packing Slip
            </LoadingButton>

            <LoadingButton
              startIcon={<Print />}
              variant="contained"
              size="small"
              disabled={!selectedRows.length || !!exportMode}
              loading={exportMode === "invoices"}
              onClick={handleExport("invoices")}
            >
              Bulk Invoices
            </LoadingButton>

            <LoadingButton
              startIcon={<Print />}
              variant="contained"
              size="small"
              disabled={!selectedRows.length || !!exportMode}
              loading={exportMode === "view_bulk_prescription_pdf"}
              onClick={handleExport("view_bulk_prescription_pdf")}
            >
              Bulk Prescriptions
            </LoadingButton>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <DataTables
        columns={OrdersColumns({
          handleDelete,
          handleView,
          isTrash,
          handleRestore
        })}
        data={orders?.results?.length ? orders?.results : []}
        loading={isLoading}
        pagination={pagination}
        onRowChange={handleRowChange}
        onPageChange={handlePageChange}
        onRowSelection={handleRowSelection}
        onRowClicked={handleView}
        selectable
      />
    </Card>
  );
}

export default UserTable;
