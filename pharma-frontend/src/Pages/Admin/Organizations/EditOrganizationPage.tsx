import * as React from "react";

import Layout from "Components/layout";
import EditOrganization from "Components/Admin/Organizations/EditOrganization";

export const EditOrganizationPage: React.FC = () => {
  return (
    <Layout title="Edit Organization">
      <EditOrganization />
    </Layout>
  );
};

export default EditOrganizationPage;
