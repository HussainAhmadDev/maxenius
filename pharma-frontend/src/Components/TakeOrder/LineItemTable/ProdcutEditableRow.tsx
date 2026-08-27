import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Box, Modal } from "@mui/material";
import TextInput from "../../Form/TextInput";
import Button from "../../Button";
import MuiIcon from "../../icons/MuiIcons";
import { HistoryResponse, OrderData, OrderProduct } from "Interfaces/Order";
import {
  useEditOrderProduct,
  useGetBatchAndExpiry,
  useUdpateDirection
} from "Hooks/useOrders";
import DatePicker from "../../Form/Date";
import get from "lodash/get";
import { useLazyPatientHistory } from "Hooks/usePatients";
import Cancel from "@material-ui/icons/Cancel";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "Hooks/useDebounce";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import { useBrand } from "Context/BrandContext";
import UpdateBatchExpiryTable from "./updateBatchExpiryTable";
import { useUser } from "Hooks/localStorageUser";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  borderRadius: "15px",
  boxShadow: 24,
  padding: "20px 32px 32px 20px",
  height: "auto"
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tb: {
      border: "1px solid red"
    },
    row: {
      borderBottom: `0.5px solid ${theme.palette.gray[300]}`,
      "&:hover": {
        background: " #FFFFFF",
        boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.06)"
      }
    },
    dBlock: {
      display: "block"
    },
    tableCell: {
      width: "650px",
      textAlign: "center"
    },
    tableCellMultiContent: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      gap: "10px"
    },
    productName: {
      minWidth: "200px",
      lineHeight: "18px",
      color: theme.palette.primary.main,
      textAlign: "left"
    },
    iconCell: {
      display: "flex"
    },
    productNameSku: {
      maxWidth: "200px",
      lineHeight: "18px",
      color: theme.palette.primary.main,
      display: "flex",
      alignItems: "center"
    },
    tableCellSku: {
      padding: "17px",
      width: "200px",
      textAlign: "left",
      position: "relative"
    },
    inputSelect: {
      minWidth: "150px"
    },
    flexAlign: {
      display: "flex",
      alignItems: "center",
      border: `1px solid ${theme.palette.green.success}`,
      color: theme.palette.green.success,
      background: theme.palette.green.successBg,
      minWidth: "120px",
      maxHeight: "50px",
      borderRadius: "6px",
      padding: "10px"
    },
    shipText: {
      margin: "0px"
    },
    shipIcon: {
      marginRight: "10px"
    },
    flexBox: {
      textAlign: "left",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start;",
      gap: "10px"
    },
    updateDirectionBox: {
      width: "500px",
      position: "absolute",
      right: "30%",
      background: "white",
      height: "auto",
      padding: "30px",
      boxShadow: " 0 0 10px rgba(0, 0, 0, 0.5)",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      zIndex: 1
    },
    formContainer: {
      display: "flex",
      width: "100%",
      alignItems: "center",
      gap: "5px",
      marginBottom: "10px"
    },
    pointerStyle: {
      cursor: "pointer"
    },
    patientName: {
      textAlign: "left"
    },
    root: {
      top: "5px",
      position: "relative"
    },
    headingContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%"
    },
    resultContainer: {
      marginBottom: "10px"
    },
    redField: {
      color: theme.palette.primary.main
    },
    iconDiv: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end"
    },

    patientHistoryTable: {
      width: "100%",
      borderCollapse: "collapse",
      border: "1px solid #ddd",
      marginTop: "20px"
    },
    th: {
      borderBottom: "1px solid #ddd",
      padding: "8px",
      textAlign: "center",
      backgroundColor: "#f2f2f2",
      fontWeight: "bold"
    },
    td: {
      borderBottom: "1px solid #ddd",
      padding: "8px",
      textAlign: "center"
    },
    patientHistoryInOrder: {
      overflow: "auto" /* Enable scrolling when content overflows */,
      maxHeight: "500px"
    },
    editPosition: {
      position: "absolute",
      right: 0,
      top: "40%"
    }
  })
);

interface OrderProductState {
  quantity: number;
  unit_price: number;
  // shipping_cost: number;
  tax_rate: number;
  ship_date?: string;
  product_id: string;
}

interface ProductTableProps {
  readonly data: OrderProduct;
  order: OrderData;
}

const ProdcutEditableRow: React.FC<ProductTableProps> = ({ data, order }) => {
  const classes = useStyles();
  const [state, setState] = React.useState<Partial<OrderProductState>>({
    quantity: data.quantity || 1,
    unit_price: data.unit_price || 0,
    tax_rate: data.tax_rate || 0,
    ship_date: data.ship_date || "",
    product_id: ""
  });

  const { mutate } = useEditOrderProduct(order?.id, state?.product_id);

  const handleChangeQuantity = (quantity: string) => {
    if (quantity ? Number(quantity) >= 0 : !quantity) {
      setState({ ...state, quantity: Number.parseInt(quantity) });
    }
  };
  const handleChangeShippingDate = (date: Date | null) => {
    if (date) setState({ ...state, ship_date: date.toISOString() });
  };

  const handleChangePrice = (value: string, field: string) => {
    if (
      (field === "unit_price" || field === "shipping_cost") &&
      (value ? Number(value) >= 0 : !value)
    ) {
      setState({ ...state, [field]: Number.parseFloat(value) });
    }

    if (
      field === "tax_rate" &&
      (value ? Number(value) >= 0 && Number(value) < 100 : !value)
    ) {
      setState({ ...state, [field]: Number.parseFloat(value) });
    }
  };

  const handleDoneEditing = () => {
    const objectToSend: Partial<Record<keyof OrderProductState, string | number>> = {};
    (Object.keys(state) as Array<keyof OrderProductState>).forEach(key => {
      const value = state[key];
      const prevValue = data[key];

      if (value !== null && value !== undefined && prevValue !== value) {
        if (
          Number(value) >= 0 &&
          key === "unit_price"
          // || key === "shipping_cost"
        ) {
          objectToSend[key] = state[key];
        } else if (value && key !== "product_id") {
          if (key === "ship_date") {
            objectToSend[key] = new Date(state[key] as string).toISOString();
          } else {
            objectToSend[key] = state[key];
          }
        }
      }
    });

    mutate(objectToSend as Partial<OrderProduct>);
    setState({});
  };

  const [directionVal, setDirectionVal] = React.useState<string | undefined>();
  const [updateDirection, setUpdateDirection] = React.useState<boolean>(false);
  const [updateBatchExpiry, setUpdateBatchExpiry] = React.useState<boolean>(false);

  const { mutate: editDirection } = useUdpateDirection();

  //eslint-disable-next-line
  const updateDirectionHanlder = (data: any) => {
    const obj = {
      direction: directionVal ?? undefined,
      productOrderID: data.id ?? undefined
    };
    obj.productOrderID && directionVal && editDirection(obj);
    setUpdateDirection(false);
  };
  const [searchParams] = useSearchParams();

  const debouncedParams = useDebounce(searchParams, 800);

  const [open, setOpen] = React.useState<boolean>(false);
  const getPatientHistory = useLazyPatientHistory();
  const handleClose = () => setOpen(false);
  const [patientHistory, setPatientHistory] = React.useState<HistoryResponse>();
  const [isPatientLoading, setIsPatientLoading] = React.useState(false);

  const getPatientHistoryHandler = async (website_patient_id: string) => {
    setIsPatientLoading(true);
    setOpen(true);
    try {
      const patientHistoryData =
        order?.website?.site_url &&
        order?.website?.authorization_key &&
        (await getPatientHistory(
          order?.website.site_url,
          order?.website.authorization_key,
          website_patient_id,
          debouncedParams
        ));
      setIsPatientLoading(false);
      setPatientHistory(patientHistoryData); // Set the patientHistory state with data
    } catch (error) {
      //eslint-disable-next-line
      console.log("error", error);
    }
  };
  const {
    mutate: batchAndExpiry,
    data: batchAndExpiryList,
    isLoading: batchExpiryLoading
  } = useGetBatchAndExpiry();

  const [productName, setProductName] = React.useState<string | undefined>("");

  const { currencySymbol } = useBrand();
  const user = useUser();

  return state?.product_id === data?.id ? (
    <tbody>
      <tr>
        {/* <td className={classes.tableCellSku}>
          <div className={classes.productNameSku}>

            <p>
              <span className={classes.dBlock}>&nbsp; {data?.product?.sku}</span>
              <span className={classes.dBlock}>
                <strong>Directions: </strong>
              </span>
            </p>
            &nbsp; {data?.product?.sku}
          </div>
        </td> */}
        <td className={classes.tableCell}>
          <div className={classes.productName}>{data?.product?.name}</div>
        </td>
        <td>
          <TextInput
            name="product_quantity"
            margin="dense"
            type="number"
            value={state?.quantity || 0}
            variant="outlined"
            onChange={e => handleChangeQuantity(e.target.value)}
            style={{ width: "80%", margin: "auto" }}
          />
        </td>
        <td className={classes.tableCell}>
          <TextInput
            name="retail_price"
            margin="dense"
            type="number"
            value={state.unit_price || 0}
            variant="outlined"
            onChange={e => handleChangePrice(e.target.value, "unit_price")}
            style={{ width: "80%", margin: "auto" }}
          />
        </td>

        <td className={classes.tableCell}>
          {data?.product?.is_tax_exempt ? "Yes" : "No"}
        </td>
        <td className={classes.tableCell}>
          <TextInput
            name="tax_rate"
            margin="dense"
            type="number"
            value={state?.tax_rate || 0}
            variant="outlined"
            onChange={e => handleChangePrice(e.target.value, "tax_rate")}
            style={{ width: "80%", margin: "auto" }}
          />
        </td>
        <td className={classes.tableCell}>
          <DatePicker
            onChange={handleChangeShippingDate}
            disabled
            value={state.ship_date ? new Date(state.ship_date) : null}
            label=""
          />
        </td>
        <td className={classes.tableCell}>${(data?.total_cost || 0).toFixed(2)}</td>
        <td className={classes.tableCell}>
          <div className={classes.iconCell}>
            <Button
              icon={<MuiIcon fontSize="small" icon="check" />}
              onlyIcon={true}
              type="secondary"
              variant="outlined"
              onClick={handleDoneEditing}
              size="small"
            />{" "}
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
    <>
      <tbody>
        <tr className={classes.row}>
          {/* <td className={classes.tableCellSku}>
            <div className={classes.productNameSku}>
              <p>
                <span className={classes.dBlock}>&nbsp; {data?.product?.sku}</span>
                <span
                  className={classes.dBlock}
                  style={{
                    color: "#121212"
                  }}
                ></span>
              </p>
            </div>
          </td> */}
          <td className={classes.tableCell}>
            <div className={classes.productName}>{data?.product?.name}</div>

            {data?.direction && (
              <div className={classes.flexBox}>
                {" "}
                <strong>Directions:</strong>
                {!updateDirection && data?.direction && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        data?.direction.length > 160
                          ? data?.direction.substring(0, 160 - 3) + "..."
                          : data?.direction
                    }}
                  ></div>
                )}
                {!updateDirection && data?.direction && (
                  <MuiIcon
                    className={classes.pointerStyle}
                    onClick={() => setUpdateDirection(!updateDirection)}
                    icon="edit"
                  />
                )}
                {updateDirection && (
                  <div className={classes.updateDirectionBox}>
                    <div
                      style={{ background: "#f1f5f9", padding: "5px" }}
                      className={classes.formContainer}
                    >
                      <p
                        style={{
                          width: "100%",
                          fontSize: "1rem",
                          fontWeight: 500
                        }}
                      >
                        Update Directions:
                      </p>

                      <Button
                        size="small"
                        text="Cancel Update Direction"
                        icon={
                          <MuiIcon
                            className={classes.pointerStyle}
                            fontSize="small"
                            icon="cancel"
                          />
                        }
                        onlyIcon={true}
                        onClick={() => setUpdateDirection(false)}
                        type="secondary"
                        variant="outlined"
                      />
                    </div>
                    <div className={classes.formContainer}>
                      <TextInput
                        type="text"
                        defaultValue={data?.direction}
                        onChange={e => setDirectionVal(e.target.value)}
                        value={directionVal}
                        name="direction"
                      />
                      <Button
                        size="small"
                        text="Update Direction"
                        icon={
                          <MuiIcon
                            className={classes.pointerStyle}
                            fontSize="small"
                            icon="check"
                          />
                        }
                        onlyIcon={true}
                        onClick={() => updateDirectionHanlder(data)}
                        type="secondary"
                        variant="outlined"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            {data?.prescription_id && (
              <div
                style={{
                  textAlign: "left"
                }}
              >
                {" "}
                <strong>Prescription id:</strong> {data.prescription_id}
              </div>
            )}
            {data?.patient_name && (
              <p
                onClick={() => getPatientHistoryHandler(data?.website_patient_id)}
                className={[classes.patientName, classes.pointerStyle].join(" ")}
              >
                {" "}
                Patient Name: <span>{data?.patient_name}</span>
              </p>
            )}
          </td>
          <td className={classes.tableCellSku}>
            {data?.batch_details?.map((item, index) => (
              <p key={index} style={{ minWidth: "200px", width: "max-content" }}>
                {`${item?.batch_number} | ${item.expiry_date} | ${item.quantity_sold} ` ||
                  ""}
              </p>
            ))}
            {(user?.is_superuser || user?.is_manager) &&
              data?.batch_details?.length > 0 && (
                <MuiIcon
                  className={[classes.pointerStyle, classes.editPosition].join(" ")}
                  onClick={() => {
                    const obj = {
                      order_id: order?.id,
                      ordered_product_id: data?.id,
                      product_id: data?.product_id
                    };
                    setProductName(data?.product?.name);
                    batchAndExpiry(obj);
                    setUpdateBatchExpiry(true);
                    setOpen(true);
                  }}
                  icon="edit"
                />
              )}
          </td>

          <td className={classes.tableCell}>{data?.quantity || "--"}</td>
          <td className={classes.tableCell}>
            {" "}
            {data?.order_product_return
              ?.map(item => +item.return_shipment.quantity)
              .reduce((sum, quantity) => sum + quantity, 0) || 0}
          </td>

          <td className={classes.tableCell}>{`${currencySymbol}${(
            data?.unit_price || 0
          ).toFixed(2)}`}</td>

          <td className={classes.tableCell}>
            {data?.ship_date ? new Date(data?.ship_date).toLocaleDateString() : "--"}
          </td>
          <td className={classes.tableCell}>{`${currencySymbol}${(
            data?.total_cost || 0
          ).toFixed(2)}`}</td>
        </tr>
      </tbody>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {updateBatchExpiry ? (
            <UpdateBatchExpiryTable
              productName={productName}
              batchExpiryLoading={batchExpiryLoading}
              handleClose={handleClose}
              batchAndExpiryList={batchAndExpiryList}
            />
          ) : (
            <>
              <div className={classes.iconDiv}>
                <span className={classes.headingContainer} onClick={handleClose}>
                  <h2 className={classes.redField}>Patient History</h2>
                  <Cancel
                    color="primary"
                    style={{ color: "#F7CA2A", fontSize: "50px", cursor: "pointer" }}
                  />
                </span>
              </div>

              <div className={classes.resultContainer}>
                {/* <span>{data?.results?.length} results </span> */}
              </div>

              <div>
                {patientHistory && (
                  <div className={classes.patientHistoryInOrder}>
                    <table className={classes.patientHistoryTable}>
                      <thead>
                        <tr>
                          <th className={classes.th}>Product Name</th>
                          <th className={classes.th}>Quantity</th>
                          <th className={classes.th}>Price</th>
                          <th className={classes.th}>Prescription ID</th>
                          <th className={classes.th}>Order Number</th>
                          <th className={classes.th}>Order Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patientHistory?.results?.length > 0 &&
                          patientHistory?.results?.map((row, index) => (
                            <tr key={index}>
                              <td className={classes.td}>
                                {get(row, "name", "")}
                                <p className={classes.redField}>
                                  Direction: {row.direction}
                                </p>
                              </td>
                              <td className={classes.td}>{row.quantity}</td>
                              <td className={classes.td}>{get(row, "price")}</td>
                              <td className={classes.td}>
                                {get(row, "website_prescription_id")}
                              </td>
                              <td className={classes.td}>
                                {get(row, "website_order_id", "")}
                              </td>
                              <td className={[classes.td, classes.redField].join(" ")}>
                                {get(row, "website_order_date", "")}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          <Box sx={{ m: 1, position: "relative" }}>
            {isPatientLoading && (
              <CircularProgress
                size={24}
                sx={{
                  color: green[500],
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px"
                }}
              />
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ProdcutEditableRow;
