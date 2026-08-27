export interface Attachment {
  url: string;
  is_cover: boolean;
  id: string;
}

export interface ProductData {
  warning_number: string;
  id: string;
  updated?: string;
  created: string;
  name: string;
  description?: string;
  is_tax_exempt?: boolean;
  tax_class?: null | string;
  tax_status?: null | string;
  number?: string | number;
  retail_price?: number;
  shipping_rate?: number;
  status?: "in_stock" | "on_back_order" | "out_of_stock";
  is_downloadable?: boolean;
  is_saas?: boolean;
  seo_slug?: string;
  sku: string;
  images?: Array<Attachment>;
  is_trash: boolean;
  sticky_product_id?: number;
  sticky_offer_id?: number;
  image?: string;
  discounts?: Array<Discount>;
  dimension_width?: number;
  dimension_height?: number;
  dimension_length?: number;
  external_id?: string;
  quantity?: number;
  shippedQuantity?: number;
  shippingCost?: number;
  shipping_date?: string;
  barcode?: string;
  is_back_order?: boolean;
  quantity_per_pack?: number;
  shipped_quantity?: number;
  direction?: string;
  patient_name?: string;
  warning_message?: string;
  warning_id: string;
  stock_quantity?: string;
  id_hash: string;
  cost_price?: number;
  product_name?: string;
}

export interface Discount {
  price: number;
  product_id?: string;
  from_quantity: number;
  user_id?: string;
  to_quantity: number;
  brand_id: string;
}

export interface ProductsResponse {
  readonly results: Array<ProductData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}
