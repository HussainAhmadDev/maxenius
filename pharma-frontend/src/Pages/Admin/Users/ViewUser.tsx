import * as React from "react";
import Layout from "../../../Components/layout";
import ViewUser from "../../../Components/Admin/Users/ViewUser";

export const ViewUserPage: React.FC = () => {
  return (
    <Layout title="View User">
      <ViewUser />
    </Layout>
  );
};

export default ViewUserPage;
