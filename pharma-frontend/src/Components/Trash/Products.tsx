import * as React from "react";
import ProductFilters from "Components/Products/ProductFilters";
import ProductTable from "Components/Products/ProductTable";
import { useProducts } from "Hooks/useProducts";
import { useDebounce } from "Hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

const ProductsTrash: React.FC = () => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);

  const { data: products, isLoading } = useProducts(debouncedParams);

  return (
    <div>
      <ProductFilters />
      <br />
      <ProductTable isLoading={isLoading} products={products} />
    </div>
  );
};

export default ProductsTrash;
