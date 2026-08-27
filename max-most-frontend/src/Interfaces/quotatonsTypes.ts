interface QuoteData {
  id: string;
  created: string;
  updated: string;
  user_id: string;
  created_by_id: string;
  trashed_by_id: string;
  quotation_date: string;
  vendor_id: string;
  vendor_name: string;
  is_trash: string;
  status: string;
  brand_id: string;
  quotation_id: number;
  product_name: string;
  purchase_order_id: string;
}
interface QuoteFormProduct {
  quantity: number | null;
  price: number | null;
  tax: number | null;
  unit_price?: number | null;
  product: {
    value: string | null;
    cost_price: number | null;
    label: string;
  };
  total: string | null;
  product_id: string | null;
  id?: string;
}
interface QuoteForm {
  id?: string;
  status?: string;
  products: Array<QuoteFormProduct>;
  vendor_id: string;
}

interface QuotesResponse {
  readonly results: Array<QuoteData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

interface EditQuoteResponse {
  id: string;
  user_id: string;
  created_by_id: string;
  trashed_by_id: string;
  quotation_date: string;
  vendor_id: string;
  products: EditQuoteProduct[];
  is_trash: boolean;
  status: string;
  status_display: string;
  brand_id: string;
  purchase_order_id: string;
}

interface EditQuoteProduct {
  product_id: string;
  line_total: number;
  unit_price: number;
  user_id: string;
  quantity: number;
  product: EditQuoteProductDetails;
  id: string;
  quotation_id: string;
  tax_rate: number;
  line_item_tax: number;
}

interface EditQuoteProductDetails {
  is_trash: boolean;
  attributes: unknown[];
  retail_price: number;
  number: string | number;
  discounts: unknown[];
  dimension_length: string | unknown;
  tax_class: string | unknown;
  dimension_height: string | unknown;
  quantity_per_pack: number;
  description: string | unknown;
  cost_price: number;
  images: string | unknown[];
  is_back_order: boolean;
  created: string;
  seo_slug: string | unknown;
  external_id: string | unknown;
  type: string;
  sku: string;
  dimension_width: string | unknown;
  name: string;
  shipping_rate: string | unknown;
  barcode: string;
  sticky_offer_id: string | unknown;
  is_downloadable: boolean;
  tax_status: string | unknown;
  updated?: string;
  status: string | unknown;
  id: string;
  is_saas: boolean;
  brand_id: string;
  warning_message: string | unknown;
  is_tax_exempt: boolean;
  sticky_product_id: string | unknown;
}

interface QuoteToPurchaseOrder {
  quotation_id: string;
  warehouse_id: string;
  unit_cost_amounts: "tax exclusive";
  invoicing_currency: string;
  exchange_rate: string;
}

export type {
  QuoteData,
  QuotesResponse,
  QuoteForm,
  QuoteFormProduct,
  EditQuoteResponse,
  EditQuoteProduct,
  QuoteToPurchaseOrder
};
