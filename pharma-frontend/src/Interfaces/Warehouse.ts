import { FormikErrors, FormikTouched } from "formik";

export interface WarehouseData {
  id: string;
  name: string;
  description: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  region: string;
  post_code: string;
  country: string;
  is_trash: boolean;
  created?: Date;
  updated?: Date;
  is_active?: boolean;
  brand_id: string;
}
export interface WarehouseResponse {
  readonly results: Array<WarehouseData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface WarehouseFormValues {
  name: string;
  description: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  region: string;
  post_code: string;
  country: string;
}

export interface WarehousePropsInterface {
  errors: FormikErrors<WarehouseFormValues>;
  values: WarehouseFormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFieldValue: (name: string, value: string, val: boolean) => void;
  touched: FormikTouched<WarehouseFormValues>;
}
