import { ResponseOrderBatch } from "Interfaces/Order";
import React, { useEffect } from "react";
import Cancel from "@material-ui/icons/Cancel";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { ukDateFormat } from "Utils/datesFormat";
import MuiIcon from "../../icons/MuiIcons";
import TextField from "@material-ui/core/TextField";
import { useUpdateBatchAndExpiry } from "Hooks/useOrders";
import { Box, Typography } from "@mui/material";
import Loader from "Components/Loader";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MuiTextField, { TextFieldProps } from "@mui/material/TextField";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pointerStyle: {
      cursor: "pointer"
    },
    row: {
      borderBottom: `0.5px solid ${theme.palette.gray[300]}`,
      "&:hover": {
        background: " #FFFFFF",
        boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.06)"
      }
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
    actionContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 10
    },
    typo: {
      fontSize: "14px",
      color: "rgba(0, 0, 0, 0.87)"
    }
  })
);
interface IProps {
  batchAndExpiryList: ResponseOrderBatch[] | undefined;
  handleClose: () => void;
  batchExpiryLoading: boolean;
  productName: string | undefined;
}

const CalendarTextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  function CalendarTextField(props, ref) {
    return <MuiTextField {...props} ref={ref} size="small" />;
  }
);

CalendarTextField.displayName = "CalendarTextField";
const UpdateBatchExpiryTable: React.FC<IProps> = ({
  batchAndExpiryList,
  handleClose,
  batchExpiryLoading,
  productName
}) => {
  const classes = useStyles();
  const [toggleID, setToggleID] = React.useState<string>("");
  const [selectedBatch, setSelectedBatch] = React.useState<ResponseOrderBatch>({
    batch_number: "",
    expiry_date: "",
    id: "",
    invoice_number: "",
    product_id: "",
    purchase_order_id: "",
    received_quantity: null,
    sku: ""
  });
  const { mutate, data } = useUpdateBatchAndExpiry();
  const [updatedBatchAndExpiryList, setUpdatedBatchAndExpiryList] = React.useState<
    ResponseOrderBatch[] | undefined
  >(batchAndExpiryList);

  useEffect(() => {
    batchAndExpiryList &&
      batchAndExpiryList?.length > 0 &&
      setUpdatedBatchAndExpiryList(batchAndExpiryList);
  }, [batchAndExpiryList]);

  const submitHandler = (id: string) => {
    const obj = {
      ...selectedBatch,
      id: selectedBatch?.id !== undefined ? selectedBatch.id : id
    };

    mutate(obj);
    setToggleID("");
  };

  React.useEffect(() => {
    if (data) {
      const response: ResponseOrderBatch = data as unknown as ResponseOrderBatch;

      const updatedList = updatedBatchAndExpiryList?.map(batch => {
        if (batch.id === response.id) {
          return {
            ...batch,
            expiry_date: response.expiry_date,
            invoice_number: response.invoice_number,
            batch_number: response.batch_number
          };
        }
        return batch;
      });
      setUpdatedBatchAndExpiryList(updatedList);
    }
    //eslint-disable-next-line
  }, [data]);
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <>
      {!batchExpiryLoading ? (
        <>
          <div className={classes.iconDiv}>
            <span className={classes.headingContainer} onClick={handleClose}>
              <h2 className={classes.redField}>{`Edit Batch Expiry (${productName})`}</h2>
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
            {updatedBatchAndExpiryList && (
              <div className={classes.patientHistoryInOrder}>
                <table className={classes.patientHistoryTable}>
                  <thead>
                    <tr>
                      <th className={classes.th}>Invoice #</th>
                      <th className={classes.th}>Batch#</th>
                      <th className={classes.th}>Expiry Date</th>
                      <th className={classes.th}>Quantity</th>
                      <th className={classes.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updatedBatchAndExpiryList.map((row, index) => (
                      <tr key={index}>
                        <td className={classes.td}>
                          {toggleID === row.id ? (
                            <TextField
                              name="invoice-number"
                              value={selectedBatch?.invoice_number}
                              onChange={e =>
                                setSelectedBatch(prev => ({
                                  ...prev,
                                  invoice_number: e.target.value || ""
                                }))
                              }
                            />
                          ) : (
                            row?.invoice_number
                          )}
                        </td>
                        <td className={classes.td}>
                          <Typography
                            variant="body1"
                            component="span"
                            className={classes.typo}
                          >
                            {toggleID === row.id ? (
                              <TextField
                                name="batch"
                                value={selectedBatch?.batch_number}
                                onChange={e =>
                                  setSelectedBatch(prev => ({
                                    ...prev,
                                    batch_number: e.target.value
                                  }))
                                }
                              />
                            ) : (
                              row?.batch_number
                            )}
                          </Typography>
                        </td>
                        <td className={classes.td}>
                          {toggleID === row.id ? (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["DateField", "DatePicker"]}>
                                <DatePicker
                                  minDate={dayjs(currentDate)}
                                  format="DD/MM/YYYY"
                                  onChange={value => {
                                    if (value?.format("DD/MM/YYYY"))
                                      setSelectedBatch(prev => ({
                                        ...prev,
                                        expiry_date: value?.format("YYYY/MM/DD")
                                      }));
                                  }}
                                  formatDensity="dense"
                                  defaultValue={dayjs(selectedBatch.expiry_date)}
                                  slots={{ textField: CalendarTextField }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          ) : (
                            ukDateFormat(row?.expiry_date, false)
                          )}
                        </td>
                        <td className={classes.td}>{row?.received_quantity}</td>
                        <td className={classes.td}>
                          {toggleID === row.id ? (
                            <>
                              <div className={classes.actionContainer}>
                                <MuiIcon
                                  className={classes.pointerStyle}
                                  onClick={() => submitHandler(row?.id)}
                                  icon="check"
                                />
                                <MuiIcon
                                  className={classes.pointerStyle}
                                  onClick={() => {
                                    setToggleID("");
                                  }}
                                  icon="cancel"
                                />
                              </div>
                            </>
                          ) : (
                            <div className={classes.actionContainer}>
                              <MuiIcon
                                className={classes.pointerStyle}
                                onClick={() => {
                                  setSelectedBatch(row);
                                  setToggleID(row.id);
                                }}
                                icon="edit"
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Box sx={{ m: 1, position: "relative" }}>
            {batchExpiryLoading && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Loader />
              </div>
            )}
          </Box>
        </>
      )}
    </>
  );
};
export default UpdateBatchExpiryTable;
