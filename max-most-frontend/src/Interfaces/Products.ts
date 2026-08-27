export interface Attachment {
  url: string;
  is_cover: boolean;
  id: string;
}

export interface ProductAttributesType {
  name: string;
  values: string[];
}

export interface AttributeValues {
  [key: string]: string;
}
export interface AttributeItem {
  attributes?: AttributeValues;
  variants?: AttributeValues[];
  sku?: string;
  barcode?: string;
  retail_price?: number;
  dimension_width?: string;
  dimension_height?: string;
  dimension_length?: string;
  status?: string;
  is_back_order?: boolean;
  id?: string;
  cost_price?: number | string;
}
export interface ProductData {
  vat_percent: number;
  message: string;
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
  type?: string;
  new_attributes: string | undefined;
  variations: AttributeItem[];
  id_hashed: string;
  brand_id: string;
  is_pom: boolean;
}

export interface MetaFields {
  text_field: string;
  multi_line: string[];
  drop_down: string[];
  numeric: number[];
  date_time: string[];
  date: string[];
}
export interface ProductDataMadeIn {
  product_id: string;
  product_field_definition_id: string;
  value: (string | number)[] | string | number;
  option_id: (string | number)[] | string | number;
  custom_fields?: {
    id?: string | undefined;
    value?: (string | number)[];
    option_id?: (string | number)[];
  }[];
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

export interface TopSellingProduct {
  product_name: string;
  product_sku: string;
  sale_amount: string;
  product_id: string;
}

export interface TopSellingResponse {
  results: TopSellingProduct[];
}

export interface ProductAttribute {
  [key: string]: string;
}

export interface Variant {
  attributes: ProductAttribute;
}

export interface CreateProductResponse {
  sku: string;
  barcode: string;
  name: string;
  description: string;
  retail_price: number;
  type: "variable" | "fixed";
  attributes: ProductAttribute[];
  variants: Variant[];
  brand_id: string;
  generate_variation: boolean;
  is_new_variant_pairs?: boolean;
}

export interface Errors {
  [key: string]: string | undefined | boolean;
  isError?: boolean;
  sku?: string;
  barcode?: string;
  product_name?: string;
  product_number?: string;
  product_barcode?: string;
}
export interface validateItemT {
  sku: string;
  barcode: string;
  [key: string]: string | boolean;
}

export interface AttributeItemT {
  [key: string]: string | number;
}

export interface VariantT {
  attributes: AttributeItemT[]; // Attributes can now have any key-value pairs
  sku: string;
  barcode: string | "";
  dimension_width: number | 0;
  dimension_height: number | 0;
  dimension_length: number | 0;
  retail_price: number | 0;
  status: string | "";
}

export interface updateProductVariable {
  id_hashed: string;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  retail_price: number | 0;
  type: string;
  attributes: AttributeItem[];
  variants: VariantT[];
  brand_id: string | undefined;
  generate_variation: boolean;
  is_new_variant_pairs: boolean;
}

export interface updateProductFixed {
  name: string;
  retail_price: number;
  id_hashed: string;
  barcode: string;
  cost_price: number;
  warning_message: string;
}
export type updateProductPayloadT = updateProductFixed | updateProductVariable;

export type AttributeDetailsT = {
  attributes: { [key: string]: string };
  barcode: string;
  dimension_height: string;
  dimension_length: string;
  dimension_width: string;
  retail_price: string;
  cost_price: string;
  sku: string;
  status: string;
};
