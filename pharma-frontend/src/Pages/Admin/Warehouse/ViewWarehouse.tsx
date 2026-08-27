import * as React from "react";
import Layout from "../../../Components/layout";
import ViewWarehouse from "Components/Admin/Warehouse/ViewWarehouse";

export const ViewWarehousePage: React.FC = () => {
  return (
    <Layout title="View Warehouse">
      <ViewWarehouse />
    </Layout>
  );
};

export default ViewWarehousePage;
