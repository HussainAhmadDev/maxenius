import * as React from "react";
import Layout from "../../../Components/layout";
import CreateVendor from "../../../Components/Admin/Vendors/CreateVendor";

export const CreateVendors: React.FC = () => {
  return (
    <Layout title="Create Brand">
      <CreateVendor />
    </Layout>
  );
};

export default CreateVendors;
