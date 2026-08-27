import { Stack } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../Hooks/useDebounce";
import React, { useState } from "react";
import WebsitesFilter from "./Components/WebsiteFilters";
import WebsitesTable from "./Components/WebsitesTable";

import DeleteConfirmation from "./Components/DeleteConfirmation";

import RestoreConfirmation from "./Components/restoreConfirmation";
import { useWebsites } from "../../../Hooks/useWebsites";
import { Website } from "../../../Interfaces/webstiteType";

const Websites: React.FC<{ isTrash?: boolean }> = ({ isTrash }) => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const {
    data: websitesList,
    isLoading,
    refetch
  } = useWebsites(debouncedParams, isTrash);

  const [action, setAction] = useState<{
    type: "del" | "view" | "edit" | "restore" | null;
    row: Website | null;
  }>({ row: null, type: null });

  const handleClear = () => {
    setAction({ row: null, type: null });
  };
  return (
    <Stack gap={2}>
      <WebsitesFilter isTrash={isTrash} />
      <WebsitesTable
        isLoading={isLoading}
        websites={websitesList}
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
    </Stack>
  );
};
export default Websites;
