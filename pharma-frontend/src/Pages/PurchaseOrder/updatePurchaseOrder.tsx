import CreatePurchaseOrder from "Components/PurchaseOrders/CreatePurchaseOrder";
import * as React from "react";
import Layout from "../../Components/layout";

export const UpdatePurchaseOrderPage: React.FC = () => {
  return (
    <Layout title="Update Purchase Order">
      <CreatePurchaseOrder title="Update Purchase Order" />
    </Layout>
  );
};

export default UpdatePurchaseOrderPage;
