import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "Components/layout";
import { NavBar } from "Components/Navbar";
import OrderFilters from "Components/Orders/OrderFilters";
import OrderTable from "Components/Orders/OrderTable";
import { useOrders } from "Hooks/useOrders";
import { useDebounce } from "Hooks/useDebounce";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
const OrdersPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const debouncedParams = useDebounce(searchParams, 800);
  const { data: results, isLoading } = useOrders(debouncedParams);
  const navigate = useNavigate();
  return (
    <Layout title="Orders">
      <NavBar pageTitle="Orders">
        <Button
          onClick={() => navigate("/take-order")}
          icon={<MuiIcon icon="add" />}
          variant="contained"
          text="Create Order"
        />
      </NavBar>

      <div style={{ padding: 30 }}>
        <OrderFilters />
        <br />
        <OrderTable isLoading={isLoading} orders={results} />
      </div>
    </Layout>
  );
};

export default OrdersPage;
