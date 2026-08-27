import { useSearchParams } from "react-router-dom";
import FridgesListTable from "./FridgesListTable";
import { useDebounce } from "../../../../Hooks/useDebounce";
import { useFridgesList } from "../../../../Hooks/useFridgesList";
import { getBrandId } from "../../../../Hooks/api";
import { useState } from "react";
import { Fridge, UpdateFridgeState } from "@interfaces/Fridges";
import DeleteConfirmationFridge from "./DeleteConfirmationFridge";
import RestoreConfirmationFridge from "./RestoreConfirmationFridge";
import FridgeFilter from "./FridgeFilter";

import { Button } from "@mui/material";
import FridgeDrawer from "./FridgeDrawer";
import PageTitle from "../../../../Components/PageTitle";
import { Stack } from "@mui/system";

const FridgeList: React.FC<{ isTrash?: boolean }> = ({ isTrash }) => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const brand = getBrandId();
  const { data, isLoading } = useFridgesList(brand?.brand_id, debouncedParams, isTrash);
  const [action, setAction] = useState<{
    type: "del" | "view" | "restore" | null;
    row: Fridge | null;
  }>({ row: null, type: null });
  const handleClear = () => setAction({ row: null, type: null });
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedFridge, setSelectedFridge] = useState<UpdateFridgeState | null>(null);

  const onCreate = () => {
    setIsUpdating(false);
    setSelectedFridge(null);
    setOpen(true);
  };

  const onUpdate = (row: Fridge) => {
    setIsUpdating(true);
    setSelectedFridge({
      id: row.id,
      brand_id: row.brand_id,
      description: row.description,
      fridge_number: row.fridge_number,
      is_active: row.is_active,
      location: row.location,
      notify_to: row.notify_to
    });
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {!isTrash && (
        <PageTitle
          icon="/assets/icons/productIcon.svg"
          title="Fridge List"
          endComponent={
            <Button
              onClick={onCreate}
              size="medium"
              variant="contained"
              id="cy__CreatePurchaseOrderBtn"
            >
              Add Fridge
            </Button>
          }
        />
      )}
      <Stack gap={2}>
        <FridgeDrawer
          open={open}
          onClose={onClose}
          mode={isUpdating ? "update" : "create"}
          initialData={selectedFridge}
        />
        <FridgeFilter isTrash={isTrash} />
        <FridgesListTable
          data={data}
          onUpdate={onUpdate}
          isLoading={isLoading}
          setAction={setAction}
          isTrash={isTrash}
          // user={user}
        />

        <DeleteConfirmationFridge
          onClose={handleClear}
          open={action.type === "del"}
          row={action.row}
        />
        <RestoreConfirmationFridge
          onClose={handleClear}
          open={action.type === "restore"}
          row={action?.row}
        />
      </Stack>
    </div>
  );
};

export default FridgeList;
