import { useSearchParams } from "react-router-dom";
// import FridgesListTable from "./FridgesListTable";
import { useDebounce } from "../../../../Hooks/useDebounce";
import { getBrandId } from "../../../../Hooks/api";
import { useState } from "react";
import { FridgeLogs, FridgeLogCreate } from "@interfaces/Fridges";
// import DeleteConfirmationFridge from "./DeleteConfirmationFridge";
// import RestoreConfirmationFridge from "./RestoreConfirmationFridge";
// import FridgeFilter from "./FridgeFilter";

import { Button } from "@mui/material";
import PageTitle from "../../../../Components/PageTitle";
import { useReportFridgeLog, useFridgesLog } from "../../../../Hooks/useFridgesLog";
import { useFridgesList } from "../../../../Hooks/useFridgesList";
import FridgesLogTable from "./FridgesLogTable";
import DeleteConfirmationFridgeLog from "./DeleteConfirmationFridgeLog";
import FridgeLogDrawer from "./FridgeLogDrawer";
import FridgeLogFilter from "./FridgeLogFilter";
import RestoreConfirmationFridgeLog from "./RestoreConfirmationFridgeLog";
import { useUser } from "../../../../Contexts/userContext";
import { Box } from "@mui/system";
import LoadingButton from "../../../../Components/LoadingButton";
import { TrendingUp } from "@mui/icons-material";

const FridgeLog: React.FC<{ isTrash?: boolean }> = ({ isTrash }) => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const brand = getBrandId();
  const { data, isLoading } = useFridgesLog(brand?.brand_id, debouncedParams, isTrash);
  const { data: dataFridgeList } = useFridgesList(brand?.brand_id);

  const [action, setAction] = useState<{
    type: "del" | "view" | "restore" | null;
    row: FridgeLogs | null;
  }>({ row: null, type: null });

  const handleClear = () => setAction({ row: null, type: null });
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedFridge, setSelectedFridge] = useState<FridgeLogCreate | null>(null);

  const onCreate = () => {
    setIsUpdating(false);
    setSelectedFridge(null);
    setOpen(true);
  };

  const { refetch, isLoading: isReportLoading } = useReportFridgeLog(searchParams);

  const handleActionCsvReport = async () => {
    try {
      await refetch({}); // Triggers the report download
    } catch (error) {
      console.error("Error downloading the report:", error);
    }
  };
  const handleUpdate = (row: FridgeLogs) => {
    setIsUpdating(true);
    setSelectedFridge({
      id: row.id ?? "",
      fridge_id: row.fridge_id ?? "",
      min_temp: row.min_temp,
      max_temp: row.max_temp,
      room_temp: row.room_temp,
      notes: row.notes
    });
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const { user } = useUser();

  return (
    <div>
      {!isTrash && (
        <PageTitle
          icon="/assets/icons/productIcon.svg"
          title="Temperature Log"
          endComponent={
            <Box sx={{ display: "flex", gap: 1 }}>
              <LoadingButton
                size="medium"
                variant="contained"
                startIcon={<TrendingUp />}
                onClick={handleActionCsvReport}
                loading={isReportLoading}
                id="cy__GetStockStatus"
              >
                Get CSV Report
              </LoadingButton>
              <Button
                onClick={onCreate}
                size="medium"
                variant="contained"
                id="cy__CreatePurchaseOrderBtn"
              >
                Add Temperature Log
              </Button>
            </Box>
          }
        />
      )}

      <FridgeLogDrawer
        open={open}
        onClose={onClose}
        mode={isUpdating ? "update" : "create"}
        initialData={selectedFridge}
        dataList={dataFridgeList?.results}
      />
      <FridgeLogFilter isTrash={isTrash} />
      <FridgesLogTable
        data={data}
        onUpdate={handleUpdate}
        isLoading={isLoading}
        setAction={setAction}
        isTrash={isTrash}
        user={user}
      />
      <DeleteConfirmationFridgeLog
        onClose={handleClear}
        open={action.type === "del"}
        row={action.row}
      />
      <RestoreConfirmationFridgeLog
        onClose={handleClear}
        open={action.type === "restore"}
        row={action?.row}
      />
    </div>
  );
};

export default FridgeLog;
