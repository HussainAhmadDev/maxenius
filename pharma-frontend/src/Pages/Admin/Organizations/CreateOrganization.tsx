import * as React from "react";

import CreateOrganization from "../../../Components/Admin/Organizations/CreateOrganization";
import Layout from "../../../Components/layout";

export const CreateOrganizationPage: React.FC = () => {
  return (
    <Layout title="Create Organization">
      <CreateOrganization />
    </Layout>
  );
};

export default CreateOrganizationPage;
