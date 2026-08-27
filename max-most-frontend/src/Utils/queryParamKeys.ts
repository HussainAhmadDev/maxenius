//Vendors
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
//Warehouse
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

// Users
export const userParmasKey = [
  "first_name",
  "last_name",
  "middle_name",
  "username",
  "email",
  "mobileNumber",
  "active_users"
];

//Orders
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
  "count"
];
export const prescriptionParamKeys = ["prescription"];
export const orderCompanyParamKeys = ["company__name", "company__number"];
export const orderBillingShippingParamKeys = ["email", "city", "state", "zip", "street1"];

//Companies
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
export const customerParamsGeneralKeys = ["name", "number", "search"];

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
  "number"
];

export const websitesParamsGeneralKeys = ["title", "site_url"];

export const quotesParamsGeneralKeys = ["vendorID", "status"];

export const fridgeParamsGeneralKeys = [
  "fridge_number",
  "location",
  "notes",
  "from_date",
  "to_date"
];

export const accessLogParamsGeneralKeys = [
  "first_name",
  "last_name",
  "from_date",
  "to_date"
];

// Products related Query Param Keys
export const productActiveLogParamsGeneralKeys = [
  "request_by",
  "website_domain",
  "inventory_item_id",
  "platform_product_id",
  "product_name",
  "sku",
  "price",
  "status",
  "action",
  "from_date",
  "to_date"
];
