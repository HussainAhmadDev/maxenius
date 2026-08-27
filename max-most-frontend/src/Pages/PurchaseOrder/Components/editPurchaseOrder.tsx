import { Stack } from "@mui/material";
import EditPurchaseOrderForm from "./editPurchaseOrderForm";
import {
  useEditPurchaseOrder,
  usePurchaseOrderRecivingHistory
} from "../../../Hooks/usePurchaseOrder";
import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import EditReceivingModal from "./editReceivingModal";
import ReceivingHistoryTable from "./ReceivingHistoryTable";
import Notes from "./Notes";
import { useDebounce } from "../../../Hooks/useDebounce";

const EditPurchaseOrder = () => {
  const { orderId } = useParams();
  const [params] = useSearchParams();
  const searchParams = useDebounce(params, 700);
  const { data: OrderData, isLoading, refetch } = useEditPurchaseOrder(orderId || "");
  const {
    data: receivings,
    isLoading: receivingsLoading,
    refetch: refetchRecivingHistory
  } = usePurchaseOrderRecivingHistory(OrderData?.id || "", searchParams);
  const [openReciving, setOpenReciving] = useState(false);
  const onOpen = () => setOpenReciving(true);
  const onClose = () => setOpenReciving(false);

  return (
    <>
      <Stack gap={2}>
        <EditPurchaseOrderForm
          onAddReciving={onOpen}
          OrderData={OrderData}
          isLoading={isLoading}
          refetch={refetch}
        />
        <EditReceivingModal
          open={openReciving}
          onClose={() => {
            onClose();
            refetchRecivingHistory();
          }}
          data={OrderData}
          progress={isLoading}
        />
        <ReceivingHistoryTable
          loading={receivingsLoading || isLoading}
          mode="full"
          data={receivings}
          id={OrderData?.id || ""}
          products={OrderData?.products}
          refetch={refetchRecivingHistory}
        />
        <Notes loading={isLoading} />
      </Stack>
    </>
  );
};

export default EditPurchaseOrder;
