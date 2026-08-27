import * as React from "react";
import Layout from "Components/layout";
import EditUser from "Components/Admin/Users/CreateUsers/EditUser";
import { useParams } from "react-router-dom";

export const EditUserPage: React.FC = () => {
  const { id } = useParams<"id">();
  return (
    <Layout title="Edit User">
      <EditUser userId={id as string} />
    </Layout>
  );
};

export default EditUserPage;
