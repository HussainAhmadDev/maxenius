import { Stack } from "@mui/material";
import ProductTransactionFilter from "./Components/ProductTransactionFilter";
import { PurchaseOrderProductForm } from "../../Interfaces/PurchaseOrder";
import { useState, useMemo } from "react";
import ProductTransactionTable from "./Components/ProductTransactionTable";
import { useProductTransaction } from "../../Hooks/useProductTransaction";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../Hooks/useDebounce";

const initialValues: PurchaseOrderProductForm = {
  price: 0,
  product: {
    cost_price: 0,
    label: "",
    value: ""
  },
  product_id: "",
  quantity: 0,
  tax: 0,
  total: 0
};

function ProductTransaction() {
  const [product, setProduct] = useState<PurchaseOrderProductForm>(initialValues);

  const [searchParams] = useSearchParams();
  const debounced = useDebounce(searchParams, 800);
  const {
    data: ProductTransactionData,
    mutate,
    isLoading
  } = useProductTransaction(debounced);

  useMemo(() => {
    if (product?.product_id) {
      mutate({ product_id: product.product_id });
    }
  }, [product, mutate, debounced]);

  return (
    <Stack gap={2}>
      <ProductTransactionFilter product={product} setProduct={setProduct} />
      <ProductTransactionTable
        productTransaction={ProductTransactionData}
        isLoading={isLoading}
      />
    </Stack>
  );
}

export default ProductTransaction;
