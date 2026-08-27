import { Address } from "./Company";
import { FormikErrors, FormikTouched } from "formik";

export interface Organization {
  id: string;
  created: string;
  updated?: string;
  address?: Address;
  address_id: number;
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  email: string;
  domain?: string;
  office_phone?: string;
  fax_phone?: string;
  ein?: string;
  is_default: boolean;
  is_active: boolean;
  fax?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  pinterest?: string;
  tiktok?: string;
  brands?: string;
  user?: string;
  is_trash: boolean;
}

export interface ListOrganizationResult {
  results: Array<Organization>;
  page: number;
  count: number;
  total: number;
  pages: number;
}

export interface CreateOrganizationForm {
  name: string;
  ein: string;
  email: string;
  office_phone: string;
  fax: string;
  url: string;
  domains: string[];
  address_phones: string[];
  address_emails: string[];
  address_street1: string;
  address_street2: string;
  address_state: string;
  address_city: string;
  address_zip: string;
  address_country: string;
  twitter: string;
  facebook: string;
  pinterest: string;
  linkedin: string;
  instagram: string;
  tiktok: string;
  is_active: boolean;
}

export interface CreateOrganizationFormProps {
  errors: FormikErrors<CreateOrganizationForm>;
  values: CreateOrganizationForm;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFieldValue: (name: string, value: string, val: boolean) => void;
  touched: FormikTouched<CreateOrganizationForm>;
}
