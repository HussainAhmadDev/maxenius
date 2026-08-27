import * as React from "react";
import OrdersFilters from "./OrdersFilters";
import OrderTable from "Components/Orders/OrderTable";
import { useOrders } from "Hooks/useOrders";
import { useDebounce } from "Hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

const CustomersOrders: React.FC<{ customerNumber?: string }> = ({ customerNumber }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const { data: orders, isLoading } = useOrders(debouncedParams);

  React.useEffect(() => {
    if (customerNumber) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("company__number", customerNumber);
      setSearchParams(newParams);
    }
  }, [customerNumber, searchParams, setSearchParams]);

  return (
    <div>
      <OrdersFilters />
      <OrderTable isLoading={isLoading} orders={orders} />
    </div>
  );
};

export default CustomersOrders;
