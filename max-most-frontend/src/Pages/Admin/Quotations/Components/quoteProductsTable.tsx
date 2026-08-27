import { Card, CardContent, CardHeader, Divider } from "@mui/material";
import DataTable from "../../../../Components/DataTable";
import React from "react";
import { QuoteProductColumns } from "../../../../Constants/quotesConst";
import { QuoteFormProduct } from "../../../../Interfaces/quotatonsTypes";
interface QuoteProductsTableProps {
  data: QuoteFormProduct[];
  onDelete?(row: QuoteFormProduct): void;
  onEdit?(row: QuoteFormProduct): void;
  onUpdate?(): void;
  editValues?: QuoteFormProduct | null;
  loading?: boolean;
  updateLoading?: boolean;
  deleteLoading?: boolean;
  noAction?: boolean;
}
const QuoteProductsTable: React.FC<QuoteProductsTableProps> = ({
  data,
  editValues,
  onDelete,
  onEdit,
  onUpdate,
  loading = false,
  updateLoading = false,
  deleteLoading = false,
  noAction = false
}) => {
  const props = {
    handleDelete: onDelete,
    handleEdit: onEdit,
    values: editValues,
    handleDone: onUpdate,
    deleteLoading,
    updateLoading
  };
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
          columns={
            noAction
              ? QuoteProductColumns(props)?.slice(0, -1)
              : QuoteProductColumns(props)
          }
          data={data}
          loading={loading}
          alloweActionColumnTo={["static"]}
          dense
        />
      </CardContent>
    </Card>
  );
};

export default QuoteProductsTable;
