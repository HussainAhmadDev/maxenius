import { Address } from "./Company";

export interface BrandSetting {
  patients: boolean;
  orders: boolean;
  dashboard: boolean;
  products: boolean;
  "product-activity-log": boolean;
  reports: boolean;
  "active-product": boolean;
  "product-transaction": boolean;
  "private-prescription": boolean;
  "shipping-label": boolean;
  "fridges-list": boolean;
  "temperature-log": boolean;
}
export type BrandList = {
  id: string;
  address_id: number;
  address: Address;
  name: string;
  description: null;
  url: string;
  logo: string;
  email: string;
  domain: string;
  office_phone: string;
  fax_phone: string;
  organization_id: string;
  is_trash: boolean;
  currency: string;
  currency_symbol: string;
  brandSettings?: BrandSetting;
};
export interface PageAllowedToBrand {
  vendor_id: string;
  is_active: boolean;
  id: number;
  key: string;
  value: boolean;
}
export type BrandSettings = {
  [key: string]: boolean;
};
export interface BrandAddress {
  is_residental: boolean;
  city: string;
  is_shipping: boolean;
  zip: string;
  middle_name: string | null;
  description: string | null;
  fax: string | null;
  email: string | null;
  street2: string | null;
  phone2: string | null;
  id: string;
  street1: string;
  email4: string | null;
  country: string;
  label: string | null;
  email2: string | null;
  company: string | null;
  phone: string | null;
  is_default: boolean;
  email3: string | null;
  street4: string | null;
  type: string;
  last_name: string;
  is_billing: boolean;
  state: string | null;
  street3: string | null;
  first_name: string;
}

export interface BrandData {
  id: string;
  address_id: string;
  organization_id: string;
  address: BrandAddress;
  currency: string;
  currency_symbol: string;
  name: string;
  description: string;
  url: string;
  logo: string;
  email: string;
  domain: string | null;
  office_phone: string | null;
  fax_phone: string | null;
  twitter: string | null;
  facebook: string | null;
  linkedin: string | null;
  instagram: string | null;
  pinterest: string | null;
  tiktok: string | null;
}

export interface BrandResponse {
  results: BrandData[];
  total: number;
  page: number;
  pages: number;
  count: number;
}
