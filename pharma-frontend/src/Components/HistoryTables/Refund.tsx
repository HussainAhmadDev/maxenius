import * as React from "react";
import Chip from "@material-ui/core/Chip";
import Grid from "@mui/material/Grid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import DataTable from "Components/DataTable/Table";
import Button from "Components/Button";
import AddRefundModel from "Components/Modals/AddRefund";
import MuiIcon from "Components/icons/MuiIcons";
import { useModal } from "Hooks/useModal";
import { EmptyData } from "Components/icons/EmptyData";
import { OrderData } from "Interfaces/Order";

interface OrderRefund {
  method: string;
  transaction_id: string;
  paid_amount: number;
  refunded: string;
  net_paid: number;
  pending_refund: number;
  date: string;
  status: string;
}

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  readonly selector: (row: OrderRefund) => string | React.ReactNode | undefined;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

const Refund: React.FC<Props> = ({ order }) => {
  const classes = useStyles();
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => {
      // will add funtion later
    }
  });

  const columns: ColumnsProps[] = [
    {
      name: "Method",
      selector: row => `${row.method}`
    },

    {
      name: "Transaction ID",
      selector: row => `${row.transaction_id}`
    },
    {
      name: "Paid",
      selector: row => `${row.paid_amount.toFixed(2)}`
    },
    {
      name: "Refunded",
      selector: row => `${row.refunded}`
    },
    {
      name: "Net Paid",
      selector: row => `${row.net_paid.toFixed(2)}`
    },
    {
      name: "Pending Refund",
      selector: row => `${row.pending_refund.toFixed(2)}`
    },
    {
      name: "Date",
      selector: row => `${row.date}`
    },
    {
      name: "Status",
      selector: row => <Chip className={classes.chip} label={row.status} />
    }
  ];

  const refundedProducts = React.useMemo(() => {
    if (order?.order_refunds?.length > 0) {
      const filteredProducts: OrderRefund[] = order.order_refunds.map(refund => {
        const payment = order.payments.find(
          payment => refund.order_payment_id === payment.id
        );
        const pendingRefund =
          (payment?.total || 0) -
          order.order_refunds
            .filter(refund => refund.order_payment_id === payment?.id)
            .reduce((a, b) => a + b.total, 0);
        return {
          method: payment?.payment_provider || "",
          transaction_id: payment?.receipt || "",
          paid_amount: payment?.total || 0,
          refunded: payment?.is_refunded ? "Yes" : "No",
          net_paid: refund?.total || 0,
          pending_refund: pendingRefund,
          date: new Date(refund?.created || "").toLocaleDateString(),
          status: refund?.status || "--"
        };
      });

      return filteredProducts;
    }
    return [];
  }, [order?.order_refunds, order?.payments]);

  return (
    <>
      <AddRefundModel
        order={order}
        saveText="Confirm Refund"
        title="Add Refund"
        handleSaveChanges={handleSave}
        handleCloseModal={handleModalClose}
        openModal={modalOpen}
      />
      <h2>Refund History</h2>
      {refundedProducts?.length > 0 ? (
        <DataTable columns={columns} data={refundedProducts} />
      ) : (
        <div style={{ width: "40%", marginLeft: "40%" }}>
          <EmptyData height={100} />
          <p>No refunds added yet</p>
        </div>
      )}
      <br />
      <Grid container>
        <Grid lg={2} xs={6} item>
          <Button
            disabled={
              !order.payments || !(order.payments.length > 0) || order.return_amount < 0
            }
            text="Add Refund"
            type="secondary"
            icon={<MuiIcon icon="add" />}
            onClick={() => handleModalOpen()}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Refund;
