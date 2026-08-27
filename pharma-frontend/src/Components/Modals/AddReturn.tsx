import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ModalInterface } from "Interfaces/ModalInterface";
import ModalPopUp from "Components/ModalPopup";
// import { Avatar } from "@mui/material";
// import get from "lodash/get";
import { OrderData, OrderProduct } from "Interfaces/Order";
import TextInput from "Components/Form/TextInput";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import { useAddOrderReturn, useUpdateOrderReturn } from "Hooks/useOrders";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      marginTop: "6px"
    },
    imgDiv: {
      display: "flex",
      textAlign: "center",
      color: "red",
      padding: "2px"
    },
    productName: {
      whiteSpace: "normal",
      color: theme.palette.primary.main
    },
    container: {
      borderTop: `1px solid ${theme.palette.gray[700]}`,
      padding: "10px 0px 10px 0px"
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
    },
    tableCell: {
      padding: "17px",
      // width: "150px",
      textAlign: "center"
    },

    tableCellSku: {
      maxWidth: "200px",
      minWidth: "100px"
    },
    row: {
      borderBottom: `0.5px solid ${theme.palette.gray[300]}`,
      "&:hover": {
        background: " #FFFFFF",
        boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.06)"
      }
    },
    iconCell: {
      display: "flex"
    }
  })
);

const AddReturnModal: React.FC<ModalInterface & { order: OrderData }> = props => {
  const classes = useStyles();
  const { order } = props;

  return (
    <div>
      <ModalPopUp
        maxWidth="md"
        modalTitle={props.title}
        openModal={props.openModal}
        handleCloseModal={props.handleCloseModal}
      >
        {order.products && order.products.length > 0 && (
          <table className={classes.table}>
            <thead className={classes.tHead}>
              <tr className={classes.tableHeader}>
                {/* <th className={classes.tableCell}>Product Number</th> */}
                <th className={classes.tableCell}>Product Name</th>
                <th className={classes.tableCell}>Price</th>
                <th className={classes.tableCell}>Qty Ordered</th>
                <th className={classes.tableCell}>Returned </th>
                <th className={classes.tableCell}>Shipping Qty</th>
                <th className={classes.tableCell}>Current Qty</th>
                <th className={classes.tableCell}>Return</th>
                <th className={classes.tableCell}></th>
              </tr>
            </thead>
            {order?.products?.map((item, index) => (
              <ReturnEditableRow key={index} data={item} order={order} />
            ))}
          </table>
        )}
        <div className={classes.container}>
          <div className={classes.subConatiner}>
            <div className={classes.paidAmountDiv}>
              <span className={classes.paidAmount}>
                Paid Amount £{(order.paid_amount || 0).toFixed(2)}
              </span>
            </div>
            <div className={classes.refundAmountDiv}>
              <span className={classes.refundAmount}>
                Refunded £{order.return_amount ? order.return_amount.toFixed(2) : "0.00"}
              </span>
            </div>
          </div>
        </div>
      </ModalPopUp>
    </div>
  );
};

export default AddReturnModal;

// interface ProductReturnState {
//   quantity: number;
//   id: string;
// }

interface ProductTableProps {
  readonly data: OrderProduct;
  order: OrderData;
}

const ReturnEditableRow: React.FC<ProductTableProps> = ({ data, order }) => {
  const classes = useStyles();

  const [returnedQty, setReturnedQty] = React.useState<number | undefined>(undefined);
  const [changedQuantity, setChangedQuantity] = React.useState<number | undefined>(0);

  React.useEffect(() => {
    if (data) {
      const returnQuantity = data?.order_product_return.find(
        item => item.ordered_product_id === data.id && item
      );
      if (returnQuantity) {
        setReturnedQty(returnQuantity?.return_shipment?.quantity);
      }
    }
  }, [data, order]);

  const { mutate: addReturn, isLoading: addLoading } = useAddOrderReturn(order?.id || "");
  const { mutate: updateReturn, isLoading: updateLoading } = useUpdateOrderReturn(
    order?.id || ""
  );

  const handleDoneEditing = (data: OrderProduct) => {
    const productFound = data?.order_product_return?.find(
      item => data?.id === item?.ordered_product_id
    );

    if (productFound?.id) {
      updateReturn({
        quantity: changedQuantity ?? productFound?.return_shipment.quantity,
        ordered_product_id: productFound?.ordered_product_id,
        return_id: productFound.id
      });
    } else {
      addReturn({
        quantity: changedQuantity ?? productFound?.return_shipment.quantity,
        ordered_product_id: data?.id
      });
    }
    setChangedQuantity(0);
  };

  return (
    <tbody>
      <tr>
        {/* <td className={classes.tableCellSku}>
          <Avatar
            style={{ margin: "auto" }}
            variant="square"
            alt={`${get(data, "product.name")}`}
            src={get(data, "product.image", "")}
          />
        </td> */}
        {/* <td className={classes.tableCell}>
          <div className={classes.productName}>{data?.product?.sku}</div>
        </td> */}
        <td className={classes.tableCell}>
          <div className={classes.productName}>
            <>
              {data?.product?.name}
              <div>
                {order?.products?.map(item => {
                  const returnItem = data?.id === item?.id;
                  return (
                    <div key={item?.id} style={{ color: "black" }}>
                      {returnItem && item?.prescription_id
                        ? `Prescription id: ${item?.prescription_id} `
                        : ""}
                    </div>
                  );
                })}
              </div>
            </>
          </div>
        </td>
        <td className={classes.tableCell}>
          <div>
            {order?.products?.map(item => {
              const returnItem = data?.id === item?.id;
              return <div key={item?.id}>{returnItem ? item?.unit_price : ""}</div>;
            })}
          </div>
        </td>
        <td className={classes.tableCell}>{data?.quantity}</td>
        <td className={classes.tableCell}>{returnedQty ?? 0}</td>

        {/* static data */}
        <td className={classes.tableCell}>{Number(data?.shipped_quantity) || 0}</td>
        {/* static condition */}
        <td className={classes.tableCell}>
          {data?.quantity - (returnedQty ?? 0) - Number(data?.shipped_quantity) || 0}
        </td>
        <>
          <td className={classes.tableCell}>
            <TextInput
              // disabled={isLoading}
              name="shipped_quantity"
              margin="dense"
              type="number"
              value={changedQuantity}
              variant="outlined"
              onChange={e => {
                {
                  /* static condition */
                }
                const quantity = parseInt(e.target.value);
                if (
                  Number(quantity) >= 0 &&
                  Number(
                    (data?.quantity || 0) -
                      (returnedQty ?? 0) -
                      Number(data?.shipped_quantity) || 0
                  ) >= quantity
                ) {
                  setChangedQuantity(quantity);
                }
              }}
              style={{ width: "80%", margin: "auto" }}
            />
          </td>

          <td className={classes.tableCell}>
            <div className={classes.iconCell}>
              <Button
                loading={updateLoading || addLoading}
                icon={<MuiIcon fontSize="small" icon="check" />}
                onlyIcon={true}
                type="secondary"
                variant="outlined"
                onClick={() => handleDoneEditing(data)}
                size="small"
                disabled={
                  Number(data?.quantity) === 0 || data?.quantity === returnedQty
                    ? true
                    : false
                }
              />
            </div>
          </td>
        </>
      </tr>
    </tbody>
  );
};
