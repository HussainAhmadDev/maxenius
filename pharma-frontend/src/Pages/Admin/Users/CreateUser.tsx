import * as React from "react";
import Layout from "Components/layout";
import CreateUser from "Components/Admin/Users/CreateUsers";

export const CreateUsers: React.FC = () => {
  return (
    <Layout title="Add User">
      <CreateUser />
    </Layout>
  );
};

export default CreateUsers;
