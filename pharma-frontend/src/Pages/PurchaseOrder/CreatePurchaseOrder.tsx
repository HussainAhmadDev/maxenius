import CreatePurchaseOrder from "Components/PurchaseOrders/CreatePurchaseOrder";
import * as React from "react";
import Layout from "../../Components/layout";
import { PurchaseOrderContextProvider } from "Context/PurchaseOrderContext";

export const CreatePurchaseOrderPage: React.FC = () => {
  return (
    <PurchaseOrderContextProvider>
      <Layout title="Create Purchase Order">
        <CreatePurchaseOrder newPurchaseOrder={true} />
      </Layout>
    </PurchaseOrderContextProvider>
  );
};

export default CreatePurchaseOrderPage;
