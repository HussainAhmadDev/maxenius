import { CardContent } from "@mui/material";
import React from "react";
import DataTable from "../../../Components/DataTable";
import { OrderPaymentHistoryColumns } from "../../../Constants/Orders";
import { PaymentData } from "../../../Interfaces/Orders";

interface OrderPaymentHistoryProps {
  data?: PaymentData[];
  loading: boolean;
  mode?: "full";
}

const OrderPaymentHistory: React.FC<OrderPaymentHistoryProps> = ({
  data,
  loading,
  mode
}) => {
  return (
    <CardContent>
      <DataTable
        columns={OrderPaymentHistoryColumns()}
        data={data || []}
        loading={loading}
        dense={mode !== "full"}
      />
    </CardContent>
  );
};

export default OrderPaymentHistory;
