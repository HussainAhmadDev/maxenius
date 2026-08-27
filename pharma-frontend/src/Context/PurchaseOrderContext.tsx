import { API_URL, getAccessToken } from "Hooks/api";
import React, {
  useState,
  createContext,
  useContext,
  FC,
  ReactElement,
  useEffect,
  SetStateAction
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useBrand } from "./BrandContext";

type IProp = {
  children: ReactElement;
};
export type PurchaseOrderType = {
  id: string;
  vendor_id: string;
  ordered: string;
  status: string;
  status_display: string;
  warehouse_id: string;
  reason?: string;
  batchNumber?: string;
  expiry_date?: string;
  products: ProductType[];
  received_quantity?: string;
  product_id?: string;
  supplier: { value: string; label: string };
  warehouse: { value: string; label: string };
};
interface IContextProps {
  purchaseOrderBody: PurchaseOrderType;
  setPurchaseOrderBody: React.Dispatch<PurchaseOrderType>;
  onSave: () => void;
  receiveOrder: (data: object) => Promise<Response>;
  receiveOrderHistory: ReceivingHistorySchema;
  updateReceiving: (obj: IUpdateReceiving) => void;
  updateOrderItem: (data: IUpdateOrderItem) => void;
  getReceiveOrderHistory: (id: string, paginationDetail: PaginationDetail) => void;
  loadingEditReceiving: boolean;
  setLoadingEditReceiving: React.Dispatch<boolean>;
  loadingCreatePO: boolean;
  setLoadingCreatePO: React.Dispatch<SetStateAction<boolean>>;
  exchangeRate: string | null;
  setExchangeRate: React.Dispatch<SetStateAction<string | null>>;
  invoiceCurrency: { label: string; value: string };
  setInvoiceCurrency: React.Dispatch<SetStateAction<{ label: string; value: string }>>;
  getPurchaseOrder: () => void;
}
type ProductType = {
  sku?: string;
  adjustmentQty?: number;

  //eslint-disable-next-line
  expiryAndBatch?: any;
  product: { label: string; value: string };
  quantity: number;
  price: number;
  tax: number;
  total: number;
  received: number;
  barcode: string;
};

interface IUpdateReceiving {
  id: string;
  purchase_order_id: string;
  product_id: string;
  sku: string;
  is_fully_received?: string;
  batch_number: string;
  expiry_date: string;
  received_quantity: number;
  invoice_number?: string;
}

interface IUpdateOrderItem {
  price: number;
  tax: number;
  quantity: number;
}

interface PaginationDetail {
  count?: string | number;
  page: string;
  pages: string;
  rowsPerPage: string;
}

interface ReceivingHistorySchema {
  count: string;
  page: string;
  pages: number;
  total: number;
  results: PurchaseOrderType[];
}
export const PurchaseOrderContext = createContext({} as IContextProps);

//eslint-disable-next-line
export const usePurchaseOrderContext = () => useContext(PurchaseOrderContext);

export const PurchaseOrderContextProvider: FC<IProp> = ({ children }) => {
  const navigate = useNavigate();
  const { id } = useParams<string>();
  const [purchaseOrderBody, setPurchaseOrderBody] = useState({} as PurchaseOrderType);
  const [exchangeRate, setExchangeRate] = React.useState<string | null>("1");
  const [invoiceCurrency, setInvoiceCurrency] = React.useState<{
    label: string;
    value: string;
  }>({
    label: "",
    value: ""
  });

  const [receiveOrderHistory, setReceiveOrderHistory] = useState<ReceivingHistorySchema>({
    count: "0",
    page: "0",
    pages: 0,
    total: 0,
    results: [] as PurchaseOrderType[]
  });
  const [loadingEditReceiving, setLoadingEditReceiving] = React.useState<boolean>(false);

  const { activeBrand, currency } = useBrand();
  const localBrand = localStorage.getItem("brand");

  useEffect(() => {
    const paginationDetail = {
      count: "10",
      page: "1",
      pages: "1",
      rowsPerPage: "10"
    };
    id && getPurchaseOrder();
    id && getReceiveOrderHistory(id, paginationDetail);
    //eslint-disable-next-line
  }, [id]);

  const getPurchaseOrder = async () => {
    const res = await fetch(`${API_URL}/purchase_order/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();

    //eslint-disable-next-line
    //@ts-ignore
    setPurchaseOrderBody({
      products: []
    });

    setInvoiceCurrency({
      label: data?.invoicing_currency,
      value: data?.invoicing_currency
    });
    setExchangeRate(data?.exchange_rate);
    setPurchaseOrderBody({
      ...purchaseOrderBody,
      id: data.id,
      vendor_id: data.vendor_id,
      ordered: data.ordered,
      status: data.status,
      status_display: data.status_display,

      warehouse_id: data.warehouse_id,

      products: data.products.map(
        (p: {
          product: { name: string; id: string; barcode: string; sku: string };
          quantity: string;
          unit_price: string;
          tax_rate: string;
          receive_quantity: string;
          id: string;
        }) => ({
          product: { label: p.product.name, value: p.product.id },
          sku: p.product.sku,
          quantity: p.quantity,
          price: p.unit_price,
          tax: p.tax_rate,
          barcode: p.product.barcode,
          received: Number(p.receive_quantity),
          id: p.id,
          total: p.tax_rate
            ? Number(p.quantity) * Number(p.unit_price) * (1 + Number(p.tax_rate) / 100)
            : Number(p.quantity) * Number(p.unit_price),
          exchangePrice: Number(p?.unit_price) * Number(data?.exchange_rate) ?? 0,
          exchangeTotal: p.tax_rate
            ? Number(p.quantity) * Number(p.unit_price) * (1 + Number(p.tax_rate) / 100)
            : Number(p.quantity) * Number(p.unit_price) * Number(data?.exchange_rate)
        })
      )
    });
  };

  const receiveOrder = async (data: object) => {
    setLoadingEditReceiving(true);
    const res = await fetch(`${API_URL}/purchase_order_received/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    // const { is_fully_received, message }: any = data
    // if (res.status == 400) {
    //   const parsedMessage = await res.json()
    //   toast.error(parsedMessage.message)

    // }
    // if (is_fully_received) {
    //   toast.error(message)
    // }
    // setLoadingEditReceiving(false)
    return res;
  };

  const getReceiveOrderHistory = async (
    id: string,
    paginationDetail: PaginationDetail
  ) => {
    if (parseInt(paginationDetail?.rowsPerPage) > 0) {
      const res = await fetch(
        `${API_URL}/purchase_order_receive_product_list/${id}?count=${paginationDetail.rowsPerPage}&page=${paginationDetail.page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json"
          }
        }
      );
      const data = await res.json();
      setReceiveOrderHistory(data);
    }
  };

  const updateReceiving = async (obj: IUpdateReceiving) => {
    const { id, ...updatedObj } = obj;

    const res = await fetch(`${API_URL}/purchase_order_receive_update/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedObj)
    });
    const data = await res.json();

    if (data.id) {
      const updatedReceiveOrderHistory: PurchaseOrderType[] =
        receiveOrderHistory?.results.map(item => {
          if (item.id === data?.id) {
            return {
              ...item,
              expiry_date: data.expiry_date,
              batch_number: data.batch_number,
              invoice_number: data.invoice_number,
              received_quantity: data.received_quantity
            };
          }
          return item;
        });

      getPurchaseOrder();
      setReceiveOrderHistory({
        ...receiveOrderHistory,
        results: updatedReceiveOrderHistory
      });
      toast.success("Updated Successfully!");
    } else {
      toast.error("something went wrong");
    }
    // return data
  };

  const updateOrderItem = async ({ price, tax, quantity }: IUpdateOrderItem) => {
    const res = await fetch(`${API_URL}/purchase_order/${id}/product/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ unit_price: price, tax_rate: tax, quantity: quantity })
    });
    const data = await res.json();
    if (data?.product_id) {
      if (!purchaseOrderBody?.products) purchaseOrderBody.products = [];
      const itemToUpdate = purchaseOrderBody?.products.find(
        p => p.product.value === data.product_id
      );
      if (itemToUpdate) {
        itemToUpdate.quantity = data?.quantity;
        itemToUpdate.price = data?.unit_price;
        itemToUpdate.tax = data?.tax_rate;
      }

      setPurchaseOrderBody({ ...purchaseOrderBody });
      toast.success("Successfully Updated!");
    } else {
      toast.error("Not Updated");
    }
  };
  const [loadingCreatePO, setLoadingCreatePO] = useState<boolean>(false);
  const onSave = async () => {
    const user = await JSON.parse(localStorage.getItem("user")!);

    await fetch(`${API_URL}/full_purchase_order/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...purchaseOrderBody,
        products: purchaseOrderBody.products.map(product => ({
          ...product,
          total: Number(
            product.tax
              ? (product.quantity * product.price * (1 + product.tax / 100)).toFixed(2) ||
                  0
              : product.quantity * product.price || 0
          ),
          product_id: product.product.value
        })),
        vendor_id: purchaseOrderBody?.supplier?.value,
        warehouse_id: purchaseOrderBody?.warehouse?.value,
        unit_cost_amounts: "tax exclusive",
        user_id: user.id,
        brand_id: activeBrand || localBrand,
        invoicing_currency:
          invoiceCurrency?.label?.length > 0 ? invoiceCurrency?.label : currency,
        exchange_rate: exchangeRate === "0" ? 1 : exchangeRate,
        currency: currency
      })
    });

    setLoadingCreatePO(false);

    navigate("/purchase-orders");
  };

  const defaultContext = {
    purchaseOrderBody,
    setPurchaseOrderBody,
    onSave,
    receiveOrder,
    receiveOrderHistory,
    updateReceiving,
    updateOrderItem,
    getReceiveOrderHistory,
    loadingEditReceiving,
    setLoadingEditReceiving,
    loadingCreatePO,
    setLoadingCreatePO,
    setExchangeRate,
    exchangeRate,
    setInvoiceCurrency,
    invoiceCurrency,
    getPurchaseOrder
  };
  return (
    <PurchaseOrderContext.Provider value={defaultContext}>
      {children}
    </PurchaseOrderContext.Provider>
  );
};
