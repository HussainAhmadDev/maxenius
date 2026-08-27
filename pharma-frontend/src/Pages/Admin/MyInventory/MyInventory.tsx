import * as React from "react";
import Layout from "Components/layout";
// import { useNavigate, useSearchParams } from "react-router-dom";
import { NavBar } from "Components/Navbar";
// import { useBrands } from "Hooks/useBrands";
// import { useDebounce } from "Hooks/useDebounce";
import MyInventoryFilters from "Components/Admin/MyInventory/myInventoryFilters";
import MyInventoryTable from "Components/Admin/MyInventory/myInventoryTable";

export const MyInventory: React.FC = () => {
  // const navigate = useNavigate();

  // const [searchParams] = useSearchParams();

  // const debouncedParams = useDebounce(searchParams, 800);
  // const { data: brands, isLoading } = useBrands(debouncedParams);

  return (
    <Layout title="My Inventory">
      <NavBar pageTitle="My Inventory"></NavBar>
      <div style={{ padding: 30 }}>
        <MyInventoryFilters />
        <br />
        <MyInventoryTable isLoading={false} />
      </div>
    </Layout>
  );
};
export default MyInventory;
