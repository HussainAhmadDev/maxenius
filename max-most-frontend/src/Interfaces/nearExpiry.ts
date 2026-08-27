export interface nearExpiry {
  products: lowStockProducts[];
  results: nearExpiry[];
  result: nearExpiry[];
  available_quantity: number;
  batch_number: string;
  brand_name: string;
  expiry_date: string;
  message: string;
  number: number;
  product_name: string;
  product_sku: string;
  total: number;
  count: number;
  pages?: number;
  page?: number;
}

export interface outOfStockProducts {
  results: outOfStockProducts[];
  products: outOfStockProducts[];
  barcode: string;
  brand_id: string;
  cost_price: string;
  created: string;
  description: string;
  dimension_height: string;
  dimension_length: string;
  dimension_width: string;
  external_id: string;
  id: string;
  is_back_order: boolean;
  is_downloadable: boolean;
  is_saas: boolean;
  is_tax_exempt: boolean;
  is_trash: boolean;
  minimum_stock: string;
  name: string;
  number: string;
  quantity_per_pack: string;
  retail_price: string;
  seo_slug: string;
  shipping_rate: string;
  sku: string;
  status: string;
  sticky_offer_id: string;
  sticky_product_id: string;
  tax_class: string;
  tax_status: string;
  trashed_on: string;
  type: string;
  updated: string;
  user_id: string;
  variation_id: string;
  warning_message: string;
  total: number;
  count: number;
  pages?: number;
  page?: number;
}

export interface lowStockProducts {
  products: lowStockProducts[];
  barcode: string;
  brand_id: string;
  cost_price: string;
  id: string;
  is_back_order: boolean;
  is_trash: boolean;
  minimum_stock: string;
  name: string;
  number: string;
  quantity_per_pack: string;
  received_quantity: string;
  retail_price: string;
  shipping_rate: string;
  sku: string;
  sold_quantity: string;
  status: string;
  stock_quantity: string;
  total: number;
  count: number;
  pages?: number;
  page?: number;
}

export interface nearExpiryResult {
  available_quantity: number;
  batch_number: string;
  brand_name: string;
  expiry_date: string;
  message: string;
  number: number;
  product_name: string;
  product_sku: string;
}
