import * as React from "react";
import Layout from "Components/layout";
import AddCustomers from "Components/Customer/AddCustomer";

export const AddCustomersPage: React.FC = () => {
  return (
    <Layout title="Add Customer">
      <AddCustomers />
    </Layout>
  );
};

export default AddCustomersPage;
