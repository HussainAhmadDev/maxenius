import * as React from "react";
import Layout from "../../../Components/layout";
import AddWarehouse from "../../../Components/Admin/Warehouse/AddWarehouse";

interface IProps {
  title?: string;
}

export const CreateWarehouse: React.FC<IProps> = ({ title }) => {
  return (
    <Layout title="Create Brand">
      <AddWarehouse title={title} />
    </Layout>
  );
};

export default CreateWarehouse;
