import {
  Card,
  CardContent,
  CardHeader,
  CardOwnProps,
  Divider,
  Typography,
  styled
} from "@mui/material";
import React, { useState } from "react";
import DataTable from "../../../Components/DataTable";
import { OrderProductsColumns } from "../../../Constants/Orders";
import { OrderData, OrderProduct } from "../../../Interfaces/Orders";
import UpdateDirectionModal from "./UpdateDirectionModal";
import PatientHistoryModal from "./PatientHistoryModal";
import BatchExpiryModal from "./BatchExpiryModal";
import { UseMutateAsyncFunction } from "react-query";

interface OrderProductsTableProps {
  mode: "view" | "full";
  products?: OrderProduct[];
  loading: boolean;
  order?: OrderData;
  refetch(): void;
  updateOrderCostPrice: UseMutateAsyncFunction<
    void,
    Error,
    Partial<OrderProduct>,
    unknown
  >;
}

const OrderProductsTable: React.FC<OrderProductsTableProps> = ({
  mode = "full",
  products,
  loading,
  order,
  updateOrderCostPrice,
  refetch
}) => {
  const [action, setAction] = useState<{
    type: "direction" | "patient-history" | "batch-expiry" | null;
    row: OrderProduct | null;
  }>({ row: null, type: null });
  const handleClear = () => setAction({ row: null, type: null });
  const handleDirections = (row: OrderProduct) => {
    setAction({ row: row, type: "direction" });
  };
  const handlePatientHistory = (row: OrderProduct) => {
    setAction({ row: row, type: "patient-history" });
  };
  const handleBatchExpiry = (row: OrderProduct) => {
    setAction({ row: row, type: "batch-expiry" });
  };

  // const [editedValues, setEditedValues] = useState<OrderProduct | null>(null);
  const [editedVat, setEditedVat] = useState<OrderProduct | null>(null);
  const [subTotalTax, setSubTotalTax] = useState<number>(0);

  const handleEdit = (val1: OrderProduct | null) => {
    // setEditedValues(val1);
    setEditedVat(val1);
  };
  const handleDone = () => {
    // if (editedValues && order?.products?.length) {
    if (editedVat && subTotalTax && order?.products?.length) {
      updateOrderCostPrice({
        // cost_price: editedValues?.cost_price,
        order_id: editedVat?.id,
        ordered_product_id: editedVat?.order_id,
        vat_percent: editedVat?.vat_percent,
        sub_total_tax: subTotalTax
      }).then(() => {
        refetch();
        // setEditedValues(null);
        setEditedVat(null);
        setSubTotalTax(0);
      });
    }
  };

  const actions = {
    ...(mode === "full" && {
      handleDirections,
      handlePatientHistory,
      handleBatchExpiry,
      handleDone,
      handleEdit,
      // values: editedValues,
      vat: editedVat,
      setSubTotalTax
    })
  };

  return (
    <>
      <StyledCard mode={mode}>
        {mode === "full" ? (
          <CardHeader
            title="Products"
            titleTypographyProps={{
              fontWeight: "bold",
              fontSize: 20
            }}
          />
        ) : (
          <Typography fontSize={18} fontWeight={"bold"} mb={1}>
            Products :
          </Typography>
        )}
        <Divider />
        <CardContent>
          <DataTable
            columns={OrderProductsColumns(actions)}
            data={products || []}
            loading={loading}
            dense={mode === "view"}
          />
        </CardContent>
      </StyledCard>
      <UpdateDirectionModal
        data={action.row}
        onClose={handleClear}
        open={action.type === "direction"}
      />
      <PatientHistoryModal
        data={action.row}
        onClose={handleClear}
        open={action.type === "patient-history"}
        order={order}
      />
      <BatchExpiryModal
        data={action.row}
        onClose={handleClear}
        open={action.type === "batch-expiry"}
        order={order}
      />
    </>
  );
};

interface StyledCard extends CardOwnProps {
  mode: "view" | "full";
}
const StyledCard = styled(Card)((props: StyledCard) => {
  const { mode } = props;
  const styles: {
    boxShadow?: string;
    borderRadius?: string;
    ".MuiCardContent-root"?: {
      paddingLeft: number;
      paddingRight: number;
    };
  } = {};
  if (mode === "view") {
    styles.borderRadius = "0";
    styles.boxShadow = "unset";
    styles[".MuiCardContent-root"] = {
      paddingLeft: 0,
      paddingRight: 0
    };
  }
  return styles;
});
export default OrderProductsTable;
