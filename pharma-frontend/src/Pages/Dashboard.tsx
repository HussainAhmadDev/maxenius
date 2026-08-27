import * as React from "react";
import Layout from "Components/layout";
import OverallStatus from "Components/Dashboard/OverallStatus";
import { NavBar } from "Components/Navbar";

export const DashboardPage: React.FC = () => {
  return (
    <Layout title="Dashboard">
      <NavBar pageTitle="Dashboard"></NavBar>
      <div style={{ padding: 30 }}>
        <OverallStatus />
      </div>
    </Layout>
  );
};
