import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid
} from "@mui/material";
import Input from "../../../Components/Input";
import SelectField from "../../../Components/SelectField";
import { currencyOptions } from "../../../Constants";
import { useWarehouses } from "../../../Hooks/useWarehouses";
import { useVendors } from "../../../Hooks/useVendors";
import { SelectOption } from "../../../Interfaces/ui";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  PurchaseOrderMain,
  PurchaseOrderProductForm
} from "../../../Interfaces/PurchaseOrder";
import { InputValueAndLabel } from "../../../Interfaces/global";
import { getBrandDetails } from "../../../Hooks/api";
import { useProducts } from "../../../Hooks/useProducts";
interface CreatePurchaseOrderFormProps {
  onAdd(vals: PurchaseOrderProductForm): void;
  onMainChange(vals: PurchaseOrderMain): void;
}
const initialValues = {
  price: 0,
  product: {
    cost_price: 0,
    label: "",
    value: ""
  },
  product_id: "",
  quantity: 0,
  tax: 0,
  total: 0
};
const initialMainValues = {
  exchange_rate: "1",
  invoicing_currency: currencyOptions[0]?.value?.toUpperCase(),
  supplier: {
    label: "",
    value: ""
  },
  unit_cost_amounts: "tax exclusive",
  vendor_id: "",
  warehouse: {
    label: "",
    value: ""
  },
  warehouse_id: ""
};

const CreatePurchaseOrderForm: React.FC<CreatePurchaseOrderFormProps> = ({
  onAdd,
  onMainChange
}) => {
  const { data: locations, isLoading: locationLoading } = useWarehouses();
  const { data: suppliers, isLoading: supplierLoading } = useVendors();
  const { data: products, isLoading: producstLoading } = useProducts(
    new URLSearchParams("?count=2000")
  );
  const brand = getBrandDetails();
  const [mainValues, setMainValues] = useState<PurchaseOrderMain>(initialMainValues);
  const [values, setValues] = useState<PurchaseOrderProductForm>(initialValues);
  const handleReset = () => setValues(initialValues);

  const handleInputChange = (mode?: "main") => (val: InputValueAndLabel) => {
    if (val.label) {
      if (mode === "main") {
        setMainValues(
          (prev: PurchaseOrderMain | undefined = {} as PurchaseOrderMain) => ({
            ...prev,
            [val.label as keyof PurchaseOrderMain]: val.value as unknown
          })
        );
      } else {
        setValues(prev => ({
          ...prev,
          [val.label as keyof PurchaseOrderProductForm]: val.value as unknown
        }));
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
  const locationData = useMemo(() => {
    const data: SelectOption[] = [];
    if (locations?.results?.length) {
      locations?.results?.map(loc => {
        data.push({
          value: loc.id,
          label: loc.name
        });
      });
    }
    return data;
  }, [locations]);
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
  useMemo(() => onMainChange(mainValues), [mainValues, onMainChange]);
  useEffect(() => {
    if (
      brand?.currency?.toLowerCase() === mainValues?.invoicing_currency?.toLowerCase()
    ) {
      setMainValues({ ...mainValues, exchange_rate: 1 });
    }
  }, [brand, mainValues, setMainValues]);
  return (
    <>
      <Card>
        <CardHeader
          title={"Purchase Order"}
          titleTypographyProps={{
            fontSize: 20,
            fontWeight: "bold"
          }}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Input
                value={"Pending"}
                disable
                label="Status :"
                id="cy__CreatePurchaseOrderStatus"
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <SelectField
                options={locationData}
                loading={locationLoading}
                value={mainValues.warehouse_id}
                label="Location :"
                name="warehouse"
                id="cy__CreatePurchaseOrderLocation"
                handleSelect={opt =>
                  setMainValues({
                    ...mainValues,
                    warehouse: opt,
                    warehouse_id: opt.value
                  })
                }
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <SelectField
                options={vendorsData}
                loading={supplierLoading}
                label="Vendor :"
                value={mainValues.vendor_id}
                name="supplier"
                id="cy__CreatePurchaseOrderVendor"
                handleSelect={opt =>
                  setMainValues({ ...mainValues, supplier: opt, vendor_id: opt.value })
                }
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Input
                label="Organization Currency :"
                value={getBrandDetails()?.currency?.toUpperCase()}
                name="currency"
                disable
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <SelectField
                options={currencyOptions}
                label="Invoicing Currency :"
                value={mainValues.invoicing_currency}
                name="invoicing_currency"
                handleSelect={opt =>
                  setMainValues({
                    ...mainValues,
                    invoicing_currency: opt?.value?.toUpperCase()
                  })
                }
              />
            </Grid>

            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Input
                label="Exchange Rate :"
                value={mainValues.exchange_rate || 0}
                name="exchange_rate"
                type="number"
                min={0}
                disable={
                  brand?.currency?.toLowerCase() ===
                  mainValues?.invoicing_currency?.toLowerCase()
                }
                handleChange={handleInputChange("main")}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
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
                  value={values.product_id}
                  name="product"
                  id="cy__SearchProduct"
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
                  id="cy__AddQuantity"
                />
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Input
                  label="Price :"
                  type="number"
                  value={values.price || 0}
                  name="price"
                  handleChange={handleInputChange()}
                  id="cy__AddPrice"
                />
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Input
                  label="Total :"
                  value={values?.quantity * values?.price || 0}
                  type="number"
                  name="total"
                  handleChange={handleInputChange()}
                  readOnly
                  noFocus
                />
              </Grid>{" "}
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Input
                  label="Exchange Price :"
                  value={
                    values.price * Number(mainValues.exchange_rate) === 0
                      ? Number(mainValues.exchange_rate) + 1
                      : Number(mainValues.exchange_rate)
                  }
                  name="exchange_price"
                  type="number"
                  readOnly
                  noFocus
                />
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Input
                  label="Exchange Total :"
                  value={
                    values.quantity *
                    (values.price *
                      (Number(mainValues.exchange_rate) === 0
                        ? Number(mainValues.exchange_rate) + 1
                        : Number(mainValues.exchange_rate)))
                  }
                  type="number"
                  name="exchange_total"
                  readOnly
                  noFocus
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: "space-between" }}>
            <Button
              color="secondary"
              variant="contained"
              type="button"
              onClick={handleReset}
            >
              Clear
            </Button>
            <Button
              id="cy__AddItemBtn"
              color="primary"
              variant="contained"
              type="submit"
              disabled={
                !values.price ||
                !values.product.label ||
                !values.product_id ||
                !values.quantity
              }
            >
              Add Item
            </Button>
          </CardActions>
        </form>
      </Card>
    </>
  );
};

export default CreatePurchaseOrderForm;
