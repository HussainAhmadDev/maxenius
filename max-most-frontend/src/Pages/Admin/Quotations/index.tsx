import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../Hooks/useDebounce";
import { useState } from "react";
import { Stack } from "@mui/material";
import QuotesTable from "./Components/quotesTable";
import QuotesFilters from "./Components/quotesFilters";
import { useQuotations } from "../../../Hooks/useQuotation";
import { QuoteData } from "../../../Interfaces/quotatonsTypes";
import RestoreConfirmation from "./Components/restoreConfirmation";
import DeleteConfirmation from "./Components/deleteConfirmation";

interface QuotesProps {
  isTrash?: boolean;
}

const Quotes: React.FC<QuotesProps> = ({ isTrash }) => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const { data: quotes, isLoading: loading } = useQuotations(debouncedParams, isTrash);
  const [action, setAction] = useState<{
    type: "del" | "restore" | null;
    row: QuoteData | null;
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
        <QuotesFilters isTrash={isTrash} />
        <QuotesTable
          isLoading={loading}
          setAction={setAction}
          quotes={quotes}
          isTrash={isTrash}
        />
        <DeleteConfirmation
          onClose={handleClear}
          open={action?.type === "del"}
          row={action?.row}
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

export default Quotes;
