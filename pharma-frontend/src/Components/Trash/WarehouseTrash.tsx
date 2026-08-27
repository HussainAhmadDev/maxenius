import * as React from "react";
import WarehousesTable from "Components/Admin/Warehouse/WarehouseTable";
import WarehouseFilters from "Components/Admin/Warehouse/WarehouseFilters";
import { useDebounce } from "Hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useWarehouses } from "Hooks/useWarehouses";

const WarehouseTrash: React.FC = () => {
  const [searchParams] = useSearchParams();

  const debouncedParams = useDebounce(searchParams, 800);

  const { data: warehouses, isLoading } = useWarehouses(debouncedParams);
  return (
    <div>
      <WarehouseFilters />

      <br />
      <WarehousesTable isLoading={isLoading} warehouses={warehouses} />
    </div>
  );
};
export default WarehouseTrash;
