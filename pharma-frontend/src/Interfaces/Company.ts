import { PatientData } from "./Order";
import { UserData } from "./User";

export type Address = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  description?: string;
  label?: string;
  street1: string;
  street2?: string;
  street3?: string;
  street4?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default?: boolean;
  is_shipping?: boolean;
  is_billing?: boolean;
  is_residental?: boolean;
  phone?: string;
  phone2?: string;
  email?: string;
  email2?: string;
  email3?: string;
  email4?: string;
  type?: string;
  fax?: string;
  company?: string;
};

export interface Contact {
  id: string;
  email?: string;
  is_billing: boolean;
  is_shipping: boolean;
  title?: string;
  website?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  organization_id?: string;
  authorize_to_purchase?: boolean;
  billing_address_id?: string;
  billing_address: Address;
  billing_phone?: string;
  shipping_address: Address;
  shipping_address_id?: string;
  is_active?: boolean;
  do_not_call?: boolean;
  do_not_email?: boolean;
  do_not_mail?: boolean;
  do_not_text?: boolean;
  is_department?: boolean;
  office_phone?: string;
  private_note?: Note[];
  created?: string;
  updated?: string;
  user: UserData;
}
export interface ContactFormValidation {
  first_name: string;

  last_name: string;
  email: string;
  is_billing: boolean;
  is_shipping: boolean;
  title: string;
  website: string;
  companyName: string;
  fax: string;
  label: string;
  office_phone: string;
  billing_phone: string;
  authorize_to_purchase?: boolean;
  address_first_name: string;

  address_last_name: string;
  address_fax: string;
  billing_address_1: string;
  billing_address_2: string;
  billing_city: string;
  billing_zip: string;
  billing_state: string;
  billing_is_billing: boolean;
  billing_is_default: boolean;
  billing_country: string;
  billing_phone1?: string;
  billing_phone2?: string;
  billing_email1?: string;
  billing_email2?: string;
  billing_email3?: string;
  billing_email4?: string;
  billing_emails?: string[];
  billing_phones?: string[];
  billing_residential?: boolean;
  billing_company?: string;
  shipping_company?: string;
  shipping_residential?: boolean;
  shipping_address_1: string;
  shipping_address_2: string;
  shipping_city: string;
  shipping_zip: string;
  shipping_state: string;
  shipping_country: string;
  shipping_phone1?: string;
  shipping_phone2?: string;
  shipping_email1?: string;
  shipping_email2?: string;
  shipping_email3?: string;
  shipping_email4?: string;
  shipping_emails?: string[];
  shipping_phones?: string[];
  shipping_is_shipping: boolean;
  shipping_is_default: boolean;
  do_not_call?: boolean;
  do_not_email?: boolean;
  do_not_mail?: boolean;
  do_not_text?: boolean;
}

export interface Note {
  id: string;
  text: string;
  type: string;
  created: string;
  updated: string;
}

export type CompanyData = {
  billing_address: any;
  id: string;
  name: string;
  address: Address;
  address_id: string;
  number: string;
  brand_id: string;
  billing_contact_id: string;
  shipping_contact_id: string;
  billing_contact: Contact;
  shipping_contact: Contact;
  external_id: string;
  notes: Note[];
  private_note: Note[];
  tax_exempt_id: string;
  is_individual: boolean;
  is_tax_exempt: boolean;
  is_active: boolean;
  created: string;
  updated: string;
  is_trash: boolean;
};

export interface CompanyResponse {
  readonly results: Array<CompanyData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface CompanyContact {
  id: string;
  contact_id: string;
  brand_id: string;
  organization_id: string;
  contact: Contact;
}
export interface CompanyContactsResponse {
  readonly results: Array<{
    id: string;
    contact_id: string;
    brand_id: string;
    contact: Contact;
    organization_id: string;
  }>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface CompanyNotesResponse {
  readonly results: Array<Note>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface CreateCompanyData {
  name: string;
  type: string;
  number: string;
}
export interface CreateCompanyNote {
  type: "public" | "private";
  text: string;
  source: string;
  note_username: string;
}

export interface EditCompanyNote {
  companyId: string;
  noteId: string;
}

export interface CreateCompanyResponse {
  brand_id: string;
  name: string;
  is_tax_exempt: boolean;
  id: string;
  notes: unknown[];
  is_individual: boolean;
  address_id: string;
  shipping_contact_id: string;
  billing_contact_id: string;
  tax_exempt_id: string;
  is_active: boolean;
  external_id: string;
}

//patients
export interface PatientResponse {
  readonly results: Array<PatientData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface ProductTransaction {
  running_total: string;
  ordered: string;
  name: string;
  number: string;
  batch_number: string;
  expiry_date: Date | string;
  quantity: number;
  type_t: string;
  is_adjustment: boolean;
}
export interface ProductTransactionResponse {
  readonly results: Array<ProductTransaction>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}
