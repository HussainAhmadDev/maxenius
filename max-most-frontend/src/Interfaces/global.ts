import { SelectOption } from "./ui";
import { User } from "./usersType";

export interface InputValueAndLabel {
  target?: string;
  value?: string | number | boolean | (string | number)[];
  label: string;
}
export interface InputOptionAndLabel {
  label: string;
  opt: SelectOption;
}
// General Pagination
export interface QueryPagination {
  page: string;
  pages: string;
  rowsPerPage: string;
  total: string;
  count: string;
}

export interface QueryPaginationProps {
  page: number;
  rowsPerPage: number;
  // pages: number;
  // total: number;
  // count: number;
}

export interface RowData {
  id?: string;
  billing_address?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    street1?: string;
    street2?: string | null;
    street3?: string | null;
    street4?: string | null;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    phone?: string;
    email?: string;
    id?: string;
  };
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    street1?: string;
    street2?: string | null;
    street3?: string | null;
    street4?: string | null;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    phone?: string;
    email?: string;
    id?: string;
  };
  website?: {
    id?: string;
    title?: string;
    consumer_key?: string;
    consumer_secret?: string;
    site_url?: string;
    authorization_key?: string;
    is_trash?: boolean;
    prescription?: boolean;
    label_template?: string;
    created_at?: string;
    updated_at?: string;
    brand_id?: string;
  };
  status?: string;
  payment_status?: string;
  shipping_status?: string;
  type?: string;
  source?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
  ordered?: string;
  is_trash?: boolean;
  customer_ip_addr?: string;
  customer_user_agent?: string;
  currency?: string;
  ship_date?: string;
  order_date?: string;
  sales_tax?: string;
  cart_tax?: string;
  discount_total?: string;
  discount_tax?: string;
  prices_include_tax?: string;
  external?: string;
  number?: string;
  recurring_payment?: string;
  shipping_cost?: string;
  non_recurring_payment?: string;
  sub_total?: string;
  total_amount?: string;
  return_amount?: string;
  paid_amount?: string;
  due_amount?: string;
  is_custom_shipping?: boolean;
  has_custom_tax_rate?: boolean;
  custom_tax_percentage?: string;
  prescription_pdf?: string;
  prescription?: string;
  website_order_id?: string;
  invoice_print?: boolean;
  packing_slip_print?: boolean;
  insurance_fee?: string;
  is_adjustment?: boolean;
  created_by_id?: string;
  trashed_by_id?: string;
  user_id?: string;
  brand_id?: string;
  prescriber_id?: string | null;
  customer_id?: string;
}

export type Auth = {
  access_token: string;
  access_token_expires: number;
  allowed_brands: Array<{
    id: string;
    name: string;
  }>;
  permissions: Array<{
    is_superuser?: boolean;
    is_staff?: boolean;
    is_manager?: boolean;
  }>;
  refresh_token: string;
  refresh_token_expires: number;
};

export interface AuthResponse extends Auth {
  user: User;
}
