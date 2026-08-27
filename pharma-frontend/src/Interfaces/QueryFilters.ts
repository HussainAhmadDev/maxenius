// General Pagination
export interface QueryPagination {
  page: string;
  pages: string;
  rowsPerPage: string;
  total: string;
  count: string;
}

// Types for Brands
export interface BrandFilters {
  organization_id: string;
}

// Company
export interface CustomerPageFilters {
  name: string;
  number: string;
  email: string;
  search: string;
  shipping_contact__email: string;
  billing_contact__email: string;
  billing_contact__first_name: string;
  shipping_contact__first_name: string;
  billing_contact__last_name: string;
  shipping_contact__last_name: string;
  billing_contact__phone: string;
  shipping_contact__phone: string;
  billing_contact__street1: string;
  shipping_contact__street1: string;
  billing_contact__street2: string;
  shipping_contact__street2: string;
  billing_contact__city: string;
  shipping_contact__city: string;
  billing_contact__state: string;
  shipping_contact__state: string;
  billing_contact__zip: string;
  shipping_contact__zip: string;
  ordered__from: string;
  ordered__to: string;
}

export type CustomerQueryFilters = Partial<CustomerPageFilters & QueryPagination>;

// Products
export interface ProductPageFilters {
  search: string;
  sku: string;
}

export type ProductQueryFilters = Partial<ProductPageFilters & QueryPagination>;

// Orders

export interface OrdersPageFilters {
  number: string;
  sku: string;
  company__number: string;
  sorting: string;
  company__billing__email: string;
  company__shipping__email: string;
  company__name: string;
  shipment_status: string;
  company__billing__city: string;
  company__shipping__city: string;
  company__billing__zip: string;
  company__shipping__zip: string;
  company__billing__state: string;
  company__shipping__state: string;
  company__billing__street1: string;
  company__shipping__street1: string;
  ordered__from: string;
  ordered__to: string;
  payment_status: string;
}

export type OrdersQueryFilters = Partial<OrdersPageFilters & QueryPagination>;

// User

export type UserPageFilters = {
  search: string;
  email: string;
  first_name: string;
  is_active: string;
  is_staff: string;
  is_superuser: string;
  last_name: string;
  middle_name: string;
  is_trash?: string;
};

export type UserQueryFilters = Partial<UserPageFilters & QueryPagination>;

// Organizations

export type OrganizationPageFilters = {
  count: string;
  ein: string;
  email: string;
  is_active: string;
  is_default: string;
  name: string;
  search: string;
  sorting: string;
};

export type OrganizationQueryFilters = Partial<OrganizationPageFilters & QueryPagination>;

// Brands

export type BrandPageFilters = {
  email: string;
  name: string;
  organization_id: string;
};

export type BrandQueryFilters = Partial<BrandPageFilters & QueryPagination>;
