import * as React from "react";
import Layout from "../../../Components/layout";
import ViewVendor from "../../../Components/Admin/Vendors/ViewVendor";

export const ViewVendorPage: React.FC = () => {
  return (
    <Layout title="View Vendor">
      <ViewVendor />
    </Layout>
  );
};

export default ViewVendorPage;
