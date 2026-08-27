import { ProductData } from "./Products";

export interface PurchaseItems {
  id: string;
  product_id: string;
  product: ProductData;
}

export interface PurchaseOrderData {
  id: string;
  reference_number: string;
  order_date: string;
  expected_date: string;
  status: string;
  supplier_reference: string;
  vendor_id: string;
  // vendor: VendorData;
  warehouse_id: string;
  // warehouse: WarehouseData;
  invoicing_currency: string;
  purchase_items: Array<PurchaseItems>;
}

export interface PurchaseOrderResponse {
  readonly results: Array<PurchaseOrderData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}
