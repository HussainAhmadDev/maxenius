import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { NavBar } from "Components/Navbar";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import AddCustomerInfo from "./AddCustomerInfo";
import { Typography } from "@material-ui/core";
import { useCompany } from "Hooks/useCompanies";
import { useCreateOrder } from "Hooks/useOrders";
import Prompt from "Components/Prompt";
import { useFormik } from "formik";
import { useUpdateCompany } from "Hooks/useCompanies";
import { CompanyData } from "Interfaces/Company";
import Contacts from "Components/Customer/Contacts";
import TaxExemption from "Components/Customer/TaxExemption";

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
    },
    markActiveDiv: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    iconLabel: {
      display: "flex",
      alignItems: "center"
    },
    TypeSection: {
      display: "flex",
      alignItems: "center",
      marginLeft: theme.spacing(6),
      [theme.breakpoints.down("md")]: {
        marginLeft: 0
      }
    },
    checkedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.primary.main}`,
      marginRight: "5px"
    },
    unCheckedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.gray[300]}`,
      marginRight: "5px",
      color: theme.palette.gray[400]
    },

    infoIcon: {
      margin: "8px",
      color: theme.palette.gray[400]
    }
  })
);

interface State {
  from?: string;
  isEdit?: boolean;
}
const AddCustomer: React.FC = () => {
  const location = useLocation();
  const state = location.state as State;
  const navigate = useNavigate();
  const classes = useStyles();
  const [showWarning, setShowWarning] = React.useState(false);
  const { id: customerId } = useParams<"id">();
  const { data: customer, isLoading } = useCompany(customerId || "");
  const { mutateAsync: updateCompany } = useUpdateCompany(customerId as string);
  const {
    data: orderData,
    mutate: createOrder,
    isLoading: isLoadingCreateOrder
  } = useCreateOrder();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      customer || ({ is_individual: false, tax_exempt_id: "" } as CompanyData),
    onSubmit: values => {
      updateCompany({
        name: values.is_individual ? "" : values.name,
        is_individual: values.is_individual,
        is_tax_exempt: values.is_tax_exempt,
        tax_exempt_id: values.tax_exempt_id || "",
        brand_id: values.brand_id
      });
    }
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Prompt
          promptMsg={"This will create a new order for this customer."}
          title={`Create new Order`}
          openModal={showWarning}
          onCancel={() => setShowWarning(false)}
          onProceed={() => {
            setShowWarning(false);
            if (customer) {
              createOrder({
                company_id: customer?.id,
                brand_id: customer?.brand_id || "",
                contact_id:
                  customer?.billing_contact?.id || customer?.shipping_contact?.id || "",
                website_id: ""
              });
              if (orderData) navigate(`/orders/${orderData?.id}`);
            }
          }}
        />
        <NavBar pageTitle={`${state?.isEdit ? "Edit" : "Add"} Customer`}>
          <div className={classes.headerButtons}>
            <Button
              aria-label="cancel"
              text="Cancel"
              type="secondary"
              onClick={() => navigate(-1)}
              style={{ marginRight: 8 }}
            />
            <Button
              aria-label="Save Customer"
              text="Save Customer"
              variant="contained"
              onClick={formik.handleSubmit}
              style={{ marginRight: 8 }}
              submit={"submit"}
            />
            <Button
              ariaLabel="take order with this customer"
              text="Take Order"
              variant="contained"
              loading={isLoading || isLoadingCreateOrder}
              disabled={
                Boolean(!customer?.billing_contact) ||
                Boolean(!customer?.shipping_contact)
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
                onClick={() => navigate("/customers")}
              >
                <p>
                  <MuiIcon icon="backArrow" fontSize="small" />
                </p>{" "}
                &nbsp;
                <p>Customers</p>
              </div>
            </Typography>
          </Grid>
          <Grid container>
            <Grid item sm={12} xs={12}>
              <AddCustomerInfo formik={formik} />
            </Grid>
          </Grid>
        </div>
        <Contacts />
        <TaxExemption formik={formik} />
      </form>
    </div>
  );
};

export default AddCustomer;
