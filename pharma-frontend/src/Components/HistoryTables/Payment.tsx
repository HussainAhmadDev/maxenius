import * as React from "react";
import Grid from "@mui/material/Grid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import DataTable from "../DataTable/Table";
import Button from "../Button";
import MuiIcon from "../icons/MuiIcons";
import PaymentModal from "../Payments/PaymentModal";
import { useModal } from "../../Hooks/useModal";
import { EmptyData } from "../icons/EmptyData";
import PaymentResponseModal from "./PaymentResponseModal";
import { OrderData, PaymentData } from "Interfaces/Order";
import { useAddOrderPayment } from "Hooks/usePayment";
import { ukDateFormat } from "Utils/datesFormat";
import { useBrand } from "Context/BrandContext";

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  readonly selector: (row: PaymentData) => string | React.ReactNode | undefined;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnStatus: {
      border: `1px solid ${theme.palette.green.success}`,
      color: theme.palette.green.success,
      background: theme.palette.green.successBg,
      borderRadius: "50px",
      padding: "6px",
      fontSize: "10.8px"
    },
    chip: {
      marginTop: "6px",
      border: `1px solid ${theme.palette.green.success}`,
      color: theme.palette.green.success,
      background: theme.palette.green.successBg
    }
  })
);

interface Props {
  order: OrderData;
}

const Payment = ({ order }: Props) => {
  const classes = useStyles();
  const { status, mutate: addPayment } = useAddOrderPayment(order.id);
  const paymentResponseModal = useModal();
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({});

  const { currencySymbol } = useBrand();

  React.useEffect(() => {
    if (status === "success" || status === "error") {
      handleModalClose();
      paymentResponseModal.handleModalOpen();
    }
  }, [status]); // eslint-disable-line

  const columns: ColumnsProps[] = [
    {
      name: "Date",
      selector: row => ukDateFormat(row.created, false)
    },
    {
      name: "Payment Method",
      selector: row => row?.payment_method?.name
    },
    {
      name: "Transaction ID",
      selector: row => row?.receipt
    },
    {
      name: "Paid",
      selector: row => `${currencySymbol}${Number(row.total).toFixed(2)}`
    },
    {
      name: "Refunded",
      selector: row => `${row.is_refunded ? "YES" : "NO"}`
    },
    {
      name: "Status",
      selector: row => (
        <button className={classes.btnStatus}> {row.status.toUpperCase()} </button>
      )
    }
  ];

  return (
    <div id="payments">
      <PaymentModal
        title="Add Payment"
        saveText="Save"
        handleCloseModal={handleModalClose}
        handleSaveChanges={handleSave}
        openModal={modalOpen}
        order={order}
        addPayment={addPayment}
        paymentSuccess={status === "success"}
        saveBtnLoading={status === "loading"}
      />
      <PaymentResponseModal
        openModal={paymentResponseModal.modalOpen}
        handleCloseModal={paymentResponseModal.handleModalClose}
        handleSaveChanges={() => {
          paymentResponseModal.handleModalClose();
          if (status === "success") {
            handleModalOpen();
          } else {
            // Retry adding payment
            paymentResponseModal.handleModalClose();
            handleModalOpen();
          }
        }}
        type={status === "success" ? "success" : "fail"}
      />
      <h2>Payment History</h2>
      {order.payments?.length > 0 ? (
        <DataTable columns={columns} data={order.payments} />
      ) : (
        <div style={{ width: "40%", marginLeft: "40%" }}>
          <EmptyData height={100} />
          <p>No payments added yet</p>
        </div>
      )}
      <br />
      <Grid container>
        <Grid item lg={2} xs={6}>
          <Button
            onClick={handleModalOpen}
            text="Add Payment"
            type="secondary"
            icon={<MuiIcon icon="add" />}
            disabled={!order.products?.length || order.is_trash}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Payment;
