import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "Components/layout";
import ProductTable from "Components/Products/ProductTable";
import ProductFilters from "Components/Products/ProductFilters";
import { NavBar } from "Components/Navbar";
import { useCreateProduct, useProducts } from "Hooks/useProducts";
import { useDebounce } from "Hooks/useDebounce";
import ModalPopup from "Components/ModalPopup";
import TextInput from "Components/Form/TextInput";

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);
  const [popupOpen, togglePopup] = React.useState(false);
  const [productName, setProductName] = React.useState("");

  const { mutate: createProduct, data: product } = useCreateProduct();
  const { data: products, isLoading } = useProducts(debouncedParams);

  React.useEffect(() => {
    if (product && product.id) {
      togglePopup(false);
      setTimeout(() => {
        navigate(`/products/edit/${product.id}`);
      }, 200);
    }
  }, [product, navigate]);

  return (
    <Layout title="Products">
      <ModalPopup
        openModal={popupOpen}
        maxWidth="sm"
        saveBtnText="Proceed"
        handleSaveChanges={() => {
          createProduct({ name: productName });
        }}
        disableSaveBtn={!productName}
        handleCloseModal={() => {
          togglePopup(false);
        }}
        modalTitle="Create New Product"
      >
        <TextInput
          label="Product Name"
          name="name"
          type="text"
          value={productName}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setProductName(e.target.value);
          }}
          error={!productName}
        />
      </ModalPopup>
      <NavBar pageTitle="Products"></NavBar>

      <br />
      <div style={{ padding: 30 }}>
        <ProductFilters />
        <br />
        <ProductTable isLoading={isLoading} products={products} />
      </div>
    </Layout>
  );
};

export default ProductsPage;
