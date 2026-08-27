import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../Hooks/useDebounce";
import { useState } from "react";
import { Stack } from "@mui/material";
import { usePurchaseOrders } from "../../Hooks/usePurchaseOrder";
import PruchaseOrderFilters from "./Components/PurchaseOrderFilters";
import PurchaseOrderTable from "./Components/PurchaseOrderTable";
import { PurchaseOrderData } from "../../Interfaces/PurchaseOrder";
import DeleteConfirmation from "./Components/DeleteConfirmation";
import PurchaseOrderDrawer from "./Components/PurchaseOrderDrawer";
import RestoreConfirmation from "./Components/restoreConfirmation";

interface PurchaseOrdersProps {
  isTrash?: boolean;
}

const PurchaseOrders: React.FC<PurchaseOrdersProps> = ({ isTrash }) => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const { data: purchaseOrders, isLoading: loading } = usePurchaseOrders(
    debouncedParams,
    isTrash
  );
  const [action, setAction] = useState<{
    type: "view" | "del" | "restore" | null;
    row: PurchaseOrderData | null;
  }>({
    row: null,
    type: null
  });

  const handleClear = () => {
    setAction({ row: null, type: null });
  };

  return (
    <>
      <Stack gap={2}>
        <PruchaseOrderFilters isTrash={isTrash} />
        <PurchaseOrderTable
          isLoading={loading}
          setAction={setAction}
          purchaseOrders={purchaseOrders}
          isTrash={isTrash}
        />
        <DeleteConfirmation
          onClose={handleClear}
          open={action?.type === "del"}
          row={action?.row}
        />

        <PurchaseOrderDrawer
          onClose={handleClear}
          open={action?.type === "view"}
          row={action?.row}
          onDelete={() => setAction({ ...action, type: "del" })}
          isTrash={isTrash}
        />

        <RestoreConfirmation
          onClose={handleClear}
          open={action.type === "restore"}
          row={action?.row}
        />
      </Stack>
    </>
  );
};

export default PurchaseOrders;
