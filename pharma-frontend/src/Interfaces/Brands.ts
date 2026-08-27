import { FormikErrors, FormikTouched } from "formik";
import { Address } from "./Company";

export interface BrandSetting {
  patients: boolean;
  orders: boolean;
  dashboard: boolean;
  products: boolean;
  reports: boolean;
  "purchase-order": boolean;
  "product-transaction": boolean;
  "private-prescription": boolean;
  "shipping-label": boolean;
}
export interface BrandsData {
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
}
export interface BrandsResponse {
  readonly results: Array<BrandsData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface BrandFormValues {
  brandName: string;
  description: string;
  email: string;
  officeNumber: string;
  fax: string;
  url: string;
  domains: string[];
  phones: string[];
  emails: string[];
  addressOne: string;
  addressTwo: string;
  state: string;
  city: string;
  zip: string;
  country: string;
  twitter: string;
  facebook: string;
  pinterest: string;
  linkdin: string;
  instagram: string;
  tiktok: string;
}

export interface BrandsPropsInterface {
  errors: FormikErrors<BrandFormValues>;
  values: BrandFormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFieldValue: (name: string, value: string, val: boolean) => void;
  touched: FormikTouched<BrandFormValues>;
}
