import React from "react";
import Layout from "Components/layout";
import { NavBar } from "Components/Navbar";
import ProductTransactionFilter from "Components/ProductTransaction/productTransactionFilter";
import TransactionProductTable from "Components/ProductTransaction/ProductTransactionTable";
import { useProductTransaction } from "Hooks/useProductTransaction";
import { useSearchParams } from "react-router-dom";

interface ISelectedProduct {
  label: string;
  value: string;
}

const ProductTransaction = () => {
  const [selectedProduct, setSelectedProduct] = React.useState<ISelectedProduct>({
    label: "Select..",
    value: ""
  });

  const [searchParams] = useSearchParams();
  // const debounced = useDebounce(searchParams, 800)
  const {
    data: productTransaction,
    mutate,
    isLoading
  } = useProductTransaction(searchParams);

  React.useEffect(() => {
    if (selectedProduct) {
      selectedProduct.value && mutate({ product_id: selectedProduct.value });
    }
    //eslint-disable-next-line
  }, [selectedProduct, searchParams]);

  return (
    <Layout title="Product Transactions">
      <NavBar pageTitle="Product Transactions"></NavBar>
      <div style={{ padding: 30 }}>
        <ProductTransactionFilter
          selectedProduct={selectedProduct}
          setSelectedProduct={(data: ISelectedProduct) => setSelectedProduct(data)}
        />
        <br />
        <TransactionProductTable
          isLoading={isLoading}
          transactionProduct={productTransaction}
        />
      </div>
    </Layout>
  );
};
export default ProductTransaction;
