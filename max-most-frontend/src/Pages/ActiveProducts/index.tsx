import { Stack } from "@mui/material";
import ProductsActivityLogFilter from "./Components/ProductsActivityLogFilter";
import ProductsActivityLogTable from "./Components/ProductsActivityLogTable";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../Hooks/useDebounce";
import { useState } from "react";
import ProductsActivityLogDialog from "./Components/ProductsActivityLogDialog";
import { getBrandId } from "../../Hooks/api";
import { useProductsActivityLog } from "../../Hooks/useProductActivityLog";
import {
  ProductActiveLogResponse,
  ProductDetails,
  ProductRequest
} from "@interfaces/productActiveLogType";

type RowType = ProductRequest | ProductActiveLogResponse | ProductDetails | null;
type ActionType =
  | "del"
  | "view"
  | "edit"
  | "payload-send"
  | "response-send"
  | "restore"
  | null;

type DialogActionType = "payload-send" | "response-send";

const ActiveProducts: React.FC<{ isTrash?: boolean }> = ({ isTrash }) => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);

  const brand = getBrandId();
  const { data, isLoading: productIsLoading } = useProductsActivityLog(
    brand?.brand_id,
    debouncedParams,
    isTrash
  );

  const [action, setAction] = useState<{
    type: ActionType;
    row: RowType;
  }>({ row: null, type: null });

  const handleClear = () => setAction({ row: null, type: null });

  const dialogActionType: DialogActionType | undefined =
    action.type === "payload-send" || action.type === "response-send"
      ? (action.type as DialogActionType)
      : undefined;

  return (
    <Stack gap={2}>
      <ProductsActivityLogFilter isTrash={isTrash} />
      <ProductsActivityLogTable
        isLoading={productIsLoading}
        data={data}
        setAction={setAction}
        isTrash={isTrash}
      />
      {dialogActionType && (
        <ProductsActivityLogDialog
          onClose={handleClear}
          open={dialogActionType !== undefined}
          row={action.row ?? null}
          actionType={dialogActionType}
        />
      )}
    </Stack>
  );
};

export default ActiveProducts;
