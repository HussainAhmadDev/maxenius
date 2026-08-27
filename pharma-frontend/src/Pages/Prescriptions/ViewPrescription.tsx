import * as React from "react";
import Layout from "../../Components/layout";
import PrescriptionView from "Components/Prescription/ViewPrescription";

export const ViewPrescription: React.FC = () => {
  return (
    <Layout title="Prescription Details">
      <PrescriptionView />
    </Layout>
  );
};

export default ViewPrescription;
