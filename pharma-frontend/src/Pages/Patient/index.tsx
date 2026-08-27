import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "Hooks/useDebounce";
import { NavBar } from "Components/Navbar";
import PatientFilters from "Components/Customer/PatientFilters";
import PatientTable from "Components/Customer/PatientTable";
import Layout from "Components/layout";
import Prompt from "Components/Prompt";
import { usePatients } from "Hooks/usePatients";

export const CustomersPage: React.FC = () => {
  // const theme = useTheme();
  //const classes = useStyles(theme);

  const [showWarning, setShowWarning] = React.useState(false);
  const [searchParams] = useSearchParams();

  const debouncedParams = useDebounce(searchParams, 800);
  const [siteUrl, setSiteUrl] = React.useState<string>();
  const [authorization_key, setAuthorizationKey] = React.useState<string>();

  const {
    data: patients,
    isLoading,
    refetch
  } = usePatients(
    `${siteUrl}/wp-json/inventory/v1/patient_list`,
    authorization_key,
    debouncedParams
  );
  React.useEffect(() => {
    refetch();
  }, [siteUrl, debouncedParams, refetch]);
  return (
    <Layout title="Patients">
      <Prompt
        promptMsg={
          "This will create a customer with the customer number only. You'll have to add the rest of the customer information after creation."
        }
        title={`Create new customer`}
        openModal={showWarning}
        onCancel={() => setShowWarning(false)}
        onProceed={() => {
          setShowWarning(false);
        }}
      />
      <NavBar pageTitle="Patients"></NavBar>

      <div style={{ padding: 30 }}>
        <PatientFilters
          getAuthorizationkey={(key: string) => setAuthorizationKey(key)}
          getSiteUrl={(site_url: string) => setSiteUrl(site_url)}
        />
        <br />
        <PatientTable isLoading={isLoading} patients={patients} />
      </div>
    </Layout>
  );
};

export default CustomersPage;
