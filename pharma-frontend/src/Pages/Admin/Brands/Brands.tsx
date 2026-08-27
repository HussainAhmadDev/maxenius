import * as React from "react";
import Layout from "Components/layout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NavBar } from "Components/Navbar";
import BrandsFilters from "Components/Admin/Brands/BrandFilters";
import BrandsTable from "Components/Admin/Brands/BrandsTable";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import { useBrands } from "Hooks/useBrands";
import { useDebounce } from "Hooks/useDebounce";

export const AdminBrands: React.FC = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const debouncedParams = useDebounce(searchParams, 800);
  const { data: brands, isLoading } = useBrands(debouncedParams);

  return (
    <Layout title="Brands">
      <NavBar pageTitle="Brands">
        <Button
          onClick={() => navigate("/admin/brand/create")}
          icon={<MuiIcon icon="add" />}
          variant="contained"
          text="Create Brand"
        />
      </NavBar>
      <div style={{ padding: 30 }}>
        <BrandsFilters />
        <br />
        <BrandsTable isLoading={isLoading} brands={brands} />
      </div>
    </Layout>
  );
};
export default AdminBrands;
