import { Card, CardContent, CardHeader, Divider } from "@mui/material";
import DataTable from "../../../Components/DataTable";
import { PurchaseOrderProductsColumns } from "../../../Constants/PurchaseOrders";
import { PurchaseOrderProductForm } from "../../../Interfaces/PurchaseOrder";
import React from "react";
interface PurchaseOrderProductsTableProps {
  data: PurchaseOrderProductForm[];
  onDelete?(row: PurchaseOrderProductForm): void;
  onEdit?(row: PurchaseOrderProductForm): void;
  onBarcode?(row: PurchaseOrderProductForm): void;
  onUpdate?(): void;
  editValues?: PurchaseOrderProductForm | null;
  loading?: boolean;
  barcodeLoadingId?: string;
}
const PurchaseOrderProductsTable: React.FC<PurchaseOrderProductsTableProps> = ({
  data,
  editValues,
  onDelete,
  onEdit,
  onUpdate,
  loading = false,
  barcodeLoadingId,
  onBarcode
}) => {
  return (
    <Card>
      <CardHeader
        title="Products"
        titleTypographyProps={{
          fontWeight: "bold",
          fontSize: 20
        }}
      />
      <Divider />
      <CardContent>
        <DataTable
          columns={PurchaseOrderProductsColumns({
            handleDelete: onDelete,
            handleEdit: onEdit,
            values: editValues,
            handleDone: onUpdate,
            barcodeLoadingId,
            handleBarcode: onBarcode
          })}
          data={data}
          loading={loading}
          alloweActionColumnTo={["static"]}
          dense
        />
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderProductsTable;
