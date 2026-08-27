import { ProductData } from "./Products";
import { SelectOption } from "./ui";

export interface PurchaseOrderForm {
  warehouse: SelectOption;
  supplier: SelectOption;
  products: PurchaseOrderProduct[];
  vendor_id: string;
  warehouse_id: string;
  unit_cost_amounts: string;
  // user_id: string;
  // brand_id: string;
  invoicing_currency: string;
  exchange_rate: string | number;
  currency?: string;
}
export interface PurchaseOrderPDFResponse {
  exchange_rate: string;
  invoicing_currency: string;
  location: string;
  order_date: string;
  order_number: number;
  products: {
    exchange_price: string;
    exchange_total: string;
    price: string;
    product_name: string;
    quantity: number;
    total: string;
  }[];
  receivings: {
    batch_number: string;
    expiry_date: string;
    product_name: string;
    received_quantity: number;
  }[];
  vendor_name: string;
  purchase_order_number?: number;
}
export interface PurchaseOrderProductForm {
  quantity: number;
  price: number;
  tax: number;
  product: {
    value: string;
    label: string;
    cost_price: number;
  };
  total: number;
  exchangePrice?: string | number;
  exchangeTotal?: string | number;
  product_id: string;
  id?: string;
}
export interface PurchaseOrderProduct {
  receive_quantity: string;
  product_variation_id: string | null;
  id: string;
  product_id: string;
  product_attribute_id: string | null;
  shipped_quantity: string | null;
  tax_rate: number;
  unit_price: number;
  is_fully_shipped: boolean;
  product: {
    shipping_rate: string | null;
    status: string;
    number: string | null;
    id: string;
    quantity_per_pack: number;
    is_trash: boolean;
    brand_id: string;
    retail_price: number;
    name: string;
    cost_price: number;
    sku: string;
    is_back_order: boolean;
    barcode: string;
  };
  sku: string;
  quantity: number;
}
export interface PurchaseOrderMain extends Omit<PurchaseOrderForm, "products"> {}

export interface PurchaseItems {
  id: string;
  product_id: string;
  product: ProductData;
}

export interface PurchaseOrderData {
  id: string;
  user_id: string;
  company_id: string | null;
  created_by_id: string;
  trashed_by_id: string;
  ordered: string;
  vendor_id: string;
  warehouse_id: string;
  is_trash: boolean;
  status: string;
  status_display: string;
  payment_status: string;
  currency: string;
  purchase_order_id?: string;
  exchange_total_amount?: string;
  product_name?: string;
  invoicing_currency: string;
  exchange_rate: string | null;
  shipping_status: string;
  sales_tax: string | null;
  prices_include_tax: string | null;
  type: string;
  external_id: string;
  number: string;
  products: Array<PurchaseOrderProduct>;
  shipping_cost: string | null;
  sub_total: string | null;
  total_amount: number;
  paid_amount: string | null;
  due_amount: string | null;
  has_custom_tax_rate: boolean;
  custom_tax_percentage: number;
  unit_cost_amounts: string;
  brand_id: string;
  is_adjustment: boolean;
}
export interface EditPurchaseOrderProduct {
  product: {
    label: string;
    value: string;
  };
  sku: string;
  quantity: number;
  price: number;
  tax: number;
  barcode: string;
  received: number;
  id: string;
  total: number;
  exchangePrice: number;
  exchangeTotal: number;
  product_id?: string;
  unit_price?: number;
}
export interface EditPurchaseOrderData {
  id: string;
  user_id: string;
  company_id: string | null;
  created_by_id: string;
  trashed_by_id: string;
  ordered: string;
  vendor_id: string;
  warehouse_id: string;
  is_trash: boolean;
  status: string;
  status_display: string;
  payment_status: string;
  currency: string;
  invoicing_currency: string;
  exchange_rate: number;
  shipping_status: string;
  sales_tax: string | null;
  prices_include_tax: string | null;
  type: string;
  external_id: string;
  number: string;
  products: Array<EditPurchaseOrderProduct>;
  shipping_cost: string | null;
  sub_total: string | null;
  total_amount: number;
  paid_amount: string | null;
  due_amount: string | null;
  has_custom_tax_rate: boolean;
  custom_tax_percentage: number;
  unit_cost_amounts: string;
  brand_id: string;
  is_adjustment: boolean;
}

export type ReceivingHistoryData = {
  id: string;
  purchase_order_id: string;
  sku: string;
  product_id: string;
  product_name: string;
  ordered_quantity: number;
  received_quantity: number;
  created: string;
  status: string;
  batch_number: string;
  expiry_date: string;
  invoice_number: string;
};
export interface ReceivingHistorySchema {
  count: string;
  page: string;
  pages: number;
  total: number;
  results: ReceivingHistoryData[];
}
export interface PurchaseOrderResponse {
  readonly results: Array<PurchaseOrderData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}
