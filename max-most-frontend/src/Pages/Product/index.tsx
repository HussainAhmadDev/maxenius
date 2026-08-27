import { useVariantProducts } from "../../Hooks/useProducts";
import { useDebounce } from "../../Hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { Stack } from "@mui/material";
import ProductFilter from "./Components/productFilter";
import ProductTable from "./Components/productTable";
import { useState } from "react";
import { ProductData } from "../../Interfaces/Products";
import ProductDrawer from "./Components/productDrawer";
import DeleteConfirmation from "./Components/deleteConfirmation";
import RestoreConfirmation from "./Components/restoreConfirmation";

const Products: React.FC<{ isTrash?: boolean }> = ({ isTrash }) => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const { data: products, isLoading } = useVariantProducts(debouncedParams, isTrash);
  const [action, setAction] = useState<{
    type: "del" | "view" | "restore" | null;
    row: ProductData | null;
  }>({ row: null, type: null });

  const handleClear = () => setAction({ row: null, type: null });

  return (
    <Stack gap={2}>
      <ProductFilter isTrash={isTrash} />
      <ProductTable
        products={products}
        isLoading={isLoading}
        setAction={setAction}
        isTrash={isTrash}
      />
      <DeleteConfirmation
        onClose={handleClear}
        open={action.type === "del"}
        row={action.row}
      />
      <ProductDrawer
        onClose={handleClear}
        onDelete={() => setAction({ ...action, type: "del" })}
        open={action.type === "view"}
        row={action?.row}
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

export default Products;
