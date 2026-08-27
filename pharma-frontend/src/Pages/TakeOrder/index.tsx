import * as React from "react";
import Layout from "../../Components/layout";
import FilterTable from "../../Components/Customer/FilterTable";
import { NavBar } from "../../Components/Navbar";
import Stepper from "../../Components/TakeOrder/Stepper";

export const TakeOrder: React.FC = () => {
  return (
    <Layout title="Take Order">
      <NavBar pageTitle="Take Order" />
      <div style={{ padding: 30 }}>
        <br />
        <>
          <Stepper
            selectedCustomer={false}
            addedShipments={false}
            addedPayments={false}
          />
          <br />
          <FilterTable />
        </>
      </div>
    </Layout>
  );
};

export default TakeOrder;
