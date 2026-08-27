import { FormikErrors, FormikTouched } from "formik";

export interface VendorData {
  id: string;
  name: string;
  contact_name: string;
  address: string;
  alternative_address: string;
  city: string;
  region: string;
  post_code: string;
  country: string;
  contact_phone: string;
  secondary_phone: string;
  fax: string;
  email: string;
  webpage: string;
  currency: string;
  is_trash: boolean;
  created?: Date;
  updated?: Date;
  is_active?: boolean;
  brand_id: string;
  is_allowed: boolean;
}
export interface VendorResponse {
  readonly results: Array<VendorData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface VendorFormValues {
  name: string;
  contact_name: string;
  address: string;
  alternative_address: string;
  city: string;
  region: string;
  post_code: string;
  country: string;
  contact_phone: string;
  secondary_phone: string;
  fax: string;
  email: string;
  webpage: string;
  currency: string;
  is_active: boolean;
}

export interface VendorPropsInterface {
  errors: FormikErrors<VendorFormValues>;
  values: VendorFormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFieldValue: (name: string, value: string, val: boolean) => void;
  touched: FormikTouched<VendorFormValues>;
}
