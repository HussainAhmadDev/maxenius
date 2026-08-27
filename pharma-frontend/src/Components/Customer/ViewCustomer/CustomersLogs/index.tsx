import * as React from "react";
import OrdersFilters from "./OrdersFilters";
import CustomerOrderTable from "./CustomerOrderTable";

const CustomersOrders: React.FC = () => {
  return (
    <div>
      <OrdersFilters />
      <CustomerOrderTable />
    </div>
  );
};

export default CustomersOrders;
