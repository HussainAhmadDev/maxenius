import * as React from "react";
import { useSearchParams } from "react-router-dom";
import OrderFilters from "../Orders/OrderFilters";
import OrderTable from "../Orders/OrderTable";

import { useOrders } from "Hooks/useOrders";
import { useDebounce } from "Hooks/useDebounce";

const OrdersTrash: React.FC = () => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const { data: orders, isLoading } = useOrders(debouncedParams);

  return (
    <div>
      <OrderFilters />
      <br />
      <OrderTable isLoading={isLoading} orders={orders} />
    </div>
  );
};

export default OrdersTrash;
