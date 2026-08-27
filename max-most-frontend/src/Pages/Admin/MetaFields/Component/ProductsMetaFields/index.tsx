import { useState } from "react";
import { Stack } from "@mui/material";
import MetaFieldTable from "./MetaFieldTable";
import { useMetaFieldsList } from "../../../../../Hooks/useMetaFields";
import { getBrandId } from "../../../../../Hooks/api";
import MetaFieldTitle from "./MetaFieldTitle";
import MetaFieldDeleteConfirmation from "./MetaFieldDeleteConfirmation";
import { MetaFieldDetail } from "@interfaces/metaFieldTypes";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../../../Hooks/useDebounce";

const MetaField: React.FC = () => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const { data: metaFieldsList, isLoading } = useMetaFieldsList(
    getBrandId()?.brand_id,
    debouncedParams,
    false
  );
  const [action, setAction] = useState<{
    type: "del" | "view" | "restore" | null;
    row: MetaFieldDetail | null;
  }>({ row: null, type: null });
  const handleClear = () => setAction({ row: null, type: null });
  return (
    <Stack gap={2}>
      <MetaFieldTitle />
      <MetaFieldTable data={metaFieldsList} isLoading={isLoading} setAction={setAction} />
      <MetaFieldDeleteConfirmation
        onClose={handleClear}
        open={action.type === "del"}
        row={action.row}
      />
    </Stack>
  );
};

export default MetaField;
