import { ProductData } from "./Products";

export interface ToBrandProducts {
  readonly results: Array<ProductData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface TransferbodyResponse {
  to_brand_id: string;
  from_brand_id: string;
  to_product_id: string;
  from_product_id: string;
  quantity: string;
  warehouse_id: string;
  vendor_id: string;
  website_id: string;
  expiry_date: string;
  batch_number: string;
  stock_transfer: boolean;
}
export interface StockTransferHistory {
  id: string;
  created: string;
  updated: string;
  to_brand_id: string;
  to_product_id: string;
  from_product_id: string;
  from_brand_id: string;
  quantity: string;
  website_id: string;
}

export interface StockTransferResponse {
  readonly results: Array<StockTransferHistory>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface InventoryItem {
  id: number;
  batch_number: string;
  expiry_date: string;
  received_quantity: number;
}
