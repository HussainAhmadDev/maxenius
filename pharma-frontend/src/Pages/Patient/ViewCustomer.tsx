import * as React from "react";
import Layout from "Components/layout";
import ViewCustomerInfo from "../../Components/Petients/ViewCustomer";

export const ViewPatientPage: React.FC = () => {
  return (
    <Layout title="View Patient Details">
      <ViewCustomerInfo />
    </Layout>
  );
};

export default ViewPatientPage;
