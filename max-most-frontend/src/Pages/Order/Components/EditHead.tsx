import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
  FormControlLabel,
  Switch
} from "@mui/material";
import Input from "../../../Components/Input";
import SelectField from "../../../Components/SelectField";
import Checkbox from "../../../Components/Checkbox";
import { OrderData } from "../../../Interfaces/Orders";
import { ukDateFormat } from "../../../Utils/datesFormat";
import { orderStatusOptions } from "../../../Constants/Orders";
import { useEditOrder } from "../../../Hooks/useOrders";
import Chip from "@mui/material/Chip";
import LoadingButton from "../../../Components/LoadingButton";
import SeeDocumentation from "../../../Components/SeeDocumentation";
import { useUser } from "../../../Contexts/userContext";

interface EditHeadProps {
  order?: OrderData;
  loading?: boolean;
  isTrash?: boolean;
}

const EditHead: React.FC<EditHeadProps> = ({ order, loading, isTrash }) => {
  const [orderStatus, setOrderStatus] = useState("");
  const [quickBook, setQuickBook] = React.useState<string | undefined>("");
  const { user } = useUser();

  const { mutateAsync: updateOrder, isLoading } = useEditOrder(order?.id || "");
  const checks = useMemo(() => {
    const payments = order?.payments ? order.payments.length > 0 : false;
    const shipments = order?.product_shippings
      ? order.product_shippings.length > 0
      : false;
    return { payments, shipments };
  }, [order]);

  const [is_prescription_opened, setIs_prescription_opened] = useState<boolean>(
    order?.is_prescription_opened ?? false
  );

  useEffect(() => {
    setIs_prescription_opened(order?.is_prescription_opened ?? false);
  }, [order?.is_prescription_opened]);

  React.useEffect(() => {
    const status = order?.status?.toLowerCase();
    let title: string = "";
    switch (status) {
      case "p":
        title = "pending";
        break;
      case "o":
        title = "on_hold";
        break;
      case "g":
        title = "processing";
        break;
      case "c":
        title = "completed";
        break;
      case "d":
        title = "cancelled";
        break;
      case "f":
        title = "refunded";
        break;
      case "t":
        title = "processing";
        break;
      case "a":
        title = "draft";
        break;
      case "i":
        title = "failed";
        break;
      case "x":
        title = "dispensed";
        break;
      default:
        break;
    }
    setQuickBook(order?.quickbook_reference_number);
    setOrderStatus(title);
  }, [order]);

  return (
    <>
      <Card sx={{ bgcolor: "primary.main" }}>
        <CardContent>
          <Stack direction={"row"} justifyContent={"space-between"} my={1}>
            <Box>
              <Checkbox
                mode="light"
                label="Customer"
                loading={loading}
                checked
                readonly
              />
              <Checkbox mode="light" label="Create Order" loading={loading} checked />
            </Box>
            <Box>
              <Checkbox
                mode="light"
                label="Shipping"
                loading={loading}
                readonly
                checked={checks.shipments}
              />
              <Checkbox
                mode="light"
                label="Payment"
                loading={loading}
                readonly
                checked={checks.payments}
              />
            </Box>
          </Stack>

          {loading ? (
            <Skeleton variant="text" width={85} sx={{ fontSize: 22 }} animation="wave" />
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h3"
                color={"common.white"}
                fontSize={22}
                fontWeight={"bold"}
              >
                Order
              </Typography>
              {isTrash && <Chip label="Trashed" color="error" sx={{ ml: 1 }} />}
            </Box>
          )}
          <Stack
            justifyContent={"start"}
            gap={1}
            alignItems={"center"}
            sx={{
              flexDirection: { xs: "column", lg: "row" }
            }}
            my={1}
          >
            <Grid container spacing={1}>
              <Grid item lg={2} xs={12} sm={6}>
                <Input
                  readOnly
                  noFocus
                  defaultValue={`#${order?.number}`}
                  label="Order Number :"
                  mode="light"
                  loading={loading}
                />
              </Grid>
              <Grid item lg={2} xs={12} sm={6}>
                <Input
                  readOnly
                  noFocus
                  defaultValue={ukDateFormat(order?.created, false)}
                  label="Date :"
                  mode="light"
                  loading={loading}
                />
              </Grid>
              <Grid item lg={2} xs={12} sm={6}>
                <Input
                  defaultValue={order?.website_order_id}
                  readOnly
                  noFocus
                  label="Website Order Id :"
                  mode="light"
                  loading={loading}
                />
              </Grid>
              <Grid item lg={2} xs={12} sm={6}>
                <Input
                  defaultValue={order?.website?.title}
                  readOnly
                  noFocus
                  label="Website Name:"
                  mode="light"
                  loading={loading}
                />
              </Grid>

              <Grid item lg={2} xs={12} sm={6}>
                <Input
                  defaultValue={order?.website_order_id}
                  readOnly
                  noFocus
                  label="Customer Number"
                  mode="light"
                  loading={loading}
                />
              </Grid>

              <Grid item lg={3} xs={12} sm={6}>
                <Input
                  defaultValue={order?.quickbook_reference_number}
                  noFocus
                  label="Quickbook Reference #"
                  mode="light"
                  loading={loading}
                  value={quickBook ? quickBook : order?.quickbook_reference_number}
                  onChange={e => setQuickBook(e.target.value)}
                />
              </Grid>

              <Grid item lg={2} xs={12} sm={6}>
                <SelectField
                  options={orderStatusOptions.filter(el => el.value !== "all")}
                  label="Status :"
                  handleSelect={data => {
                    setOrderStatus(data.value as string);
                  }}
                  mode="light"
                  name="status"
                  loading={loading}
                  value={orderStatus}
                  disable={isLoading}
                />
              </Grid>

              {(user?.is_superuser || user?.is_pharmacist) && order?.prescription_ids && (
                <Grid item lg={2} xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={is_prescription_opened}
                        onChange={() =>
                          setIs_prescription_opened(!is_prescription_opened)
                        }
                        sx={{
                          "& .MuiSwitch-switchBase": {
                            "&.Mui-checked": {
                              "& + .MuiSwitch-track": {
                                backgroundColor: "#B0BEC5"
                              }
                            }
                          },
                          "& .MuiSwitch-track": {
                            backgroundColor: "#E0E0E0"
                          },
                          "& .MuiSwitch-thumb": {
                            backgroundColor: "white"
                          }
                        }}
                      />
                    }
                    label="Prescription Open"
                    labelPlacement="start"
                    sx={{
                      color: "white",
                      marginTop: {
                        xs: 2,
                        sm: 3,
                        md: 3
                      }
                    }}
                  />
                </Grid>
              )}
            </Grid>
            <Stack
              minHeight={43}
              alignItems={"center"}
              direction={"row"}
              alignSelf={"end"}
            >
              <LoadingButton
                color="secondary"
                variant="contained"
                onClick={() =>
                  updateOrder({
                    status: orderStatus,
                    quickbook_reference_number: quickBook ? quickBook : "",
                    is_prescription_opened
                  })
                }
                loading={isLoading}
              >
                Save
              </LoadingButton>
            </Stack>
          </Stack>
          <SeeDocumentation
            color="white"
            fileName={"useEditOrder"}
            title={"See Documentation"}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default EditHead;
