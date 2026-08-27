import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "Hooks/useDebounce";
import { NavBar } from "Components/Navbar";
import Button from "Components/Button";
import CustomerFilters from "Components/Customer/CustomerFilters";
import CustomerTable from "Components/Customer/CustomerTable";
import MuiIcon from "Components/icons/MuiIcons";
import Layout from "Components/layout";
import { useCompanies, useCreateCompany } from "Hooks/useCompanies";
import { useBrand } from "Context/BrandContext";
import Prompt from "Components/Prompt";
export const CustomersPage: React.FC = () => {
  const [showWarning, setShowWarning] = React.useState(false);
  const [searchParams] = useSearchParams();

  const debouncedParams = useDebounce(searchParams, 800);
  const { data: companies, isLoading } = useCompanies(debouncedParams);
  const { activeBrand } = useBrand();
  const { mutate: createCompany } = useCreateCompany();

  return (
    <Layout title="Customers">
      <Prompt
        promptMsg={
          "This will create a customer with the customer number only. You'll have to add the rest of the customer information after creation."
        }
        title={`Create new customer`}
        openModal={showWarning}
        onCancel={() => setShowWarning(false)}
        onProceed={() => {
          setShowWarning(false);
          createCompany(activeBrand);
        }}
      />
      <NavBar pageTitle="Customers">
        <Button
          onClick={() => {
            setShowWarning(true);
          }}
          icon={<MuiIcon icon="add" />}
          variant="contained"
          text="Add Customer"
        />
      </NavBar>
      <div style={{ padding: 30 }}>
        <CustomerFilters />
        <br />
        <CustomerTable isLoading={isLoading} companies={companies} />
      </div>
    </Layout>
  );
};

export default CustomersPage;
