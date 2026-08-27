import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Close, DeleteForever, ModeEdit } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Palette,
  Skeleton,
  Stack,
  styled
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { OrderData, OrderProduct, PaymentData } from "../../../Interfaces/Orders";
import { useOrder } from "../../../Hooks/useOrders";
import { ukDateFormat } from "../../../Utils/datesFormat";
import ProductsTable from "./OrderProductsTable";
import OrderSummary from "./OrderSummary";
import OrderShipmentHistory from "./OrderShipmentHistory";
import Tabs from "../../../Components/Tabs";
import OrderPaymentHistory from "./OrderPaymentHistory";
import OrderReturnHistory from "./OrderReturnHistory";
import Chip from "@mui/material/Chip";
import { useUser } from "../../../Contexts/userContext";
import SeeDocumentation from "../../../Components/SeeDocumentation";
interface OrderDrawerProps {
  open: boolean;
  onClose(): void;
  row?: OrderData | null;
  onDelete(): void;
  isTrash?: boolean;
}
const OrderDrawer: React.FC<OrderDrawerProps> = props => {
  const { onClose, open, row, onDelete, isTrash } = props;

  const navigate = useNavigate();
  const { user } = useUser();
  const { data, isLoading: fetchLoading } = useOrder(
    open && row?.id ? row?.id : undefined
  );

  const handleEdit = () => {
    if (row?.id) {
      navigate(`/edit-order/${row?.id}${isTrash ? "?is_trash=1" : ""}`);
    }
  };
  const shipmentStatus = React.useMemo(() => {
    const status = data?.shipping_status;
    let color: keyof Palette;
    switch (status) {
      case "not_shipped":
        color = "error";
        break;
      case "partially_shipped":
        color = "warning";
        break;
      default:
        color = "success";
    }
    return {
      color,
      title: data?.shipping_status?.replace(/_/g, " ")?.toUpperCase()
    };
  }, [data]);
  const orderStatus = React.useMemo(() => {
    const status = data?.status?.toLowerCase();
    let vals: { color: keyof Palette | null; title: string } = { color: null, title: "" };
    switch (status) {
      case "p":
        vals = { title: "Pending", color: "warning" };
        break;
      case "o":
        vals = { title: "On Hold", color: "warning" };
        break;
      case "g":
        vals = { title: "Processing", color: "warning" };
        break;
      case "c":
        vals = { title: "Completed", color: "success" };
        break;
      case "d":
        vals = { title: "Cancelled", color: "error" };
        break;
      case "f":
        vals = { title: "Refunded", color: "warning" };
        break;
      case "t":
        vals = { title: "Processing", color: "warning" };
        break;
      case "a":
        vals = { title: "Draft", color: "info" };
        break;
      case "i":
        vals = { title: "Failed", color: "error" };
        break;
      case "x":
        vals = { title: "Dispensed", color: "warning" };

        break;
      default:
        break;
    }

    return vals;
  }, [data]);
  const products = React.useMemo(() => {
    const prods: OrderProduct[] = [];
    if (data?.products && data?.products?.length) {
      prods.push(data.products?.[0] as unknown as OrderProduct);
    }
    return prods;
  }, [data]);
  const payments = React.useMemo(() => {
    const pmts: PaymentData[] = [];
    if (data?.payments && data?.payments?.length) {
      pmts.push(data.payments?.[0] as unknown as PaymentData);
    }
    return pmts;
  }, [data]);
  return (
    <StyledDrawer anchor="right" open={open} onClose={() => !fetchLoading && onClose()}>
      <IconButton
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500]
        }}
        onClick={onClose}
        disabled={fetchLoading}
      >
        <Close />
      </IconButton>
      <Stack direction={"row"} gap={1} alignItems={"center"} justifyContent={"start"}>
        <Typography fontSize={20} fontWeight={"bold"} variant="h3">
          Order No :
        </Typography>
        {fetchLoading ? (
          <Skeleton variant="text" sx={{ fontSize: 30 }} width={150} />
        ) : (
          <Typography fontSize={20} fontWeight={"bold"} variant="h3">
            {data?.number}
          </Typography>
        )}
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Stack
        direction={"row"}
        gap={1}
        alignItems={"center"}
        justifyContent={"start"}
        my={1}
      >
        <Button
          id="cy__EditOrder"
          startIcon={<ModeEdit />}
          variant="contained"
          color="info"
          size="small"
          onClick={handleEdit}
          disabled={fetchLoading}
        >
          Edit Order
        </Button>

        {!isTrash ? (
          user?.is_superuser && (
            <Button
              startIcon={<DeleteForever />}
              variant="contained"
              color="info"
              size="small"
              onClick={onDelete}
              disabled={fetchLoading}
              id="cy__OrderTrash"
            >
              Trash
            </Button>
          )
        ) : (
          <Chip label="Trashed" color="error" sx={{ ml: 1 }} />
        )}
      </Stack>
      {fetchLoading ? (
        <Skeleton variant="text" sx={{ fontSize: 25 }} width={150} />
      ) : (
        <Typography mt={1} fontWeight={"bold"} fontSize={18}>
          Order :{" "}
        </Typography>
      )}
      <SeeDocumentation fileName={"useOrder"} title={"See Documentation"} />

      <Divider sx={{ my: 1 }} />
      <Grid container spacing={fetchLoading ? 0 : 2}>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Order Number :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"} textTransform={"capitalize"}>
              {data?.number}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Date :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {!!data?.ordered && data?.ordered?.toString()?.toLowerCase() === "none"
                ? "---"
                : !!data?.ordered && ukDateFormat(new Date(data?.ordered), true)}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Shipment Status: :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography
              variant="body2"
              fontWeight={"bold"}
              color={`${shipmentStatus.color}.main`}
            >
              {shipmentStatus?.title}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Website Order ID :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.website_order_id}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Website Name :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.website.title}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Status :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography
              variant="body2"
              fontWeight={"bold"}
              color={`${orderStatus.color}.main`}
            >
              {orderStatus?.title}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Box mt={1}>
        {/* <ProductsTable mode="view" products={products} loading={fetchLoading} />*/}
        <ProductsTable
          mode="view"
          products={products}
          loading={fetchLoading}
          refetch={() => {}}
          updateOrderCostPrice={async () => {}}
        />
      </Box>
      {data?.products && data?.products?.length > 1 && (
        <Typography sx={{ cursor: "pointer" }} onClick={handleEdit}>
          More Products...
        </Typography>
      )}
      <Divider sx={{ my: 1 }} />
      <Box>
        <OrderSummary mode="view" loading={fetchLoading} order={data} />
      </Box>
      <Tabs
        list={[
          {
            title: "Shipment History",
            comp: <OrderShipmentHistory loading={fetchLoading} data={products} />
          },
          {
            title: "Payment History",
            comp: <OrderPaymentHistory loading={fetchLoading} data={payments} />
          },
          {
            title: "Return History",
            comp: <OrderReturnHistory loading={fetchLoading} data={products} />
          }
        ]}
        noshadow
        border
        dense
      />
    </StyledDrawer>
  );
};

const StyledDrawer = styled(Drawer)(({
  theme: {
    shape: { borderRadius }
  }
}) => {
  const spaceFromTop = 67;
  return {
    ".MuiDrawer-paper": {
      marginTop: spaceFromTop,
      height: `calc(100% - ${spaceFromTop}px)`,
      width: "100%",
      maxWidth: "500px",
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      boxShadow: "0px 4px 29.3px 0px #0000001A",
      padding: "18px"
    }
  };
});
export default OrderDrawer;
