import * as React from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../Components/layout";

import UpdateVendor from "../../../Components/Admin/Vendors/UpdateVendor";
import { useVendorById } from "Hooks/useVendors";

export const EditVendors: React.FC = () => {
  const { id } = useParams();

  const { data: vendorDetail } = useVendorById(id);

  return (
    <Layout title="Create Brand">
      {/* eslint-disable-next-line  */}
      {/* @ts-ignore */}
      {vendorDetail ? <UpdateVendor vendorDetails={vendorDetail} /> : null}
    </Layout>
  );
};

export default EditVendors;
