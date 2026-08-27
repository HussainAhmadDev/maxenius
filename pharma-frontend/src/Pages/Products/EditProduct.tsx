import * as React from "react";
import Layout from "Components/layout";
import EditProductPage from "Components/Products/CreateProduct/EditProduct";

export const EditProduct: React.FC = () => {
  return (
    <Layout title="Editing Product">
      <EditProductPage />
    </Layout>
  );
};

export default EditProduct;
