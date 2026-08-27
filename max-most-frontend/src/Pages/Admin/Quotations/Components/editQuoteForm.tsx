import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid
} from "@mui/material";
import Input from "../../../../Components/Input";
import SelectField from "../../../../Components/SelectField";
import { useVendors } from "../../../../Hooks/useVendors";
import { SelectOption } from "../../../../Interfaces/ui";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { InputValueAndLabel } from "../../../../Interfaces/global";
import { useProducts } from "../../../../Hooks/useProducts";
import {
  EditQuoteResponse,
  QuoteForm,
  QuoteFormProduct
} from "../../../../Interfaces/quotatonsTypes";
import { quotesStatusOptions } from "../../../../Constants/quotesConst";
import Checkbox from "../../../../Components/Checkbox";
import LoadingButton from "../../../../Components/LoadingButton";
interface EditQuoteFormProps {
  onAdd(vals: QuoteFormProduct): void;
  onMainChange(vals: Omit<QuoteForm, "products">): void;
  data?: EditQuoteResponse;
  fetchLoading?: boolean;
  addProductLoading?: boolean;
}
const initialValues = {
  price: null,
  product: {
    cost_price: null,
    value: null,
    label: ""
  },
  product_id: null,
  quantity: null,
  tax: null,
  total: null
};
const initialMainValues = {
  vendor_id: "",
  status: "pending"
};
const EditQuoteForm: React.FC<EditQuoteFormProps> = ({
  onAdd,
  onMainChange,
  data,
  fetchLoading,
  addProductLoading
}) => {
  const { data: suppliers, isLoading: supplierLoading } = useVendors();
  const { data: products, isLoading: producstLoading } = useProducts(
    new URLSearchParams("?count=2000")
  );
  const [mainValues, setMainValues] =
    useState<Omit<QuoteForm, "products">>(initialMainValues);
  const [values, setValues] = useState<QuoteFormProduct>(initialValues);
  const handleReset = () => setValues(initialValues);

  const handleInputChange = (mode?: "main") => (val: InputValueAndLabel) => {
    if (val.label) {
      if (mode === "main") {
        const vals = { ...mainValues };
        (vals[val.label as keyof Omit<QuoteForm, "products">] as unknown) = val.value;
        setMainValues(vals);
      } else {
        const vals = { ...values };
        (vals[val.label as keyof QuoteFormProduct] as unknown) = val.value;
        setValues(vals);
      }
    }
  };
  const handleSubmitValues = (e: FormEvent) => {
    e.preventDefault();
    onAdd(values);
    handleReset();
  };
  const vendorsData = useMemo(() => {
    const data: SelectOption[] = [];
    if (suppliers?.results?.length) {
      suppliers?.results?.forEach(s => {
        data.push({
          value: s.id,
          label: s.name
        });
      });
    }
    return data;
  }, [suppliers]);

  const productsOptions = useMemo(() => {
    if (products?.results?.length) {
      return products.results?.map(el => {
        return {
          label: `${el.name}${el.barcode ? ` (${el.barcode})` : ""}`,
          value: el?.id_hash
        };
      });
    } else {
      return [];
    }
  }, [products]);
  useEffect(() => onMainChange(mainValues), [mainValues, onMainChange]);
  useEffect(() => {
    if (data) {
      const { vendor_id, status_display: status } = data;
      setMainValues({ vendor_id, status });
    }
  }, [data]);
  return (
    <>
      <Card>
        <CardHeader
          title={"Quote Details"}
          titleTypographyProps={{
            fontSize: 20,
            fontWeight: "bold"
          }}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              display={"flex"}
              justifyContent={"start"}
              gap={1}
              alignItems={"center"}
            >
              {quotesStatusOptions?.map((item, key) => (
                <Checkbox
                  id={`cy__${item.value}`}
                  checked={item.value === mainValues?.status}
                  loading={fetchLoading}
                  key={key}
                  onClick={() => setMainValues({ ...mainValues, status: item?.value })}
                  label={item?.label}
                  disabled={Boolean(data?.purchase_order_id)}
                />
              ))}
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <SelectField
                options={vendorsData}
                loading={supplierLoading || fetchLoading}
                label="Vendor :"
                value={mainValues.vendor_id}
                name="supplier"
                disable={Boolean(data?.purchase_order_id)}
                handleSelect={opt =>
                  setMainValues({ ...mainValues, vendor_id: opt.value })
                }
              />
            </Grid>
            {Boolean(data?.purchase_order_id) && (
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Input
                  loading={fetchLoading}
                  label="Purchase Order Id :"
                  value={data?.purchase_order_id}
                  name="purchase_order_id"
                  disable
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      <Collapse
        in={!data?.purchase_order_id}
        sx={{ transition: "all .3s ease-in-out !important" }}
      >
        <Card>
          <CardHeader
            title={"Product Details"}
            titleTypographyProps={{
              fontSize: 20,
              fontWeight: "bold"
            }}
          />
          <Divider />
          <form onSubmit={handleSubmitValues}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <SelectField
                    options={productsOptions}
                    label="Search Product :"
                    loading={producstLoading}
                    value={values.product_id || ""}
                    name="product"
                    disabled={Boolean(data?.purchase_order_id)}
                    handleSelect={opt => {
                      const prod = products?.results?.find(
                        el => String(el.id_hash) === String(opt.value)
                      );
                      setValues({
                        ...values,
                        product: {
                          cost_price: prod?.cost_price || 0,
                          ...opt
                        },
                        price: prod?.cost_price || 0,
                        product_id: opt.value
                      });
                    }}
                  />
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Quantity :"
                    value={values.quantity || 0}
                    name="quantity"
                    handleChange={handleInputChange()}
                    type="number"
                    disabled={Boolean(data?.purchase_order_id)}
                  />
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Price :"
                    type="number"
                    value={values.price || 0}
                    name="price"
                    disabled={Boolean(data?.purchase_order_id)}
                    handleChange={handleInputChange()}
                  />
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Input
                    label="Total :"
                    value={(values?.quantity || 0) * (values?.price || 0) || 0}
                    type="number"
                    name="total"
                    disabled={Boolean(data?.purchase_order_id)}
                    handleChange={handleInputChange()}
                    readOnly
                    noFocus
                  />
                </Grid>{" "}
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between" }}>
              <Button
                color="secondary"
                variant="contained"
                type="button"
                disabled={Boolean(data?.purchase_order_id)}
                onClick={handleReset}
              >
                Clear
              </Button>
              <LoadingButton
                color="primary"
                variant="contained"
                type="submit"
                loading={addProductLoading}
                disabled={
                  !values.price ||
                  !values.product.label ||
                  !values.product_id ||
                  !values.quantity ||
                  Boolean(data?.purchase_order_id)
                }
              >
                Add Item
              </LoadingButton>
            </CardActions>
          </form>
        </Card>
      </Collapse>
    </>
  );
};

export default EditQuoteForm;
