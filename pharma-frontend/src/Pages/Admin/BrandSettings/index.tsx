import React from "react";
import PagesSetting from "./PagesSetting";
import VendorsSetting from "./VendorsSettings";
import Layout from "Components/layout";
import { NavBar } from "Components/Navbar";

const BrandSettigns = () => {
  return (
    <Layout title="Brand Settings">
      <NavBar pageTitle="Brand Settings"></NavBar>
      <PagesSetting />
      <VendorsSetting />
    </Layout>
  );
};
export default BrandSettigns;
