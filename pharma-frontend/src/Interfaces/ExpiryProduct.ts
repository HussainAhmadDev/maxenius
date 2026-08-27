export interface ExpiryData {
  product_name: string;
  batch_number: number;
  brand_name: string;
  expiry_date: number;
  product_sku: string;
  available_quantity: number;
  number: string;
}
export interface ExpiryDataResponse {
  readonly results: Array<ExpiryData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}
