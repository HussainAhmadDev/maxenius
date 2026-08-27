import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Layout from "../../Components/layout";
import { NavBar } from "../../Components/Navbar";
import OrderTrash from "../../Components/Trash/Orders";
import PurchaseOrderTrash from "../../Components/Trash/PurchaseOrder";
import VendorTrash from "../../Components/Trash/VendorTrash";
import ProductsTrash from "../../Components/Trash/Products";
import UserTrash from "../../Components/Trash/Users";
import BrandTrash from "../../Components/Trash/WarehouseTrash";

const TrashPage: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Layout title="Trash">
      <NavBar pageTitle="Trash"></NavBar>
      <div style={{ padding: 30 }}>
        <Tabs
          indicatorColor="secondary"
          value={value}
          onChange={handleChangeTab}
          aria-label="basic tabs example"
        >
          <Tab label="Orders" />
          <Tab label="Purcahse Order" />
          <Tab label="Products" />
          <Tab label="Vendor" />
          <Tab label="Warehouses" />
          <Tab label="Users" />
        </Tabs>
        {value === 0 && <OrderTrash />}
        {value === 1 && <PurchaseOrderTrash />}
        {value === 2 && <ProductsTrash />}
        {value === 3 && <VendorTrash />}
        {value === 4 && <BrandTrash />}
        {value === 5 && <UserTrash />}
      </div>
    </Layout>
  );
};

export default TrashPage;
