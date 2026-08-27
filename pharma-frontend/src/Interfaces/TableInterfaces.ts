export interface CustomerTableData {
  customerNumber: string;
  companyName: string;
  billTo: string;
  shipTo: string;
  email: string;
  phone: string;
}
export interface ProductTableData {
  productNumber: string;
  productName: string;
  sku: string;
  description: string;
  stock: string;
  price: string;
  discontinued: boolean;
}
export interface UserTableData {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  password: string;
  mobile_phone: string;
  last_login: string;
  is_active: boolean;
  profilePic: string;
}
export interface BrandTableData {
  name: string;
  ein: string;
  organization: string;
  email: string;
  officePhone: string;
  active: boolean;
  dateCreated: string;
  image: string;
}
export interface OrderTableData {
  orderNumber: string;
  customerNumber: string;
  date: string;
  price: string;
  billing: {
    name: string;
  };
  shipping: {
    name: string;
  };

  paymentStatus: string;
  shipmentStatus: string;
}
export interface CustomerFilterTableData {
  id: string;
  companyName: string;
  billing: {
    name: string;
    phone: string;
    email: string;
  };
  shipping: {
    name: string;
    phone: string;
    email: string;
  };
  lastOrderDate: string;
}
export interface PaymentHistoryTableData {
  created: string;
  id: string;
  payment_provider: string;
  type: string;
  order_id: string;
  total: number;
  is_refunded: boolean;
  receipt: string;
  status: string;
  recurring: boolean;
  updated: string;
}
export interface ActivityLogsTableData {
  logNumber: string;
  dateTime: string;
  organization: string;
  brand: string;
  contentType: string;
  fieldName: string;
  fieldValue: string;
}
export interface ShipmentHistoryTableData {
  date: string;
  sku: string;
  orderedQuantity: string;
  shipped: string;
  shippingCost?: string;
  name: string;
  status?: string;
}
export interface ReturnHistoryTableData {
  date?: string;
  sku: string;
  orderedQuantity: string;
  shipped?: string;
  returned: string;
  name: string;
  amountRefunded: number;
  currentQuantity?: number;
}
export interface RefundHistoryTableData {
  method?: string;
  transactionId?: string;
  paid: string;
  refunded: string;
  netPaid?: string;
  pendingRefund: string;
  date?: string;
  status: string;
  amountToRefund?: number;
}
export interface OrganizationTableData {
  name: string;
  ein?: string;
  email: string;
  officePhone?: string;
  brands?: string;
  user?: string;
  dateCreated?: string;
  isActive: boolean;
  logo?: string;
}
export interface ContactTableData {
  name: string;
  email: string;
  phone: string;
  shipping?: boolean;
  billing?: boolean;
}
export interface CustomerLogs {
  logNo: string;
  user: string;
  date: string;
  fieldName: string;
  fieldValue: string;
}
