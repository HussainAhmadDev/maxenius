import * as React from "react";
import { NavBar } from "Components/Navbar";
import { CompanyData } from "Interfaces/Company";
import { OrderData } from "Interfaces/Order";
import PrescriptionDetails from "./PrescriptionDetails";
import PrescriptionProductsTable from "../PrescriptionItemTable";

export const PrescriptionView: React.FC = () => {
  return (
    <>
      <NavBar pageTitle="Precription Details" />
      <div style={{ padding: 30 }}>
        <PrescriptionDetails />
        <br />
        <PrescriptionProductsTable order={{} as OrderData} customer={{} as CompanyData} />
      </div>
    </>
  );
};

export default PrescriptionView;
