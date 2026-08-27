import * as React from "react";
import { Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate, useParams } from "react-router-dom";
import MuiIcon from "Components/icons/MuiIcons";
import CustomerInfoSection from "./CustomerInfoSection";
import CustomersOrders from "./CustomersOrder";
import CustomerLogs from "./CustomersLogs";
import { NavBar } from "Components/Navbar";
import Button from "Components/Button";
import { useCompany, useRestoreCustomer, useTrashCompany } from "Hooks/useCompanies";
import Prompt from "Components/Prompt";
import { useCreateOrder } from "Hooks/useOrders";

const useStyles = makeStyles((theme: Theme) =>
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
const AddCustomer: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id: companyId } = useParams<"id">();
  const { data: company, isLoading } = useCompany(companyId as string);
  const {
    data: orderData,
    mutate: createOrder,
    isLoading: isLoadingCreateOrder
  } = useCreateOrder();
  const { mutateAsync: trashCustomer, isLoading: isLoadingTrashOrder } =
    useTrashCompany();
  const { mutateAsync: restoreCustomer, isLoading: isLoadingRestoreOrder } =
    useRestoreCustomer();
  const [tabValue, setTabValue] = React.useState(0);
  const [showWarning, setShowWarning] = React.useState(false);
  const [showTrashWarning, setShowTrashWarning] = React.useState(false);
  const handleChangeTab = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Prompt
        promptMsg={`This will ${
          company?.is_trash ? "restore" : "trash"
        } customer number ${company?.number}.`}
        title={`${company?.is_trash ? "Restore" : "Trash"} Customer`}
        openModal={showTrashWarning}
        onCancel={() => setShowTrashWarning(false)}
        onProceed={() => {
          setShowTrashWarning(false);
          if (company) {
            company?.is_trash
              ? restoreCustomer({ customerId: company.id })
              : trashCustomer({ customerId: company.id });
          }
        }}
      />
      <Prompt
        promptMsg={"This will create a new order for this customer."}
        title={`Create new Order`}
        openModal={showWarning}
        onCancel={() => setShowWarning(false)}
        onProceed={() => {
          setShowWarning(false);
          if (company) {
            createOrder({
              company_id: company?.id,
              brand_id: company?.brand_id || "",
              contact_id:
                company?.billing_contact?.id || company?.shipping_contact?.id || "",
              website_id: ""
            });
            if (orderData) navigate(`/orders/${orderData?.id}`);
          }
        }}
      />
      <NavBar pageTitle={`Customer No: ${company?.number}`}>
        <div className={classes.headerButtons}>
          <Button
            ariaLabel={`${company?.is_trash ? "restore" : "trash"} this customer`}
            text={`${company?.is_trash ? "Restore" : "Trash"} Customer`}
            type="secondary"
            loading={isLoadingTrashOrder || isLoadingRestoreOrder}
            onClick={() => {
              setShowTrashWarning(true);
            }}
            style={{ marginRight: 8 }}
          />
          <Button
            ariaLabel="take order with this customer"
            text="Take Order"
            variant="contained"
            loading={isLoading || isLoadingCreateOrder}
            disabled={
              Boolean(!company?.name) ||
              Boolean(!company?.billing_contact) ||
              Boolean(!company?.shipping_contact)
            }
            onClick={() => {
              setShowWarning(true);
            }}
          />
        </div>
      </NavBar>
      <div style={{ padding: 30 }}>
        <Grid container>
          <Typography variant="body2">
            <div
              className={classes.customerBackDiv}
              onClick={() => navigate("/Patients")}
            >
              <p>
                <MuiIcon icon="backArrow" fontSize="small" />
              </p>{" "}
              &nbsp;
              <p>Customers</p>
            </div>
          </Typography>
        </Grid>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeTab}
          aria-label="disabled tabs example"
        >
          <Tab label="Customer Info" />
          <Tab label="Orders" />
          {/* <Tab label="Logs" /> */}
        </Tabs>
        {tabValue === 0 ? (
          <CustomerInfoSection />
        ) : tabValue === 1 ? (
          <CustomersOrders customerNumber={company?.number} />
        ) : (
          <CustomerLogs />
        )}
      </div>
    </div>
  );
};

export default AddCustomer;
