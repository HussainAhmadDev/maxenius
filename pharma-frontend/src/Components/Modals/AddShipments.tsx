import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ModalInterface } from "Interfaces/ModalInterface";
import ModalPopUp from "Components/ModalPopup";
import { OrderData, OrderProduct, OrderProductShipping } from "Interfaces/Order";
import DatePicker from "Components/Form/Date";
import { Grid } from "@mui/material";
// import get from "lodash/get";
import Button from "Components/Button";
import {
  useAddOrderShipment,
  useBarcodeScaning,
  useEditOrderProductShipping
} from "Hooks/useOrders";
import TextInput from "Components/Form/TextInput";
import MuiIcon from "Components/icons/MuiIcons";
import TextField from "@mui/material/TextField";
import { ukDateFormat } from "Utils/datesFormat";
import { useUser } from "Hooks/localStorageUser";
import ShippingReturnContext from "Context/ShippingReturnContext";

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
    },
    tableCell: {
      padding: "8px",
      // width: "110px",
      textAlign: "center"
    },
    productNameSku: {
      maxWidth: "200px",
      lineHeight: "18px",
      color: theme.palette.primary.main,
      display: "flex",
      alignItems: "center"
    },
    tableCellSku: {
      maxWidth: "200px",
      minWidth: "100px",
      display: "flex",
      padding: "17px",
      textAlign: "center",
      alignItems: "center"
    },
    row: {
      borderBottom: `0.5px solid ${theme.palette.gray[300]}`,
      "&:hover": {
        background: " #FFFFFF",
        boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.06)"
      }
    },
    truncate: {
      overflow: "hidden",
      whiteSpace: "nowrap",
      width: "100px",
      textOverflow: "ellipsis"
    },
    barcodeContainer: {
      display: "flex",
      justifyItems: "center",
      alignItems: "center",
      gap: "20px",
      marginBottom: "10px"
    }
  })
);

const AddShipments: React.FC<ModalInterface & { order: OrderData }> = props => {
  const classes = useStyles();
  const { order } = props;

  const [barcodeValue, setBarcodeValue] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { mutate, isLoading } = useBarcodeScaning(order?.id);

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      await mutate({
        barcode: barcodeValue
      });
      setBarcodeValue("");
    }
  };
  React.useEffect(() => {
    if (!isLoading) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isLoading]);

  const doNotAllow = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <ModalPopUp
        maxWidth="md"
        modalTitle={props.title}
        openModal={props.openModal}
        handleCloseModal={props.handleCloseModal}
      >
        <Grid className={classes.barcodeContainer}>
          <TextField
            label="Barcode"
            name="barcode"
            value={barcodeValue}
            onKeyPress={handleKeyPress}
            onChange={event => setBarcodeValue(event.target.value)}
            onCut={doNotAllow}
            onCopy={doNotAllow}
            onPaste={doNotAllow}
            autoComplete="off"
            disabled={isLoading}
            inputRef={inputRef}
          />
        </Grid>
        {order.products && order.products.length > 0 && (
          <table className={classes.table}>
            <thead className={classes.tHead}>
              <tr className={classes.tableHeader}>
                {/* <th className={classes.tableCell}>Product Number</th> */}
                {/* <th className={classes.tableCell}>Barcode</th> */}
                <th className={classes.tableCell}>Product Name</th>
                <th className={classes.tableCell}>Quantity</th>
                <th className={classes.tableCell}>Returned</th>
                <th className={classes.tableCell}>Shipped </th>
                <th className={classes.tableCell}>Date</th>
                <th className={classes.tableCell}></th>
              </tr>
            </thead>
            {
              // !updateUI ?
              order?.products?.map((item, index) => {
                return <ShipmentEditableRow key={index} data={item} order={order} />;
              })
              // : <h3>loading....</h3>
            }
          </table>
        )}
      </ModalPopUp>
    </div>
  );
};

// export default React.memo(AddShipments);
const MemoizedAddShipments = React.memo(AddShipments);
export default MemoizedAddShipments;

interface OrderProductState {
  quantity?: number;
  ship_date?: string;
  ordered_product_id: string;
  total_quantity?: number;
  returned_quantity?: number;
}

interface ProductTableProps {
  readonly data: OrderProduct;
  order: OrderData;
}

const ShipmentEditableRow: React.FC<ProductTableProps> = ({ data, order }) => {
  const classes = useStyles();
  const [state, setState] = React.useState<Partial<OrderProductState>>({
    quantity: data.quantity || 0,
    ship_date: data.ship_date || "",
    ordered_product_id: data.product_id
  });

  const { shippingInfo, setShippingInfo } = React.useContext(ShippingReturnContext);

  // React.useEffect(() => {
  //   if (shippingInfo.product_id && order?.products) {
  //     if (shippingInfo.product_id === data.id) {
  //       setState({
  //         quantity: shippingInfo?.shipped_quantity ?? data.quantity,
  //         ship_date: shippingInfo?.ship_date ?? data.ship_date,
  //         ordered_product_id: shippingInfo.product_id ?? data.product_id
  //       });
  //     }
  //   }
  // }, [shippingInfo, order?.products, data]);

  const { mutate: addShipment, isLoading } = useAddOrderShipment(order?.id || "");
  const { mutate: editShipment, isLoading: isLoadingEditShipping } =
    useEditOrderProductShipping(order?.id || "");

  const handleDoneEditing = () => {
    const objectToSend: Partial<Record<keyof OrderProductState, string | number>> = {};
    (Object.keys(state) as Array<keyof OrderProductState>).forEach(key => {
      const value = state[key];
      if (Number(value) >= 0 && key === "quantity") {
        objectToSend[key] = state[key];
      }
      if (key === "ship_date") {
        objectToSend[key] = state[key]
          ? new Date(state[key] as string).toISOString()
          : new Date().toISOString();
      } else {
        objectToSend[key] = state[key];
      }
    });
    const foundItem =
      order.products && order.products.find(item => item.id === shippingInfo.product_id);

    const alreadyInShipments = order?.product_shippings.find(
      shipping => shipping.ordered_product_id === data.id
    );
    if (alreadyInShipments || foundItem) {
      editShipment({
        ordered_product_id: data.id,
        quantity: (state.quantity || 0) - (data.shipped_quantity || 0),
        ship_date: state.ship_date || shippingInfo.ship_date || "",
        shipmentId: alreadyInShipments?.id
          ? alreadyInShipments?.id
          : shippingInfo.id || ""
      });
    } else {
      addShipment(objectToSend as Omit<OrderProductShipping, "id" | "created">);
    }
    setState({});
  };

  const user = useUser();

  const [isAllowed, setIsAllowed] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (user) {
      if (user?.is_superuser || user?.is_manager) {
        setIsAllowed(true);
      }
    }
  }, [user]);

  return state?.ordered_product_id === data?.id ? (
    <tbody>
      <tr>
        {/* <td className={classes.tableCell}>
          <div className={classes.productNameSku}>
        
            {data?.product?.sku}
          </div>
        </td> */}
        {/* <td className={classes.tableCell}>
          <div className={`${classes.truncate} ${classes.productName}`}>
            {data?.product?.barcode}
          </div>
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
        <td className={classes.tableCell}>{data?.quantity}</td>
        <td className={classes.tableCell}>
          {data?.order_product_return
            ?.map(item => +item.return_shipment.quantity)
            .reduce((sum, quantity) => sum + quantity, 0) || 0}
        </td>
        <td className={classes.tableCell}>
          <TextInput
            name="shipped_quantity"
            margin="dense"
            type="number"
            value={state.quantity}
            variant="outlined"
            onChange={e => {
              const quantity = parseInt(e.target.value);
              if (Number(quantity) >= 0 && Number(data.quantity) >= quantity) {
                setState({ ...state, quantity: quantity });
              }
            }}
            inputProps={{ inputMode: "numeric" }} //
            style={{ width: "60px", margin: "auto" }}
          />
        </td>
        <td className={classes.tableCell}>
          <DatePicker
            onChange={(e: Date | null) => {
              if (e) setState({ ...state, ship_date: e.toISOString() });
            }}
            //eslint-disable-next-line
            //@ts-ignore
            value={
              state.ship_date
                ? ukDateFormat(state.ship_date, false)
                : ukDateFormat(new Date(), false)
            }
            label=""
          />
        </td>
        <td className={classes.tableCell}>
          <div className={classes.iconCell}>
            <Button
              icon={<MuiIcon fontSize="small" icon="check" />}
              onlyIcon={true}
              type="secondary"
              variant="outlined"
              onClick={handleDoneEditing}
              disabled={
                (state?.quantity ?? 0) + (state?.returned_quantity ?? 0) >
                (state?.total_quantity ?? 0)
              }
              size="small"
            />
            &nbsp;&nbsp;
            <Button
              size="small"
              icon={<MuiIcon icon="cancel" />}
              onlyIcon={true}
              onClick={() => {
                setState({});
              }}
              type="secondary"
              variant="outlined"
            />{" "}
          </div>
        </td>
      </tr>
    </tbody>
  ) : (
    <tbody>
      <tr className={classes.row}>
        {/* <td className={classes.tableCell}>
          <div className={classes.productNameSku}>{data?.product?.sku}</div>
        </td> */}
        {/* <td className={classes.tableCell}>
          <div className={classes.productName}>{data?.product?.barcode}</div>
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
        <td className={classes.tableCell}>{data?.quantity}</td>

        <td className={classes.tableCell}>
          {data?.order_product_return
            ?.map(item => +item.return_shipment.quantity)
            .reduce((sum, quantity) => sum + quantity, 0) || 0}
        </td>

        <td className={classes.tableCell}>{data?.shipped_quantity || 0}</td>
        <td className={classes.tableCell}>
          {data?.ship_date ? ukDateFormat(data?.ship_date, false) : "--"}
        </td>
        {isAllowed && (
          <td className={classes.tableCell}>
            <div className={classes.iconCell}>
              <Button
                loading={isLoading || isLoadingEditShipping}
                icon={<MuiIcon fontSize="small" icon="edit" />}
                onlyIcon={true}
                onClick={() => {
                  if (data.id !== shippingInfo.product_id) {
                    setShippingInfo({
                      id: null,
                      ship_date: null,
                      shipped_quantity: null,
                      product_id: null
                    });
                  }
                  setState({
                    ordered_product_id: data?.id,
                    total_quantity: data?.quantity,
                    returned_quantity:
                      data?.order_product_return
                        ?.map(item => +item.return_shipment.quantity)
                        .reduce((sum, quantity) => sum + quantity, 0) || 0,
                    quantity: data.shipped_quantity || 0,
                    ship_date: data.ship_date || ""
                  });
                }}
                type="secondary"
                variant="outlined"
                disabled={order.is_trash}
                size="small"
              />
            </div>
          </td>
        )}
      </tr>
    </tbody>
  );
};
