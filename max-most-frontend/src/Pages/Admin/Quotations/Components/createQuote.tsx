import { Stack } from "@mui/material";
import PageTitle from "../../../../Components/PageTitle";
import CreateQuoteForm from "./createQuoteForm";
import { useMemo, useState } from "react";
import QuoteProductsTable from "./quoteProductsTable";
import { uuid } from "../../../../Utils/datesFormat";
import { toast } from "react-toastify";
import LoadingButton from "../../../../Components/LoadingButton";
import { useNavigate } from "react-router-dom";
import { QuoteForm, QuoteFormProduct } from "../../../../Interfaces/quotatonsTypes";
import { useAddEditQuote } from "../../../../Hooks/useQuotation";

const CreateQuote = () => {
  const [mainValues, setMainValues] = useState<Omit<QuoteForm, "products">>();
  const [products, setProducts] = useState<QuoteFormProduct[]>([]);
  const [editValues, setEditValues] = useState<QuoteFormProduct | null>(null);
  const { mutateAsync, isLoading } = useAddEditQuote();
  const navigate = useNavigate();

  const productsData: QuoteFormProduct[] = useMemo(() => {
    if (products.length && mainValues) {
      return products.map(el => {
        return {
          ...el,
          total: ((el.quantity || 0) * (el.price || 0))?.toString(),
          id: uuid()
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
    setProducts([vals, ...products]);
  };
  const handleDelete = (row: QuoteFormProduct) => {
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
  const handleEdit = (row: QuoteFormProduct) => {
    if (row) {
      setEditValues(row);
    } else {
      setEditValues(null);
    }
  };
  const handleCreateQuote = () => {
    try {
      if (!products.length) {
        throw Error("Atleast one Product is reqiured");
      }

      if (!mainValues?.vendor_id) {
        throw new Error("Vendor is reqiured");
      }

      if (qoute) {
        mutateAsync({
          ...qoute,
          products: qoute.products?.map(item => {
            delete item.id;
            return { ...item };
          })
        }).then(() => navigate("/admin/quotes"));
      }
    } catch (error) {
      toast.error((error as Error)?.message);
    }
  };

  return (
    <>
      <PageTitle
        title="Create Quote"
        icon="/assets/icons/quotes-icon.svg"
        endComponent={
          <LoadingButton
            variant="contained"
            onClick={handleCreateQuote}
            loading={isLoading}
            disabled={!qoute}
            size="medium"
            id="cy__QuoteSaveBtn"
          >
            Save
          </LoadingButton>
        }
      />
      <Stack gap={2}>
        <CreateQuoteForm onAdd={handleAddProduct} onMainChange={setMainValues} />
        <QuoteProductsTable
          data={productsData}
          onDelete={handleDelete}
          editValues={editValues}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
        />
      </Stack>
    </>
  );
};

export default CreateQuote;
