interface Vendor {
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
  brand?: string;
  user?: string;
}

interface VendorFormValues {
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
interface VendorResponse {
  readonly results: Array<Vendor>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export type { Vendor, VendorFormValues, VendorResponse };
