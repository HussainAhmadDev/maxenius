import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Grid,
  CardContent,
  CardActions,
  Divider,
  Typography,
  styled,
  Card,
  Stack,
  CardHeader
} from "@mui/material";
import SelectField from "../../../../Components/SelectField";
import { useWarehouses } from "../../../../Hooks/useWarehouses";
import { useVendors } from "../../../../Hooks/useVendors";
import { SelectOption } from "../../../../Interfaces/ui";
import { InputValueAndLabel } from "../../../../Interfaces/global";
import Input from "../../../../Components/Input";
import { useProducts } from "../../../../Hooks/useProducts";
import DataTable from "../../../../Components/DataTable";
import {
  IncreaseStcock,
  IncreaseStockForm,
  IncreaseStockFormProduct
} from "../../../../Interfaces/stocksAdjustmentTypes";
import DatePicker from "../../../../Components/DatePicker";
import dayjs from "dayjs";
import { IncreaseStockColumns } from "../../../../Constants/stockAdjustmentConst";
import { useIncreaseAdjustment } from "../../../../Hooks/usestocksAdjustment";
import LoadingButton from "../../../../Components/LoadingButton";
import { Add } from "@mui/icons-material";
import { toast } from "react-toastify";

const initialValues: IncreaseStockFormProduct = {
  batch_number: "",
  expiry_date: "",
  product_id: "",
  quantity: 0,
  sku: "",
  stock_quantity: 0,
  product_name: ""
};

const initialMainValues: Omit<IncreaseStockForm, "products"> = {
  reason: "",
  vendor_id: "",
  warehouse_id: ""
};

const IncreaseStock = () => {
  const { data: locations, isLoading: locationLoading } = useWarehouses();
  const { data: suppliers, isLoading: supplierLoading } = useVendors();
  const [isValidDate, setIsValidDate] = useState(false);
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch
  } = useProducts(new URLSearchParams("?count=2000"));
  const { mutateAsync, isLoading: saveLoading } = useIncreaseAdjustment();

  const [products, setProducts] = useState<IncreaseStockFormProduct[]>([]);
  const [mainValues, setMainValues] =
    useState<Omit<IncreaseStockForm, "products">>(initialMainValues);
  const [values, setValues] = useState<IncreaseStockFormProduct>(initialValues);

  useEffect(() => {}, [values.expiry_date]);

  const handleReset = (mode?: "main") => {
    if (mode === "main") {
      setMainValues(initialMainValues);
    } else {
      setValues(initialValues);
    }
  };

  const handleAdd = () => {
    setProducts([...products, values]);
    handleReset();
  };

  const handleDelete = (row: IncreaseStockFormProduct) => {
    setProducts(products.filter(product => product.sku !== row.sku));
  };

  const handleInputChange = (mode?: "main") => (val: InputValueAndLabel) => {
    if (val.label) {
      if (mode === "main") {
        setMainValues({
          ...mainValues,
          [val.label]: val.value
        });
      } else {
        setValues({
          ...values,
          [val.label]: val.value
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      if (!mainValues?.reason) {
        throw new Error("Reason is required");
      }
      if (!mainValues?.vendor_id) {
        throw new Error("Vendor is required");
      }
      if (!mainValues?.warehouse_id) {
        throw new Error("Location is required");
      }
      if (!products?.length) {
        throw new Error("At least one product is required");
      }
      const tempData: IncreaseStcock = {
        ...mainValues,
        products: products?.map(item => {
          const { batch_number, expiry_date, product_id, quantity, sku } = item;
          return {
            batch_number,
            expiry_date,
            product_id,
            quantity,
            sku
          };
        })
      };
      mutateAsync(tempData)?.then(() => {
        handleReset("main");
        handleReset();
        setProducts([]);
        refetch();
      });
    } catch (error) {
      toast.error((error as Error)?.message);
    }
  };

  const vendorsData = useMemo(() => {
    const data: SelectOption[] = [];
    if (suppliers?.results?.length) {
      suppliers.results.forEach(supplier => {
        data.push({
          value: supplier.id,
          label: supplier.name
        });
      });
    }
    return data;
  }, [suppliers]);

  const productsOptions = useMemo(() => {
    if (productsData?.results?.length) {
      return productsData.results.map(product => ({
        value: product.id_hash,
        label: `${product.name} (${product.sku})`
      }));
    } else {
      return [];
    }
  }, [productsData]);

  const locationData = useMemo(() => {
    const data: SelectOption[] = [];
    if (locations?.results?.length) {
      locations.results.forEach(location => {
        data.push({
          value: location.id,
          label: location.name
        });
      });
    }
    return data;
  }, [locations]);
  return (
    <Stack gap={2}>
      <StyledCard>
        <CardContent>
          <Stack width={"100%"} direction={"row"} justifyContent={"end"}>
            <LoadingButton
              startIcon={<Add />}
              onClick={handleSave}
              loading={saveLoading}
              variant="contained"
              id="cy__StockSaveBtn"
            >
              Save
            </LoadingButton>
          </Stack>

          <Grid container columnSpacing={2} rowSpacing={1} mb={1}>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <SelectField
                options={locationData}
                loading={locationLoading}
                value={mainValues.warehouse_id}
                label="Location :"
                name="warehouse"
                handleSelect={opt =>
                  setMainValues({
                    ...mainValues,
                    warehouse_id: opt.value
                  })
                }
                id="cy__StockLocation"
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <SelectField
                options={vendorsData}
                loading={supplierLoading}
                label="Vendor:"
                value={mainValues.vendor_id}
                name="supplier"
                handleSelect={opt =>
                  setMainValues({ ...mainValues, vendor_id: opt.value })
                }
                id="cy__StockVendor"
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Input
                label="Reason:"
                value={mainValues.reason}
                name="reason"
                handleChange={handleInputChange("main")}
                id="cy__StockReason"
              />
            </Grid>
          </Grid>
          <Typography fontWeight={"bold"} my={1}>
            Product Details :
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Grid container columnSpacing={2} rowSpacing={1} my={1}>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <SelectField
                options={productsOptions}
                label="Search Product :"
                loading={productsLoading}
                value={values.product_id}
                name="product"
                id="cy__SearchProductForStock"
                handleSelect={opt => {
                  const selectedProduct = productsData?.results?.find(
                    product => String(product.id_hash) === String(opt.value)
                  );
                  setValues({
                    ...values,
                    sku: String(selectedProduct?.sku) || "",
                    stock_quantity: Number(selectedProduct?.stock_quantity) || 0,
                    product_id: selectedProduct?.id_hash || "id_hash",
                    product_name: selectedProduct?.name || ""
                  });
                }}
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Input
                label="Stock Quantity :"
                value={values.stock_quantity}
                name="stock_quantity"
                type="number"
                disabled
                id="cy__StockQuantity"
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Input
                label="Adjustment Qty :"
                type="number"
                min={0}
                value={values.quantity}
                name="adjustment_qty"
                handleChange={val =>
                  setValues({ ...values, quantity: Number(val.value) })
                }
                id="cy__StockAdjustmentQty"
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Input
                label="After Adjustment Qty :"
                type="number"
                value={Number(values.stock_quantity || 0) + values.quantity}
                name="after_adjustment_qty"
                disabled
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Input
                label="Batch # :"
                name="batch_number"
                value={values.batch_number}
                handleChange={handleInputChange()}
                id="cy__StockBatch"
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <DatePicker
                value={
                  values.expiry_date ? dayjs(values.expiry_date, "DD/MM/YYYY") : null
                }
                label="Expiry Date :"
                onChange={val => {
                  if (val && val?.isValid()) {
                    setIsValidDate(true);
                    setValues({
                      ...values,
                      expiry_date: dayjs(val).format("DD/MM/YYYY")
                    });
                  } else if (!val) {
                    setValues({
                      ...values,
                      expiry_date: ""
                    });
                  } else {
                    setIsValidDate(false);
                  }
                }}
                disablePast
                id="cy__StockExpiryDate"
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
              onClick={handleAdd}
              disabled={
                !isValidDate ||
                !values.sku ||
                !values.expiry_date ||
                values.quantity === 0
              }
              id="cy__StockAddItem"
            >
              Add Item
            </Button>
          </CardActions>
        </CardContent>
      </StyledCard>
      <Card>
        <CardHeader title={`Results (${products?.length})`} />
        <Divider />
        <DataTable
          columns={IncreaseStockColumns({ handleDelete })}
          loading={false}
          data={products || []}
        />
      </Card>
    </Stack>
  );
};

const StyledCard = styled(Card)(() => {
  return {
    boxShadow: "0px 21px 29.3px 0px #0000001A",
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0"
  };
});

export default IncreaseStock;
