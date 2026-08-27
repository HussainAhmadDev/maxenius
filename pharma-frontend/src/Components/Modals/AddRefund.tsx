import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ModalInterface } from "Interfaces/ModalInterface";
import ModalPopUp from "Components/ModalPopup";
import { OrderData, PaymentData } from "Interfaces/Order";
import TextInput from "Components/Form/TextInput";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import { useAddOrderRefund } from "Hooks/useOrders";
import { usePaymentStatus } from "Hooks/usePayment";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      marginTop: "6px",
      color: theme.palette.gray[1500],
      border: `1px solid ${theme.palette.gray[1500]}`,
      borderRadius: "8px",
      padding: "8px"
    },
    imgDiv: {
      display: "flex",
      textAlign: "center",
      color: "red",
      padding: "2px"
    },
    method: {
      whiteSpace: "normal"
    },
    container: {
      borderTop: `1px solid ${theme.palette.gray[700]}`,
      padding: "10px 0px 10px 0px"
    },
    container1: {
      padding: "0px 0px 10px 0px"
    },
    subConatiner: {
      border: `1px solid ${theme.palette.gray[700]}`,
      background: theme.palette.gray[100],
      padding: "10px 0px 10px 0px",
      display: "flex",
      borderRadius: "6px"
    },
    paidAmountDiv: {
      padding: "5px",
      width: "50%"
    },
    paidAmount: {
      color: theme.palette.gray[600],
      fontWeight: "bold",
      marginLeft: "10px"
    },
    refundAmountDiv: {
      padding: "5px",
      width: "50%"
    },
    refundAmount: {
      fontWeight: "bold",
      color: theme.palette.primary.main,
      marginLeft: "10px"
    },
    refundableAmount: {
      fontWeight: "bold",
      color: theme.palette.primary.main,
      marginLeft: "10px"
    },
    tableCellSku: {
      maxWidth: "200px",
      minWidth: "100px"
    },
    tableCell: {
      padding: "17px",
      // width: "150px",
      textAlign: "center"
    },
    iconCell: {
      display: "flex"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    tHead: { borderCollapse: "collapse" },
    tableBody: {
      // overflowX: "auto"
    },
    tableHeader: {
      background: theme.palette.gray[1000],
      borderRadius: "6px 6px 0px 0px",
      height: "52px",
      color: theme.palette.gray[500],
      fontSize: "12px"
    }
  })
);

const AddRefund: React.FC<ModalInterface & { order: OrderData }> = props => {
  const classes = useStyles();
  const { order } = props;
  return (
    <div>
      <ModalPopUp
        maxWidth="lg"
        modalTitle={props.title}
        openModal={props.openModal}
        handleCloseModal={props.handleCloseModal}
        checkBox={props.checkBox}
      >
        {/* Table  */}
        {order.payments?.length && (
          <>
            <div className={classes.container1}>
              <div className={classes.subConatiner}>
                <span className={classes.refundableAmount}>
                  Total Refundable Amount $
                  {order.return_amount ? Number(order.return_amount).toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
            <table className={classes.table}>
              <thead className={classes.tHead}>
                <tr className={classes.tableHeader}>
                  <th className={classes.tableCell}>Method</th>
                  <th className={classes.tableCell}>Transaction ID</th>
                  <th className={classes.tableCell}>Paid</th>
                  <th className={classes.tableCell}>Refunded</th>
                  <th className={classes.tableCell}>Net Paid </th>
                  <th className={classes.tableCell}>Pending Refund</th>
                  <th className={classes.tableCell}>Status</th>
                  <th className={classes.tableCell}>Add Refund</th>
                  <th className={classes.tableCell}></th>
                </tr>
              </thead>
              {order?.payments?.map(item => (
                <RefundEditableRow key={item.id} data={item} order={order} />
              ))}
            </table>
            <div className={classes.container}>
              <div className={classes.subConatiner}>
                <div className={classes.paidAmountDiv}>
                  <span className={classes.paidAmount}>
                    Paid Amount ${(order.paid_amount || 0).toFixed(2)}
                  </span>
                </div>
                <div className={classes.refundAmountDiv}>
                  <span className={classes.refundAmount}>
                    Amount To Refund $
                    {order.return_amount
                      ? Number(order.return_amount).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Table  */}
      </ModalPopUp>
    </div>
  );
};

export default AddRefund;

interface ProductReturnState {
  total: number;
  receipt: string;
  id: string;
}

interface ProductTableProps {
  readonly order: OrderData;
  readonly data: PaymentData;
}

const RefundEditableRow: React.FC<ProductTableProps> = ({ data, order }) => {
  const classes = useStyles();
  const [state, setState] = React.useState<ProductReturnState>({
    total: 0,
    receipt: data.payment_provider === "offline" ? "" : data.receipt,
    id: data.id
  });
  const { mutate, isLoading } = useAddOrderRefund(order.id);
  const {
    data: payment_status,
    isLoading: isLoadingStatus,
    isError
  } = usePaymentStatus(data.id, data.type);

  const handleDoneEditing = () => {
    mutate({
      payment_id: data.id,
      user_id: data.user.id,
      brand_id: order.brand_id,
      company_id: order.company_id,
      order_id: order.id,
      payment_provider: data.payment_provider,
      total: state.total,
      receipt: state.receipt
    });
  };

  const netPaid = order.order_refunds
    .filter(refund => refund.order_payment_id === data.id)
    .reduce((a, b) => a + b.total, 0);

  const pendingRefund = Number((data.total - netPaid).toFixed(2));

  return (
    <tbody key={data.id}>
      <tr>
        <td className={classes.tableCell}>
          <div>{data?.payment_provider}</div>
        </td>
        <td className={classes.tableCell}>
          {data.payment_provider === "offline" ? (
            <TextInput
              name="reciept"
              margin="dense"
              type="text"
              value={state.receipt}
              variant="outlined"
              onChange={e => {
                setState({ ...state, receipt: e.target.value });
              }}
              style={{ width: "80%", margin: "auto" }}
            />
          ) : (
            <div>{data?.receipt}</div>
          )}
        </td>
        <td className={classes.tableCell}>{data?.total.toFixed(2)}</td>
        <td className={classes.tableCell}>{data?.is_refunded ? "Yes" : "No"}</td>
        <td className={classes.tableCell}>{netPaid.toFixed(2)}</td>
        <td className={classes.tableCell}>{pendingRefund}</td>
        <td className={classes.tableCell}>
          <p className={classes.chip}>{data?.status}</p>
        </td>
        <td className={classes.tableCell}>
          <TextInput
            name="refund_total"
            margin="dense"
            type="number"
            value={state.total}
            variant="outlined"
            onChange={e => {
              const refund = Number(e.target.value);
              if (refund > 0 && refund <= pendingRefund) {
                setState({ ...state, total: refund });
              }
            }}
            style={{ width: "80%", margin: "auto" }}
          />
        </td>
        <td className={classes.tableCell}>
          <div className={classes.iconCell}>
            <Button
              loading={isLoading}
              icon={<MuiIcon fontSize="small" icon="check" />}
              onlyIcon={true}
              type="secondary"
              variant="outlined"
              onClick={handleDoneEditing}
              size="small"
              disabled={
                state.total <= 0 ||
                (data.type === "offline" && !state.receipt) ||
                (data.type === "credit_card" &&
                  (isLoadingStatus ||
                    isError ||
                    payment_status?.status === "capturedPendingSettlement"))
              }
            />
          </div>
        </td>
      </tr>
    </tbody>
  );
};
