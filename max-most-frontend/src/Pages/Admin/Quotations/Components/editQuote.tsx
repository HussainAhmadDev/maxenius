import { Stack } from "@mui/material";
import PageTitle from "../../../../Components/PageTitle";
import EditQuoteForm from "./editQuoteForm";
import { useMemo, useState } from "react";
import QuoteProductsTable from "./quoteProductsTable";
import { toast } from "react-toastify";
import LoadingButton from "../../../../Components/LoadingButton";
import { useParams } from "react-router-dom";
import { QuoteForm, QuoteFormProduct } from "../../../../Interfaces/quotatonsTypes";
import {
  useEditQuotation,
  useAddEditQuote,
  useAddQuotationProduct,
  useUpdateQuotationProduct,
  useDeleteQuotationProduct
} from "../../../../Hooks/useQuotation";
import QuoteToPoModal from "./quoteToPOModal";

const EditQuote = () => {
  const { id } = useParams();
  const { data: quote, isLoading: quoteFetchLoading, refetch } = useEditQuotation(id);
  const { mutateAsync: addProduct, isLoading: addProductLoading } =
    useAddQuotationProduct();
  const { mutateAsync: updateProduct, isLoading: updateProductLoading } =
    useUpdateQuotationProduct();
  const { mutateAsync: deleteProduct, isLoading: deleteProductLoading } =
    useDeleteQuotationProduct();

  const { mutateAsync, isLoading } = useAddEditQuote();
  const [mainValues, setMainValues] = useState<Omit<QuoteForm, "products">>();
  const [products, setProducts] = useState<QuoteFormProduct[]>([]);
  const [editValues, setEditValues] = useState<QuoteFormProduct | null>(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const productsData: QuoteFormProduct[] = useMemo(() => {
    if (products.length && mainValues) {
      return products.map(el => {
        return {
          ...el,
          total: ((el.quantity || 0) * (el.price || 0))?.toString()
        };
      });
    } else {
      return [];
    }
  }, [products, mainValues]);
  const qoute: QuoteForm | null = useMemo(() => {
    if (products && mainValues) {
      const data: QuoteForm = {
        ...mainValues,
        products: (productsData || []) as unknown as QuoteFormProduct[]
      };
      return data;
    } else {
      return null;
    }
  }, [mainValues, productsData, products]);

  const handleAddProduct = (vals: QuoteFormProduct) => {
    if (id) {
      const { product_id, price: unit_price, quantity } = vals;
      addProduct({ product_id, unit_price, quantity, id });
    }
  };
  const handleUpdate = () => {
    const check = productsData.some(el => el.id === editValues?.id);
    if (check && editValues && id) {
      const { quantity, id, price: unit_price } = editValues;
      updateProduct({ quantity, product_id: id, unit_price, id }).then(() => {
        setEditValues(null);
      });
    } else {
      toast.error("Something went's wrong");
    }
  };
  const handleEdit = (row: QuoteFormProduct) => {
    if (row) {
      setEditValues(row);
    } else {
      setEditValues(null);
    }
  };
  const handleEditQuote = () => {
    try {
      if (!products.length) {
        throw Error("Atleast one Product is reqiured");
      }
      if (!mainValues?.vendor_id) {
        throw new Error("Vendor is reqiured");
      }
      if (qoute && id) {
        mutateAsync({
          ...qoute,
          id,
          products: []
        }).then(() => {
          refetch();
        });
      }
    } catch (error) {
      toast.error((error as Error)?.message);
    }
  };
  const handleDelete = (row: QuoteFormProduct) => {
    if (row && id) {
      setEditValues(row);
      deleteProduct({ id, product_id: row?.id }).then(() => setEditValues(null));
    }
  };
  useMemo(() => {
    if (quote?.products?.length) {
      setProducts(
        quote?.products?.map(item => {
          return {
            price: Number(item.unit_price || 0),
            product: {
              cost_price: Number(item.unit_price || 0),
              label: `${item?.product.name}${item?.product.barcode ? ` (${item?.product.barcode})` : ""}`,
              value: item?.product?.id
            },
            product_id: item?.product?.id,
            quantity: Number(item?.quantity || 0),
            tax: item?.tax_rate,
            total: (
              Number(item?.quantity || 0) * Number(item.unit_price || 0)
            )?.toString(),
            id: item?.id
          };
        })
      );
    }
  }, [quote, setProducts]);
  return (
    <>
      <PageTitle
        title="Edit Quote"
        icon="/assets/icons/quotes-icon.svg"
        endComponent={
          <Stack direction={"row"} gap={1}>
            <LoadingButton
              size="medium"
              color="secondary"
              variant="contained"
              onClick={handleOpen}
              disabled={
                !qoute ||
                updateProductLoading ||
                addProductLoading ||
                isLoading ||
                quote?.status_display?.toLowerCase() !== "approved" ||
                Boolean(quote?.purchase_order_id)
              }
            >
              Convert to Purchase Order
            </LoadingButton>
            <LoadingButton
              variant="contained"
              size="medium"
              loading={isLoading}
              disabled={
                !qoute ||
                updateProductLoading ||
                addProductLoading ||
                Boolean(quote?.purchase_order_id)
              }
              onClick={handleEditQuote}
            >
              Save
            </LoadingButton>
          </Stack>
        }
      />
      <Stack gap={2}>
        <EditQuoteForm
          data={quote}
          fetchLoading={quoteFetchLoading}
          addProductLoading={addProductLoading}
          onAdd={handleAddProduct}
          onMainChange={setMainValues}
        />
        <QuoteProductsTable
          data={productsData}
          editValues={editValues}
          updateLoading={updateProductLoading}
          deleteLoading={deleteProductLoading}
          loading={quoteFetchLoading}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          noAction={Boolean(quote?.purchase_order_id)}
        />
        <QuoteToPoModal
          onClose={() => {
            handleClose();
            refetch();
          }}
          open={open}
          quote={quote}
        />
      </Stack>
    </>
  );
};

export default EditQuote;
