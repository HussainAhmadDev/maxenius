import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "Hooks/useDebounce";
import PurchaseOrderFilters from "Components/PurchaseOrders/PurchaseOrderFilters";
import PurchaseOrderTable from "Components/PurchaseOrders/PurchaseOrderTable";
import { usePurchaseOrders } from "Hooks/usePurchaseOrders";

const PurchaseOrderTrash: React.FC = () => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);

  const { data: purchaseOrders, isLoading } = usePurchaseOrders(debouncedParams);

  return (
    <div>
      <PurchaseOrderFilters />
      <br />
      <PurchaseOrderTable isLoading={isLoading} purchaseOrders={purchaseOrders} />
    </div>
  );
};

export default PurchaseOrderTrash;
