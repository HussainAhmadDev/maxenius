import { Address, CompanyData } from "./Company";
import { ProductData } from "./Products";

interface BatchDetails {
  batch_number: string;
  expiry_date: string;
  quantity_sold: number;
}
export interface OrderProduct {
  is_pom: boolean;
  is_fully_shipped: boolean;
  ship_date?: string;
  tax_rate?: number;
  sub_total_tax?: number;
  total_cost: number;
  taxes?: number;
  id: string;
  quantity: number;
  shipped_quantity: number;
  product_id: string;
  was_returned?: boolean;
  unit_price: number;
  shipping_cost?: number;
  sub_total?: number;
  order_product_return: OrderProductReturn[];
  sku?: string;
  product?: ProductData;
  was_refunded?: boolean;
  direction?: string;
  patient_name?: string;
  quantity_per_pack?: number;
  prescription_id: string;
  website_patient_id: string;
  batch_details: BatchDetails[];
  return_shipment: {
    id: number;
    created: string;
    updated: string;
    carrier: string | null;
    cost: string | null;
    description: string | null;
    delivery_speed: string | null;
    weight: string | null;
    dimension_width: string | null;
    dimension_height: string | null;
    dimension_length: string | null;
    quantity: number;
  };
}

export type OrderProductReturn = {
  id: string | undefined;
  brand_id: string;
  company_id: string;
  created: string;
  ordered_product_id: string;
  product_id: string;
  return_shipment: OrderProductReturnShipment;
  shipping_class_id: string;
  user_id: string;
};

export type OrderNote = {
  type: string;
  updated?: string;
  created: string;
  id: string;
  text: string;
  source?: string;
  note_username?: string;
};
export interface OrderNoteResponse {
  results: OrderNote[];
  page: number;
  count: number;
  total: number;
  pages: number;
}

export interface PaymentData {
  type: string;
  recurring: boolean;
  receipt: string;
  non_recurring: boolean;
  pending_refund: number;
  created: string;
  total: number;
  is_refunded: boolean;
  id: string;
  status: string;
  updated: string;
  payment_provider: string;
  order_id: string;
  payment_method: PaymentMethod;
  user: {
    created: string;
    date_joined: string;
    email: string;
    first_name: string;
    id: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    last_login: string;
    last_name: string;
    middle_name: string;
    mobile_phone: string;
    office_phone: string;
    type: string;
    updated: string;
    username: string;
  };
}

export type OrderCategory = "order" | "standing" | "quote";

interface PaymentMethod {
  id: string;
  created: string;
  updated: string;
  name: string;
  description: string;
  is_active: boolean;
  is_trash: boolean;
}

export interface OrderData {
  id: string;
  company_id: string;
  company: CompanyData;
  category: OrderCategory;
  brand_id: string;
  created: string;
  contact_id: string;
  ship_date?: string;
  currency: string;
  discount_tax: null;
  customer_ip_addr: null;
  prices_include_tax: null;
  updated: string;
  cart_tax: null;
  has_custom_tax_rate: boolean;
  custom_tax_percentage: number;
  sales_tax: number;
  shipping_cost: number;
  discount_total: null;
  status: string;
  total_amount: number;
  customer_user_agent: null;
  is_trash: boolean;
  number: string;
  order_refunds: OrderRefund[];
  products?: OrderProduct[];
  product_shippings: OrderProductShipping[];
  notes?: OrderNote[];
  due_amount: number;
  recurring_payment: number;
  non_recurring_payment: number;
  sub_total: number;
  paid_amount?: number;
  source: string;
  is_custom_shipping: boolean;
  ordered: string;
  payments: PaymentData[];
  is_standing_order: boolean;
  payment_status?: string;
  return_amount: number;
  shipping_status?: string;
  billing_address: Address;
  shipping_address: Address;
  billing_address_first_name?: string;
  billing_address_last_name?: string;
  shipping_address_first_name?: string;
  shipping_address_last_name?: string;
  quantity?: number;
  number_of_order_items: null | number;
  website_order_id?: number;
  website: {
    id: string;
    created: string;
    updated: string;
    title: string;
    site_url: string;
    authorization_key: string;
    brand_id: string;
    prescription: string;
    label_template: string;
  };
  prescription_ids?: number;
  website_authorization?: string;
  insurance_fee: number;
  website_name: string;
  website_url?: string;
  website_authorization_key?: string;
  packing_slip_print: boolean;
  invoice_print: boolean;
  quickbook_reference_number?: string;
}
export interface IsOpenStatus {
  website_authorization: string;
  website: string;
  website_order_id: string;
}
export interface PatientData {
  id: string;
  name: string;
  date_of_birth: string;
  address: string;
  prescriber: string;
  prescriber_email: string;
  prescriber_phone: string;
}
export interface OrderShipmentResponse {
  ship_date: string;
  quantity: number;
  ordered_product_id: string;
  id: string;
}
export interface OrderResponse {
  readonly results: Array<OrderData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}
export interface HistoryData {
  created_by: string;
  direction: string;
  discount_amount: number;
  name: string;
  prescriber: string;
  price: number;
  quantity: number;
  sku: string;
  subtotal: number;
  total: number;
  website_order_date: string;
  website_order_id: number;
  website_prescription_id: number;
}

export interface HistoryResponse {
  readonly results: Array<HistoryData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}
export interface PateintResponse {
  readonly results: Array<PatientData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface OrderProductShipping {
  shipped_quantity: number;
  id: string;
  created: string;
  updated?: string;
  ship_date?: string;
  carrier?: string;
  tracking?: string;
  weight?: number;
  shipping_type?: string;
  ordered_product_id: string;
  total?: number;
  total_tax?: number;
  quantity: number;
  returned_quantity?: number;
  total_quantity?: number;
}
export interface UpdateDirection {
  direction?: string;
  productOrderID?: string | undefined;
}
export interface OrderProductReturnShipmentResponse {
  results: OrderProductReturnShipment[];
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface OrderProductReturnShipment {
  description: string;
  dimension_length: number;
  weight: number;
  carrier: string;
  delivery_speed: number;
  dimension_width: number;
  dimension_height: number;
  cost: number;
  quantity: number;
}

export interface OrderRefundResponse {
  results: OrderRefund[];
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface OrderRefund {
  user_id: string;
  brand_id: string;
  company_id: string;
  created?: string;
  order_id: string;
  product_id?: string;
  order_payment_id?: string;
  ordered_product_id?: string;
  payment_provider: string;
  total: number;
  total_tax?: number;
  total_shipping?: number;
  quantity?: number;
  sku?: string;
  external_id?: string;
  reason?: string;
  receipt?: string;
  status?: string;
}

export interface FetchOrderProductBatchExpiry {
  ordered_product_id: string;
  product_id?: string;
  order_id: string;
  // batch_number: string;
  // expiry_date: string;
}
export interface ResponseOrderBatch {
  batch_number: string;
  expiry_date: string;
  id: string;
  invoice_number: string;
  product_id: string;
  purchase_order_id: string;
  received_quantity: number | null;
  sku: string;
}
export interface BulkShipment {
  sku_list: Array<string>;
  start_date: string;
  end_date: string;
  ship_date: string;
}
