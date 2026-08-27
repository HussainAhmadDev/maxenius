import * as React from "react";
import Layout from "../../../Components/layout";
import ViewBrand from "../../../Components/Admin/Brands/ViewBrand";

export const ViewBrandPage: React.FC = () => {
  return (
    <Layout title="View Brand">
      <ViewBrand />
    </Layout>
  );
};

export default ViewBrandPage;
