import { Stack } from "@mui/material";
import EditHead from "./EditHead";
import Actions from "./Actions";
// import EditNotes from "./EditNotes";
import { useParams } from "react-router-dom";
import { useOrder, useUpdateOrderProductCostPrice } from "../../../Hooks/useOrders";
import CustomerInfo from "./CustomerInfo";
import OrderProductsTable from "./OrderProductsTable";
import Notes from "./Notes";
import OrderSummary from "./OrderSummary";
import OrderShipmentHistory from "./OrderShipmentHistory";
import OrderPaymentHistory from "./OrderPaymentHistory";
import OrderReturnHistory from "./OrderReturnHistory";
import Tabs from "../../../Components/Tabs";

function EditOrder() {
  const { orderId } = useParams();

  const { data: order, isLoading, refetch } = useOrder(orderId);
  const { mutateAsync: updateOrderCostPrice, isLoading: updateCostPriceLoading } =
    useUpdateOrderProductCostPrice();
  return (
    <Stack gap={2} width={"100%"}>
      <EditHead order={order} loading={isLoading} isTrash={order?.is_trash} />
      <Actions order={order} loading={isLoading} refetch={refetch} />
      <CustomerInfo order={order} loading={isLoading} />
      <OrderProductsTable
        mode="full"
        order={order}
        refetch={refetch}
        products={order?.products}
        loading={updateCostPriceLoading}
        updateOrderCostPrice={updateOrderCostPrice}
      />
      <Notes order={order} loading={isLoading} />
      <OrderSummary loading={isLoading} mode="full" order={order} />
      <Tabs
        list={[
          {
            title: "Shipment History",
            comp: (
              <OrderShipmentHistory
                loading={isLoading}
                data={order?.products}
                order={order}
                mode="full"
              />
            )
          },
          {
            title: "Payment History",

            comp: (
              <OrderPaymentHistory
                loading={isLoading}
                data={order?.payments}
                mode="full"
              />
            )
          },
          {
            title: "Return History",
            id: "cy__EditReturnHistory",
            comp: (
              <OrderReturnHistory
                loading={isLoading}
                data={order?.products}
                order={order}
                mode="full"
              />
            )
          }
        ]}
      />
    </Stack>
  );
}

export default EditOrder;
