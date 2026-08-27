import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "Components/layout";
import CustomerInfoDisplay from "Components/TakeOrder/CustomerInfo";
import LineItemTable from "Components/TakeOrder/LineItemTable";
import PaymentHistory from "Components/HistoryTables/Payment";
import ShipmentHistory from "Components/HistoryTables/Shipment";
import ReturnHistory from "Components/HistoryTables/Return";
import OrderDetails from "Components/TakeOrder/OrderDetails";
import { NavBar } from "Components/Navbar";
import Stepper from "Components/TakeOrder/Stepper";
import { CompanyData } from "Interfaces/Company";
import { useOrder } from "Hooks/useOrders";
import { OrderData } from "Interfaces/Order";
import { OrderProvider } from "Context/OrderContext";
import { Typography } from "@material-ui/core";
import MuiIcon from "Components/icons/MuiIcons";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ShippingReturnProvider } from "Context/ShippingReturnContext";

const useStyles = makeStyles(() =>
  createStyles({
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center"
    },
    customerBackDiv: {
      display: "flex",
      cursor: "pointer"
    }
  })
);
export const OrderDetailsPage: React.FC = () => {
  const { id: orderId } = useParams<"id">();
  const navigate = useNavigate();
  const classes = useStyles();

  const { data: orderData } = useOrder(orderId as string);
  const addedPayments = orderData?.payments ? orderData.payments.length > 0 : false;
  const addedShipments = orderData?.product_shippings
    ? orderData.product_shippings.length > 0
    : false;
  return (
    <Layout title="Order Details">
      <ShippingReturnProvider>
        <OrderProvider>
          <NavBar pageTitle="Edit Order" />

          <Typography component={"div"} variant="body2">
            <div className={classes.customerBackDiv} onClick={() => navigate(-1)}>
              <p>
                <MuiIcon icon="backArrow" fontSize="small" />
              </p>{" "}
              &nbsp;
              <p>Orders</p>
            </div>
          </Typography>
          <div style={{ padding: 30 }}>
            <Stepper
              selectedCustomer={true}
              addedShipments={addedShipments}
              addedPayments={addedPayments}
            />
            <br />
            <OrderDetails
              order={orderData || ({} as OrderData)}
              customer={{} as CompanyData}
            />
            <br />
            <CustomerInfoDisplay
              order={orderData || ({} as OrderData)}
              customer={{} as CompanyData}
            />
            <br />
            <br />
            <PaymentHistory order={orderData || ({} as OrderData)} />
            <br />
            <LineItemTable
              order={orderData || ({} as OrderData)}
              customer={{} as CompanyData}
            />
            <br />
            <ShipmentHistory order={orderData || ({} as OrderData)} />
            <br />
            <ReturnHistory order={orderData || ({} as OrderData)} />
            <br />
          </div>
        </OrderProvider>
      </ShippingReturnProvider>
    </Layout>
  );
};

export default OrderDetailsPage;
