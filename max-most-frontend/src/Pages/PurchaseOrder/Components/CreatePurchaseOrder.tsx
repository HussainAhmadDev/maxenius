import { Stack } from "@mui/material";
import PageTitle from "../../../Components/PageTitle";
import CreatePurchaseOrderForm from "./CreatePurchaseOrderForm";
import { useMemo, useState } from "react";
import {
  PurchaseOrderForm,
  PurchaseOrderMain,
  PurchaseOrderProduct,
  PurchaseOrderProductForm
} from "../../../Interfaces/PurchaseOrder";
import PurchaseOrderProductsTable from "./PurchaseOrderProductsTable";
import { uuid } from "../../../Utils/datesFormat";
import { toast } from "react-toastify";
import { useCreatePurchaseOrder } from "../../../Hooks/usePurchaseOrder";
import LoadingButton from "../../../Components/LoadingButton";
import { useNavigate } from "react-router-dom";
import { useGenerateBarcodeBySKU } from "../../../Hooks/useProducts";
// import SeeDocumentation from "../../../Components/SeeDocumentation";

const CreatePurchaseOrder = () => {
  const [mainValues, setMainValues] = useState<PurchaseOrderMain>();
  const [products, setProducts] = useState<PurchaseOrderProductForm[]>([]);
  const [editValues, setEditValues] = useState<PurchaseOrderProductForm | null>(null);
  const { mutateAsync, isLoading } = useCreatePurchaseOrder();
  const [barcodeLoadingId, setBarcodeLoadingId] = useState("");
  const navigate = useNavigate();
  const { mutateAsync: generateBarcode } = useGenerateBarcodeBySKU();

  const productsData: PurchaseOrderProductForm[] = useMemo(() => {
    if (products.length && mainValues) {
      return products.map(el => {
        const exchangeRate =
          Number(mainValues.exchange_rate) === 0 ? 1 : Number(mainValues.exchange_rate);
        return {
          ...el,
          total: el.quantity * el.price,
          exchangePrice: (el.price * exchangeRate).toFixed(2),
          exchangeTotal: (el.quantity * el.price * exchangeRate).toFixed(2),
          id: uuid()
        };
      });
    } else {
      return [];
    }
  }, [products, mainValues]);
  const purchaseOrders: PurchaseOrderForm | null = useMemo(() => {
    if (products && mainValues) {
      const data: PurchaseOrderForm = {
        ...mainValues,
        products: (productsData || []) as unknown as PurchaseOrderProduct[]
      };
      return data;
    } else {
      return null;
    }
  }, [mainValues, productsData, products]);

  const handleAddProduct = (vals: PurchaseOrderProductForm) => {
    setProducts([vals, ...products]);
  };
  const handleDelete = (row: PurchaseOrderProductForm) => {
    setProducts(productsData.filter(el => el.id !== row.id));
  };
  const handleUpdate = () => {
    const ind = productsData.findIndex(el => el.id === editValues?.id);
    const data = [...productsData];
    if (ind !== -1 && editValues) {
      data[ind] = editValues;
      setProducts(data);
    }
    setEditValues(null);
  };
  const handleEdit = (row: PurchaseOrderProductForm) => {
    if (row) {
      setEditValues(row);
    } else {
      setEditValues(null);
    }
  };
  const handleBarcode = async (row: PurchaseOrderProductForm) => {
    try {
      setBarcodeLoadingId(row?.id || "");
      const label = row?.product?.label;
      const skuPattern = /\(([^)]+)\)/;
      const match = label.match(skuPattern);
      if (match) {
        const sku = match.at(-1);
        if (sku) {
          await generateBarcode({
            data: [sku]
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBarcodeLoadingId("");
    }
  };
  const handleCreatePurchaseOrder = () => {
    try {
      if (!products.length) {
        throw Error("Atleast one Product is reqiured");
      }
      if (!Number(mainValues?.exchange_rate)) {
        throw Error("Exchange rate should be more than 0");
      }
      if (!mainValues?.vendor_id) {
        throw new Error("Vendor is reqiured");
      }
      if (!mainValues?.warehouse_id) {
        throw new Error("Location is reqiured");
      }
      if (!mainValues?.invoicing_currency) {
        throw new Error("Invoicing Currency is reqiured");
      }
      if (purchaseOrders) {
        mutateAsync(purchaseOrders).then(() => navigate("/purchase-orders"));
      }
    } catch (error) {
      toast.error((error as Error)?.message);
    }
  };

  return (
    <>
      <PageTitle
        title="Create Purchase Order"
        icon="/assets/icons/purchaseOrder.svg"
        endComponent={
          <LoadingButton
            variant="contained"
            size="medium"
            onClick={handleCreatePurchaseOrder}
            loading={isLoading}
            disabled={!purchaseOrders}
            id="cy__CreateSaveBtn"
          >
            Save
          </LoadingButton>
        }
      />
      {/* <SeeDocumentation
        fileName={"useCreatePurchaseOrder"}
        title={"Create PO Documentation"}
      /> */}
      <Stack gap={2}>
        <CreatePurchaseOrderForm onAdd={handleAddProduct} onMainChange={setMainValues} />
        <PurchaseOrderProductsTable
          data={productsData}
          onDelete={handleDelete}
          editValues={editValues}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
          barcodeLoadingId={barcodeLoadingId}
          onBarcode={handleBarcode}
        />
      </Stack>
    </>
  );
};

export default CreatePurchaseOrder;
