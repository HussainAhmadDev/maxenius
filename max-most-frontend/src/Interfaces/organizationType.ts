export interface OrganizationAddress {
  description: string | null;
  zip: string;
  street1: string;
  first_name: string;
  email2: string | null;
  phone2: string | null;
  company: string | null;
  is_shipping: boolean;
  is_default: boolean;
  country: string;
  is_billing: boolean;
  is_residental: boolean;
  middle_name: string | null;
  email: string | null;
  city: string;
  phone: string | null;
  email4: string | null;
  street2: string | null;
  label: string | null;
  fax: string | null;
  type: string;
  street3: string | null;
  state: string | null;
  email3: string | null;
  id: string;
  last_name: string;
  street4: string | null;
}
export interface OrganizationData {
  id: string;
  created: string;
  updated: string | null;
  address: OrganizationAddress;
  address_id: string;
  name: string;
  description: string;
  url: string | null;
  logo: string | null;
  email: string;
  domain: string | null;
  office_phone: string | null;
  fax_phone: string | null;
  ein: string | null;
  is_default: boolean;
  is_active: boolean;
  twitter: string | null;
  facebook: string | null;
  linkedin: string | null;
  instagram: string | null;
  pinterest: string | null;
  tiktok: string | null;
}

export interface OrganizationResponse {
  results: OrganizationData[];
  total: number;
  page: number;
  pages: number;
  count: number;
}
