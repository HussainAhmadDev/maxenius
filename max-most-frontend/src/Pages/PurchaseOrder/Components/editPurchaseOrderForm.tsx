import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import Checkbox from "../../../Components/Checkbox";
import {
  useAddPurchaseOrderProduct,
  useGeneratePOReport,
  useUpdatePurchaseOrder,
  useUpdatePurchaseOrderProduct
} from "../../../Hooks/usePurchaseOrder";
import { useUser } from "../../../Contexts/userContext";
import React, { useEffect, useMemo, useState } from "react";
import {
  EditPurchaseOrderData,
  EditPurchaseOrderProduct,
  PurchaseOrderPDFResponse,
  PurchaseOrderProductForm
} from "../../../Interfaces/PurchaseOrder";
import { InputValueAndLabel } from "../../../Interfaces/global";
import {
  EditPurchaseOrderProductsColumns,
  orderStatus
} from "../../../Constants/PurchaseOrders";
import Input from "../../../Components/Input";
import { ukDateFormat } from "../../../Utils/datesFormat";
import { getBrandDetails } from "../../../Hooks/api";
import SelectField from "../../../Components/SelectField";
import { currencyOptions } from "../../../Constants";
import { SelectOption } from "../../../Interfaces/ui";
import { useWarehouses } from "../../../Hooks/useWarehouses";
import { useVendors } from "../../../Hooks/useVendors";
import { useGenerateBarcodeBySKU, useProducts } from "../../../Hooks/useProducts";
import LoadingButton from "../../../Components/LoadingButton";
import PageTitle from "../../../Components/PageTitle";
import { toast } from "react-toastify";
import DataTable from "../../../Components/DataTable";
import { generatePurchaserOrderPDF } from "../../../Utils/PDF";
import { useParams } from "react-router-dom";
import { PictureAsPdf } from "@mui/icons-material";
import { User } from "../../../Interfaces/usersType";
import SeeDocumentation from "../../../Components/SeeDocumentation";
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
interface EditPurchaseOrderFormProps {
  OrderData?: EditPurchaseOrderData;
  isLoading: boolean;
  onAddReciving(): void;
  refetch(): void;
}
const EditPurchaseOrderForm: React.FC<EditPurchaseOrderFormProps> = ({
  OrderData,
  isLoading,
  onAddReciving,
  refetch
}) => {
  const { data: locations, isLoading: locationLoading } = useWarehouses();
  const { data: suppliers, isLoading: supplierLoading } = useVendors();
  const { data: productsData, isLoading: producstLoading } = useProducts(
    new URLSearchParams("?count=2000")
  );
  const { orderId } = useParams();
  const [product, setProduct] = useState<PurchaseOrderProductForm>(initialValues);
  const { mutateAsync: mutateAsyncPDF, isLoading: pdfLoading } = useGeneratePOReport();
  const [editedValues, setEditedValues] = useState<
    PurchaseOrderProductForm | EditPurchaseOrderProduct | null
  >(null);
  const { user } = useUser();
  const [data, setData] = useState<EditPurchaseOrderData>({} as EditPurchaseOrderData);
  const [barcodeLoadingId, setBarcodeLoadingId] = useState("");
  const brand = getBrandDetails();
  const { mutateAsync: generateBarcode } = useGenerateBarcodeBySKU();
  const { mutateAsync, isLoading: updateLoading } = useUpdatePurchaseOrder();
  const { mutateAsync: addProduct, isLoading: addProductLoading } =
    useAddPurchaseOrderProduct();
  const { mutateAsync: updateProduct, isLoading: updateProductLoading } =
    useUpdatePurchaseOrderProduct();
  const handlePdfExport = () => {
    if (!orderId) {
      return toast.error("Invalid Id");
    }
    mutateAsyncPDF({
      purchase_order_id: orderId
    }).then(res => {
      const data = res as PurchaseOrderPDFResponse;
      if (data) {
        generatePurchaserOrderPDF(data);
      }
    });
  };
  const handleEdit = (
    vals: PurchaseOrderProductForm | EditPurchaseOrderProduct | null
  ) => {
    setEditedValues(vals);
  };
  const handleDone = () => {
    if (editedValues && orderId && data?.products?.length) {
      updateProduct({
        unit_price: editedValues?.price,
        quantity: editedValues?.quantity,
        product_id: editedValues?.id,
        id: orderId || ""
      }).then(() => {
        refetch();
        setEditedValues(null);
      });
    }
  };
  const handleBarcode = async (row: PurchaseOrderProductForm) => {
    try {
      setBarcodeLoadingId(row?.id || "");
      if ((row as unknown as EditPurchaseOrderProduct)?.sku) {
        await generateBarcode({
          data: [(row as unknown as EditPurchaseOrderProduct)?.sku]
        }).then(() => {
          setBarcodeLoadingId("");
        });
      } else {
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
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBarcodeLoadingId("");
    }
  };
  const handleEditPurchaseOrder = () => {
    try {
      if (!data?.vendor_id) {
        throw new Error("Vendor is reqiured");
      }
      if (!data?.warehouse_id) {
        throw new Error("Location is reqiured");
      }
      if (!data?.invoicing_currency) {
        throw new Error("Invoicing Currency is reqiured");
      }
      if (data) {
        mutateAsync({
          ...data
        }).then(() => {
          refetch();
        });
      }
    } catch (error) {
      toast.error((error as Error)?.message);
    }
  };
  const handleInputChange = (mode?: "main") => (val: InputValueAndLabel) => {
    if (val.label) {
      if (mode === "main") {
        setData(
          (prev: EditPurchaseOrderData | undefined = {} as EditPurchaseOrderData) => ({
            ...prev,
            [val.label as keyof EditPurchaseOrderData]: val.value as unknown
          })
        );
      } else {
        setProduct(prev => ({
          ...prev,
          [val.label as keyof PurchaseOrderProductForm]: val.value as unknown
        }));
      }
    }
  };

  const handleStatusChange = (value: string) => {
    if (isEnabled(value, OrderData!, user) && data) {
      setData({ ...data, status_display: value });
    }
  };
  const handleReset = () => setProduct(initialValues);
  const handleAddProduct = (vals: PurchaseOrderProductForm) => {
    if (vals) {
      const sku = productsData?.results?.find(
        itm => itm.id_hash === vals.product_id
      )?.sku;
      if (sku && orderId) {
        addProduct({
          id: orderId || "",
          product_id: vals?.product_id,
          sku,
          unit_price: vals?.price,
          quantity: vals.quantity
        }).then(() => {
          handleReset();
          refetch();
        });
      }
    }
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
    if (productsData?.results?.length) {
      return productsData.results?.map(el => {
        return {
          label: `${el.name}${el.barcode ? ` (${el.barcode})` : ""}`,
          value: el?.id_hash
        };
      });
    } else {
      return [];
    }
  }, [productsData]);
  useMemo(() => {
    if (OrderData) {
      setData(OrderData);
    }
  }, [OrderData, setData]);
  useEffect(() => {
    if (
      brand?.currency?.toLowerCase() === data?.invoicing_currency?.toLowerCase() &&
      data
    ) {
      setData({ ...data, exchange_rate: 1 });
    }
  }, [brand, data, setData]);
  useEffect(() => {
    if (data?.warehouse_id && !locationLoading && !supplierLoading) {
      const warehouse = locationData.find(l => l.value === data.warehouse_id);
      const supplier = vendorsData?.find(s => s.value === data.vendor_id);
      if (warehouse && supplier) {
        const updatedPurchaseOrderBody = {
          ...data,
          warehouse: { ...warehouse },
          supplier: { ...supplier }
        };

        setData(updatedPurchaseOrderBody);
      }
    }
  }, [data, vendorsData, locationLoading, locationData, supplierLoading, setData]);
  return (
    <>
      <PageTitle
        title="Edit Purchase Order"
        icon="/assets/icons/purchaseOrder.svg"
        endComponent={
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <LoadingButton
              variant="contained"
              color="secondary"
              size="medium"
              onClick={handlePdfExport}
              loading={pdfLoading}
              disabled={!orderId || isLoading || addProductLoading}
              startIcon={<PictureAsPdf />}
            >
              Generate PDF
            </LoadingButton>
            <LoadingButton
              variant="contained"
              size="medium"
              onClick={handleEditPurchaseOrder}
              loading={updateLoading}
              disabled={isLoading || pdfLoading || addProductLoading}
            >
              Save
            </LoadingButton>
            <SeeDocumentation
              fileName={"useUpdatePurchaseOrder"}
              title={"See Documentation"}
            />
          </Stack>
        }
      />
      <Card>
        <CardHeader
          title="Purchase Order Details"
          titleTypographyProps={{
            fontSize: 20,
            fontWeight: "bold"
          }}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Status :</Typography>
              <Stack
                direction={"row"}
                gap={2}
                justifyContent={"start"}
                alignItems={"cneter"}
                flexWrap={"wrap"}
              >
                {orderStatus.map((itm, key) => {
                  return (
                    <Checkbox
                      label={itm?.replace(/_/g, " ")}
                      key={key}
                      checked={data?.status_display === itm}
                      loading={isLoading}
                      sx={{
                        textTransform: "capitalize"
                      }}
                      onClick={() => handleStatusChange(itm)}
                      disabled={!isEnabled(itm, OrderData!, user)}
                    />
                  );
                })}
              </Stack>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Input
                disable
                label="Date :"
                loading={isLoading}
                value={ukDateFormat(data?.ordered, true)}
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
                value={data?.invoicing_currency?.toLowerCase()}
                name="invoicing_currency"
                handleSelect={opt =>
                  data &&
                  setData({
                    ...data,
                    invoicing_currency: opt?.value?.toUpperCase()
                  })
                }
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Input
                label="Exchange Rate :"
                value={data?.exchange_rate || 0}
                name="exchange_rate"
                type="number"
                min={0}
                disable={
                  brand?.currency?.toLowerCase() ===
                  data?.invoicing_currency?.toLowerCase()
                }
                handleChange={handleInputChange("main")}
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <SelectField
                options={locationData}
                loading={locationLoading}
                value={data?.warehouse_id}
                label="Location :"
                name="warehouse"
                handleSelect={opt =>
                  data &&
                  setData({
                    ...data,
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
                value={data?.vendor_id}
                name="supplier"
                handleSelect={opt => data && setData({ ...data, vendor_id: opt.value })}
              />
            </Grid>
            <Grid xs={12} item>
              <Divider />
            </Grid>
            <Grid xs={12} item>
              <Typography fontWeight={"bold"}>
                {data?.products?.length} Results
              </Typography>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <SelectField
                options={productsOptions}
                label="Search Product :"
                loading={producstLoading}
                value={product.product_id}
                name="product"
                handleSelect={opt => {
                  const prod = productsData?.results?.find(
                    el => String(el.id_hash) === String(opt.value)
                  );
                  setProduct({
                    ...product,
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
                value={product.quantity || 0}
                name="quantity"
                handleChange={handleInputChange()}
                type="number"
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Input
                label="Price :"
                type="number"
                value={product.price || 0}
                name="price"
                min={0}
                handleChange={handleInputChange()}
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Input
                label="Total :"
                value={product?.quantity * product?.price || 0}
                type="number"
                name="total"
                handleChange={handleInputChange()}
                readOnly
                noFocus
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Input
                label="Exchange Price :"
                value={
                  Number(product.price) *
                  (Number(data?.exchange_rate) === 0 ? 1 : Number(data?.exchange_rate))
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
                  product.quantity *
                  (product.price *
                    (Number(data?.exchange_rate) === 0 ? 1 : Number(data?.exchange_rate)))
                }
                type="number"
                name="exchange_total"
                readOnly
                noFocus
              />
            </Grid>
            <Grid item xs={12}>
              <Stack
                width={"100%"}
                justifyContent={"end"}
                gap={2}
                alignItems={"center"}
                direction={"row"}
              >
                <Button
                  color="secondary"
                  variant="contained"
                  type="button"
                  disabled={addProductLoading}
                  onClick={handleReset}
                >
                  Clear
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  onClick={() => handleAddProduct(product)}
                  disabled={
                    !product?.price ||
                    !product?.product.label ||
                    !product?.product_id ||
                    !product?.quantity ||
                    addProductLoading
                  }
                >
                  Add Item
                </Button>
              </Stack>
              <SeeDocumentation
                fileName={"useAddPurchaseOrderProduct"}
                title={"Add Product API Documentation"}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <DataTable
                columns={EditPurchaseOrderProductsColumns({
                  handleDone,
                  handleEdit,
                  loading: updateProductLoading,
                  values: editedValues,
                  handleBarcode,
                  barcodeLoadingId
                })}
                data={data?.products || []}
                loading={isLoading}
                dense
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            id="cy__AddReceivingbtn"
            variant="contained"
            disabled={["pending", "approved"].includes(data?.status_display || "")}
            onClick={onAddReciving}
          >
            Add Receiving
          </Button>
          <SeeDocumentation
            title="Add Receiving Documentation "
            fileName="useUpdateReceiving"
          />
        </CardActions>
      </Card>
    </>
  );
};
const isEnabled = (status: string, data: EditPurchaseOrderData, user: User | null) => {
  switch (data?.status_display) {
    case "pending":
      return (
        (user?.is_superuser || user?.is_manager || user?.is_associate) &&
        (status.includes("pending") || status.includes("approved"))
      );
    case "approved":
      return (
        (user?.is_superuser || user?.is_manager || user?.is_associate) &&
        (status === "accepted" || status === "approved")
      );
    case "accepted":
      return false;
    default:
      return false;
  }
};
export default EditPurchaseOrderForm;
