// These are the query param keys that will be used in the URL on the customers/Take Order page
export const customerParamsGeneralKeys = ["name", "number", "search"];
// The search Params related to billing and shipping contact are in the form of
// billing_contact__{key} and shipping_contact__{key}
// on the customer page we don't store the prefixes (billing_contact__ and shipping_contact__) to make the URL a little shorter
// These keys help us convert the search params from key=value to billing_contact__{key}=value
// and shipping_contact__{key}=value when sending them to the backend
export const customerParamsContactKeys = [
  "email",
  "first_name",
  "last_name",
  "phone",
  "street1",
  "street2",
  "city",
  "state",
  "zip"
];
// Orders related Query Param Keys
export const orderParamsGeneralKeys = [
  "number",
  "sku",
  "ordered__from",
  "ordered__to",
  "payment_status",
  "shipment_status",
  "website_id",
  "shipment_status",
  "status",
  "website_order_id",
  "order_number",
  "company_name",
  "product_id"
];
export const prescriptionParamKeys = ["prescription"];
// Customer related Query Params in Order search
export const orderCompanyParamKeys = ["company__name", "company__number"];
// Billing and shipping related keys
export const orderBillingShippingParamKeys = ["email", "city", "state", "zip", "street1"];
// Products related Query Param Keys
export const productParamsGeneralKeys = [
  "sku",
  "barcode",
  "name",
  "supplier",
  "description",
  "tax_class",
  "tags",
  "category",
  "product_name",
  "order_number",
  "website_id"
];

// Brands related Query Param Keys
export const brandParamsGeneralKeys = ["name", "email", "organization"];

// Vendors related Query Param Keys
export const vendorsParamsGeneralKeys = [
  "name",
  "contact_name",
  "city",
  "post_code",
  "region",
  "country",
  "contact_phone",
  "fax",
  "email",
  "webpage",
  "currency",
  "cityOrTown",
  "postCode",
  "search_by_active_vendor"
];

// Warehouses related Query Param Keys
export const warehouseParamsGeneralKeys = [
  "vendorName",
  "city",
  "post_code",
  "region",
  "country",
  "cityOrTown",
  "postCode",
  "search_by_active_warehouses",
  "name"
];

// Purchase related Query Param Keys
export const purchaseOrderParamsGeneralKeys = [
  "reference_number",
  "status",
  "supplier_reference",
  "location",
  "expected_date",
  "order_date",
  "status",
  "warehouseID",
  "vendorID",
  "number",
  "product_id"
];
export const orderParamGeneralKeys = [
  "status",
  "warehouseID",
  "vendorID",
  "number",
  "product_id"
];

//user params keys
export const userParmasKey = [
  "first_name",
  "last_name",
  "middle_name",
  "username",
  "email",
  "mobileNumber",
  "active_users"
];
