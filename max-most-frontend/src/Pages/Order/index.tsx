import OrderFilter from "./Components/OrderFilter";
import OrderTable from "./Components/OrderTable";
import { useSearchParams } from "react-router-dom";
import { useOrders } from "../../Hooks/useOrders";
import { useDebounce } from "../../Hooks/useDebounce";
import React, { useState } from "react";
import { OrderData } from "../../Interfaces/Orders";
import { Stack } from "@mui/material";
import DeleteConfirmation from "./Components/DeleteConfirmation";
import OrderDrawer from "./Components/OrderDrawer";
import RestoreConfirmation from "./Components/restoreConfirmation";
// import { DetailProvider } from "./context/DetailContext";
// import { LabelProvider } from "./context/LabelContext";
// import { ToastContainer } from "react-toastify";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { DndProvider } from "react-dnd";
// import { DashboardPage } from "./trelloBoard";
// import OrderFilter from "./Components/OrderFilter";
// import SeeDocumentation from "../../Components/SeeDocumentation";

export interface CustomEventType {
  value: string;
  label: string;
}

const Orders: React.FC<{ isTrash?: boolean }> = ({ isTrash = false }) => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const { data: orders, isLoading } = useOrders(debouncedParams, isTrash);
  const [action, setAction] = useState<{
    type: "edit" | "view" | "del" | "restore" | null;
    row: OrderData | null;
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
        {/* <OrderFilter isTrash={isTrash} /> */}
        {/* <SeeDocumentation fileName={"useOrders"} title={"See Order Card Documentation"} />

        <DetailProvider>
          <LabelProvider>
            <DndProvider backend={HTML5Backend}>
              <DashboardPage />
              <ToastContainer />
            </DndProvider>
          </LabelProvider>
        </DetailProvider> */}
        <OrderFilter isTrash={isTrash} />
        <OrderTable
          isLoading={isLoading}
          orders={orders}
          setAction={setAction}
          isTrash={isTrash}
        />
        <DeleteConfirmation
          onClose={handleClear}
          open={action.type === "del"}
          row={action?.row}
        />

        <OrderDrawer
          onClose={handleClear}
          open={action.type === "view"}
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

export default Orders;
