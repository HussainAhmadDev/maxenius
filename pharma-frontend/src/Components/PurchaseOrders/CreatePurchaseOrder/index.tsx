import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { NavBar } from "../../Navbar";
import Button from "../../Button";
import MuiIcon from "../../icons/MuiIcons";
import PurchaseOrderEditForm from "./PurchaseOrderEditForm";
import PurchaseOrderEditTable from "./PurchaseOrderEditTable";
import { usePurchaseOrderContext } from "Context/PurchaseOrderContext";
import { toast } from "react-toastify";
import { useGeneratePOReport } from "Hooks/usePurchaseOrders";
import { generatePDF } from "./generatePDF";
import { StaticData } from "./data";

// import 'jspdf-autotable';

interface IProps {
  title?: string;
  newPurchaseOrder?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end"
    },
    customerBackDiv: {
      display: "flex",
      color: theme.palette.gray[400],
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

const CreatePurchaseOrder: React.FC<IProps> = ({ newPurchaseOrder }) => {
  const navigate = useNavigate();
  const { id } = useParams<string>();
  const classes = useStyles();
  const { onSave, purchaseOrderBody, loadingCreatePO, setLoadingCreatePO } =
    usePurchaseOrderContext();

  const validationHandler = () => {
    setLoadingCreatePO(true);
    if (!purchaseOrderBody?.warehouse?.value && !purchaseOrderBody?.supplier?.value) {
      setLoadingCreatePO(false);
      toast.error("Location and Vendor are required");
    } else if (!purchaseOrderBody?.warehouse?.value) {
      setLoadingCreatePO(false);
      toast.error("Please Select Location");
    } else if (!purchaseOrderBody?.supplier?.value) {
      setLoadingCreatePO(false);
      toast.error("Please Select Vendor");
    } else {
      onSave();
    }
  };

  //eslint-disable-next-line
  const { mutateAsync: generateReport, isLoading } = useGeneratePOReport();
  const po_id = useParams();

  return (
    <div>
      <NavBar pageTitle={`${id ? "Edit" : "Create"} Purchase Order`} purchaseOrder={true}>
        <div className={classes.headerButtons}>
          <Button
            text="Cancel"
            type="secondary"
            onClick={() => navigate("/purchase-orders")}
          />
          &nbsp;
          {po_id?.id && (
            <Button
              disabled={isLoading}
              loading={isLoading}
              text="Generate PDF"
              type="secondary"
              submit="submit"
              onClick={() => {
                if (po_id?.id) {
                  generateReport({ purchase_order_id: po_id?.id })?.then(res => {
                    const data = res as unknown as StaticData;
                    generatePDF(data);
                  });
                }
              }}
            />
          )}
          &nbsp;
          <Button
            disabled={loadingCreatePO}
            loading={loadingCreatePO}
            text="Save"
            variant="contained"
            submit="submit"
            onClick={validationHandler}
          />
        </div>
      </NavBar>
      <Grid container item alignItems={"center"} justifyContent={"center"} padding={1}>
        <Grid container justifyContent="space-between">
          {/* Back Icon */}
          <Grid container>
            <div className={classes.customerBackDiv} onClick={() => navigate(-2)}>
              <p>
                <MuiIcon icon="backArrow" fontSize="small" />
                Purchase Order
              </p>
            </div>
          </Grid>
        </Grid>
        {/* Back Icon */}
        <Grid container spacing={2}>
          {/* Info Section */}
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <PurchaseOrderEditForm />
            <br />
            <PurchaseOrderEditTable
              newPurchaseOrder={newPurchaseOrder}
              isLoading={false}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreatePurchaseOrder;
