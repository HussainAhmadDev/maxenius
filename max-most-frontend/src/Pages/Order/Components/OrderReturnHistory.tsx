import { Button, CardActions, CardContent } from "@mui/material";
import React, { useState } from "react";
import DataTable from "../../../Components/DataTable";
import { OrderReturnHistoryColumns } from "../../../Constants/Orders";
import { OrderData, OrderProduct, Returned } from "../../../Interfaces/Orders";
import { ukDateFormat } from "../../../Utils/datesFormat";
import { Add } from "@mui/icons-material";
import OrderAddReturnModal from "./OrderAddReturnModal";

interface OrderReturnHistoryProps {
  data?: OrderProduct[];
  loading: boolean;
  mode?: "full";
  order?: OrderData;
}

const OrderReturnHistory: React.FC<OrderReturnHistoryProps> = ({
  data,
  loading,
  mode,
  order
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const returnedProducts = React.useMemo(() => {
    if (data && data.length > 0) {
      const filteredReturns: Array<Returned> = [];

      data?.forEach(product => {
        product?.order_product_return?.forEach(productReturn => {
          filteredReturns.push({
            sku: product.sku || "",
            name: product.product?.name || "",
            quantityOrdered: product.quantity || 0,
            quantityShipped: product.shipped_quantity || 0,
            quantityReturned: productReturn.return_shipment.quantity,
            image: product.product?.image,
            currentQuantity: product.quantity,
            date:
              productReturn.created?.toLowerCase() === "none"
                ? "---"
                : productReturn.created
                  ? ukDateFormat(productReturn.created, false)
                  : "---",
            amountRefunded: 0,
            prescription_id: product.prescription_id
          });
        });
      });
      return filteredReturns;
    }
    return [];
  }, [data]);
  return (
    <>
      <CardContent>
        <DataTable
          columns={OrderReturnHistoryColumns()}
          data={returnedProducts || []}
          loading={loading}
          dense={mode !== "full"}
        />
      </CardContent>
      {mode == "full" && (
        <CardActions>
          <Button
            id="cy__AddReturnbtn"
            startIcon={<Add />}
            variant="contained"
            size="small"
            onClick={handleOpen}
          >
            Add Return
          </Button>
        </CardActions>
      )}
      <OrderAddReturnModal onClose={handleClose} open={open} data={data} order={order} />
    </>
  );
};

export default OrderReturnHistory;
