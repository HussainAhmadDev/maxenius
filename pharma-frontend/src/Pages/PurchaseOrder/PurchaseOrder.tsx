/* eslint-disable-entire-file */
import * as React from "react";
import Layout from "Components/layout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NavBar } from "Components/Navbar";
import PurchaseOrderFilters from "../../Components/PurchaseOrders/PurchaseOrderFilters";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import PurchaseOrderTable from "Components/PurchaseOrders/PurchaseOrderTable";
import { usePurchaseOrders } from "Hooks/usePurchaseOrders";
import { useDebounce } from "Hooks/useDebounce";

export const PurchaseOrders: React.FC = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const debouncedParams = useDebounce(searchParams, 800);

  const { data: purchaseOrders, isLoading } = usePurchaseOrders(debouncedParams);

  return (
    <Layout title="Purchase Orders">
      <NavBar pageTitle="Purchase Orders" purchaseOrder={true}>
        <Button
          onClick={() => navigate("/purchase-orders/create")}
          icon={<MuiIcon icon="add" />}
          variant="contained"
          text="Create Purchase Order"
        />
      </NavBar>
      <div style={{ padding: 30 }}>
        <PurchaseOrderFilters />
        <br />
        <PurchaseOrderTable purchaseOrders={purchaseOrders} isLoading={isLoading} />
      </div>
    </Layout>
  );
};
export default PurchaseOrders;
