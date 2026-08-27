import * as React from "react";
import Layout from "../../../Components/layout";
import CreateBrand from "../../../Components/Admin/Brands/CreateBrand";

export const CreateBrands: React.FC = () => {
  return (
    <Layout title="Create Brand">
      <CreateBrand />
    </Layout>
  );
};

export default CreateBrands;
