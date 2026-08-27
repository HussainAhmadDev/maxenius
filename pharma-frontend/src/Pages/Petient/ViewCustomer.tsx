import * as React from "react";
import Layout from "Components/layout";
import ViewCustomerInfo from "Components/Customer/ViewCustomer";

export const ViewCustomerPage: React.FC = () => {
  return (
    <Layout title="View Customer">
      <ViewCustomerInfo />
    </Layout>
  );
};

export default ViewCustomerPage;
