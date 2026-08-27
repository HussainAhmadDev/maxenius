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
import { RecieveHistoryColumns } from "../../../Constants/PurchaseOrders";
import {
  EditPurchaseOrderProduct,
  ReceivingHistoryData,
  ReceivingHistorySchema
} from "../../../Interfaces/PurchaseOrder";
import { toast } from "react-toastify";
import { useUpdateReceiving } from "../../../Hooks/usePurchaseOrder";
import { useSearchParams } from "react-router-dom";
import SeeDocumentation from "../../../Components/SeeDocumentation";

interface ReceivingHistoryTableProps {
  mode: "view" | "full";
  id?: string;
  data?: ReceivingHistorySchema;
  loading: boolean;
  products?: EditPurchaseOrderProduct[];
  refetch?(): void;
}

const ReceivingHistoryTable: React.FC<ReceivingHistoryTableProps> = ({
  mode = "full",
  data,
  loading,
  products,
  refetch
}) => {
  const [values, setValues] = useState<ReceivingHistoryData | null>(null);
  const { mutateAsync, isLoading } = useUpdateReceiving();
  const [searchParams, setSearchParams] = useSearchParams();
  const pagination = {
    page: (data?.page || 1).toString(),
    rowsPerPage: (data?.count || 100).toString(),
    pages: (data?.pages || 1).toString(),
    total: (data?.total || 0).toString()
  };

  const handleEdit = (row: ReceivingHistoryData) => {
    setValues(row);
  };
  const handleDone = () => {
    if (!products?.length || !values) {
      return;
    }
    const receiveable = checkReceived(
      values.product_id,
      values.received_quantity,
      values,
      products
    );
    if (receiveable) {
      mutateAsync({
        id: values.id,
        purchase_order_id: values.purchase_order_id,
        product_id: values.product_id,
        sku: values.sku,
        is_fully_received: true,
        batch_number: values.batch_number,
        expiry_date: values.expiry_date,
        invoice_number: values.invoice_number,
        received_quantity: values.received_quantity
      }).then(() => {
        refetch && refetch();
        setValues(null);
      });
    } else {
      toast.error("Receiving can not be exceed from Total Quantity..!");
    }
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
  return (
    <>
      <StyledCard mode={mode}>
        {mode === "full" ? (
          <CardHeader
            title="Receiving History"
            titleTypographyProps={{
              fontWeight: "bold",
              fontSize: 20
            }}
          />
        ) : (
          <Typography fontSize={18} fontWeight={"bold"} mb={1}>
            Receiving History :
          </Typography>
        )}

        <Divider />
        <CardContent>
          <SeeDocumentation
            fileName={"usePurchaseOrderRecivingHistory"}
            title={"See Receiving History Documentation"}
          />
          <DataTable
            columns={
              mode === "view"
                ? RecieveHistoryColumns({})?.slice(0, -1)
                : RecieveHistoryColumns(
                    mode === "full"
                      ? {
                          handleEdit,
                          handleDone,
                          loading: isLoading,
                          values
                        }
                      : {}
                  )
            }
            data={data?.results || []}
            loading={loading}
            dense={mode === "view"}
            pagination={mode === "full" ? pagination : undefined}
            onPageChange={handlePageChange}
            onRowChange={handleRowChange}
          />
        </CardContent>
      </StyledCard>
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

const checkReceived = (
  id: string,
  rowQuanity: number,
  values: ReceivingHistoryData,
  products: EditPurchaseOrderProduct[]
) => {
  let totalQty = 0;

  let sumReceived = Number(values?.received_quantity);
  let foundMatchingProducts = false;

  for (const product of products) {
    if (id === product.product.value) {
      totalQty = product.quantity;
      sumReceived += product.received;
      foundMatchingProducts = true;
    }
  }

  sumReceived = sumReceived - rowQuanity;

  const isDisabled = foundMatchingProducts ? sumReceived <= totalQty : false;

  return isDisabled;
};
export default ReceivingHistoryTable;
