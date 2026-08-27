import * as React from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../Components/layout";
import ViewOrganization from "Components/Admin/Organizations/ViewOrganization";
import { useOrgById } from "Hooks/useOrgs";

export const ViewOrganizationPage: React.FC = () => {
  const { id: orgId } = useParams<"id">();
  const { data } = useOrgById(orgId as string);

  return (
    <Layout title="View Organization">
      <ViewOrganization data={data} />
    </Layout>
  );
};

export default ViewOrganizationPage;
