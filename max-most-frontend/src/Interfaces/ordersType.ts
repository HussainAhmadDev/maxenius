interface Address {
  first_name: string;
  last_name: string;
  company: string;
  street1: string;
  street2: string | null;
  street3: string | null;
  street4: string | null;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
  email: string | null;
  id: string;
}

interface Website {
  id: string;
  title: string;
  consumer_key: string;
  consumer_secret: string;
  site_url: string;
  authorization_key: string;
  is_trash: boolean;
  prescription: boolean;
  label_template: string;
  created_at: string;
  updated_at: string;
  brand_id: string;
}

interface ProductShipping {
  id: string;
  created_at: string;
  updated_at: string;
  carrier: string | null;
  cost: string;
  description: string | null;
  delivery_speed: number;
  weight: number;
  dimension_width: number;
  dimension_height: number;
  dimension_length: number;
  quantity: number;
  is_trash: boolean;
  tracking: string | null;
  total: string;
  total_tax: string;
  shipping_type: string | null;
  is_return: boolean;
  insurance: boolean;
  provider_id_id: string | null;
  order_id: string;
  ordered_product_id: string;
}

interface Note {
  id: string;
  type: string;
  source: string;
  created_at: string;
  updated_at: string;
  text: string;
  object_id: number;
  note_username: string;
  is_trash: boolean;
  author_id: string;
  content_type_id: string | null;
}

export interface Order {
  id: string;
  billing_address: Address;
  shipping_address: Address;
  website: Website;
  status: string;
  payment_status: string;
  shipping_status: string;
  type: string;
  source: string;
  category: string;
  product_shippings: ProductShipping[];
  notes: Note[];
  created_at: string;
  updated_at: string;
  ordered: string;
  is_trash: boolean;
  customer_ip_addr: string;
  customer_user_agent: string;
  currency: string;
  ship_date: string;
  order_date: string;
  sales_tax: string;
  cart_tax: string;
  discount_total: string;
  discount_tax: string;
  prices_include_tax: string;
  external: string;
  number: string;
  recurring_payment: string;
  shipping_cost: string;
  non_recurring_payment: string;
  sub_total: string;
  total_amount: string;
  return_amount: string;
  paid_amount: string;
  due_amount: string;
  is_custom_shipping: boolean;
  has_custom_tax_rate: boolean;
  custom_tax_percentage: string;
  prescription_pdf: string;
  prescription: string;
  website_order_id: string;
  invoice_print: boolean;
  packing_slip_print: boolean;
  insurance_fee: string;
  is_adjustment: boolean;
  created_by_id: string;
  trashed_by_id: string;
  user_id: string;
  brand_id: string;
  prescriber_id: string;
  customer_id: string;
}

export interface OrderResponse {
  results: Order[];
  total: number;
  page: number;
  pages: number;
  count: number;
}

/**
 * @interface Vendor
 * Represents a vendor object.
 */
export interface AddCustomerResponse {
  /** External ID associated with the vendor (nullable) */
  external_id: string | null;
  /** Indicates if the vendor is an individual */
  is_individual: boolean;
  /** Indicates if the vendor is in the trash */
  is_trash: boolean;
  /** Array of notes related to the vendor */
  notes: string[];
  /** Indicates if the vendor is active */
  is_active: boolean;
  /** Unique identifier for the vendor */
  id: string;
  /** Shipping contact ID for the vendor (nullable) */
  shipping_contact_id: string | null;
  /** Tax-exempt ID for the vendor (nullable) */
  tax_exempt_id: string | null;
  /** Brand ID associated with the vendor */
  brand_id: string;
  /** Name of the vendor (nullable) */
  name: string | null;
  /** Indicates if the vendor is tax-exempt */
  is_tax_exempt: boolean;
  /** Address ID for the vendor (nullable) */
  address_id: string | null;
  /** Billing contact ID for the vendor (nullable) */
  billing_contact_id: string | null;
  number: string;
}
