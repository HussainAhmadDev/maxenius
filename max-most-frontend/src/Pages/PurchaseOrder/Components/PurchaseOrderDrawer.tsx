import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Close, DeleteForever, ModeEdit } from "@mui/icons-material";
import {
  Divider,
  Drawer,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  styled
} from "@mui/material";
import { PurchaseOrderData } from "../../../Interfaces/PurchaseOrder";
import { useNavigate } from "react-router-dom";
import {
  usePurchaseOrder,
  usePurchaseOrderRecivingHistory
} from "../../../Hooks/usePurchaseOrder";
import { ukDateFormat } from "../../../Utils/datesFormat";
import { useWarehouseById } from "../../../Hooks/useWarehouses";
import { useVendorById } from "../../../Hooks/useVendors";
import ReceivingHistoryTable from "./ReceivingHistoryTable";
import Chip from "@mui/material/Chip";
import { useUser } from "../../../Contexts/userContext";
interface PurchaseOrderDrawerProps {
  open: boolean;
  onClose(): void;
  row?: PurchaseOrderData | null;
  onDelete(): void;
  isTrash?: boolean;
}
const PurchaseOrderDrawer: React.FC<PurchaseOrderDrawerProps> = props => {
  const { onClose, open, row, onDelete, isTrash } = props;
  const { user } = useUser();
  const navigate = useNavigate();
  const { data, isLoading: fetchLoading } = usePurchaseOrder(
    open && row?.id ? row?.id : undefined
  );
  const { data: location, isLoading: locationLoading } = useWarehouseById(
    open && data?.warehouse_id ? data?.warehouse_id : undefined
  );
  const { data: vendor, isLoading: vendorLoading } = useVendorById(
    open && data?.vendor_id ? data?.vendor_id : undefined
  );
  const handleEdit = () => {
    if (row?.id) {
      navigate(`/edit-purchaseOrder/${row?.id}`);
    }
  };
  const status = React.useMemo(() => {
    switch (data?.status) {
      case "h":
        return "partial";
      case "p":
        return "pending";
      case "a":
        return "approved";
      case "t":
        return "accepted";
      case "c":
        return "delivered";
      case "n":
        return "open";
      default:
        return "---";
    }
  }, [data]);
  const { data: orderRecivingHistory, isLoading: orderRecivingHistoryLoading } =
    usePurchaseOrderRecivingHistory(open && data?.id ? data?.id : undefined);
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
          Purchase Order :
        </Typography>
        {fetchLoading ? (
          <Skeleton variant="text" sx={{ fontSize: 30 }} width={150} />
        ) : (
          <Typography fontSize={20} fontWeight={"bold"} variant="h3">
            {data?.id}
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
          id="cy__EditPurchaseOrderBtn"
          startIcon={<ModeEdit />}
          variant="contained"
          color="info"
          size="small"
          onClick={handleEdit}
          disabled={fetchLoading}
        >
          Edit Purchase Order
        </Button>
        {isTrash ? (
          <Chip label="Trashed" color="error" sx={{ ml: 1 }} />
        ) : (
          user?.is_superuser && (
            <Button
              startIcon={<DeleteForever />}
              variant="contained"
              color="info"
              size="small"
              onClick={onDelete}
              disabled={fetchLoading}
            >
              Trash
            </Button>
          )
        )}
      </Stack>
      <Stack justifyContent={"space-between"} direction={"row"}>
        {fetchLoading ? (
          <Skeleton variant="text" sx={{ fontSize: 25 }} width={150} />
        ) : (
          <Typography mt={1} fontWeight={"bold"} fontSize={18}>
            Basic Information :{" "}
          </Typography>
        )}
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={fetchLoading ? 0 : 2}>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" width={80} />
          ) : (
            <Typography variant="body2">Status :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"} textTransform={"capitalize"}>
              {status}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" width={80} />
          ) : (
            <Typography variant="body2">Date :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"} textTransform={"capitalize"}>
              {ukDateFormat(data?.ordered, true)}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" width={80} />
          ) : (
            <Typography variant="body2">Invoicing Currency :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.invoicing_currency || "---"}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading || locationLoading ? (
            <Skeleton variant="text" width={80} />
          ) : (
            <Typography variant="body2">Location :</Typography>
          )}
          {fetchLoading || locationLoading ? (
            <Skeleton variant="text" width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {location?.name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading || vendorLoading ? (
            <Skeleton variant="text" width={80} />
          ) : (
            <Typography variant="body2">Vendor :</Typography>
          )}
          {fetchLoading || vendorLoading ? (
            <Skeleton variant="text" width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {vendor?.name || "---"}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Divider sx={{ my: 1 }} />
      <ReceivingHistoryTable
        id={row?.id}
        mode="view"
        data={orderRecivingHistory}
        loading={orderRecivingHistoryLoading}
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
      padding: "18px",
      marginBottom: "200px"
    }
  };
});
export default PurchaseOrderDrawer;
