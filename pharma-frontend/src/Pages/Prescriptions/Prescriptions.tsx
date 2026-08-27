import * as React from "react";
import Layout from "Components/layout";
// import { useNavigate } from "react-router-dom";
import { NavBar } from "Components/Navbar";
// import Button from "Components/Button";
// import MuiIcon from "Components/icons/MuiIcons";
import PrescriptionFilters from "Components/Prescription/PrescriptionFilters";
import PrescriptionTable from "Components/Prescription/PrescriptionTable";

export const Prescriptions: React.FC = () => {
  // const navigate = useNavigate();

  return (
    <Layout title="Prescriptions">
      <NavBar pageTitle="Prescriptions">
        {/* <Button
          onClick={() => navigate("/purchase-orders/create")}
          icon={<MuiIcon icon="add" />}
          variant="contained"
          text="Create Purchase Order"
        /> */}
      </NavBar>
      <div style={{ padding: 30 }}>
        <PrescriptionFilters />
        <br />
        <PrescriptionTable isLoading={false} />
      </div>
    </Layout>
  );
};
export default Prescriptions;
