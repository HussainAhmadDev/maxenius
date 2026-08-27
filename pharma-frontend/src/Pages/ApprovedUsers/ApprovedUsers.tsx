import * as React from "react";
import Layout from "Components/layout";
// import { useNavigate } from "react-router-dom";
import { NavBar } from "Components/Navbar";
import ApprovedUsersFilters from "Components/ApprovedUsers/ApprovedUsersFilters";
import ApprovedUsersTable from "Components/ApprovedUsers/ApprovedUsersTable";
// import { usePurchaseOrders } from "Hooks/usePurchaseOrders";
// import { useDebounce } from "Hooks/useDebounce";

export const ApprovedUsers: React.FC = () => {
  //   const navigate = useNavigate();

  //   const [searchParams] = useSearchParams();

  //   const debouncedParams = useDebounce(searchParams, 800);
  //   const { data: purchaseOrders, isLoading } = usePurchaseOrders(debouncedParams);

  return (
    <Layout title="Approved Users">
      <NavBar pageTitle="Approved Users"></NavBar>
      <div style={{ padding: 30 }}>
        <ApprovedUsersFilters />
        <br />
        <ApprovedUsersTable isLoading={false} />
      </div>
    </Layout>
  );
};
export default ApprovedUsers;
