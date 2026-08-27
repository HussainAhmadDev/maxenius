import { Button, Stack } from "@mui/material";
import {
  Check,
  DeleteForever,
  LocalShipping,
  Print,
  ReceiptLong
} from "@mui/icons-material";
import ReplayIcon from "@mui/icons-material/Replay";
import { OrderData } from "../../../Interfaces/Orders";
import DeleteConfirmation from "./DeleteConfirmation";
import { useCallback, useMemo, useState } from "react";
import LoadingButton from "../../../Components/LoadingButton";
import { externalPDFLinksOrder, handleLabelsExport } from "../../../Utils/PDF";
import { useUser } from "../../../Contexts/userContext";
import { useBrandContext } from "../../../Contexts/brandContext";
import ShippingLabelModal from "./ShippingLabelModal";
import RestoreConfirmation from "./restoreConfirmation";
interface ActionsProps {
  order?: OrderData;
  loading: boolean;
  refetch(): void;
}
type Action =
  | "del"
  | "prescription"
  | "invoice"
  | "packing-slip"
  | "shipping-label"
  | "one-label"
  | "split-labels"
  | "restore"
  | null;
const Actions: React.FC<ActionsProps> = ({ loading: fetchLoading, order, refetch }) => {
  const [action, setAction] = useState<Action>(null);
  const { user } = useUser();
  const { brand } = useBrandContext();
  const isTrash = useMemo(() => {
    return order?.is_trash;
  }, [order]);

  const handleAction = useCallback(
    (type: Action, refresh?: boolean) => () => {
      if (order) {
        setAction(type);
      } else {
        setAction(null);
      }
      refresh && refetch();
    },
    [order, setAction, refetch]
  );

  const labelDisabled = useMemo(() => {
    if (
      order?.products?.every(
        item => !item.prescription_id || item.prescription_id === ""
      ) &&
      order?.products?.every(item => !item.is_pom)
    ) {
      return true;
    } else {
      return false;
    }
  }, [order]);

  useMemo(() => {
    if (order && user) {
      const { first_name = "", last_name = "", email = "" } = user;
      const username = first_name + " " + last_name;
      const orderIds = "";
      let url;
      switch (action) {
        case "prescription":
          externalPDFLinksOrder(
            "/wp-json/inventory/v1/view_prescription_pdf?order_id=",
            order,
            handleAction(null)
          );
          break;
        case "invoice":
          url = `/wp-json/inventory/v1/view_order_pdf?username=${username}&email=${email}&document_type=${"invoice"}&order_ids=${orderIds}`;
          externalPDFLinksOrder(url, order, handleAction(null, true));
          break;
        case "packing-slip":
          url = `/wp-json/inventory/v1/view_order_pdf?username=${username}&email=${email}&document_type=${"packing-slip"}&order_ids=${orderIds}`;
          externalPDFLinksOrder(url, order, handleAction(null, true));
          break;
        case "one-label":
          handleLabelsExport("one", order, handleAction(null, true));
          break;
        case "split-labels":
          handleLabelsExport("split", order, handleAction(null, true));
          break;
        default:
          break;
      }
    }
  }, [action, handleAction, order, user]);
  return (
    <>
      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        gap={2}
        justifyContent={"start"}
        alignItems={"center"}
      >
        {user?.is_superuser &&
          (isTrash ? (
            <LoadingButton
              color="info"
              variant="contained"
              startIcon={<DeleteForever />}
              disabled={fetchLoading}
              onClick={handleAction("del")}
            >
              Trash Order
            </LoadingButton>
          ) : (
            <LoadingButton
              color="info"
              variant="contained"
              startIcon={<ReplayIcon />}
              disabled={fetchLoading}
              onClick={handleAction("restore")}
            >
              Restore
            </LoadingButton>
          ))}

        <LoadingButton
          color="info"
          variant="contained"
          startIcon={<ReceiptLong />}
          onClick={handleAction("prescription")}
          loading={action === "prescription"}
          disabled={
            !(
              ((user?.is_superuser || user?.is_pharmacist) &&
                order?.prescription_ids !== null) ||
              (order?.is_prescription_opened && order?.prescription_ids !== null)
            )
          }
        >
          View Prescription
        </LoadingButton>
        <LoadingButton
          color="info"
          variant="contained"
          onClick={handleAction("invoice")}
          startIcon={
            order?.invoice_print ? (
              <Check sx={{ color: "green !important" }} />
            ) : (
              <Print />
            )
          }
          loading={action === "invoice"}
          disabled={fetchLoading || order?.website_order_id === null}
        >
          Print Invoice
        </LoadingButton>

        <LoadingButton
          color="info"
          variant="contained"
          onClick={handleAction("packing-slip")}
          startIcon={
            order?.packing_slip_print ? (
              <Check sx={{ color: "green !important" }} />
            ) : (
              <Print />
            )
          }
          loading={action === "packing-slip"}
          disabled={fetchLoading || order?.website_order_id === null}
        >
          Packing Slip
        </LoadingButton>
        {brand?.brandSettings?.["shipping-label"] && (
          <Button
            variant="contained"
            color="info"
            startIcon={<LocalShipping />}
            onClick={handleAction("shipping-label")}
            disabled={true || fetchLoading || !order?.products?.length || order?.is_trash}
          >
            Shipping Label
          </Button>
        )}
        <LoadingButton
          color="info"
          variant="contained"
          startIcon={<Print />}
          onClick={handleAction("one-label")}
          loading={action === "one-label"}
          disabled={labelDisabled || fetchLoading}
        >
          1 Label
        </LoadingButton>
        <LoadingButton
          color="info"
          variant="contained"
          startIcon={<Print />}
          onClick={handleAction("split-labels")}
          loading={action === "split-labels"}
          disabled={labelDisabled || fetchLoading}
        >
          Split Labels
        </LoadingButton>
      </Stack>
      <DeleteConfirmation
        onClose={handleAction(null, true)}
        open={action === "del"}
        row={order}
      />
      <RestoreConfirmation
        onClose={handleAction(null, true)}
        open={action === "restore"}
        row={order}
      />
      <ShippingLabelModal
        onClose={handleAction(null, true)}
        open={action === "shipping-label"}
        data={order}
      />
    </>
  );
};
export default Actions;
