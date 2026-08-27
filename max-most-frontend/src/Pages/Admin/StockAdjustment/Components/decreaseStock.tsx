import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CardContent,
  Grid,
  CardActions,
  Button,
  Card,
  styled,
  Stack
} from "@mui/material";
import LoadingButton from "../../../../Components/LoadingButton";
import Input from "../../../../Components/Input";
import SelectField from "../../../../Components/SelectField";
import DataTable from "../../../../Components/DataTable";
import { useWebsites } from "../../../../Hooks/usePatients";
import { useProducts } from "../../../../Hooks/useProducts";
import { PurchaseOrderMain } from "../../../../Interfaces/PurchaseOrder";
import { InputValueAndLabel } from "../../../../Interfaces/global";
import {
  useCreateDescreaseAdjustment,
  useExpiryAndBatchList
} from "../../../../Hooks/usestocksAdjustment";
import { getBrandId } from "../../../../Hooks/api";
import {
  AdjustmentProduct,
  DecreaseStockBody,
  DecreaseStockFormProduct
} from "../../../../Interfaces/stocksAdjustmentTypes";
import { SelectOption } from "../../../../Interfaces/ui";
import { DecreaseStockColumns } from "../../../../Constants/stockAdjustmentConst";
import { Add } from "@mui/icons-material";
import { toast } from "react-toastify";

const initialValues: AdjustmentProduct = {
  price: 0,
  product: {
    cost_price: 0,
    label: "",
    value: ""
  },
  quantity: 0,
  tax: 0,
  total: 0,
  id: "",
  stock_quantity: 0,
  sku: "",
  name: "",
  batchNumber: "",
  expiry_date: "",
  less_quantity: 0,
  after_adjustment_qty: 0,
  batch_id: "",
  adjustmentQty: ""
};

const initialMainValues: PurchaseOrderMain = {
  exchange_rate: "1",
  invoicing_currency: "",
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

function DecreaseStock() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [product, setProduct] = useState<Partial<AdjustmentProduct>>(initialValues);
  const { mutate, isLoading: descreasePostingLoading } = useCreateDescreaseAdjustment();

  const brand = getBrandId();

  const {
    data: expiryAndBatch,
    isLoading: expiryLoading,
    refetch: reftechBatchAndExpiry
  } = useExpiryAndBatchList(product?.product?.value, brand?.brand_id);

  const { data: websitesResponse, isLoading: websitesFetchLoading } = useWebsites();
  const [mainValues, setMainValues] = useState<PurchaseOrderMain>(initialMainValues);
  const {
    data: products,
    isLoading: productsLoading,
    refetch: refetchProduct
  } = useProducts(new URLSearchParams("?count=2000"));
  const [values, setValues] = useState<AdjustmentProduct>(initialValues);

  const [submittedData, setSubmittedData] = useState<AdjustmentProduct[]>([]);

  const handleReset = () => setValues(initialValues);

  const websites = useMemo(() => {
    const data: SelectOption[] = [];
    if (websitesResponse?.results?.length) {
      websitesResponse?.results?.forEach(website_id => {
        data.push({
          value: website_id.id,
          label: website_id.title
        });
      });
    }
    return data;
  }, [websitesResponse]);

  const batches: SelectOption[] = useMemo(() => {
    return (
      expiryAndBatch?.map(item => ({
        label: `${item?.batch_number} | ${item?.expiry_date} | ${item?.received_quantity}`,
        value: item?.id?.toString(),
        received_quantity: item?.received_quantity
      })) || []
    );
  }, [expiryAndBatch]);

  const handelOrderFilter = (event: { label: string; value: string | null }) => {
    if (event) {
      const { label, value } = event;
      if (value) {
        searchParams.set(label, value.toString());
      } else {
        searchParams.delete(label);
      }
      setSearchParams(searchParams);
    }
  };

  const productsOptions = useMemo(() => {
    if (products?.results?.length) {
      return products.results
        ?.filter(product => product.stock_quantity && Number(product.stock_quantity) > 0)
        ?.map(el => ({
          label: `${el.name}${el.barcode ? ` (${el.barcode})` : ""}`,
          value: el?.id_hash
        }));
    } else {
      return [];
    }
  }, [products]);

  const handleInputChange = (mode?: "main") => (val: InputValueAndLabel) => {
    if (val.label) {
      if (mode === "main") {
        const vals = { ...mainValues };
        (vals[val.label as keyof PurchaseOrderMain] as unknown) = val.value;
        setMainValues(vals);
      } else {
        const vals = { ...values };
        (vals[val.label as keyof AdjustmentProduct] as unknown) = val.value;

        if (val.label === "less_quantity") {
          vals.after_adjustment_qty = vals.stock_quantity - Number(val.value);
        }

        if (Number(val.value) <= Number(values.stock_quantity)) setValues(vals);
      }
    }
  };

  const handleSubmit = () => {
    setSubmittedData([...submittedData, values]);
    handleReset();
  };

  const handleDelete = (row: DecreaseStockFormProduct) => {
    setSubmittedData(submittedData.filter(product => product.sku !== row.sku));
  };
  const [reasoned, setReasoned] = useState<string>();

  const handleSave = async () => {
    const activeBrand = getBrandId();

    const website_id = searchParams.get("website_id");
    if (!submittedData || !reasoned || !website_id) {
      const missingFields = [];
      if (!submittedData || submittedData.length === 0) {
        missingFields.push("Products");
      }
      if (!reasoned) {
        missingFields.push("Reason");
      }
      if (!website_id) {
        missingFields.push("website ID");
      }

      const errorMessage = `Please fill in the following required fields: ${missingFields.join(
        ", "
      )}`;
      toast.error(errorMessage);
      return;
    }

    const convertedData = {
      brand_id: activeBrand.brand_id || "",
      reason: reasoned,
      website_id: website_id,

      products: submittedData?.map(product => ({
        product_id: product.product.value || "",
        sku: product.sku || "",
        quantity: product.less_quantity || 0,
        batch_number: product.batchNumber,
        expiry_date: product.expiry_date
      }))
    };

    mutate(convertedData as DecreaseStockBody);
    refetchProduct();
    reftechBatchAndExpiry();
  };

  return (
    <>
      <Stack gap={2}>
        <StyledCard>
          <CardContent sx={{ py: 2 }}>
            <Stack width={"100%"} direction={"row"} justifyContent={"end"}>
              <LoadingButton
                startIcon={<Add />}
                onClick={handleSave}
                loading={descreasePostingLoading}
                variant="contained"
                id="cy__DecreaseSavebtn"
              >
                Save
              </LoadingButton>
            </Stack>
            <Grid container spacing={2}>
              <Grid item md={4} sm={6} xs={12}>
                <SelectField
                  handleSelect={(opt, name) => {
                    handelOrderFilter({
                      label: name,
                      value: opt?.value === "" ? "" : opt.value
                    });
                  }}
                  loading={websitesFetchLoading}
                  label="Website :"
                  name="website_id"
                  options={websites}
                  id="cy__DecreaseWebsiteId"
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Input
                  label="Reason :"
                  name="name"
                  handleChange={value => setReasoned(value?.value.toString())}
                  id="cy__DecreaseReason"
                />
              </Grid>
            </Grid>
            <Grid container columnSpacing={2} rowSpacing={1} my={2}>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <SelectField
                  options={productsOptions}
                  label="Search Product :"
                  loading={productsLoading}
                  value={values.product.value}
                  name="product"
                  handleSelect={opt => {
                    const prod = products?.results?.find(
                      el => String(el.id_hash) === String(opt.value)
                    );

                    setValues({
                      ...values,
                      product: {
                        cost_price: prod?.cost_price || 0,
                        label: opt.label,
                        value: opt.value
                      },
                      price: prod?.cost_price || 0,
                      sku: prod?.sku || "",
                      name: prod?.name || "",
                      stock_quantity: 0,
                      less_quantity: 0,
                      after_adjustment_qty: 0
                    });

                    setProduct({
                      ...product,
                      product: {
                        cost_price: prod?.cost_price || 0,
                        label: opt.label,
                        value: opt.value
                      },
                      sku: prod?.sku || "",
                      name: prod?.name || ""
                    });
                  }}
                  id="cy__DecreaseSearchProduct"
                />
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <SelectField
                  options={batches}
                  loading={expiryLoading}
                  value={values.batch_id}
                  label="Batch | Expiry | Qty"
                  name="batch"
                  handleSelect={opt => {
                    const batch = batches.find(b => b.value === opt.value);
                    setValues({
                      ...values,
                      batch_id: opt.value,
                      stock_quantity: batch ? Number(batch.received_quantity) : 0,
                      batchNumber: batch ? batch.label.split(" | ")[0] : "",
                      expiry_date: batch ? batch.label.split(" | ")[1] : "",
                      less_quantity: 0,
                      after_adjustment_qty: 0
                    });
                  }}
                  id="cy__DecreaseBatch"
                />
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Input
                  label="Stock Quantity"
                  type="number"
                  value={values.stock_quantity}
                  name="stock_quantity"
                  handleChange={handleInputChange()}
                  disabled
                  id="cy___DecreaseStockQuantity"
                />
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Input
                  label="Less Quantity "
                  type="number"
                  value={values.less_quantity}
                  name="less_quantity"
                  handleChange={handleInputChange()}
                  id="cy__DecreaseLessQty"
                />
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12} my={2}>
                <Input
                  label="After Adjustment Qty"
                  type="number"
                  value={values.after_adjustment_qty}
                  name="after_adjustment_qty"
                  handleChange={handleInputChange()}
                  disabled
                  id="cy__DeacreaseAdjustmentQty"
                />
              </Grid>
            </Grid>
            <CardActions sx={{ justifyContent: "space-between" }}>
              <Button
                color="secondary"
                variant="contained"
                type="button"
                onClick={() => handleReset()}
              >
                Clear
              </Button>
              <Button
                color="primary"
                variant="contained"
                type="button"
                onClick={handleSubmit}
                id="cy__DecreaseAddItem"
              >
                Add Item
              </Button>
            </CardActions>
          </CardContent>
        </StyledCard>
        <Card>
          <DataTable
            columns={DecreaseStockColumns({ handleDelete })}
            loading={false}
            data={submittedData}
          />
        </Card>
      </Stack>
    </>
  );
}

const StyledCard = styled(Card)(() => {
  return {
    boxShadow: "0px 21px 29.3px 0px #0000001A",
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0"
  };
});

export default DecreaseStock;
