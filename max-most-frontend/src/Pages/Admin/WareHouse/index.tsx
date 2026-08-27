import { Stack } from "@mui/material";
import WareHouseTable from "./Components/WareHouseTable";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../Hooks/useDebounce";
import WarehouseFilters from "./Components/WarehouseFilters";
import { useWarehouses } from "../../../Hooks/useWarehouses";
import { useState } from "react";
import { Warehouse as WarehouseData } from "../../../Interfaces/warehouseType";
import DeleteConfirmation from "./Components/DeleteConfirmation";
import WareHouseDrawer from "./Components/WareHouseDrawer";
import RestoreConfirmation from "./Components/restoreConfirmation";

const Warehouse: React.FC<{ isTrash?: boolean }> = ({ isTrash }) => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const {
    data: warehouses,
    isLoading,
    refetch
  } = useWarehouses(debouncedParams, isTrash);
  const [action, setAction] = useState<{
    type: "del" | "view" | "edit" | "restore" | null;
    row: WarehouseData | null;
  }>({ row: null, type: null });

  const handleClear = () => {
    setAction({ row: null, type: null });
  };
  return (
    <Stack gap={2}>
      <WarehouseFilters isTrash={isTrash} />
      <WareHouseTable
        isLoading={isLoading}
        warehouses={warehouses}
        setAction={setAction}
        isTrash={isTrash}
      />
      <DeleteConfirmation
        onClose={() => {
          refetch();
          handleClear();
        }}
        open={action.type === "del"}
        row={action.row!}
      />
      <RestoreConfirmation
        onClose={() => {
          refetch();
          handleClear();
        }}
        open={action.type === "restore"}
        row={action.row!}
      />
      <WareHouseDrawer
        onClose={handleClear}
        open={action.type === "view"}
        row={action.row!}
        onDelete={() => setAction({ ...action, type: "del" })}
        isTrash={isTrash}
      />
    </Stack>
  );
};
export default Warehouse;
