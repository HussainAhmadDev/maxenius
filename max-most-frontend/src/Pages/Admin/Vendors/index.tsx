import { Stack } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../Hooks/useDebounce";
import { useState } from "react";
import { useVendors } from "../../../Hooks/useVendors";
import VendorFilters from "./Components/VendorFilters";
import VendorDrawer from "./Components/Vendordrawer";
import { Vendor } from "../../../Interfaces/vendorsType";
import DeleteConfirmation from "./Components/DeleteConfirmation";
import VendorTable from "./Components/VendorsTable";
import RestoreConfirmation from "./Components/restoreConfirmation";

interface VendorsProps {
  isTrash?: boolean;
}

const Vendors: React.FC<VendorsProps> = ({ isTrash }) => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const {
    data: vendors,
    isLoading,
    refetch
  } = useVendors(debouncedParams, true, isTrash);

  const [action, setAction] = useState<{
    type: "del" | "view" | "edit" | "restore" | null;
    row: Vendor | null;
  }>({ row: null, type: null });

  const handleClear = () => {
    setAction({ row: null, type: null });
  };

  return (
    <Stack gap={2}>
      <VendorFilters isTrash={isTrash} />
      <VendorTable
        isLoading={isLoading}
        vendors={vendors}
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
      <VendorDrawer
        onClose={handleClear}
        open={action.type === "view"}
        row={action.row!}
        onDelete={() => setAction({ ...action, type: "del" })}
        isTrash={isTrash}
      />
      <RestoreConfirmation
        onClose={handleClear}
        open={action.type === "restore"}
        row={action?.row}
      />
    </Stack>
  );
};

export default Vendors;
